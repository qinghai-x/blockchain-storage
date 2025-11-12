<template>
  <div class="profile-container">
    <el-page-header content="个人信息" class="page-header" />

    <el-row :gutter="20">
      <!-- 左侧：个人信息卡片 -->
      <el-col :xs="24" :lg="8">
        <el-card class="profile-card" shadow="hover">
          <div class="avatar-section">
            <el-avatar :size="120" :src="userInfo.avatar" class="user-avatar">
              <el-icon :size="60"><User /></el-icon>
            </el-avatar>
            <div class="avatar-actions">
              <el-button size="small" @click="showAvatarDialog = true">更换头像</el-button>
            </div>
          </div>
          <div class="user-basic-info">
            <h2>{{ userInfo.nickname || userInfo.username || '未命名用户' }}</h2>
            <p class="username-display">用户名：{{ userInfo.username }}</p>
            <el-tag :type="userInfo.role === 'admin' ? 'danger' : 'primary'">
              {{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
            <p class="register-time">注册时间：{{ formatTime(userInfo.createdAt) }}</p>
          </div>
        </el-card>

        <!-- 存储统计 -->
        <el-card class="stats-card" shadow="hover" style="margin-top: 20px;">
          <template #header>
            <span>存储统计</span>
          </template>
          <div class="stats-content">
            <div class="stat-item">
              <div class="stat-label">文件总数</div>
              <div class="stat-value">{{ storageStats.totalFiles }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">已用空间</div>
              <div class="stat-value">{{ formatFileSize(storageStats.totalSize) }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：编辑表单 -->
      <el-col :xs="24" :lg="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>编辑个人信息</span>
              <el-button type="primary" @click="handleSave" :loading="saving">
                保存修改
              </el-button>
            </div>
          </template>

          <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
            <el-form-item label="用户名">
              <el-input :value="userInfo.username" disabled />
              <div class="form-tip">用户名用于登录，不可修改</div>
            </el-form-item>

            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="editForm.nickname" placeholder="请输入昵称（在系统中显示的名字）" />
              <div class="form-tip">昵称是在系统中显示的名字，可以随时修改</div>
            </el-form-item>

            <el-form-item label="公钥" prop="publicKey">
              <el-input 
                v-model="editForm.publicKey" 
                type="textarea" 
                :rows="3"
                placeholder="请输入区块链公钥" 
              />
            </el-form-item>

            <el-form-item label="注册时间">
              <el-input :value="formatTime(userInfo.createdAt)" disabled />
            </el-form-item>

            <el-form-item label="用户ID">
              <el-input :value="userInfo.id" disabled />
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 修改密码 -->
        <el-card shadow="hover" style="margin-top: 20px;">
          <template #header>
            <span>修改密码</span>
          </template>

          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input 
                v-model="passwordForm.oldPassword" 
                type="password" 
                placeholder="请输入当前密码"
                show-password
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input 
                v-model="passwordForm.newPassword" 
                type="password" 
                placeholder="请输入新密码（至少6位）"
                show-password
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input 
                v-model="passwordForm.confirmPassword" 
                type="password" 
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleChangePassword" :loading="changingPassword">
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 更换头像对话框 -->
    <el-dialog v-model="showAvatarDialog" title="更换头像" width="500px">
      <el-tabs v-model="avatarTab" type="border-card">
        <el-tab-pane label="本地上传" name="upload">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            accept="image/*"
            drag
          >
            <el-icon v-if="!uploadedAvatar" class="avatar-uploader-icon"><Plus /></el-icon>
            <img v-if="uploadedAvatar" :src="uploadedAvatar" class="avatar-preview" />
            <div v-else class="upload-tips">
              <p>点击或拖拽图片到此区域上传</p>
              <p class="tips-text">支持 JPG、PNG、GIF 格式，大小不超过 2MB</p>
            </div>
          </el-upload>
          <div v-if="uploadedAvatar" class="avatar-preview-section">
            <p>预览效果：</p>
            <el-avatar :size="100" :src="uploadedAvatar">
              <el-icon :size="50"><User /></el-icon>
            </el-avatar>
          </div>
        </el-tab-pane>
        <el-tab-pane label="URL输入" name="url">
          <el-form label-width="80px">
            <el-form-item label="头像URL">
              <el-input 
                v-model="avatarUrl" 
                placeholder="请输入头像图片URL"
                @input="previewAvatar = avatarUrl"
              />
            </el-form-item>
            <el-form-item label="预览">
              <el-avatar :size="100" :src="previewAvatar || userInfo.avatar">
                <el-icon :size="50"><User /></el-icon>
              </el-avatar>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="handleCancelAvatar">取消</el-button>
        <el-button type="primary" @click="handleUpdateAvatar" :disabled="!uploadedAvatar && !avatarUrl">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Plus } from '@element-plus/icons-vue'
import { getUserProfile, updateUserProfile, changePassword } from '@/api/auth'
import { getFileList } from '@/api/storage'

const router = useRouter()

interface UserInfo {
  id: string
  username: string
  nickname?: string
  avatar: string
  publicKey: string
  role: string
  createdAt: string
}

const userInfo = ref({
  id: '',
  username: '',
  nickname: '',
  avatar: '',
  publicKey: '',
  role: '',
  createdAt: ''
})

const editForm = reactive({
  nickname: '',
  publicKey: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const storageStats = reactive({
  totalFiles: 0,
  totalSize: 0
})

const editFormRef = ref(null)
const passwordFormRef = ref(null)
const saving = ref(false)
const changingPassword = ref(false)
const showAvatarDialog = ref(false)
const avatarUrl = ref('')
const previewAvatar = ref('')
const avatarTab = ref('upload')
const uploadedAvatar = ref('')

const formRules = reactive({
  nickname: [
    { max: 20, message: '昵称最多20个字符', trigger: 'blur' }
  ],
  publicKey: [
    { min: 10, message: '公钥长度至少10位', trigger: 'blur' }
  ]
})

const passwordRules = reactive({
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_: any, value: string, callback: (error?: Error) => void) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

onMounted(async () => {
  await loadUserProfile()
  await loadStorageStats()
})

const loadUserProfile = async () => {
  try {
    const response = await getUserProfile()
    if (response.success && response.data) {
      userInfo.value = response.data
      editForm.nickname = response.data.nickname || response.data.username
      editForm.publicKey = response.data.publicKey
    } else {
      ElMessage.error('获取用户信息失败')
      router.push('/login')
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
    router.push('/login')
  }
}

const loadStorageStats = async () => {
  try {
    const response = await getFileList()
    if (response.success && response.data) {
      storageStats.totalFiles = response.data.length
      storageStats.totalSize = response.data.reduce((sum: number, file: any) => sum + file.fileSize, 0)
    }
  } catch (error) {
    console.error('获取存储统计失败', error)
  }
}

const handleSave = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()
    saving.value = true

    const response = await updateUserProfile({
      nickname: editForm.nickname,
      publicKey: editForm.publicKey
    })

    if (response.success) {
      ElMessage.success('个人信息更新成功，已永久保存')
      await loadUserProfile()
      // 触发全局用户信息更新事件，确保所有组件都能获取最新信息
      window.dispatchEvent(new Event('auth-change'))
      
      // 验证数据已保存
      const verify = localStorage.getItem('userInfo')
      if (!verify) {
        ElMessage.warning('个人信息可能未完全保存，请刷新页面检查')
      }
    } else {
      ElMessage.error(response.message || '更新失败')
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '更新失败'
    ElMessage.error(message)
  } finally {
    saving.value = false
  }
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    changingPassword.value = true

    const response = await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })

    if (response.success) {
      ElMessage.success('密码修改成功，请重新登录')
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
      passwordFormRef.value.resetFields()
      
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      ElMessage.error(response.message || '密码修改失败')
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '密码修改失败'
    ElMessage.error(message)
  } finally {
    changingPassword.value = false
  }
}

const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }

  // 读取文件并转换为 base64
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      uploadedAvatar.value = e.target.result as string
    }
  }
  reader.readAsDataURL(file)
  
  // 阻止自动上传，我们手动处理
  return false
}

