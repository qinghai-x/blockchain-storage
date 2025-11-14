<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
    <el-form-item label="文件" prop="files">
      <el-upload
        class="upload-wrapper"
        drag
        :auto-upload="false"
        :file-list="fileList"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        :accept="acceptedFileTypes"
        multiple
      >
        <el-icon class="upload-icon"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持多种文件类型：ZIP、Word、Excel、PDF、TXT、图片等
            <br>
            单个文件最大 100MB，可同时选择多个文件上传
          </div>
        </template>
      </el-upload>
      
      <!-- 已选择的文件列表 -->
      <div v-if="fileList.length > 0" class="selected-files">
        <div class="files-header">
          <span>已选择 {{ fileList.length }} 个文件</span>
          <el-button type="text" size="small" @click="clearAllFiles">清空</el-button>
        </div>
        <div class="files-list">
          <div v-for="(file, index) in fileList" :key="index" class="file-item">
            <el-icon class="file-type-icon"><Document /></el-icon>
            <div class="file-info">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-size">{{ formatFileSize(file.size || 0) }}</div>
            </div>
            <el-icon class="remove-icon" @click="removeFile(index)"><Close /></el-icon>
          </div>
        </div>
      </div>
    </el-form-item>

    <el-form-item label="描述">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="请输入文件描述（可选，将应用于所有文件）"
      />
    </el-form-item>

    <!-- 上传进度 -->
    <div v-if="uploadProgress.show" class="upload-progress">
      <div class="progress-header">
        <span>正在上传文件...</span>
        <span>{{ uploadProgress.current }}/{{ uploadProgress.total }}</span>
      </div>
      <el-progress 
        :percentage="uploadProgress.percentage" 
        :status="uploadProgress.status"
        :stroke-width="8"
      />
      <div class="progress-detail">
        当前：{{ uploadProgress.currentFile || '准备中...' }}
      </div>
    </div>

    <div class="form-actions">
      <el-button @click="handleCancel" :disabled="uploading">取 消</el-button>
      <el-button 
        type="primary" 
        :loading="uploading" 
        :disabled="fileList.length === 0"
        @click="handleSubmit"
      >
        {{ uploading ? `上传中 (${uploadProgress.current}/${uploadProgress.total})` : `开始上传 (${fileList.length})` }}
      </el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { UploadFile, UploadFiles } from 'element-plus'
import { UploadFilled, Document, Close } from '@element-plus/icons-vue'
import { uploadFile } from '@/api/storage'

const emit = defineEmits(['success', 'cancel'])

interface UploadFormState {
  description: string
  files: File[]
}

const form = reactive({
  description: '',
  files: [] as File[]
})

const rules = reactive({
  files: [{ required: true, message: '请至少选择一个文件', trigger: 'change' }]
} as any)

// 支持的文件类型
const acceptedFileTypes = computed(() => {
  return [
    // 压缩文件
    '.zip', '.rar', '.7z', '.tar', '.gz',
    // Office 文档
    '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    // PDF
    '.pdf',
    // 文本文件
    '.txt', '.md', '.csv',
    // 图片
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp',
    // 其他
    '.json', '.xml', '.html', '.css', '.js', '.ts'
  ].join(',')
})

const formRef = ref(null)
const uploading = ref(false)
const fileList = ref([])

const uploadProgress = reactive({
  show: false,
  current: 0,
  total: 0,
  percentage: 0,
  status: 'success' as 'success' | 'exception' | 'warning',
  currentFile: ''
})

const resetForm = () => {
  form.description = ''
  form.files = []
  fileList.value = []
  uploadProgress.show = false
  uploadProgress.current = 0
  uploadProgress.total = 0
  uploadProgress.percentage = 0
  formRef.value?.clearValidate()
}

const validateFile = (file: File): boolean => {
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    ElMessage.error(`文件 "${file.name}" 超过 100MB 限制`)
    return false
  }
  return true
}

