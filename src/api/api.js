import {
  businessServer
} from './index.js'

// 获取用户协议
export function getProtocal(){
  return businessServer({
    url: '/file/getProtocol',
    method: 'GET',
    responseType: "blob",
  })
}

// 登录页 - 注册 提交
export function register(data){
  return businessServer({
    url: '/auth/signUp',
    method: 'POST',
    data
  })
}

// 登录页 - 注册 手机验证码
export function registerTelephone(data){
  return businessServer({
    url: `/auth/sendPhoneCode4CheckOwn/${data}`,
    method: 'GET'
  })
}

// 登录页 - 注册 验证帐号
export function registerAccount(data){
  return businessServer({
    url: `/auth/checkAccount/${data}`,
    method: 'GET',
  })
}

// 登录页 - 注册 验证手机号
export function registerPhone(data){
  return businessServer({
    url: `/auth/checkPhone/${data}`,
    method: 'GET',
  })
}

// 登录页 - 帐号密码登录
export function accountLogin(data){
  return businessServer({
    url: `/auth/accountLogin`,
    method: 'POST',
    data
  })
}

// 登录页 - 手机号登录 短信验证
export function phoneVerifFun(data){
  return businessServer({
    url: `/auth/sendPhoneCode4Login/${data}`,
    method: 'GET'
  })
}

// 登录页 - 手机号登录 登录
export function phoneLogin(data){
  return businessServer({
    url: `/auth/codeLogin`,
    method: 'POST',
    data
  })
}

// 登录页-找回密码 获取手机号验证码
export function getPhoneVeriFG(data){
  return businessServer({
    url: `/auth/sendPhoneCode4ChangePassword/${data}`,
    method: 'GET'
  })
}

// 登录页-找回密码 验证验证码
export function getVeriVal(data){
  return businessServer({
    url: `/auth/checkPhoneCode4ChangePassword?${data}`,
    method: 'GET'
  })
}

// 登录页-找回密码 修改密码
export function editPS(data){
  return businessServer({
    url: `/auth/changePasswordByPhone`,
    method: 'PUT',
    data
  })
}

// 首页 工作台下拉框
export function homeSelect(){
  return businessServer({
    url: `/professional/home/zone`,
    method: 'GET',
  })
}

// 首页 任务状态 数据统计
export function homeT(data){
  return businessServer({
    url: `/professional/home/statistics?zoneuuid=${data}`,
    method: 'GET',
  })
}

// 首页 传达切换分区事件
export function putNewZoneID(data){
  return businessServer({
    url: `/customer/updateZoneUuid`,
    method: 'PUT',
    data
  })
}

// 首页 echarts
export function echartsData(data){
  return businessServer({
    url: `/professional/home/daystask?zoneuuid=${data}`,
    method: 'GET',
  })
}

// 个人信息
export function getInfo(){
  return businessServer({
    url: `/customer/getCustomerByToken`,
    method: 'GET'
  })
}

// 新建任务 设置渲染模板-获取已存在记录
export function createTaskSet(){
  return businessServer({
    url: `/professional/template/getCustomerTemplateList`,
    method: 'GET'
  })
}

// 新建任务 设置渲染模板-获取所有软件名和版本号
export function createTaskSetSoftware(){
  return businessServer({
    url: `/professional/template/getSoftList`,
    method: 'GET'
  })
}

// 新建任务 设置渲染模板-获取指定软件指定版本的所有插件
export function createTaskSetPlugin(data){
  return businessServer({
    url: `/professional/template/getPluginList?softUuid=${data}`,
    method: 'GET'
  })
}

// 新建任务 设置渲染模板-删除摸板
export function createTaskSetDeletePlugin(data){
  return businessServer({
    url: `/professional/template/deleteTemplate/${data}`,
    method: 'DELETE'
  })
}


// 新建任务 设置渲染模板-新建模板-确定【新建】
export function createTaskSetNewPlugin(data){
  return businessServer({
    url: `/professional/template/addCustomerTemplate`,
    method: 'POST',
    data
  })
}


