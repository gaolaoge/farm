import {
  businessServer
} from './index.js'

// 站内信 - 获取列表
export function getRecentTaskList(data) {
  return businessServer({
    url: `/professional/project/getHomepageProject?${data}`,
    method: 'GET'
  })
}
