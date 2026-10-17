import { supabase, isSupabaseConfigured } from '@/lib/supabase'

/**
 * 认证数据层：基于 Supabase Auth + profiles 表
 * 对外保持与原 localStorage 版本相同的函数签名和返回结构，
 * 因此 LoginView / RegisterForm / ProfileView 无需改动。
 */

interface AuthPayload {
  username: string
  password: string
  nickname?: string
  publicKey?: string
}

interface StoredUser {
  id: string
  username: string
  nickname?: string
  publicKey?: string
  avatar: string
  role?: string
  createdAt: string
}

interface AuthResponse {
  success: boolean
  message?: string
  data?: {
    token: string
    user: Pick<StoredUser, 'id' | 'username' | 'nickname' | 'publicKey' | 'avatar' | 'role'>
  }
}

interface ProfileResponse {
  success: boolean
  message?: string
  data?: StoredUser
}

interface UpdateProfilePayload {
  username?: string
  nickname?: string
  publicKey?: string
  avatar?: string
}

interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}

// 用户名 -> Supabase Auth 登录邮箱（Supabase 以邮箱作为登录标识）
const AUTH_EMAIL_DOMAIN = 'users.local'
const toAuthEmail = (username: string) => `${username}@${AUTH_EMAIL_DOMAIN}`

const defaultAvatar = (username: string) =>
  `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`

// 从 profiles 表读取用户资料
const fetchProfile = async (userId: string): Promise<StoredUser | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) {
    console.error('读取用户资料失败:', error)
    return null
  }
  return data as StoredUser | null
}

// 组装返回给前端的安全用户对象
const buildUserInfo = (user: StoredUser) => ({
  id: user.id,
  username: user.username,
  nickname: user.nickname || user.username,
  publicKey: user.publicKey || '',
  avatar: user.avatar || defaultAvatar(user.username),
  role: user.role || 'user'
})

// 注册（用户名 + 密码；用户名映射为唯一登录邮箱）
export const register = async (payload: AuthPayload): Promise<AuthResponse> => {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: 'Supabase 尚未配置，请在项目根目录 .env 中填写 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY'
    }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: toAuthEmail(payload.username),
      password: payload.password,
      options: {
        data: {
          username: payload.username,
          nickname: payload.nickname || payload.username
        }
      }
    })

    if (error) throw error
    if (!data.user) {
      return { success: false, message: '注册失败，请稍后重试' }
    }

    // 写入 profiles 表（用户资料）
    const profile = {
      id: data.user.id,
      username: payload.username,
      nickname: payload.nickname || payload.username,
      publicKey: payload.publicKey || '',
      avatar: defaultAvatar(payload.username),
      role: 'user',
      createdAt: new Date().toISOString()
    }
    const { error: profileError } = await supabase.from('profiles').upsert(profile)
    if (profileError) {
      console.error('写入用户资料失败:', profileError)
      return { success: false, message: '注册成功但资料初始化失败，请稍后重试登录' }
    }

    return { success: true }
  } catch (error: any) {
    console.error('注册错误:', error)
    const msg = error?.message || ''
    if (msg.includes('already registered') || msg.includes('已注册')) {
      return { success: false, message: '用户名已存在，请更换用户名' }
    }
    if (msg.includes('at least 6')) {
      return { success: false, message: '密码至少6位' }
    }
    return { success: false, message: '注册失败，请稍后重试' }
  }
}

// 登录（用户名 + 密码）
export const login = async (payload: AuthPayload): Promise<AuthResponse> => {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: 'Supabase 尚未配置，请在项目根目录 .env 中填写 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY'
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: toAuthEmail(payload.username),
      password: payload.password
    })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('Invalid login credentials')) {
        return { success: false, message: '用户名或密码错误' }
      }
      if (msg.includes('Email not confirmed')) {
        return { success: false, message: '注册邮箱尚未确认，请在 Supabase 后台关闭邮箱确认后重试' }
      }
      return { success: false, message: '登录失败，请检查用户名和密码' }
    }

    if (!data.session) {
      return { success: false, message: '登录失败，未获取到会话' }
    }

    const user = await fetchProfile(data.user.id)
    const userInfo = buildUserInfo(
      user || {
        id: data.user.id,
        username: payload.username,
        nickname: payload.username,
        avatar: defaultAvatar(payload.username),
        role: 'user',
        createdAt: new Date().toISOString()
      }
    )

    return {
      success: true,
      data: {
        token: data.session.access_token,
        user: userInfo
      }
    }
  } catch (error) {
    console.error('登录错误:', error)
    return { success: false, message: '登录失败，请稍后重试' }
  }
}

