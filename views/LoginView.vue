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
              placeholder="用户名"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
  
          <el-button 
            type="primary" 
            size="large" 
            @click="handleLogin"
            :loading="loading"
            style="width: 100%; margin-top: 20px;"
          >
            登录
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .login-card {
    width: 100%;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .login-header {
    text-align: center;
    color: #333;
  }
  
  .login-header h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
  }
  
  .login-header p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
  
  .login-footer {
    text-align: center;
    margin-top: 20px;
    color: #666;
  }
  
  .register-section {
    padding: 20px 0;
  }
  
  .register-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .register-header h2 {
    margin: 0 0 8px 0;
    color: #333;
  }
  
  .register-header p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
  </style>