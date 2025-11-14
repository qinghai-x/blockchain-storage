/**
 * 数据迁移和版本管理
 * 确保代码更新时用户数据不会丢失
 */

// 数据版本号 - 每次数据结构变更时递增
const DATA_VERSION = 1

const VERSION_KEY = 'blockchain-storage-version'
const USER_STORAGE_KEY = 'blockchain-storage-users'
const FILE_STORAGE_KEY = 'blockchain-storage-files'
const USER_INFO_KEY = 'userInfo'

/**
 * 获取当前存储的数据版本
 */
export const getDataVersion = (): number => {
  try {
    const version = localStorage.getItem(VERSION_KEY)
    return version ? parseInt(version, 10) : 0
  } catch {
    return 0
  }
}

/**
 * 设置数据版本
 */
const setDataVersion = (version: number): void => {
  try {
    localStorage.setItem(VERSION_KEY, version.toString())
  } catch (error) {
    console.error('设置数据版本失败:', error)
  }
}

/**
 * 备份所有用户数据
 */
const backupData = (): void => {
  try {
    const users = localStorage.getItem(USER_STORAGE_KEY)
    const files = localStorage.getItem(FILE_STORAGE_KEY)
    const userInfo = localStorage.getItem(USER_INFO_KEY)
    
    if (users) {
      localStorage.setItem(`${USER_STORAGE_KEY}-backup-${Date.now()}`, users)
    }
    if (files) {
      localStorage.setItem(`${FILE_STORAGE_KEY}-backup-${Date.now()}`, files)
    }
    if (userInfo) {
      localStorage.setItem(`${USER_INFO_KEY}-backup-${Date.now()}`, userInfo)
    }
    
    // 清理旧的备份（只保留最近3个）
    cleanupOldBackups()
  } catch (error) {
    console.warn('数据备份失败:', error)
  }
}

/**
 * 清理旧的备份数据
 */
const cleanupOldBackups = (): void => {
  try {
    const keys = Object.keys(localStorage)
    const backupKeys = keys
      .filter(key => key.includes('-backup-'))
      .sort()
      .reverse()
    
    // 只保留最近3个备份
    if (backupKeys.length > 3) {
      backupKeys.slice(3).forEach(key => {
        localStorage.removeItem(key)
      })
    }
  } catch (error) {
    console.warn('清理备份失败:', error)
  }
}

/**
 * 验证数据完整性
 */
const validateData = (): boolean => {
  try {
    // 检查用户数据
    const users = localStorage.getItem(USER_STORAGE_KEY)
    if (users) {
      const parsed = JSON.parse(users)
      if (!Array.isArray(parsed)) {
        console.error('用户数据格式错误')
        return false
      }
    }
    
    // 检查文件数据
    const files = localStorage.getItem(FILE_STORAGE_KEY)
    if (files) {
      const parsed = JSON.parse(files)
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        console.error('文件数据格式错误')
        return false
      }
    }
    
    return true
  } catch (error) {
    console.error('数据验证失败:', error)
    return false
  }
}

/**
 * 迁移数据（从旧版本到新版本）
 */
const migrateData = (fromVersion: number, toVersion: number): void => {
  console.log(`数据迁移: ${fromVersion} -> ${toVersion}`)
  
  // 备份数据
  backupData()
  
  // 版本 0 -> 1: 确保数据结构正确
  if (fromVersion < 1 && toVersion >= 1) {
    try {
      // 迁移用户数据
      const users = localStorage.getItem(USER_STORAGE_KEY)
      if (users) {
        const parsed = JSON.parse(users)
        if (Array.isArray(parsed)) {
          // 确保每个用户都有必需的字段
          const migratedUsers = parsed.map((user: any) => ({
            ...user,
            nickname: user.nickname || user.username || '',
            publicKey: user.publicKey || '',
            role: user.role || 'user',
            createdAt: user.createdAt || new Date().toISOString()
          }))
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(migratedUsers))
        }
      }
      
      // 迁移文件数据
      const files = localStorage.getItem(FILE_STORAGE_KEY)
      if (files) {
        const parsed = JSON.parse(files)
        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          // 文件数据格式正确，无需迁移
          localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(parsed))
        } else if (Array.isArray(parsed)) {
          // 旧格式：文件数组，需要转换为按用户ID分组的格式
          // 注意：这种情况下无法确定文件属于哪个用户，所以保留为空对象
          // 实际使用中，这种情况应该很少见
          console.warn('检测到旧格式文件数据，但无法确定用户归属，已清空')
          localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify({}))
        }
      }
    } catch (error) {
      console.error('数据迁移失败:', error)
      // 迁移失败时，尝试从备份恢复
      restoreFromBackup()
    }
  }
  
  // 未来版本迁移逻辑可以在这里添加
  // if (fromVersion < 2 && toVersion >= 2) { ... }
}

