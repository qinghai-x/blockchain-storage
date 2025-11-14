import CryptoJS from 'crypto-js'

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
  password: string
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

const USER_STORAGE_KEY = 'blockchain-storage-users'

const readUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredUser[]) : []
  } catch (error) {
    console.warn('解析用户数据失败', error)
    return []
  }
}

const writeUsers = (users: StoredUser[]) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users))
    // 确保数据写入成功
    const verify = localStorage.getItem(USER_STORAGE_KEY)
    if (!verify) {
      console.error('用户数据写入失败：localStorage 可能已满或不可用')
      throw new Error('用户数据保存失败，请检查浏览器存储空间')
    }
  } catch (error) {
    console.error('保存用户数据到 localStorage 失败:', error)
    throw new Error('用户数据保存失败，请检查浏览器存储空间或清除缓存后重试')
  }
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'user-' + Math.random().toString(36).slice(2, 10)
}

const hashPassword = (password: string) => {
  return CryptoJS.SHA256(password).toString()
}

export const register = async (payload: AuthPayload): Promise<AuthResponse> => {
  const users = readUsers()

  const exists = users.some(user => user.username === payload.username)
  if (exists) {
    return {
      success: false,
      message: '用户名已存在，请更换用户名'
    }
  }

  const newUser: StoredUser = {
    id: generateId(),
    username: payload.username,
    nickname: payload.nickname || payload.username,
    password: hashPassword(payload.password),
    publicKey: payload.publicKey || '',
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(payload.username)}`,
    role: 'user',
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  writeUsers(users)

  return {
    success: true
  }
}

export const login = async (payload: AuthPayload): Promise<AuthResponse> => {
  const users = readUsers()
  const user = users.find(item => item.username === payload.username)

  if (!user) {
    throw new Error('用户不存在，请先注册')
  }

  if (user.password !== hashPassword(payload.password)) {
    throw new Error('密码错误，请重试')
  }

  // 登录时只需要验证用户名和密码，不需要公钥验证
  // 公钥仅用于注册时的可选安全增强，不影响登录流程

  const token = `token-${generateId()}-${Date.now()}`

  // 确保返回完整的用户信息，包括所有个人信息字段
  const userInfo = {
    id: user.id,
    username: user.username,
    nickname: user.nickname || user.username,
    publicKey: user.publicKey || '',
    avatar: user.avatar,
    role: user.role || 'user'
  }

  // 登录时立即保存用户信息到 localStorage，确保数据持久化
  try {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    // 验证保存成功
    const verify = localStorage.getItem('userInfo')
    if (!verify) {
      console.error('用户信息保存失败：localStorage 可能已满或不可用')
    }
  } catch (error) {
    console.error('保存用户信息到 localStorage 失败:', error)
    // 即使保存失败也继续登录流程，但记录错误
  }

  return {
    success: true,
    data: {
      token,
      user: userInfo
    }
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

const getCurrentUser = (): StoredUser | null => {
  try {
    const raw = localStorage.getItem('userInfo')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const userId = parsed?.id
    if (!userId) return null

    const users = readUsers()
    return users.find(u => u.id === userId) || null
  } catch (error) {
    console.warn('获取当前用户失败', error)
    return null
  }
}

export const getUserProfile = async (): Promise<ProfileResponse> => {
  const user = getCurrentUser()
  
  if (!user) {
    return {
      success: false,
      message: '用户未登录或用户不存在'
    }
  }

  return {
    success: true,
    data: {
      id: user.id,
      username: user.username,
      nickname: user.nickname || user.username,
      password: '', // 不返回密码
      publicKey: user.publicKey,
      avatar: user.avatar,
      role: user.role || 'user',
      createdAt: user.createdAt
    }
  }
}

export const updateUserProfile = async (payload: UpdateProfilePayload): Promise<ProfileResponse> => {
  const user = getCurrentUser()
  
  if (!user) {
    return {
      success: false,
      message: '用户未登录或用户不存在'
    }
  }

  const users = readUsers()
  const userIndex = users.findIndex(u => u.id === user.id)
  
  if (userIndex === -1) {
    return {
      success: false,
      message: '用户不存在'
    }
  }

  // 如果更新用户名，检查是否重复
  if (payload.username && payload.username !== user.username) {
    const exists = users.some(u => u.username === payload.username && u.id !== user.id)
    if (exists) {
      return {
        success: false,
        message: '用户名已存在，请更换用户名'
      }
    }
    users[userIndex].username = payload.username
    // 更新头像URL（如果用户名改变，使用新用户名生成头像）
    if (!payload.avatar) {
      users[userIndex].avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(payload.username)}`
    }
  }

  if (payload.nickname !== undefined) {
    users[userIndex].nickname = payload.nickname || users[userIndex].username
  }

  if (payload.publicKey) {
    users[userIndex].publicKey = payload.publicKey
  }

  if (payload.avatar) {
    users[userIndex].avatar = payload.avatar
  }

  writeUsers(users)

  // 更新 localStorage 中的用户信息，确保所有个人信息字段都被保存
  const updatedUser = users[userIndex]
  const storedUserInfo = {
    id: updatedUser.id,
    username: updatedUser.username,
    nickname: updatedUser.nickname || updatedUser.username,
    publicKey: updatedUser.publicKey || '',
    avatar: updatedUser.avatar,
    role: updatedUser.role || 'user'
  }
  
  try {
    localStorage.setItem('userInfo', JSON.stringify(storedUserInfo))
    // 验证保存成功
    const verify = localStorage.getItem('userInfo')
    if (!verify) {
      console.error('用户信息更新失败：localStorage 可能已满或不可用')
      throw new Error('用户信息保存失败，请检查浏览器存储空间')
    }
  } catch (error) {
    console.error('保存用户信息到 localStorage 失败:', error)
    throw new Error('用户信息保存失败，请检查浏览器存储空间或清除缓存后重试')
  }

  return {
    success: true,
    data: {
      id: updatedUser.id,
      username: updatedUser.username,
      nickname: updatedUser.nickname || updatedUser.username,
      password: '',
      publicKey: updatedUser.publicKey,
      avatar: updatedUser.avatar,
      role: updatedUser.role || 'user',
      createdAt: updatedUser.createdAt
    }
  }
}

export const hasUsers = async (): Promise<boolean> => {
  const users = readUsers()
  return users.length > 0
}

export const changePassword = async (payload: ChangePasswordPayload): Promise<{ success: boolean; message?: string }> => {
  const user = getCurrentUser()
  
  if (!user) {
    return {
      success: false,
      message: '用户未登录或用户不存在'
    }
  }

  // 验证旧密码
  if (user.password !== hashPassword(payload.oldPassword)) {
    return {
      success: false,
      message: '当前密码错误'
    }
  }

  const users = readUsers()
  const userIndex = users.findIndex(u => u.id === user.id)
  
  if (userIndex === -1) {
    return {
      success: false,
      message: '用户不存在'
    }
  }

  // 更新密码
  users[userIndex].password = hashPassword(payload.newPassword)
  writeUsers(users)

  return {
    success: true,
    message: '密码修改成功'
  }
}
