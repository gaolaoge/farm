import {
  businessServer
} from './index.js'

// 准备工作 - 识别【一键版】or【专业版】
export function identify(){
  return businessServer({
    url: `/professional/task/createTaskQuery`,
    method: 'GET'
  })
}

// 准备工作 - 获取网盘目录
export function catalogue(){
  return businessServer({
    url: `/file/assets/upload/getCustomerUnfoldFileList?filePath=-`,
    method: 'GET'
  })
}

// 准备工作 - 获取可用的场景文件格式
export function getFileType(){
  return businessServer({
    url: `/file/render/code/getRenderCode`,
    method: 'GET'
  })
}

// 准备工作 - 保存历史工程路径
export function savePath(data){
  return businessServer({
    url: `/file/assets/upload/addSceneFilePath`,
    method: 'POST',
    data
  })
}

// 提交
export function newTaskProfession(data){
  return businessServer({
    url: `/professional/task/addTasks`,
    method: 'POST',
    data
  })
}
