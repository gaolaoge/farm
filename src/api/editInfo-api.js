import {
  businessServer
} from './index.js'

// 修改基本信息 【昵称】【头像】【性别】【生日】
export function editBasicInfo(data) {
  return businessServer({
    url: '/customer/updateCustomerInfo',
    method: 'PUT',
    data
  })
}

// 修改密码 - 验证码
export function getCodeFromPS(data) {
  return businessServer({
    url: '/customer/sendPhoneCode4ChangePassword',
    method: 'GET',
    data
  })
}

// 修改密码
export function editPassWord(data) {
  return businessServer({
    url: '/customer/updatePassword',
    method: 'PUT',
    data
  })
}

// 修改邮箱 - 获取手机验证码
export function getPhoneCodeFromEmail() {
  return businessServer({
    url: '/customer/sendPhoneCode4ChangeEmail',
    method: 'GET',
  })
}

// 修改邮箱 - 获取新邮箱验证码
export function getEmailCodeFromEmail(data) {
  return businessServer({
    url: `/customer/sendEmailCode4CheckOwn/${data}`,
    method: 'GET'
  })
}

// 修改邮箱 - 修改
export function editEmail(data) {
  return businessServer({
    url: `/customer/changeEmailByPhoneCode`,
    method: 'PUT',
    data
  })
}

// 修改手机号 - 通过验证手机号 - 获取旧手机号验证码
export function editPhoneGetOC() {
  return businessServer({
    url: `/customer/sendPhoneCode4ChangePhone`,
    method: 'GET'
  })
}

// 修改手机号 - 通用 - 获取新手机号验证码
export function editPhoneGetNC(data) {
  return businessServer({
    url: `/customer/sendPhoneCode4CheckOwn/${data}`,
    method: 'GET'
  })
}

// 修改手机号 - 通过验证手机号 - 发送验证
export function editPhoneP(data) {
  return businessServer({
    url: `/customer/changePhoneByPhoneCode`,
    method: 'PUT',
    data
  })
}

// 修改手机号 - 通过验证邮箱 - 获取邮箱验证码
export function editPhoneGetEC() {
  return businessServer({
    url: `/customer/sendEmailCode4ChangePhone`,
    method: 'GET'
  })
}

// 修改手机号 - 通过验证邮箱 - 发送验证
export function editPhonePP(data) {
  return businessServer({
    url: `/customer/changePhoneByEmailCode`,
    method: 'PUT',
    data
  })
}

// 修改手机号 - 通过验证密码 - 发送验证
export function editPhonePS(data) {
  return businessServer({
    url: `/customer/changePhoneByPassword`,
    method: 'PUT',
    data
  })
}
