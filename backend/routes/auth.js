const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const router = express.Router()

// 模拟用户数据库
const users = []

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, publicKey } = req.body

    // 验证输入
    if (!username || !password || !publicKey) {
      return res.status(400).json({
        success: false,
        message: '请填写完整的注册信息'
      })
    }

    // 检查用户是否已存在
    const existingUser = users.find(user => user.username === username)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      })
    }

    // 加密密码
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // 生成用户ID
    const userId = crypto.randomUUID()

    // 创建新用户
    const newUser = {
      id: userId,
      username,
      password: hashedPassword,
      publicKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    users.push(newUser)

    // 生成JWT令牌
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET || 'blockchain-storage-secret',
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          publicKey: newUser.publicKey
        }
      }
    })

  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试'
    })
  }
})

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password, publicKey } = req.body

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '请填写用户名和密码'
      })
    }

    // 查找用户
    const user = users.find(u => u.username === username)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      })
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      })
    }

    // 验证公钥（可选）
    if (publicKey && user.publicKey !== publicKey) {
      return res.status(401).json({
        success: false,
        message: '公钥验证失败'
      })
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'blockchain-storage-secret',
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          publicKey: user.publicKey
        }
      }
    })

  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    })
  }
})

// 获取用户信息
router.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户不存在'
    })
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      publicKey: user.publicKey,
      createdAt: user.createdAt
    }
  })
})

// JWT认证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '访问令牌不存在'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'blockchain-storage-secret', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: '令牌无效或已过期'
      })
    }
    req.user = user
    next()
  })
}

module.exports = router