// 获取当前用户资料
export const getUserProfile = async (): Promise<ProfileResponse> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      return { success: false, message: '用户未登录或会话已过期' }
    }

    const profile = await fetchProfile(authData.user.id)
    if (!profile) {
      return { success: false, message: '用户不存在' }
    }

    return {
      success: true,
      data: {
        id: profile.id,
        username: profile.username,
        nickname: profile.nickname || profile.username,
        password: '',
        publicKey: profile.publicKey || '',
        avatar: profile.avatar || defaultAvatar(profile.username),
        role: profile.role || 'user',
        createdAt: profile.createdAt
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return { success: false, message: '获取用户信息失败' }
  }
}

// 更新用户资料（昵称 / 公钥 / 头像 / 用户名）
export const updateUserProfile = async (payload: UpdateProfilePayload): Promise<ProfileResponse> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      return { success: false, message: '用户未登录或用户不存在' }
    }

    // 若修改用户名，先检查是否被占用
    if (payload.username) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', payload.username)
        .neq('id', authData.user.id)
        .maybeSingle()
      if (existing) {
        return { success: false, message: '用户名已存在，请更换用户名' }
      }
    }

    const updates: Record<string, unknown> = {}
    if (payload.username !== undefined) updates.username = payload.username
    if (payload.nickname !== undefined) updates.nickname = payload.nickname
    if (payload.publicKey !== undefined) updates.publicKey = payload.publicKey
    if (payload.avatar !== undefined) updates.avatar = payload.avatar

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase.from('profiles').update(updates).eq('id', authData.user.id)
      if (error) {
        if ((error as any)?.code === '23505') {
          return { success: false, message: '用户名已存在，请更换用户名' }
        }
        return { success: false, message: '更新失败，请稍后重试' }
      }
    }

    const profile = await fetchProfile(authData.user.id)
    if (!profile) {
      return { success: false, message: '用户不存在' }
    }

    return {
      success: true,
      data: {
        id: profile.id,
        username: profile.username,
        nickname: profile.nickname || profile.username,
        password: '',
        publicKey: profile.publicKey || '',
        avatar: profile.avatar || defaultAvatar(profile.username),
        role: profile.role || 'user',
        createdAt: profile.createdAt
      }
    }
  } catch (error) {
    console.error('更新用户资料失败:', error)
    return { success: false, message: '更新失败，请稍后重试' }
  }
}

// 公开注册体系：登录页始终展示「立即注册」入口
export const hasUsers = async (): Promise<boolean> => {
  return true
}

// 修改密码（先校验旧密码，再更新新密码）
export const changePassword = async (payload: ChangePasswordPayload): Promise<{ success: boolean; message?: string }> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase 尚未配置，请在 .env 中填写相关配置' }
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      return { success: false, message: '用户未登录或用户不存在' }
    }
    const email = authData.user.email || ''

    // 校验旧密码：使用旧密码重新登录
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: payload.oldPassword
    })
    if (verifyError) {
      return { success: false, message: '当前密码错误' }
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: payload.newPassword })
    if (updateError) {
      const msg = updateError.message || ''
      if (msg.includes('at least 6')) {
        return { success: false, message: '新密码至少6位' }
      }
      return { success: false, message: '密码修改失败，请稍后重试' }
    }

    return { success: true, message: '密码修改成功' }
  } catch (error) {
    console.error('修改密码失败:', error)
    return { success: false, message: '密码修改失败，请稍后重试' }
  }
}
