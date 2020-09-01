import {
  businessServer
} from './index.js'

// 获取Echarts查询条件
export function getQueryConditions(){
  return businessServer({
    url: '/professional/countProjects',
    method: 'GET'
  })
}

// 获取任务统计数Echarts查询条件
export function getTaskData(data){
  return businessServer({
    url: '/professional/taskCount',
    method: 'POST',
    data
  })
}

// 获取帧数统计数Echarts查询条件
export function geFramesData(data){
  return businessServer({
    url: '/professional/frameCount',
    method: 'POST',
    data
  })
}

// 获取消费统计数Echarts查询条件
export function getConsumptionData(data){
  return businessServer({
    url: '/professional/consumeCount',
    method: 'POST',
    data
  })
}

// 获取任务状态统计数Echarts查询条件
export function getStatusData(data){
  return businessServer({
    url: '/professional/taskStates/${data}',
    method: 'GET',
  })
}
