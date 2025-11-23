const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const fs = require('fs').promises
const path = require('path')
const router = express.Router()

// 配置multer用于文件上传
const storage = multer.memoryStorage()
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB限制
  }
})

// 模拟文件存储
const files = []
const BLOCKCHAIN_NETWORK = process.env.BLOCKCHAIN_NETWORK || 'local'

// 上传文件
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件'
      })
    }

    const { fileName, description } = req.body
    const fileBuffer = req.file.buffer
    const userId = req.headers['user-id'] // 从认证中间件获取

    // 计算文件哈希
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex')

    // 检查文件是否已存在
    const existingFile = files.find(f => f.fileHash === fileHash && f.userId === userId)
    if (existingFile) {
      return res.status(400).json({
        success: false,
        message: '文件已存在'
      })
    }

    // 模拟IPFS存储（实际项目中应连接真实IPFS节点）
    const ipfsHash = await simulateIPFSStorage(fileBuffer)

    // 模拟区块链交易（实际项目中应连接真实区块链网络）
    const blockchainTx = await simulateBlockchainTransaction({
      fileHash,
      ipfsHash,
      fileName,
      userId,
      timestamp: new Date().toISOString()
    })

    // 创建文件记录
    const fileRecord = {
      id: crypto.randomUUID(),
      fileName: fileName || req.file.originalname,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      fileHash,
      ipfsHash,
      blockchainTx,
      userId,
      description: description || '',
      uploadTime: new Date().toISOString(),
      status: 1, // 1: 已存储, 2: 同步中, 3: 异常
      mimeType: req.file.mimetype
    }

    files.push(fileRecord)

    res.json({
      success: true,
      message: '文件上传成功',
      data: {
        file: fileRecord,
        blockchainInfo: {
          transaction: blockchainTx,
          network: BLOCKCHAIN_NETWORK,
          timestamp: new Date().toISOString()
        }
      }
    })

  } catch (error) {
    console.error('文件上传错误:', error)
    res.status(500).json({
      success: false,
      message: '文件上传失败'
    })
  }
})

// 获取文件列表
router.get('/list', (req, res) => {
  try {
    const userId = req.headers['user-id']
    const userFiles = files.filter(file => file.userId === userId)
    
    res.json({
      success: true,
      data: userFiles
    })
  } catch (error) {
    console.error('获取文件列表错误:', error)
    res.status(500).json({
      success: false,
      message: '获取文件列表失败'
    })
  }
})

// 下载文件
router.get('/download/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params
    const userId = req.headers['user-id']

    const file = files.find(f => f.id === fileId && f.userId === userId)
    if (!file) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      })
    }

    // 模拟从IPFS获取文件（实际项目中应从IPFS网络获取）
    const fileBuffer = await simulateIPFSRetrieval(file.ipfsHash)

    // 设置响应头
    res.setHeader('Content-Type', file.mimeType)
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.fileName)}"`)
    res.setHeader('Content-Length', fileBuffer.length)
    res.setHeader('X-File-Hash', file.fileHash)
    res.setHeader('X-Blockchain-Tx', file.blockchainTx)

    // 发送文件数据
    res.send(fileBuffer)

  } catch (error) {
    console.error('文件下载错误:', error)
    res.status(500).json({
      success: false,
      message: '文件下载失败'
    })
  }
})

// 删除文件
router.delete('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params
    const userId = req.headers['user-id']

    const fileIndex = files.findIndex(f => f.id === fileId && f.userId === userId)
    if (fileIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      })
    }

    const file = files[fileIndex]

    // 模拟区块链删除记录
    const deleteTx = await simulateBlockchainTransaction({
      action: 'DELETE',
      fileHash: file.fileHash,
      userId,
      timestamp: new Date().toISOString()
    })

    // 从列表中移除文件
    files.splice(fileIndex, 1)

    res.json({
      success: true,
      message: '文件删除成功',
      data: {
        deleteTransaction: deleteTx
      }
    })

  } catch (error) {
    console.error('文件删除错误:', error)
    res.status(500).json({
      success: false,
      message: '文件删除失败'
    })
  }
})

// 模拟IPFS存储
async function simulateIPFSStorage(fileBuffer) {
  // 实际项目中这里应该连接IPFS节点
  return `Qm${crypto.createHash('sha256').update(fileBuffer).digest('hex')}`
}

// 模拟IPFS检索
async function simulateIPFSRetrieval(ipfsHash) {
  // 实际项目中这里应该从IPFS网络获取文件
  // 这里返回一个模拟的缓冲区
  return Buffer.from(`Simulated file content for IPFS hash: ${ipfsHash}`, 'utf8')
}

// 模拟区块链交易
async function simulateBlockchainTransaction(data) {
  // 实际项目中这里应该连接区块链网络（如以太坊、Hyperledger等）
  const txHash = crypto.createHash('sha256')
    .update(JSON.stringify(data) + Date.now())
    .digest('hex')
  
  return `0x${txHash}`
}

module.exports = router