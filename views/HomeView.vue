<template>
  <div class="home-view">
    <section id="home" class="hero">
      <div class="hero-background">
        <div class="particles"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">区块链</span><span class="highlight-text">与</span><span class="gradient-text">云计算</span><span class="highlight-text">融合</span>
          </h1>
          <h2 class="hero-subtitle">下一代分布式存储解决方案</h2>
          <p class="hero-description">
            结合区块链的去中心化安全性与云计算的弹性扩展能力，打造安全、高效、可靠的分布式存储生态系统
          </p>
          <div class="hero-buttons">
            <el-button type="primary" size="large" @click="goStorage">立即体验</el-button>
            <el-button size="large" plain @click="scrollTo('features')">了解更多</el-button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="blockchain-node"></div>
          <div class="cloud-network"></div>
        </div>
      </div>
    </section>

    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title">核心特性</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.title">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="technology" class="technology">
      <div class="container">
        <h2 class="section-title">技术架构</h2>
        <div class="architecture">
          <div class="arch-layer" v-for="layer in architecture" :key="layer.title">
            <div class="layer-card">
              <h3>{{ layer.title }}</h3>
              <p>{{ layer.content }}</p>
            </div>
            <div class="arch-arrow" v-if="layer.arrow">↓</div>
          </div>
        </div>
        <div class="tech-details">
          <div class="tech-item" v-for="tech in technologyDetails" :key="tech.title">
            <h4>{{ tech.title }}</h4>
            <ul>
              <li v-for="item in tech.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section id="advantages" class="advantages">
      <div class="container">
        <h2 class="section-title">系统优势</h2>
        <div class="comparison">
          <div class="comparison-item">
            <div class="comparison-header">
              <h3>传统存储</h3>
            </div>
            <ul class="comparison-list">
              <li class="negative">❌ 中心化单点故障</li>
              <li class="negative">❌ 数据安全风险高</li>
              <li class="negative">❌ 扩展性受限</li>
              <li class="negative">❌ 成本高昂</li>
            </ul>
          </div>
          <div class="comparison-item highlight">
            <div class="comparison-header">
              <h3>我们的系统</h3>
              <span class="badge">推荐</span>
            </div>
            <ul class="comparison-list">
              <li class="positive">✅ 去中心化架构</li>
              <li class="positive">✅ 区块链加密保护</li>
              <li class="positive">✅ 弹性云扩展</li>
              <li class="positive">✅ 按需付费</li>
            </ul>
          </div>
        </div>
        <div class="stats">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="contact">
      <div class="container">
        <h2 class="section-title">联系我们</h2>
        <div class="contact-content">
          <div class="contact-info">
            <div class="info-item" v-for="info in contactInfos" :key="info.title">
              <div class="info-icon">{{ info.icon }}</div>
              <div>
                <h4>{{ info.title }}</h4>
                <p>{{ info.value }}</p>
              </div>
            </div>
          </div>
          <div class="contact-form">
            <el-form :model="contactForm" label-position="top">
              <el-form-item label="您的姓名">
                <el-input v-model="contactForm.name" placeholder="请输入姓名" />
              </el-form-item>
              <el-form-item label="您的邮箱">
                <el-input v-model="contactForm.email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item label="留言内容">
                <el-input v-model="contactForm.message" type="textarea" :rows="5" placeholder="请输入留言" />
              </el-form-item>
              <el-button type="primary" @click="submitContact">发送消息</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <p>© 2025 区块链与云计算融合的分布式存储系统. 保留所有权利.</p>
        <div class="footer-links">
          <a href="javascript:void(0)">隐私政策</a>
          <a href="javascript:void(0)">服务条款</a>
          <a href="javascript:void(0)">关于我们</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const features = [
  { icon: '🔐', title: '去中心化安全', description: '基于区块链技术，数据加密存储，多重验证机制，确保数据安全性和完整性' },
  { icon: '⚡', title: '高性能存储', description: '云计算弹性扩展，智能负载均衡，支持PB级数据存储，毫秒级响应速度' },
  { icon: '🌐', title: '全球分布式', description: '多节点部署，全球覆盖，就近访问，降低延迟，提升用户体验' },
  { icon: '💰', title: '成本优化', description: '按需付费，资源动态分配，降低存储成本，提高资源利用率' },
  { icon: '🔄', title: '数据冗余', description: '多副本存储，自动备份，故障自动恢复，99.99%数据可用性保障' },
  { icon: '📊', title: '智能管理', description: '可视化监控面板，实时数据分析，智能运维，自动化管理' }
]

const architecture = [
  { title: '应用层', content: 'Web界面、API接口、移动应用', arrow: true },
  { title: '服务层', content: '存储服务、计算服务、网络服务', arrow: true },
  { title: '区块链层', content: '智能合约、共识机制、加密算法', arrow: true },
  { title: '存储层', content: '分布式文件系统、数据分片、冗余备份', arrow: true },
  { title: '基础设施层', content: '云服务器、网络设备、存储设备', arrow: false }
]

const technologyDetails = [
  { title: '区块链技术', items: ['PoS共识算法', 'IPFS分布式存储协议', '零知识证明加密'] },
  { title: '云计算技术', items: ['容器化部署（Docker/K8s）', '微服务架构', '弹性伸缩'] },
  { title: '存储技术', items: ['对象存储（S3兼容）', '块存储', '文件存储'] }
]

const stats = [
  { value: '99.99%', label: '可用性' },
  { value: '1000+', label: 'PB级存储' },
  { value: '50+', label: '全球节点' },
  { value: '24/7', label: '全天候服务' }
]

const contactInfos = [
  { icon: '📧', title: '邮箱', value: 'contact@blockchain-storage.com' },
  { icon: '📱', title: '电话', value: '400-888-8888' },
  { icon: '📍', title: '地址', value: '中国·贵州·贵州电子科技职业学院' }
]

const contactForm = reactive({
  name: '',
  email: '',
  message: ''
})

const goStorage = () => {
  router.push('/storage')
}

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const submitContact = () => {
  if (!contactForm.name || !contactForm.email || !contactForm.message) {
    ElMessage.warning('请填写完整的联系方式')
    return
  }
  ElMessage.success('感谢您的留言，我们会尽快与您联系！')
  contactForm.name = ''
  contactForm.email = ''
  contactForm.message = ''
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
}
</style>
