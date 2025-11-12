const express = require('express')
const router = express.Router()

router.get('/overview', (req, res) => {
  res.json({
    success: true,
    data: {
      totalStorage: 1280 * 1024 * 1024 * 1024,
      totalFiles: 56240,
      activeNodes: 48,
      averageLatency: 42
    }
  })
})

module.exports = router
