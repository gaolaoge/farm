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
  // PLUGIN_WS_API: '"ws://192.168.1.111:15000"',  // 李杨
  // PLUGIN_WS_API: '"ws://192.168.1.9:15000"',   // 陆鑫
  // MOCKJS: true
})
