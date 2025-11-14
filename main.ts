import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles.css'
import App from './App.vue'
import router from './router/index.js'
import { initDataMigration, verifyStorageKeys } from './api/dataMigration'

// 在应用启动前初始化数据迁移系统
// 确保代码更新时用户数据不会丢失
try {
  verifyStorageKeys()
  initDataMigration()
  console.log('数据迁移系统初始化完成')
} catch (error) {
  console.error('数据迁移系统初始化失败:', error)
  // 即使初始化失败，也继续启动应用，避免影响用户体验
}

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(router)

app.mount('#app')