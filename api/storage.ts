import CryptoJS from 'crypto-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

/**
 * 存储数据层：基于 Supabase Storage（对象存储）+ files 表（元数据）
 * 对外保持与原 localStorage 版本相同的函数签名和返回结构，
 * 因此 UploadForm / StorageView / ManagementView / SecurityView / ProfileView 无需改动。
 */

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
  storagePath: string
}

// 返回给前端的摘要（不含内部存储路径）
export type StoredFileSummary = Omit<StoredFile, 'storagePath'>

interface StorageResponse<T> {
  success: boolean
  message?: string
  data?: T
}

// 数据库行（snake_case）-> 前端字段（camelCase）
const toSummary = (row: any): StoredFileSummary => ({
  id: row.id,
  fileName: row.file_name,
  originalName: row.original_name,
  fileSize: Number(row.file_size) || 0,
  fileHash: row.file_hash,
  blockchainTx: row.blockchain_tx,
  uploadTime: row.upload_time,
  status: row.status,
  mimeType: row.mime_type,
  description: row.description
})

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('无法读取文件内容'))
    reader.readAsDataURL(blob)
  })

// 获取文件列表（当前用户的文件，按上传时间倒序）
export const getFileList = async (): Promise<StorageResponse<StoredFileSummary[]>> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      return { success: false, message: '用户未登录' }
    }

    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', authData.user.id)
      .order('upload_time', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: (data || []).map(toSummary)
    }
  } catch (error) {
    console.error('获取文件列表失败:', error)
    return { success: false, message: '获取文件列表失败，请刷新页面重试' }
  }
}

// 上传文件：对象进 Storage（user-files bucket），元数据进 files 表
export const uploadFile = async (payload: UploadPayload): Promise<StorageResponse<StoredFileSummary>> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      return { success: false, message: '用户未登录，请先登录' }
    }
    const userId = authData.user.id

    // 计算内容指纹（用于去重）
    const fileHash = CryptoJS.SHA256(payload.file.name + payload.file.size + payload.file.lastModified).toString()

    // 同用户重复文件检查
    const { data: duplicate } = await supabase
      .from('files')
      .select('id')
      .eq('user_id', userId)
      .eq('file_hash', fileHash)
      .maybeSingle()
    if (duplicate) {
      return { success: false, message: '该文件已上传，无需重复上传' }
    }

    // 存储路径：{userId}/{uuid}.{扩展名}
    // Supabase Storage 对 key 严格限制为 S3 安全字符集（仅 ASCII），
    // 中文/空格等非 ASCII 字符会被拒绝并报 Invalid key。
    // 因此存储 key 使用纯 ASCII 的 UUID + 扩展名，原文件名仅保存在 files 表元数据中用于展示。
    const extMatch = payload.file.name.match(/\.([a-zA-Z0-9]+)$/)
    const safeKeyName = `${crypto.randomUUID()}.${extMatch ? extMatch[1].toLowerCase() : 'bin'}`
    const storagePath = `${userId}/${safeKeyName}`
    const { error: uploadError } = await supabase.storage.from('user-files').upload(storagePath, payload.file, {
      contentType: payload.file.type || 'application/octet-stream',
      upsert: false
    })
    if (uploadError) {
      return { success: false, message: `文件上传失败：${uploadError.message}` }
    }

    // 展示用哈希（页面保留「文件哈希 / 区块链交易」展示位）
    const blockchainTx = `0x${CryptoJS.SHA256(fileHash + Date.now()).toString().slice(0, 32)}`

    const fileRecord = {
      user_id: userId,
      file_name: payload.file.name,
      original_name: payload.file.name,
      file_size: payload.file.size,
      file_hash: fileHash,
      storage_path: storagePath,
      description: payload.description || '',
      upload_time: new Date().toISOString(),
      status: 1,
      mime_type: payload.file.type || 'application/octet-stream',
      blockchain_tx: blockchainTx
    }

    const { data: inserted, error: insertError } = await supabase
      .from('files')
      .insert(fileRecord)
      .select()
      .single()

    if (insertError) {
      // 记录写入失败时回滚已上传的对象
      await supabase.storage.from('user-files').remove([storagePath])
      return { success: false, message: `文件记录保存失败：${insertError.message}` }
    }

    return { success: true, data: toSummary(inserted) }
  } catch (error: any) {
    console.error('上传错误:', error)
    return { success: false, message: '文件上传失败，请稍后重试' }
  }
}

// 删除文件（对象 + 记录）
export const deleteFile = async (fileId: string): Promise<StorageResponse<null>> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      return { success: false, message: '用户未登录' }
    }

    const { data: file, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', authData.user.id)
      .maybeSingle()
    if (fetchError || !file) {
      return { success: false, message: '文件不存在或已删除' }
    }

    // 删除存储对象（失败不阻断记录删除）
    if (file.storage_path) {
      await supabase.storage.from('user-files').remove([file.storage_path])
    }

    const { error } = await supabase.from('files').delete().eq('id', fileId).eq('user_id', authData.user.id)
    if (error) {
      return { success: false, message: '文件删除失败，请稍后重试' }
    }

    return { success: true }
  } catch (error) {
    console.error('删除文件失败:', error)
    return { success: false, message: '文件删除失败，请稍后重试' }
  }
}

// 下载文件：从 Storage 下载并转为 Data URL 返回（视图层保持原有 base64 处理逻辑）
export const downloadFile = async (
  fileId: string
): Promise<StorageResponse<{ content: string; fileName: string; mimeType: string }>> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      return { success: false, message: '用户未登录' }
    }

    const { data: file, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', authData.user.id)
      .maybeSingle()
    if (fetchError || !file) {
      return { success: false, message: '文件不存在或已删除' }
    }

    const { data: blob, error: downloadError } = await supabase.storage
      .from('user-files')
      .download(file.storage_path)
    if (downloadError || !blob) {
      return { success: false, message: '文件下载失败' }
    }

    const content = await blobToDataUrl(blob)

    return {
      success: true,
      data: {
        content,
        fileName: file.file_name,
        mimeType: file.mime_type || 'application/octet-stream'
      }
    }
  } catch (error) {
    console.error('下载文件失败:', error)
    return { success: false, message: '文件下载失败' }
  }
}
