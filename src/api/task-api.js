import {
  businessServer
} from './index.js'

// 任务 - 渲染下载 - 获取列表（效果图）
export function uploadTabGetList(data) {
  return businessServer({
    url: `/professional/design/task/getDesignTaskList${data}`,
    method: 'GET'
  })
}

// 任务 - 渲染下载 - 缩略图
export function getThumbnail(data) {
  return businessServer({
    url: `/professional/file/getFrameImage?${data}`,
    method: 'GET'
  })
}

// 任务 - 渲染下载 - 拷贝 - 获取预设参数
export function getCopySetData(data) {
  return businessServer({
    url: `/professional/task/getCopyInfo/${data}`,
    method: 'GET'
  })
}

// 任务 - 渲染下载 - 拷贝 - 发送
export function setCopySetData(data) {
  return businessServer({
    url: `/professional/task/copyTask`,
    method: 'POST',
    data
  })
}