const handleFileChange = (file: any, files: any[]) => {
  if (file.raw) {
    // 验证文件大小
    if (!validateFile(file.raw)) {
      // 移除无效文件
      const index = fileList.value.findIndex((f: any) => f.uid === file.uid)
      if (index > -1) {
        fileList.value.splice(index, 1)
      }
      return
    }
    
    // 检查是否重复
    const exists = fileList.value.some((f: any) => 
      f.name === file.name && f.size === file.size
    )
    if (exists) {
      ElMessage.warning(`文件 "${file.name}" 已存在，已跳过`)
      const index = fileList.value.findIndex((f: any) => f.uid === file.uid)
      if (index > -1) {
        fileList.value.splice(index, 1)
      }
      return
    }
    
    fileList.value = files
    form.files = files.filter((f: any) => f.raw).map((f: any) => f.raw as File)
  }
}

const handleFileRemove = (file: any) => {
  const index = fileList.value.findIndex((f: any) => f.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
    form.files = fileList.value.filter((f: any) => f.raw).map((f: any) => f.raw as File)
  }
}

const removeFile = (index: number) => {
  fileList.value.splice(index, 1)
  form.files = fileList.value.filter((f: any) => f.raw).map((f: any) => f.raw as File)
}

const clearAllFiles = () => {
  fileList.value = []
  form.files = []
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleCancel = () => {
  if (uploading.value) {
    ElMessage.warning('正在上传中，请等待完成')
    return
  }
  resetForm()
  emit('cancel')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (form.files.length === 0) {
      ElMessage.warning('请至少选择一个文件')
      return
    }

    uploading.value = true
    uploadProgress.show = true
    uploadProgress.total = form.files.length
    uploadProgress.current = 0
    uploadProgress.percentage = 0
    uploadProgress.status = 'success'
    uploadProgress.currentFile = ''

    let successCount = 0
    let failCount = 0
    const errors: string[] = []

    // 逐个上传文件
    for (let i = 0; i < form.files.length; i++) {
      const file = form.files[i]
      uploadProgress.current = i + 1
      uploadProgress.currentFile = file.name
      uploadProgress.percentage = Math.round(((i + 1) / form.files.length) * 100)

      try {
        const response = await uploadFile({
          file: file,
          description: form.description
        })

        if (response.success) {
          successCount++
        } else {
          failCount++
          errors.push(`${file.name}: ${response.message || '上传失败'}`)
        }
      } catch (error: unknown) {
        failCount++
        const message = error instanceof Error ? error.message : '上传失败'
        errors.push(`${file.name}: ${message}`)
      }

      // 添加小延迟，避免浏览器阻塞
      if (i < form.files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    // 显示结果
    if (failCount === 0) {
      uploadProgress.status = 'success'
      ElMessage.success(`成功上传 ${successCount} 个文件`)
      resetForm()
      emit('success')
    } else if (successCount > 0) {
      uploadProgress.status = 'warning'
      ElMessage.warning(`部分文件上传失败：成功 ${successCount} 个，失败 ${failCount} 个`)
      if (errors.length > 0) {
        console.error('上传错误详情:', errors)
      }
      resetForm()
      emit('success')
    } else {
      uploadProgress.status = 'exception'
      ElMessage.error(`所有文件上传失败`)
      if (errors.length > 0) {
        console.error('上传错误详情:', errors)
        // 显示前3个错误
        const errorMsg = errors.slice(0, 3).join('; ')
        ElMessage.error(errorMsg + (errors.length > 3 ? ` 等 ${errors.length} 个错误` : ''))
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '文件上传失败'
    ElMessage.error(message)
    uploadProgress.status = 'exception'
  } finally {
    uploading.value = false
    // 延迟隐藏进度条
    setTimeout(() => {
      if (uploadProgress.show) {
        uploadProgress.show = false
      }
    }, 2000)
  }
}
</script>

<style scoped>
.upload-wrapper {
  width: 100%;
}

.upload-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 12px;
}

.selected-files {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.files-list {
  max-height: 200px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.file-item:hover {
  background: #f0f2f5;
}

.file-item:last-child {
  margin-bottom: 0;
}

.file-type-icon {
  font-size: 20px;
  color: #409eff;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.remove-icon {
  font-size: 16px;
  color: #909399;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.2s;
}

.remove-icon:hover {
  color: #f56c6c;
}

.upload-progress {
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.progress-detail {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style>
