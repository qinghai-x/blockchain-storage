<template>
  <div class="management-view">
    <el-page-header content="数据管理中心" class="page-header" />

    <el-row :gutter="20" class="stats-row" v-loading="loading">
      <el-col :xs="24" :sm="12" :lg="6" v-for="card in summaryCards" :key="card.title">
        <el-card shadow="hover" class="summary-card">
          <div class="card-icon" :style="{ background: card.gradient }">{{ card.icon }}</div>
          <div class="card-content">
            <div class="card-title">{{ card.title }}</div>
            <div class="card-value">{{ card.value }}</div>
            <div class="card-desc">{{ card.description }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="section-card" shadow="hover" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>节点运行状态</span>
        </div>
      </template>
      <el-table :data="nodeList" border v-if="nodeList.length > 0">
        <el-table-column prop="name" label="节点名称" min-width="140" />
        <el-table-column prop="region" label="所属区域" min-width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === '在线' ? 'success' : 'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="storage" label="存储占用" min-width="140" />
        <el-table-column prop="bandwidth" label="带宽负载" min-width="140" />
        <el-table-column prop="uptime" label="在线时长" min-width="140" />
      </el-table>
      <el-empty v-else description="暂无节点数据" />
    </el-card>

    <el-card class="section-card" shadow="hover" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>系统状态</span>
        </div>
      </template>
      <el-timeline v-if="alarms.length > 0">
        <el-timeline-item
          v-for="(alarm, index) in alarms"
          :key="index"
          :type="alarm.type"
          :timestamp="alarm.time"
        >
          {{ alarm.content }}
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else description="暂无状态信息" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileList } from '@/api/storage'

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

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化数字（添加千分位）
const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN')
}

// 计算统计数据
const stats = computed(() => {
  const totalFiles = fileList.value.length
  const totalSize = fileList.value.reduce((sum, file) => sum + file.fileSize, 0)
  const activeFiles = fileList.value.filter(file => file.status === 1).length
  const avgFileSize = totalFiles > 0 ? totalSize / totalFiles : 0
  
  // 按文件类型统计
  const fileTypes = fileList.value.reduce((acc, file) => {
    const type = file.mimeType.split('/')[0] || 'other'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // 按日期统计（最近7天）
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentFiles = fileList.value.filter(file => 
    new Date(file.uploadTime) >= sevenDaysAgo
  ).length
  
  return {
    totalFiles,
    totalSize,
    activeFiles,
    avgFileSize,
    fileTypes,
    recentFiles
  }
})

// 统计卡片数据
const summaryCards = computed(() => {
  const { totalFiles, totalSize, activeFiles, recentFiles } = stats.value
  
  return [
    { 
      icon: '💾', 
      title: '总存储量', 
      value: formatFileSize(totalSize), 
      description: recentFiles > 0 ? `最近7天新增 ${recentFiles} 个文件` : '暂无数据',
      gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)' 
    },
    { 
      icon: '📂', 
      title: '文件总数', 
      value: formatNumber(totalFiles), 
      description: `活跃文件 ${activeFiles} 个`,
      gradient: 'linear-gradient(135deg,#ec4899,#f97316)' 
    },
    { 
      icon: '✅', 
      title: '活跃文件', 
      value: formatNumber(activeFiles), 
      description: totalFiles > 0 ? `${Math.round((activeFiles / totalFiles) * 100)}% 文件正常` : '暂无数据',
      gradient: 'linear-gradient(135deg,#10b981,#34d399)' 
    },
    { 
      icon: '📊', 
      title: '平均大小', 
      value: formatFileSize(stats.value.avgFileSize), 
      description: totalFiles > 0 ? `共 ${formatNumber(totalFiles)} 个文件` : '暂无数据',
      gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' 
    }
  ]
})

// 节点运行状态（基于文件分布模拟）
const nodeList = computed(() => {
  const { totalSize, totalFiles } = stats.value
  
  if (totalFiles === 0) {
    return [
      { name: '节点-本地-01', region: '本地存储', status: '在线', storage: '0 B / 5 MB', bandwidth: '0%', uptime: '0 天' }
    ]
  }
  
  // 根据文件数量模拟节点分布
  const nodes = []
  const nodeCount = Math.min(Math.ceil(totalFiles / 10), 4) // 最多4个节点
  
  const regions = ['本地存储', '备份节点-01', '备份节点-02', '备份节点-03']
  const nodeSize = totalSize / nodeCount
  
  for (let i = 0; i < nodeCount; i++) {
    const nodeStorage = nodeSize * (0.6 + Math.random() * 0.4) // 60%-100%使用率
    const maxStorage = nodeSize * 1.5
    const usage = Math.round((nodeStorage / maxStorage) * 100)
    const uptime = Math.floor(Math.random() * 200) + 1
    
    nodes.push({
      name: `节点-${regions[i]}`,
      region: regions[i],
      status: '在线',
      storage: `${formatFileSize(nodeStorage)} / ${formatFileSize(maxStorage)}`,
      bandwidth: `${usage}%`,
      uptime: `${uptime} 天`
    })
  }
  
  return nodes
})

// 告警信息（基于实际数据生成）
const alarms = computed(() => {
  const { totalSize, totalFiles } = stats.value
  const alarmsList = []
  const now = new Date()
  
  // 存储空间告警（如果超过5MB）
  const maxStorage = 5 * 1024 * 1024 // 5MB
  if (totalSize > maxStorage * 0.9) {
    alarmsList.push({
      type: 'danger',
      time: now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      content: `存储空间使用率超过 90%，当前使用 ${formatFileSize(totalSize)}，建议清理部分文件。`
    })
  } else if (totalSize > maxStorage * 0.7) {
    alarmsList.push({
      type: 'warning',
      time: now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      content: `存储空间使用率超过 70%，当前使用 ${formatFileSize(totalSize)}，请注意管理存储空间。`
    })
  }
  
  // 文件数量告警
  if (totalFiles > 100) {
    alarmsList.push({
      type: 'warning',
      time: now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      content: `文件数量较多（${totalFiles} 个），建议定期整理和清理不需要的文件。`
    })
  }
  
  // 如果没有告警，显示正常状态
  if (alarmsList.length === 0) {
    alarmsList.push({
      type: 'success',
      time: now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      content: `系统运行正常，当前存储 ${formatFileSize(totalSize)}，共 ${totalFiles} 个文件。`
    })
  }
  
  return alarmsList
})

// 加载文件列表
const loadFileList = async () => {
  try {
    loading.value = true
    const response = await getFileList()
    if (response.success && response.data) {
      fileList.value = response.data as FileItem[]
    } else {
      fileList.value = []
    }
  } catch (error) {
    ElMessage.error('获取文件列表失败')
    fileList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFileList()
})

// 监听用户登录状态变化
window.addEventListener('auth-change', () => {
  loadFileList()
})
</script>

<style scoped>
.management-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  padding-left: 0;
}

.stats-row {
  margin: 0;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title {
  font-size: 16px;
  color: #4b5563;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.card-desc {
  font-size: 13px;
  color: #6b7280;
}

.section-card {
  border-radius: 16px;
}

.card-header {
  font-weight: 600;
  font-size: 16px;
}
</style>
