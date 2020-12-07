import {
  businessServer
} from './index.js'

// 资产 - 跳转到DCP
export function jumpToDCP(data) {
  return businessServer({
    url: `/professional/assets/getFramePathToDcp`,
    method: 'POST',
    data
  })
}