// 新建任务 设置渲染模板-新建模板-确定【编辑】
export function createTaskSetEditPlugin(data){
  return businessServer({
    url: `/professional/template/updateTemplate`,
    method: 'PUT',
    data
  })
}

// 新建任务 设置渲染模板-新建模板-【提交】
export function pushTask(data){
  return businessServer({
    url: `/professional/task/addTasks`,
    method: 'POST',
    data
  })
}

// 新建任务 设置渲染模板-新建模板-【提交】
export function oneMorePath(data){
  return businessServer({
    url: `/professional/file/beforeUpload`,
    method: 'POST',
    data
  })
}

// 账单 充值记录 获取table数据
export function getUpTopTable(data){
  return businessServer({
    url: `/billing/recharge/getRechargeList?${data}`,
    method: 'GET'
  })
}

// 账单 充值记录 下载收据
export function downloadReceipt(data){
  return businessServer({
    url: `/file/farmReceipt?${data}`,
    method: 'GET',
    responseType: 'blob'
  })
}

// 账单 充值记录 导出记录
export function exportUpTopTable(data){
  return businessServer({
    url: `/billing/recharge/getRechargeExcel?${data}`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 账单 消费记录 获取所属项目List
export function getConsumptionSelectList(){
  return businessServer({
    url: `/professional/project/getCustomerProjectList`,
    method: 'GET'
  })
}

// 账单 消费记录 获取table数据
export function getConsumptionTable(data){
  return businessServer({
    url: `/billing/spending/getSpendingList?${data}`,
    method: 'GET'
  })
}

// 账单 消费记录 导出记录
export function exportConsumptionTable(data){
  return businessServer({
    url: `/billing/spending/getSpendingExcel?${data}`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 账单 消费记录 渲染消费详情
export function consumptionSeeMore(data){
  return businessServer({
    url: `/billing/spending/getRenderSpendingDetailList/${data}`,
    method: 'GET',
  })
}

// 账单 消费记录 下载消费详情
export function upTopSeeMore(data){
  return businessServer({
    url: `/billing/spending/getDownloadSpendingDetailList/${data}`,
    method: 'GET',
  })
}

// 上传场景文件
export function upTopCJ(data){
  return businessServer({
    url: `/professional/file/uploadSceneFile`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// 上传工程文件
export function upTopGC(data){
  return businessServer({
    url: `/professional/file/uploadResource`,
    method: 'POST',
    data
  })
}

// 任务 - 分析上传 - 获取项目列表
export function getTaskItemList(){
  return businessServer({
    url: `/professional/project/getCustomerProjectList`,
    method: 'GET'
  })
}

// 任务 - 分析上传 - 获取列表
export function getTaskTableList(data){
  return businessServer({
    url: `/professional/task/getAnalyseTaskList?${data}`,
    method: 'GET',
    timeout: 5000
  })
}

// 任务 - 分析上传 - 查看详情
export function upTopTableSeeMore(data){
  return businessServer({
    url: `/professional/task/getAnalyseTaskResult?${data}`,
    method: 'GET',
  })
}

// 任务 - 分析上传 - 重新分析
export function analyseAgain(data){
  return businessServer({
    url: `/professional/task/resubmitAnalyseTask`,
    method: 'POST',
    data
  })
}

// 任务 - 分析上传 - 删除
export function upTopTableDelete(data){
  return businessServer({
    url: `/professional/task/deleteAnalyseTask`,
    method: 'DELETE',
    data
  })
}

// 任务 - 分析上传 - 设置参数
export function upTopTableSet(data){
  return businessServer({
    url: `/professional/setting/getLayerInfo/${data}`,
    method: 'GET',
    timeout: 3000
  })
}
``
// 任务 - 渲染下载 - 获取列表
export function getRenderTableList(data){
  return businessServer({
    url: `/professional/task/getRenderTaskList?${data}`,
    method: 'GET',

  })
}

// 任务 - 渲染下载 - 查看详情
export function getRenderTSeeMore(data){
  return businessServer({
    url: `/professional/frame/getAllFrameTaskList?${data}`,
    method: 'GET',
  })
}

// 任务 - 渲染下载 - 开始
export function itemStart(data){
  return businessServer({
    url: `/professional/task/instruct/instructTask`,
    method: 'PUT',
    data
  })
}

// 任务 - 渲染下载 - 归档
export function itemArchive(data){
  return businessServer({
    url: `/professional/history/putToHistory`,
    method: 'PUT',
    data
  })
}

// 任务 - 渲染下载 - 删除
export function itemDelete(data){
  return businessServer({
    url: `/professional/task/instruct/instructTask`,
    method: 'PUT',
    data
  })
}

// 任务 - 详情窗口 - 新建项目
export function addNewItem(data){
  return businessServer({
    url: `/professional/project/addCustomerProject`,
    method: 'POST',
    data
  })
}

// 任务 - 详情窗口 - 新建项目
export function startRender(data){
  return businessServer({
    url: `/professional/setting/setRenderSetting`,
    method: 'POST',
    data
  })
}

// 任务 - 详情窗口 - 查看余额
export function seeBalance(){
  return businessServer({
    url: `/professional/file/getRenderBalance`,
    method: 'GET'
  })
}

// 任务 - 详情窗口 - 下载完成帧
export function downloadFrame(data){
  return businessServer({
    url: `/professional/file/downloadFrameFile?${data}`,
    method: 'GET',
    responseType: 'blob'
  })
}

// 任务 - 详情窗口 - 查看【帧-历史渲染记录】
export function getFrameHistoryTable(data){
  return businessServer({
    url: `/professional/frame/getFrameTaskAndLog?${data}`,
    method: 'GET'
  })
}

// 任务 - 详情窗口 - 下载日志
export function downloadLog(data){
  return businessServer({
    url: `/professional/log/downloadFrameLog?${data}`,
    method: 'GET',
    responseType: 'blob'
  })
}

// 任务 - 归档记录 - 获取列表
export function getRecordList(data){
  return businessServer({
    url: `/professional/history/getHistoryTaskList?${data}`,
    method: 'GET'
  })
}

// 任务 - 归档记录 - 还原到下载列表
export function reductionDownloadList(data){
  return businessServer({
    url: `/professional/history/returnToDownload`,
    method: 'PUT',
    data
  })
}

// 账单 - 充值 - 立即充值 - 支付宝
export function ALiPay(data){
  return businessServer({
    url: `/recharge/alipay/toAlipay?payment=${data}`,
    method: 'GET'
  })
}

// 账单 - 充值 - 计算金币
export function computeGold(data){
  return businessServer({
    url: `/recharge/balance/getArrivalAmountByPayment/${data}`,
    method: 'GET'
  })
}

// 账单 - 充值 - 充值结果
export function upTopDefault(data){
  return businessServer({
    url: `/recharge/alipay/return?${data}`,
    method: 'GET'
  })
}

// 资产 - 渲染输出 - 主任务
export function assetsExportMain(data){
  return businessServer({
    url: `/professional/assets/getAssetsTaskList?${data}`,
    method: 'GET'
  })
}

// 资产 - 渲染输出 - 层任务
export function assetsExportLayer(data){
  return businessServer({
    url: `/professional/assets/getAssetsLayerTaskList?${data}`,
    method: 'GET'
  })
}

// 资产 - 渲染输出 - 帧任务
export function assetsExportFrame(data){
  return businessServer({
    url: `/professional/assets/getAssetsFrameTaskList?${data}`,
    method: 'GET'
  })
}

// 资产 - 渲染输出 - 申请压缩文件
export function compressionFiles(data){
  return businessServer({
    url: `/professional/package/downloadFolderZip?path=${data}`,
    method: 'GET',
    responseType: "blob",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 资产 - 删除
export function assetsDeleteItem(data){
  return businessServer({
    url: `/professional/assets/deleteAssetsTaskList`,
    method: 'DELETE',
    data
  })
}

// 任务 - 缩略图
// export function getThumbnail(data){
//   return businessServer({
//     url: `/professional/file/getFrameImage?${data}`,
//     method: 'GET'
//   })
// }
