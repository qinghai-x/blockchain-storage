<template>
  <div class="storage-container">
    <el-card class="storage-card">
      <template #header>
        <div class="card-header">
          <h3>📁 文件存储管理</h3>
          <div class="header-actions">
            <el-button type="primary" plain @click="handleCreateFolder">
              <el-icon><FolderAdd /></el-icon>
              新建文件夹
            </el-button>
            <el-button type="primary" @click="showUploadDialog = true">
              <el-icon><Upload /></el-icon>
              上传文件
            </el-button>
          </div>
        </div>
      </template>

      <!-- 类型分类 -->
      <div class="category-bar">
        <el-radio-group v-model="category" class="category-group">
          <el-radio-button v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <!-- 面包屑导航 -->
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>
          <span class="crumb-root" @click="goToPath(-1)">根目录</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="(f, idx) in folderPath" :key="f.id">
          <span
            :class="{ 'crumb-current': idx === folderPath.length - 1 }"
            @click="goToPath(idx)"
          >{{ f.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 文件夹区域 -->
      <div v-if="folders.length > 0" class="folder-grid" v-loading="loading">
        <div v-for="folder in folders" :key="folder.id" class="folder-card">
          <div class="folder-icon">📁</div>
          <div class="folder-name" :title="folder.name">{{ folder.name }}</div>
          <div class="folder-actions">
            <el-button size="small" type="primary" link @click="enterFolder(folder)">进入</el-button>
            <el-button size="small" type="danger" link @click="handleDeleteFolder(folder)">删除</el-button>
          </div>
        </div>
      </div>

      <!-- 文件列表 -->
      <el-table :data="fileListFiltered" v-loading="loading" class="file-table">
        <el-table-column prop="fileName" label="文件名" min-width="240">
          <template #default="{ row }">
            <div class="file-info">
              <span class="file-type-icon">{{ getTypeIcon(row) }}</span>
              <div class="file-details">
                <div class="file-name">{{ row.fileName }}</div>
                <div class="file-meta">
                  {{ getCategoryLabel(row) }} · {{ formatFileSize(row.fileSize) }} · {{ formatTime(row.uploadTime) }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="fileHash" label="文件哈希" min-width="220">
          <template #default="{ row }">
            <el-tooltip :content="row.fileHash">
              <span class="hash-text">{{ shortenHash(row.fileHash) }}</span>
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

        <el-table-column label="操作" width="210">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handlePreview(row)">
              预览
            </el-button>
            <el-button size="small" @click="handleDownload(row)">
              下载
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-if="!loading && fileList.length === 0 && folders.length === 0"
        :description="currentFolderName === '根目录' ? '还没有文件，点击右上角上传文件或新建文件夹' : '当前文件夹为空'"
      />
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog v-model="preview.show" title="文件预览" width="720px" top="6vh" destroy-on-close>
      <div v-loading="preview.loading" class="preview-body">
        <div v-if="preview.loading" class="preview-hint">正在加载文件…</div>
        <template v-else-if="preview.error">
          <el-empty :description="preview.error" />
        </template>
        <template v-else>
          <img v-if="preview.kind === 'image'" :src="preview.content" class="preview-media" :alt="preview.fileName" />
          <video v-else-if="preview.kind === 'video'" :src="preview.content" class="preview-media" controls autoplay />
          <audio v-else-if="preview.kind === 'audio'" :src="preview.content" class="preview-audio" controls />
          <iframe v-else-if="preview.kind === 'pdf'" :src="preview.content" class="preview-pdf" />
          <el-empty v-else description="该类型暂不支持在线预览，请点击下载查看" />
        </template>
      </div>
      <template #footer>
        <el-button @click="preview.show = false">关闭</el-button>
        <el-button type="primary" @click="previewDownload">下载</el-button>
      </template>
    </el-dialog>

    <!-- 上传文件对话框 -->
    <el-dialog v-model="showUploadDialog" title="上传文件" width="600px">
      <UploadForm
        :folder-id="currentFolderId"
        :folder-name="currentFolderName"
        @success="handleUploadSuccess"
        @cancel="showUploadDialog = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Upload, FolderAdd } from '@element-plus/icons-vue'
import UploadForm from '@/components/UploadForm.vue'
import {
  getFileList,
  getFolderList,
  createFolder,
  deleteFolder,
  getFolderPath,
  deleteFile,
  downloadFile,
  type Folder
} from '@/api/storage'

interface FileItem {
  id: string
  fileName: string
  fileSize: number
  fileHash: string
  blockchainTx: string
  uploadTime: string
  status: number
  mimeType: string
  folderId?: string | null
}

type Category = 'all' | 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other'

interface CategoryOption {
  value: Category
  label: string
}

const categoryOptions: CategoryOption[] = [
  { value: 'all', label: '全部' },
  { value: 'image', label: '🖼️ 图片' },
  { value: 'video', label: '🎬 视频' },
  { value: 'audio', label: '🎵 音频' },
  { value: 'document', label: '📄 文档' },
  { value: 'archive', label: '📦 压缩包' },
  { value: 'other', label: '其他' }
]

const route = useRoute()
const router = useRouter()

const fileList = ref<FileItem[]>([])
const folders = ref<Folder[]>([])
const loading = ref(false)
const showUploadDialog = ref(false)
const currentFolderId = ref<string | null>(null)
const folderPath = ref<Folder[]>([])
const category = ref<Category>('all')

const currentFolderName = computed(() => {
  const last = folderPath.value[folderPath.value.length - 1]
  return last ? last.name : '根目录'
})

const preview = ref<{
  show: boolean
  loading: boolean
  error: string
  kind: '' | 'image' | 'video' | 'audio' | 'pdf' | 'unsupported'
  content: string
  fileName: string
  mimeType: string
  fileId: string
}>({
  show: false,
  loading: false,
  error: '',
  kind: '',
  content: '',
  fileName: '',
  mimeType: '',
  fileId: ''
})

onMounted(async () => {
  // 从 URL 恢复文件夹位置（如 /storage?folder=xxx）
  const folderId = typeof route.query.folder === 'string' ? route.query.folder : null
  if (folderId) {
    const resp = await getFolderPath(folderId)
    if (resp.success && resp.data) {
      folderPath.value = resp.data
      currentFolderId.value = folderId
    }
  }
  loadData()
})

// 监听用户登录状态变化，重新加载数据
window.addEventListener('auth-change', () => {
  loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    const [folderResp, fileResp] = await Promise.all([
      getFolderList(currentFolderId.value),
      getFileList({ folderId: currentFolderId.value })
    ])
    folders.value = folderResp.success ? (folderResp.data || []) : []
    fileList.value = fileResp.success ? (fileResp.data || []) : []
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 同步 URL（刷新/分享后仍停留在当前文件夹）
const syncUrl = () => {
  router.replace({ query: currentFolderId.value ? { folder: currentFolderId.value } : {} })
}

const enterFolder = (folder: Folder) => {
  folderPath.value.push(folder)
  currentFolderId.value = folder.id
  syncUrl()
  loadData()
}

const goToPath = (index: number) => {
  // -1 表示根目录
  if (index < 0) {
    folderPath.value = []
    currentFolderId.value = null
  } else {
    folderPath.value = folderPath.value.slice(0, index + 1)
    const target = folderPath.value[folderPath.value.length - 1]
    currentFolderId.value = target ? target.id : null
  }
  syncUrl()
  loadData()
}

const handleCreateFolder = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请输入文件夹名称（同一目录下不可重名）', '新建文件夹', {
      confirmButtonText: '创建',
      cancelButtonText: '取消',
      inputPattern: /^[\s\S]{1,50}$/,
      inputErrorMessage: '文件夹名称长度需在 1~50 个字符之间',
      inputValue: '新建文件夹'
    })
    const response = await createFolder(value, currentFolderId.value)
    if (response.success) {
      ElMessage.success('文件夹创建成功')
      loadData()
    } else if (response.message) {
      ElMessage.error(response.message)
    }
  } catch (error) {
    // 用户取消
  }
}

const handleDeleteFolder = async (folder: Folder) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文件夹 "${folder.name}" 吗？\n文件夹内的文件会移回根目录，不会被删除。`,
      '警告',
      { type: 'warning' }
    )
    const response = await deleteFolder(folder.id)
    if (response.success) {
      ElMessage.success('文件夹删除成功')
      loadData()
    } else if (response.message) {
      ElMessage.error(response.message)
    }
  } catch (error) {
    // 用户取消
  }
}

const handleUploadSuccess = () => {
  showUploadDialog.value = false
  loadData()
  ElMessage.success('文件上传成功')
}

// ==================== 类型分类 ====================

const getCategory = (mime: string, name: string): Category => {
  const ext = (name.split('.').pop() || '').toLowerCase()
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)) return 'archive'
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'rtf', 'csv', 'json', 'xml'].includes(ext)) return 'document'
  if (mime.startsWith('text/') || mime.includes('pdf') || mime.includes('word') || mime.includes('sheet') || mime.includes('presentation')) return 'document'
  return 'other'
}

const getTypeIcon = (file: FileItem): string => {
  const cat = getCategory(file.mimeType || '', file.fileName)
  const icons: Record<Category, string> = {
    all: '📄',
    image: '🖼️',
    video: '🎬',
    audio: '🎵',
    document: '📄',
    archive: '📦',
    other: '❓'
  }
  return icons[cat]
}

const getCategoryLabel = (file: FileItem): string => {
  const cat = getCategory(file.mimeType || '', file.fileName)
  const labels: Record<Category, string> = {
    all: '其他',
    image: '图片',
    video: '视频',
    audio: '音频',
    document: '文档',
    archive: '压缩包',
    other: '其他'
  }
  return labels[cat]
}

// 按当前分类过滤
const fileListFiltered = computed(() => {
  if (category.value === 'all') return fileList.value
  return fileList.value.filter((f) => getCategory(f.mimeType || '', f.fileName) === category.value)
})

// ==================== 预览 ====================

const previewKindOf = (file: FileItem): '' | 'image' | 'video' | 'audio' | 'pdf' | 'unsupported' => {
  const mime = file.mimeType || ''
  const ext = (file.fileName.split('.').pop() || '').toLowerCase()
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime === 'application/pdf' || ext === 'pdf') return 'pdf'
  return 'unsupported'
}

const handlePreview = async (file: FileItem) => {
  const kind = previewKindOf(file)
  preview.value.show = true
  preview.value.loading = true
  preview.value.error = ''
  preview.value.kind = kind
  preview.value.fileName = file.fileName
  preview.value.mimeType = file.mimeType || 'application/octet-stream'
  preview.value.fileId = file.id
  preview.value.content = ''

  if (kind === 'unsupported') {
    preview.value.loading = false
    return
  }

  const response = await downloadFile(file.id)
  if (response.success && response.data) {
    preview.value.content = response.data.content
  } else {
    preview.value.error = response.message || '文件加载失败'
  }
  preview.value.loading = false
}

const previewDownload = async () => {
  const item = fileList.value.find((f) => f.id === preview.value.fileId)
  if (item) {
    await handleDownload(item)
  }
}

// ==================== 下载 / 删除 ====================

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
    } else {
      ElMessage.error(response.message || '文件下载失败')
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '文件下载失败'
    ElMessage.error(message)
  }
}

const handleDelete = async (file: FileItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文件 "${file.fileName}" 吗？`,
      '警告',
      { type: 'warning' }
    )

    const response = await deleteFile(file.id)
    if (response.success) {
      ElMessage.success('文件删除成功')
      loadData()
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
  max-width: 1600px;
  margin: 0 auto;
}

