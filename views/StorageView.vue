<template>
    <div class="storage-container">
      <el-card class="storage-card">
        <template #header>
          <div class="card-header">
            <h3>📁 文件存储管理</h3>
            <el-button type="primary" @click="showUploadDialog = true">
              <el-icon><Upload /></el-icon>
              上传文件
            </el-button>
          </div>
        </template>
  
        <!-- 文件列表 -->
        <el-table :data="fileList" v-loading="loading">
          <el-table-column prop="fileName" label="文件名" min-width="200">
            <template #default="{ row }">
              <div class="file-info">
                <el-icon class="file-icon"><Document /></el-icon>
                <div class="file-details">
                  <div class="file-name">{{ row.fileName }}</div>
                  <div class="file-meta">
                    {{ formatFileSize(row.fileSize) }} · 
                    {{ formatTime(row.uploadTime) }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="fileHash" label="文件哈希" min-width="280">
            <template #default="{ row }">
              <el-tooltip :content="row.fileHash">
                <span class="hash-text">{{ shortenHash(row.fileHash) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          
          <el-table-column prop="blockchainTx" label="区块链交易" min-width="280">
            <template #default="{ row }">
              <el-tooltip :content="row.blockchainTx">
                <span class="hash-text">{{ shortenHash(row.blockchainTx) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <el-button size="small" @click="handleDownload(row)">
                下载
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
      <!-- 上传文件对话框 -->
      <el-dialog 
        v-model="showUploadDialog" 
        title="上传文件" 
        width="600px"
       >
        <UploadForm 
           @success="handleUploadSuccess"
           @cancel="showUploadDialog = false"
         />
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Document, Upload } from '@element-plus/icons-vue'
  import UploadForm from '@/components/UploadForm.vue'
  import { getFileList, deleteFile, downloadFile } from '@/api/storage'
  
  interface FileItem {
    id: string
    fileName: string
    fileSize: number
    fileHash: string
    blockchainTx: string
    uploadTime: string
    status: number
    mimeType: string
  }
  
  const fileList = ref<FileItem[]>([])
  const loading = ref(false)
  const showUploadDialog = ref(false)
  
  onMounted(() => {
    loadFileList()
  })
  
  // 监听用户登录状态变化，重新加载文件列表
  window.addEventListener('auth-change', () => {
    loadFileList()
  })
  
  const loadFileList = async () => {
    try {
      loading.value = true
      const response = await getFileList()
      if (response.success) {
        fileList.value = response.data || []
      } else {
        fileList.value = []
      }
    } catch (error) {
      ElMessage.error('获取文件列表失败')
    } finally {
      loading.value = false
    }
  }
  
  const handleUploadSuccess = () => {
    showUploadDialog.value = false
    loadFileList()
    ElMessage.success('文件上传成功')
  }
  
  const handleDownload = async (file: FileItem) => {
    try {
      const response = await downloadFile(file.id)
      if (response.success && response.data) {
        const { content, fileName, mimeType } = response.data
        const base64Data = content.startsWith('data:') ? content.split(',')[1] : content
        const byteString = atob(base64Data)
        const arrayBuffer = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++) {
          arrayBuffer[i] = byteString.charCodeAt(i)
        }

        const blob = new Blob([arrayBuffer], { type: mimeType || 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName || file.fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      ElMessage.error('文件下载失败')
    }
  }
  
  const handleDelete = async (file: FileItem) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除文件 "${file.fileName}" 吗？此操作将在区块链上记录删除记录。`,
        '警告',
        { type: 'warning' }
      )
      
      const response = await deleteFile(file.id)
      if (response.success) {
        ElMessage.success('文件删除成功')
        loadFileList()
      } else if (response.message) {
        ElMessage.error(response.message)
      }
    } catch (error) {
      // 用户取消删除
    }
  }
  
  const shortenHash = (hash: string) => {
    return hash ? `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}` : ''
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const formatTime = (time: string) => {
    return new Date(time).toLocaleString()
  }
  
  const getStatusType = (status: number) => {
    const types = ['', 'success', 'warning', 'danger']
    return types[status] || ''
  }
  
  const getStatusText = (status: number) => {
    const texts = ['', '已存储', '同步中', '异常']
    return texts[status] || '未知'
  }
  </script>
  
  <style scoped>
  .storage-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .file-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .file-icon {
    font-size: 20px;
    color: #409eff;
  }
  
  .file-details {
    display: flex;
    flex-direction: column;
  }
  
  .file-name {
    font-weight: 500;
    color: #6366f1;
    font-size: 14px;
  }
  
  .file-meta {
    font-size: 12px;
    color: #909399;
  }
  
  .hash-text {
    font-family: 'Courier New', monospace;
    color: #67c23a;
    cursor: pointer;
  }
  </style>