'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URI: '"http://192.168.1.179/"',    // 开发
  // BASE_URI: '"http://223.80.107.190:18146"',
  // BACK_WS_API: '"ws://192.168.1.86:5002/websocket/web/"',   // 范博文
  BACK_WS_API: '"ws://192.168.1.176:5002/websocket/web/"',
  PLUGIN_WS_API: '"ws://localhost:15000"',
  // DOWNLOAD_PLUGIN_PATH: '"http://www.chinamoviecloud.cn:8085/CloudTransfer.exe"',           // 生产
  DOWNLOAD_PLUGIN_PATH: '"http://223.80.107.190:8084/CloudTransfer.exe"',                // 开发、测试
  MOCKJS: true,
  VERSION: "'-'",
})
