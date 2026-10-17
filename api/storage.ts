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
  folderId?: string | null
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
  folderId?: string | null
}

// 返回给前端的摘要（不含内部存储路径）
export type StoredFileSummary = Omit<StoredFile, 'storagePath'>

// 文件夹
export interface Folder {
  id: string
  name: string
  parentId: string | null
  createdAt: string
}

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
  description: row.description,
  folderId: row.folder_id ?? null
})

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('无法读取文件内容'))
    reader.readAsDataURL(blob)
  })

// 获取文件列表
// options.folderId：
//   - 不传或 undefined：返回全部文件（兼容旧调用）
//   - null：返回根目录文件（folder_id 为空）
//   - 有值：返回该文件夹内的文件
export const getFileList = async (options?: { folderId?: string | null }): Promise<StorageResponse<StoredFileSummary[]>> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      return { success: false, message: '用户未登录' }
    }

    let query = supabase
      .from('files')
      .select('*')
      .eq('user_id', authData.user.id)

    if (options?.folderId !== undefined) {
      if (options.folderId === null) {
        query = query.is('folder_id', null)
      } else {
        query = query.eq('folder_id', options.folderId)
      }
    }

    const { data, error } = await query.order('upload_time', { ascending: false })

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
      folder_id: payload.folderId ?? null,
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
      return { success: false, message: `文件下载失败：${downloadError?.message || '未获取到文件内容'}` }
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

// ==================== 文件夹（用户自建目录） ====================

// 获取指定父目录下的子文件夹（parentId 传 null 表示根目录）
export const getFolderList = async (parentId: string | null): Promise<StorageResponse<Folder[]>> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      return { success: false, message: '用户未登录' }
    }

    let query = supabase
      .from('folders')
      .select('*')
      .eq('user_id', authData.user.id)

    if (parentId === null) {
      query = query.is('parent_id', null)
    } else {
      query = query.eq('parent_id', parentId)
    }

    const { data, error } = await query.order('created_at', { ascending: true })
    if (error) throw error

    return {
      success: true,
      data: (data || []).map((f: any) => ({
        id: f.id,
        name: f.name,
        parentId: f.parent_id ?? null,
        createdAt: f.created_at
      }))
    }
  } catch (error) {
    console.error('获取文件夹列表失败:', error)
    return { success: false, message: '获取文件夹列表失败，请刷新页面重试' }
  }
}

// 新建文件夹（同目录下重名时返回失败）
export const createFolder = async (name: string, parentId: string | null): Promise<StorageResponse<Folder>> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  const trimmed = (name || '').trim()
  if (!trimmed) {
    return { success: false, message: '文件夹名称不能为空' }
  }
  if (trimmed.length > 50) {
    return { success: false, message: '文件夹名称最长 50 个字符' }
  }
  if (/[\\/:*?"<>|]/.test(trimmed)) {
    return { success: false, message: '文件夹名称不能包含 \\ / : * ? " < > | 等字符' }
  }

  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      return { success: false, message: '用户未登录' }
    }

    // 同目录查重
    let dupQuery = supabase
      .from('folders')
      .select('id')
      .eq('user_id', authData.user.id)
      .eq('name', trimmed)
    dupQuery =
      parentId === null ? dupQuery.is('parent_id', null) : dupQuery.eq('parent_id', parentId)

    const { data: dup } = await dupQuery.maybeSingle()
    if (dup) {
      return { success: false, message: '该目录下已存在同名文件夹' }
    }

    const { data, error } = await supabase
      .from('folders')
      .insert({ user_id: authData.user.id, name: trimmed, parent_id: parentId })
      .select()
      .single()
    if (error) throw error

    return {
      success: true,
      data: {
        id: data.id,
        name: data.name,
        parentId: data.parent_id ?? null,
        createdAt: data.created_at
      }
    }
  } catch (error: any) {
    console.error('新建文件夹失败:', error)
    // 数据库唯一索引兜底
    if (error?.code === '23505') {
      return { success: false, message: '该目录下已存在同名文件夹' }
    }
    return { success: false, message: '新建文件夹失败，请稍后重试' }
  }
}

// 删除文件夹：子文件夹级联删除，文件夹内的文件自动移回根目录（folder_id 置空，文件不丢失）
export const deleteFolder = async (folderId: string): Promise<StorageResponse<null>> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      return { success: false, message: '用户未登录' }
    }

    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId)
      .eq('user_id', authData.user.id)
    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('删除文件夹失败:', error)
    return { success: false, message: '删除文件夹失败，请稍后重试' }
  }
}

// 获取文件夹的祖先链（用于面包屑），从根到当前文件夹
export const getFolderPath = async (folderId: string): Promise<StorageResponse<Folder[]>> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      return { success: false, message: '用户未登录' }
    }

    const path: Folder[] = []
    let currentId: string | null = folderId
    let guard = 0

    while (currentId && guard < 20) {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('id', currentId)
        .eq('user_id', authData.user.id)
        .maybeSingle()
      if (error || !data) break
      path.unshift({
        id: data.id,
        name: data.name,
        parentId: data.parent_id ?? null,
        createdAt: data.created_at
      })
      currentId = data.parent_id
      guard++
    }

    return { success: true, data: path }
  } catch (error) {
    console.error('获取文件夹路径失败:', error)
    return { success: false, message: '获取文件夹路径失败' }
  }
}
