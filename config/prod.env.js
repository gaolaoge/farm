'use strict'
module.exports = {
  NODE_ENV: '"production"',
  // BASE_URI: '"http://192.168.1.179"',              // 开发
  BASE_URI: '"http://223.80.107.190:18146"',     // 测试环境
  // BASE_URI: '"http://10.2.2.146"',               // 测试环境2
  // BASE_URI: '"http://www.chinamoviecloud.cn:28146"',            // 生产
  // BACK_WS_API: '"ws://192.168.1.176:5002/websocket/web/"',        // 开发
  BACK_WS_API: '"ws://223.80.107.190:5002/websocket/web/"',     // 测试环境
  // BACK_WS_API: '"ws://10.2.2.142:5002/websocket/web/"',         // 测试环境2
  // BACK_WS_API: '"ws://223.80.107.190:5003/websocket/web/"',     // 生产

  // DOWNLOAD_PLUGIN_PATH: '"http://www.chinamoviecloud.cn:8085/CloudTransfer.exe"',     // 生产
  DOWNLOAD_PLUGIN_PATH: '"http://223.80.107.190:8084/CloudTransfer.exe"',                // 开发、测试

  PLUGIN_WS_API: '"ws://localhost:17002"',
  MOCKJS: false,
  VERSION: 202101061507,
}