:deep(.el-card) {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  background: var(--bg-card);
}

:deep(.el-card:hover) {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  border-color: var(--primary-light);
}

:deep(.el-card__header) {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
  border-bottom: 1px solid var(--border-color);
  padding: 24px 28px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

:deep(.el-button--primary) {
  background: var(--gradient-primary);
  border: none;
  box-shadow: var(--shadow);
  transition: all 0.3s;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.category-bar {
  margin-bottom: 18px;
}

:deep(.el-radio-group.category-group .el-radio-button__inner) {
  border-radius: 8px !important;
  margin-right: 6px;
  font-weight: 500;
  padding: 10px 18px;
}

:deep(.el-radio-group.category-group .el-radio-button) {
  border: none;
}

:deep(.el-radio-group.category-group .el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: var(--gradient-primary);
  color: #fff;
}

.breadcrumb {
  margin-bottom: 16px;
}

.crumb-root,
.crumb-current {
  cursor: pointer;
  font-weight: 600;
  color: var(--primary-color);
}

.crumb-root:hover,
.crumb-current:hover {
  text-decoration: underline;
}

.crumb-current {
  color: var(--text-primary);
  cursor: default;
}

.folder-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
}

.folder-card {
  width: 180px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: rgba(14, 165, 233, 0.03);
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.folder-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.folder-icon {
  font-size: 38px;
  line-height: 1.2;
}

.folder-name {
  margin-top: 8px;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-actions {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 4px;
}

:deep(.el-table) {
  border-radius: var(--radius);
  overflow: hidden;
}

:deep(.el-table__header) {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.04) 0%, rgba(6, 182, 212, 0.04) 100%);
}

:deep(.el-table th) {
  background: transparent;
  color: var(--text-primary);
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
}

:deep(.el-table td) {
  border-bottom: 1px solid var(--border-light);
}

:deep(.el-table__row:hover) {
  background: rgba(14, 165, 233, 0.03);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.file-type-icon {
  font-size: 24px;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.file-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 15px;
  transition: color 0.3s;
}

.file-name:hover {
  color: var(--primary-color);
}

.file-meta {
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.hash-text {
  font-family: 'Courier New', monospace;
  color: var(--success-color);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  background: rgba(16, 185, 129, 0.08);
}

.hash-text:hover {
  color: #059669;
  background: rgba(16, 185, 129, 0.12);
  transform: translateY(-1px);
}

:deep(.el-tag) {
  border-radius: 8px;
  font-weight: 500;
  padding: 4px 12px;
}

:deep(.el-button--small) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
}

:deep(.el-button--small:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-body {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-hint {
  color: var(--text-tertiary);
}

.preview-media {
  max-width: 100%;
  max-height: 65vh;
  border-radius: var(--radius);
}

.preview-audio {
  width: 100%;
}

.preview-pdf {
  width: 100%;
  height: 65vh;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
}
</style>
