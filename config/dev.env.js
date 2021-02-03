'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URI: '"http://www.chinamoviecloud.cn:28146"',            // 生产
  BACK_WS_API: '"ws://223.80.107.190:5003/websocket/web/"',     // 生产
  DOWNLOAD_PLUGIN_PATH: '"http://www.chinamoviecloud.cn:8085/CloudTransfer.exe"',     // 生产
  PLUGIN_WS_API: '"ws://localhost:17002"',
  MOCKJS: false,
  VERSION: 202102031010
})
