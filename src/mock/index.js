import Mock from 'mockjs'

Mock.mock(`/auth/accountLogin`, 'POST', options => {
  const {body} = options
  return {
    status: 200,
    message: '登录成功、'
  }
})
