import {
  businessServer
} from './index.js'

// 开票记录 - 获取列表
export function getInvoiceList(data) {
  return businessServer({
    url: `/billing/invoice/getInvoicePage?${data}`,
    method: 'GET'
  })
}

// 开票记录 - 获取发票抬头列表
export function getHeadersList() {
  return businessServer({
    url: `/billing/invoice/getInvoiceTitleList`,
    method: 'GET'
  })
}

// 开票记录 - 导出记录
export function exportInvoiceTable(data) {
  return businessServer({
    url: `/billing/invoice/getInvoiceExcel?${data}`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 立即开票 - 获取可开票的充值记录
export function getRechargeListF() {
  return businessServer({
    url: `/billing/invoice/getRechargeList4Invoice`,
    method: 'GET'
  })
}

// 立即开票 - 获取户开票抬头信息
export function getInvoiceHeaderListF() {
  return businessServer({
    url: `/billing/invoice/getInvoiceSettingList`,
    method: 'GET'
  })
}

// 立即开票 - 添加开票抬头
export function addInvoiceHeader(data) {
  return businessServer({
    url: `/billing/invoice/addInvoiceSetting`,
    method: 'POST',
    data
  })
}

// 立即开票 - 发票抬头 - 设为默认
export function setItemDefault(id) {
  return businessServer({
    url: `/billing/invoice/setInvoiceSettingDefault/${id}`,
    method: 'PUT'
  })
}

// 立即开票 - 发票抬头 - 删除
export function deleteItemIn(id) {
  return businessServer({
    url: `/billing/invoice/deleteInvoiceSetting/${id}`,
    method: 'DELETE'
  })
}

// 立即开票 - 发票抬头 - 编辑
export function editItemIn(data) {
  return businessServer({
    url: `/billing/invoice/updateInvoiceSetting`,
    method: 'PUT',
    data
  })
}

// 立即开票 - 立即开票
export function invoicing(data) {
  return businessServer({
    url: `/billing/invoice/addInvoice`,
    method: 'POST',
    data
  })
}

// 充值记录 - 待付款
export function peddingPayment(id) {
  return businessServer({
    url: `/recharge/alipay/continuePay?outTradeNo=${id}`,
    method: 'GET'
  })
}
