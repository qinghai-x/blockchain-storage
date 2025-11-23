<template>
    <div class="login-container">
      <el-card class="login-card">
        <template #header>
          <div class="login-header">
            <h2>区块链云存储系统</h2>
            <p>安全 · 高效 · 可信</p>
          </div>
        </template>
        
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" v-if="!showRegister">
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="请输入用户名"
              :prefix-icon="User"
              size="large"
              clearable
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
  
          <el-button 
            type="primary" 
            size="large" 
            @click="handleLogin"
            :loading="loading"
            style="width: 100%; margin-top: 20px;"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form>
  
        <div class="login-footer" v-if="!showRegister">
          <p>还没有账户？<el-link type="primary" @click="showRegister = true">立即注册</el-link></p>
        </div>
      </el-card>
  
      <!-- 注册表单 -->
      <div v-if="showRegister" class="register-section">
        <div class="register-header">
          <h2>首次注册</h2>
          <p>创建您的账户以开始使用</p>
        </div>
        <RegisterForm @success="handleRegisterSuccess" @cancel="handleCancelRegister" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
  import { User, Lock } from '@element-plus/icons-vue'
  import RegisterForm from '@/components/RegisterForm.vue'
  import { login, hasUsers } from '@/api/auth'
  
  const router = useRouter()
  const loginFormRef = ref<FormInstance>()
  const loading = ref(false)
  const showRegister = ref(false)
  
  const loginForm = reactive({
    username: '',
    password: ''
  })
  
  const rules = reactive<FormRules>({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  })
  
  onMounted(async () => {
    // 检查是否有已注册用户，如果没有则显示注册界面
    const usersExist = await hasUsers()
    if (!usersExist) {
      showRegister.value = true
    }
  })
  
  const handleLogin = async () => {
    if (!loginFormRef.value) return
    
    try {
      await loginFormRef.value.validate()
      loading.value = true
      
      const response = await login(loginForm)
      
      if (response.success && response.data) {
        // 保存 token 和用户信息，确保数据持久化
        try {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('userInfo', JSON.stringify(response.data.user))
          
          // 验证保存成功
          const verifyToken = localStorage.getItem('token')
          const verifyUserInfo = localStorage.getItem('userInfo')
          if (!verifyToken || !verifyUserInfo) {
            ElMessage.warning('登录信息保存可能失败，请刷新页面检查')
          }
        } catch (error) {
          console.error('保存登录信息失败:', error)
          ElMessage.error('登录信息保存失败，请检查浏览器存储空间')
          return
        }
        
        window.dispatchEvent(new Event('auth-change'))
        ElMessage.success('登录成功')
        router.push('/storage')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '登录失败，请检查用户名和密码'
      ElMessage.error(message)
    } finally {
      loading.value = false
    }
  }
  
  const handleRegisterSuccess = async (username: string, password: string) => {
    showRegister.value = false
    ElMessage.success('注册成功，正在自动登录...')
    
    // 注册成功后自动登录
    try {
      loading.value = true
      const response = await login({
        username,
        password
      })
      
      if (response.success && response.data) {
        // 保存 token 和用户信息，确保数据持久化
        try {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('userInfo', JSON.stringify(response.data.user))
          
          // 验证保存成功
          const verifyToken = localStorage.getItem('token')
          const verifyUserInfo = localStorage.getItem('userInfo')
          if (!verifyToken || !verifyUserInfo) {
            ElMessage.warning('登录信息保存可能失败，请刷新页面检查')
          }
        } catch (error) {
          console.error('保存登录信息失败:', error)
          ElMessage.error('登录信息保存失败，请检查浏览器存储空间')
          return
        }
        
        window.dispatchEvent(new Event('auth-change'))
        ElMessage.success('登录成功')
        router.push('/storage')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '自动登录失败，请手动登录'
      ElMessage.error(message)
    } finally {
      loading.value = false
    }
  }
  
  const handleCancelRegister = () => {
    // 如果还没有用户，不允许取消注册
    hasUsers().then(exists => {
      if (exists) {
        showRegister.value = false
      } else {
        ElMessage.warning('请先完成注册才能使用系统')
      }
    })
  }
  </script>
  
  <style scoped>
  .login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%);
    background-size: 200% 200%;
    animation: gradientShift 15s ease infinite;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .login-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .login-card {
    width: 100%;
    max-width: 460px;
    box-shadow: 0 24px 64px rgba(14, 165, 233, 0.25);
    border-radius: var(--radius-xl);
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.98);
    position: relative;
    z-index: 1;
    transition: transform 0.3s;
  }

  .login-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 32px 80px rgba(14, 165, 233, 0.3);
  }

  :deep(.el-card__header) {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%);
    border-bottom: 1px solid rgba(14, 165, 233, 0.15);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    padding: 28px;
  }
  
  .login-header {
    text-align: center;
    color: var(--text-primary);
  }
  
  .login-header h2 {
    margin: 0 0 12px 0;
    font-size: 28px;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .login-header p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 15px;
    font-weight: 500;
  }
  
  .login-footer {
    text-align: center;
    margin-top: 28px;
    color: var(--text-secondary);
    font-weight: 500;
  }

  :deep(.el-link) {
    font-weight: 600;
    color: var(--primary-color);
  }
  
  .register-section {
    padding: 28px 0;
  }
  
  .register-header {
    text-align: center;
    margin-bottom: 28px;
  }
  
  .register-header h2 {
    margin: 0 0 12px 0;
    color: var(--text-primary);
    font-size: 26px;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .register-header p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 15px;
    font-weight: 500;
  }

  :deep(.el-button--primary) {
    background: var(--gradient-primary);
    border: none;
    box-shadow: 0 4px 16px rgba(14, 165, 233, 0.35);
    transition: all 0.3s;
    font-weight: 600;
  }

  :deep(.el-button--primary:hover) {
    background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
    box-shadow: 0 6px 24px rgba(14, 165, 233, 0.45);
    transform: translateY(-2px);
  }

  :deep(.el-input__inner) {
    border-radius: var(--radius);
    border-color: rgba(14, 165, 233, 0.2);
    transition: all 0.3s;
  }

  :deep(.el-input__inner:focus) {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
  </style>