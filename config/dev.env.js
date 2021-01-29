'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URI: '"http://223.80.107.190:18146"',        // 测试环境
  // BASE_URI: '"http://10.2.2.146"',               // 测试环境2
  BACK_WS_API: '"ws://223.80.107.190:5002/websocket/web/"',        // 测试环境
  // BACK_WS_API: '"ws://10.2.2.142:5002/websocket/web/"',         // 测试环境2
  DOWNLOAD_PLUGIN_PATH: '"http://223.80.107.190:8084/CloudTransfer.exe"',                // 开发、测试
  PLUGIN_WS_API: '"ws://localhost:17002"',
  MOCKJS: true,
  VERSION: 202101291005
})
