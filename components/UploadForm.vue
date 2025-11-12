<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
    <el-form-item label="文件" prop="file">
      <el-upload
        class="upload-wrapper"
        drag
        :auto-upload="false"
        :file-list="fileList"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        :limit="1"
      >
        <el-icon class="upload-icon"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">最大支持 100MB，建议使用 zip 压缩包</div>
        </template>
      </el-upload>
    </el-form-item>

    <el-form-item label="描述">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="请输入文件描述（可选）"
      />
    </el-form-item>

    <div class="form-actions">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">开始上传</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules, type UploadFile, type UploadFiles } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { uploadFile } from '@/api/storage'

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'cancel'): void
}>()

interface UploadFormState {
  description: string
  file: File | null
}

const form = reactive<UploadFormState>({
  description: '',
  file: null
})

const rules = reactive<FormRules<UploadFormState>>({
  file: [{ required: true, message: '请先选择要上传的文件', trigger: 'change' }]
})

const formRef = ref<FormInstance>()
const loading = ref(false)
const fileList = ref<UploadFile[]>([])

const resetForm = () => {
  form.description = ''
  form.file = null
  fileList.value = []
  formRef.value?.clearValidate()
}

const handleFileChange = (file: UploadFile, files: UploadFiles) => {
  if (files.length > 1) {
    files.splice(0, files.length - 1)
  }
  if (file.raw) {
    form.file = file.raw
    fileList.value = [file]
  }
}

const handleFileRemove = () => {
  form.file = null
  fileList.value = []
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    if (!form.file) {
      ElMessage.warning('请选择文件后再上传')
      return
    }

    loading.value = true
    const response = await uploadFile({
      file: form.file,
      description: form.description
    })

    if (response.success) {
      ElMessage.success('文件上传成功')
      resetForm()
      emit('success')
    } else {
      ElMessage.error(response.message || '文件上传失败')
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '文件上传失败'
    ElMessage.error(message)
  } finally {
    loading.value = false
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}
</style>
