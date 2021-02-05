import axios from 'axios'
import vue from '@/main.js'
import {
  messageFun
} from "../assets/common"
import store from '../store'

let lock = true

// 业务服务
const businessServer = new axios.create({
  baseURL: process.env.BASE_URI,
  // timeout: 5000,
  // headers: {}
})

businessServer.interceptors.request.use(config => {
  let token = null
  if (document.cookie) {
    let obj = document.cookie.split(';').find(curr => /token/.test(curr))
    token = obj ? obj.split('=')[1] : null
  }
  if (sessionStorage.getItem('token')) token = sessionStorage.getItem('token')
  config.headers['token'] = token
  return config
})

// respone拦截器 拦截到所有的response，然后先做一些判断
businessServer.interceptors.response.use(
  response => {
    const res = response.data
    // if (res.code != 200) {
    //   // alert('有一定的错误存在:' + res.message)  //不弹出 将错传给调用出使用
    //   return Promise.reject(res.message)  //这里的值会传递给我调用接口处的错误返回信息
    // } else {
    return response
    // }
  },
  error => {
    console.log(error)
    if (vue.$route.path == '/login') return false
    if (error.response.status == 401) error.response.data.msg == '异地登录' ? createEM(error.response.data.data) : createEM()
  })

function createEM(remoteLogin) {
  if(!lock) return false
  else lock = false
  if(remoteLogin) store.commit('remoteLoginFun', remoteLogin)  // 异地登录
  else {
    if(vue.$route.name) messageFun('warning', 'Token过期，请重新登录。')
    vue.$router.push('/login')
  }
  setTimeout(() => lock = true, 1000)
}

export {
  businessServer,
  fileServer
}
