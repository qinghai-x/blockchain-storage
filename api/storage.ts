import CryptoJS from 'crypto-js'

interface UploadPayload {
  file: File
  description?: string
}

interface StoredFile {
  id: string
  fileName: string
  originalName: string
  fileSize: number
  fileHash: string
  blockchainTx: string
  uploadTime: string
  status: number
  mimeType: string
  description?: string
  content: string
}

export type StoredFileSummary = Omit<StoredFile, 'content'>

interface StorageResponse<T> {
  success: boolean
  message?: string
  data?: T
}

const STORAGE_KEY = 'blockchain-storage-files'

const getCurrentUserId = (): string | null => {
  try {
    const raw = localStorage.getItem('userInfo')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.id || null
  } catch (error) {
    console.warn('解析用户信息失败', error)
    return null
  }
}

const readStorage = (): Record<string, StoredFile[]> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, StoredFile[]>) : {}
  } catch (error) {
    console.warn('解析文件数据失败', error)
    return {}
  }
}

const writeStorage = (data: Record<string, StoredFile[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    // 确保数据写入成功
    const verify = localStorage.getItem(STORAGE_KEY)
    if (!verify) {
      console.error('数据写入失败：localStorage 可能已满或不可用')
      throw new Error('数据保存失败，请检查浏览器存储空间')
    }
  } catch (error) {
    console.error('保存数据到 localStorage 失败:', error)
    throw new Error('数据保存失败，请检查浏览器存储空间或清除缓存后重试')
  }
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'file-' + Math.random().toString(36).slice(2, 10)
}

const generateBlockchainTx = (hash: string) => {
  return `0x${CryptoJS.SHA256(hash + Date.now()).toString().slice(0, 32)}`
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        resolve(result)
      } else {
        reject(new Error('无法读取文件内容'))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

export const getFileList = async (): Promise<StorageResponse<StoredFileSummary[]>> => {
  const userId = getCurrentUserId()
  if (!userId) {
    return {
      success: false,
      message: '用户未登录'
    }
  }

  try {
    const storage = readStorage()
    const files = storage[userId] || []
    
    // 确保返回的数据按上传时间倒序排列（最新的在前）
    const sortedFiles = files.sort((a, b) => 
      new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
    )
    
    return {
      success: true,
      data: sortedFiles.map(({ content, ...rest }) => rest)
    }
  } catch (error) {
    console.error('获取文件列表失败:', error)
    return {
      success: false,
      message: '获取文件列表失败，请刷新页面重试'
    }
  }
}

export const uploadFile = async (payload: UploadPayload): Promise<StorageResponse<StoredFileSummary>> => {
  const userId = getCurrentUserId()
  if (!userId) {
    return {
      success: false,
      message: '用户未登录，请先登录'
    }
  }

  const base64 = await fileToBase64(payload.file)
  const fileHash = CryptoJS.SHA256(base64).toString()
  const newFile: StoredFile = {
    id: generateId(),
    fileName: payload.file.name,
    originalName: payload.file.name,
    fileSize: payload.file.size,
    fileHash,
    blockchainTx: generateBlockchainTx(fileHash),
    uploadTime: new Date().toISOString(),
    status: 1,
    mimeType: payload.file.type || 'application/octet-stream',
    description: payload.description,
    content: base64
  }

  const storage = readStorage()
  const userFiles = storage[userId] || []

  const duplicate = userFiles.some(file => file.fileHash === newFile.fileHash)
  if (duplicate) {
    return {
      success: false,
      message: '该文件已上传，无需重复上传'
    }
  }

  userFiles.push(newFile)
  storage[userId] = userFiles
  writeStorage(storage)

  const { content, ...summary } = newFile
  return {
    success: true,
    data: summary
  }
}

export const deleteFile = async (fileId: string): Promise<StorageResponse<null>> => {
  const userId = getCurrentUserId()
  if (!userId) {
    return {
      success: false,
      message: '用户未登录'
    }
  }

  const storage = readStorage()
  const userFiles = storage[userId] || []
  const index = userFiles.findIndex(file => file.id === fileId)

  if (index === -1) {
    return {
      success: false,
      message: '文件不存在或已删除'
    }
  }

  userFiles.splice(index, 1)
  storage[userId] = userFiles
  writeStorage(storage)

  return {
    success: true
  }
}

export const downloadFile = async (fileId: string): Promise<StorageResponse<{ content: string; fileName: string; mimeType: string }>> => {
  const userId = getCurrentUserId()
  if (!userId) {
    return {
      success: false,
      message: '用户未登录'
    }
  }

  const storage = readStorage()
  const userFiles = storage[userId] || []
  const file = userFiles.find(item => item.id === fileId)

  if (!file) {
    return {
      success: false,
      message: '文件不存在或已删除'
    }
  }

  return {
    success: true,
    data: {
      content: file.content,
      fileName: file.fileName,
      mimeType: file.mimeType
    }
  }
}
