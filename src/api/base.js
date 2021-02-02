import {
  businessServer
} from './index.js'

// 获取当前余额
export function getCurrentBalance(customerUuid){
  return businessServer({
    url: `/billing/balance/getGoldBalanceByCustomerUuid/${customerUuid}`,
    method: 'GET'
  })
}
