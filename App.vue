<template>
    <el-container class="layout-container">
      <!-- 顶部导航 -->
      <el-header class="layout-header">
        <div class="header-content">
          <div class="logo">
            <svg class="logo-icon" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <!-- 区块链链环 -->
              <g id="blockchain">
                <circle cx="30" cy="30" r="12" fill="none" stroke="#6366f1" stroke-width="3" opacity="0.8"/>
                <circle cx="60" cy="30" r="12" fill="none" stroke="#8b5cf6" stroke-width="3" opacity="0.8"/>
                <circle cx="90" cy="30" r="12" fill="none" stroke="#ec4899" stroke-width="3" opacity="0.8"/>
                <line x1="42" y1="30" x2="48" y2="30" stroke="#6366f1" stroke-width="2" opacity="0.6"/>
                <line x1="72" y1="30" x2="78" y2="30" stroke="#8b5cf6" stroke-width="2" opacity="0.6"/>
              </g>
              <!-- 云存储图标 -->
              <g id="cloud">
                <path d="M 40 70 Q 30 70 30 80 Q 30 90 40 90 L 80 90 Q 90 90 90 80 Q 90 70 80 70 Q 85 60 75 60 Q 65 60 60 70 Z" 
                      fill="url(#cloudGradient)" opacity="0.9"/>
                <defs>
                  <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </g>
              <!-- 连接线 -->
              <g id="connection">
                <line x1="60" y1="42" x2="60" y2="58" stroke="#fbbf24" stroke-width="2" opacity="0.7"/>
                <circle cx="60" cy="50" r="3" fill="#fbbf24" opacity="0.8"/>
              </g>
            </svg>
            <h2 class="logo-text">区块链云存储系统</h2>
          </div>
          <div class="nav-menu">
            <el-menu 
              mode="horizontal" 
              :default-active="activeMenu"
              router
            >
              <el-menu-item index="/">系统概览</el-menu-item>
              <el-menu-item index="/storage">文件存储</el-menu-item>
              <el-menu-item index="/management">数据管理</el-menu-item>
              <el-menu-item index="/security">安全中心</el-menu-item>
            </el-menu>
          </div>
          <div class="user-info">
            <template v-if="isAuthenticated">
              <el-dropdown @command="handleCommand">
                <span class="user-dropdown">
                  <el-avatar :size="32" :src="userInfo.avatar" />
                  {{ userInfo.nickname || userInfo.username || '未命名用户' }}
                  <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template v-else>
              <el-button type="primary" @click="router.push('/login')">登录</el-button>
            </template>
          </div>
        </div>
      </el-header>
  
      <!-- 主要内容 -->
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { ArrowDown } from '@element-plus/icons-vue'
  
  const route = useRoute()
  const router = useRouter()
  
  const defaultAvatar = 'https://api.dicebear.com/7.x/identicon/svg?seed=guest'
  const userInfo = ref({
    username: '访客',
    nickname: '访客',
    avatar: defaultAvatar,
    role: ''
  })
  const token = ref('')
  
  const activeMenu = computed(() => route.path)
  
  const isAuthenticated = computed(() => Boolean(token.value))
  
  const refreshUserInfo = () => {
    const storedUserInfo = localStorage.getItem('userInfo')
    const storedToken = localStorage.getItem('token') || ''
    token.value = storedToken

    if (storedUserInfo && storedToken) {
      try {
        const parsed = JSON.parse(storedUserInfo)
        // 确保加载所有个人信息字段，包括头像、用户名、昵称、角色等
        userInfo.value = {
          username: parsed.username || '未命名用户',
          nickname: parsed.nickname || parsed.username || '未命名用户',
          avatar: parsed.avatar || defaultAvatar,
          role: parsed.role || ''
        }
        // 如果用户信息存在但缺少某些字段，尝试从用户数据库补充
        if (parsed.id) {
          // 可以在这里添加从用户数据库同步最新信息的逻辑
          // 但为了性能，我们主要依赖 localStorage 中的数据
        }
      } catch (error) {
        console.warn('解析用户信息失败', error)
        userInfo.value = {
          username: '访客',
          nickname: '访客',
          avatar: defaultAvatar,
          role: ''
        }
      }
    } else {
      userInfo.value = {
        username: '访客',
        nickname: '访客',
        avatar: defaultAvatar,
        role: ''
      }
    }
  }
  
  onMounted(() => {
    refreshUserInfo()
    window.addEventListener('storage', refreshUserInfo)
    window.addEventListener('auth-change', refreshUserInfo)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('storage', refreshUserInfo)
    window.removeEventListener('auth-change', refreshUserInfo)
  })
  
  watch(() => route.fullPath, () => {
    refreshUserInfo()
  })
  
  const handleCommand = async (command: string) => {
    if (command === 'logout') {
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          type: 'warning'
        })
        
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        refreshUserInfo()
        ElMessage.success('已退出登录')
        router.push('/login')
      } catch {
        // 用户取消退出
      }
    } else if (command === 'profile') {
      router.push('/profile')
    }
  }
  </script>
  
  <style scoped>
  .layout-container {
    height: 100vh;
  }
  
  .layout-header {
    background: #fff;
    border-bottom: 1px solid #e6e6e6;
    padding: 0 20px;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.logo-text {
  margin: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
}
  
  .nav-menu {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .user-dropdown {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.3s;
  }
  
  .user-dropdown:hover {
    background-color: #f5f7fa;
  }
  
  .layout-main {
    background-color: #f5f7fa;
    padding: 20px;
  }
  </style>