const handleAvatarSuccess = () => {
  // 这个函数不会被调用，因为我们返回了 false
}

const handleCancelAvatar = () => {
  showAvatarDialog.value = false
  avatarUrl.value = ''
  previewAvatar.value = ''
  uploadedAvatar.value = ''
  avatarTab.value = 'upload'
}

const handleUpdateAvatar = async () => {
  const avatarToUse = uploadedAvatar.value || avatarUrl.value
  
  if (!avatarToUse) {
    ElMessage.warning('请选择或输入头像')
    return
  }

  try {
    const response = await updateUserProfile({
      avatar: avatarToUse
    })

    if (response.success) {
      ElMessage.success('头像更新成功，已永久保存')
      handleCancelAvatar()
      await loadUserProfile()
      // 触发全局用户信息更新事件
      window.dispatchEvent(new Event('auth-change'))
      
      // 验证数据已保存
      const verify = localStorage.getItem('userInfo')
      if (!verify) {
        ElMessage.warning('头像可能未完全保存，请刷新页面检查')
      }
    } else {
      ElMessage.error(response.message || '头像更新失败')
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '头像更新失败'
    ElMessage.error(message)
  }
}

const formatTime = (time: string) => {
  if (!time) return '未知'
  return new Date(time).toLocaleString('zh-CN')
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  padding-left: 0;
  margin-bottom: 20px;
}

.profile-card {
  text-align: center;
}

.avatar-section {
  margin-bottom: 20px;
}

.user-avatar {
  margin-bottom: 15px;
  border: 3px solid #409eff;
}

.avatar-actions {
  margin-top: 10px;
}

.user-basic-info h2 {
  margin: 15px 0 10px 0;
  color: #303133;
}

.user-basic-info .register-time {
  margin-top: 10px;
  color: #909399;
  font-size: 14px;
}

.stats-card {
  text-align: center;
}

.stats-content {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.stat-value {
  color: #409eff;
  font-size: 24px;
  font-weight: 700;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-uploader {
  width: 100%;
  margin-bottom: 20px;
}

.avatar-uploader :deep(.el-upload) {
  width: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar-preview {
  width: 100%;
  height: 178px;
  object-fit: cover;
  display: block;
}

.upload-tips {
  padding: 40px 20px;
  text-align: center;
}

.upload-tips p {
  margin: 10px 0;
  color: #606266;
}

.tips-text {
  font-size: 12px;
  color: #909399;
}

.avatar-preview-section {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.avatar-preview-section p {
  margin-bottom: 15px;
  color: #606266;
}

.username-display {
  margin: 8px 0;
  color: #909399;
  font-size: 14px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}
</style>