/**
 * 从备份恢复数据
 */
const restoreFromBackup = (): void => {
  try {
    const keys = Object.keys(localStorage)
    const backupKeys = keys
      .filter(key => key.includes('-backup-'))
      .sort()
      .reverse()
    
    if (backupKeys.length > 0) {
      const latestBackup = backupKeys[0]
      const backupTime = latestBackup.split('-backup-')[1]
      
      const usersBackup = localStorage.getItem(`${USER_STORAGE_KEY}-backup-${backupTime}`)
      const filesBackup = localStorage.getItem(`${FILE_STORAGE_KEY}-backup-${backupTime}`)
      const userInfoBackup = localStorage.getItem(`${USER_INFO_KEY}-backup-${backupTime}`)
      
      if (usersBackup) {
        localStorage.setItem(USER_STORAGE_KEY, usersBackup)
      }
      if (filesBackup) {
        localStorage.setItem(FILE_STORAGE_KEY, filesBackup)
      }
      if (userInfoBackup) {
        localStorage.setItem(USER_INFO_KEY, userInfoBackup)
      }
      
      console.log('已从备份恢复数据')
    }
  } catch (error) {
    console.error('从备份恢复失败:', error)
  }
}

/**
 * 初始化数据迁移系统
 * 在应用启动时调用，确保数据版本正确
 */
export const initDataMigration = (): void => {
  try {
    const currentVersion = getDataVersion()
    
    // 如果版本不匹配，执行迁移
    if (currentVersion !== DATA_VERSION) {
      console.log(`检测到数据版本变更: ${currentVersion} -> ${DATA_VERSION}`)
      
      // 验证现有数据
      if (!validateData()) {
        console.warn('数据验证失败，尝试从备份恢复')
        restoreFromBackup()
      }
      
      // 执行迁移
      migrateData(currentVersion, DATA_VERSION)
      
      // 更新版本号
      setDataVersion(DATA_VERSION)
      
      console.log('数据迁移完成')
    } else {
      // 版本匹配，验证数据完整性
      if (!validateData()) {
        console.warn('数据验证失败，尝试从备份恢复')
        restoreFromBackup()
      }
    }
  } catch (error) {
    console.error('数据迁移初始化失败:', error)
    // 即使迁移失败，也尝试恢复备份
    restoreFromBackup()
  }
}

/**
 * 检查数据存储键名是否稳定
 * 确保代码更新时不会改变存储键名
 */
export const verifyStorageKeys = (): boolean => {
  const expectedKeys = [
    USER_STORAGE_KEY,
    FILE_STORAGE_KEY,
    USER_INFO_KEY,
    VERSION_KEY
  ]
  
  // 检查是否有使用旧键名的数据需要迁移
  const allKeys = Object.keys(localStorage)
  const deprecatedKeys = allKeys.filter(key => 
    key.startsWith('blockchain-storage') && 
    !expectedKeys.includes(key) &&
    !key.includes('-backup-')
  )
  
  if (deprecatedKeys.length > 0) {
    console.warn('检测到可能已废弃的存储键:', deprecatedKeys)
    // 可以在这里添加从旧键名迁移到新键名的逻辑
  }
  
  return true
}

/**
 * 获取数据统计信息（用于调试）
 */
export const getDataStats = () => {
  try {
    const users = localStorage.getItem(USER_STORAGE_KEY)
    const files = localStorage.getItem(FILE_STORAGE_KEY)
    const userInfo = localStorage.getItem(USER_INFO_KEY)
    
    const userCount = users ? JSON.parse(users).length : 0
    const fileData = files ? JSON.parse(files) : {}
    const totalFiles = Object.values(fileData).reduce((sum: number, files: any) => {
      return sum + (Array.isArray(files) ? files.length : 0)
    }, 0)
    
    return {
      version: getDataVersion(),
      userCount,
      totalFiles,
      hasUserInfo: !!userInfo,
      storageSize: new Blob([users || '', files || '', userInfo || '']).size
    }
  } catch (error) {
    console.error('获取数据统计失败:', error)
    return null
  }
}

