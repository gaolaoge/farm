import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    user: {
      name: null,           // 昵称
      account: null,        // 账号
      phone: null,
      avatar: require('@/assets/userImg.png'),  // 头像
      token: '',
      balance: '0.000',     // 金币余额
      haveCapacity: '0.000',// 剩余容量
      payAmount: '0.000',   // 累计支付金币
      goldCoins: '0.000',   // 累计到账金币
      consumption: '0.00',  // 累计消费金币
      level: null,
      birthday: null,
      email: null,
      sex: null,
      id: null
    },
    login: false,
    zoneId: null,           // 所在区ID
    zone: null,             // 分区 1影视区 2效果图区
    taskType: null,         // 渲染模式 「profession」专业版 「easy」一键版
    isGup: null,
    socket_plugin: null,    // 与插件关联的websocket
    socket_plugin_msg: null,// 与插件关联的websocket接收的参数
    socket_backS: null,     // 与后台关联的websocket
    socket_backS_msg: null, // 与后台关联的websocket接收的参数
  },
  getter: {},
  mutations: {
    // 创建与后台的websocket
    WEBSOCKET_BACKS_INIT(state, url) {
      let num = 0
      state.socket_backS = new WebSocket(url)
      state.socket_backS.addEventListener('open', () => console.log('--与后台连接成功--'))
      state.socket_backS.addEventListener('error', () => {
        if(num >= 5){
          console.log('--与后台连接失败--')
          state.socket_backS = 'err'
        }else {
          num ++
          console.log('--与后台连接失败，尝试重新连接--')
          this.WEBSOCKET_BACKS_INIT(state, url)
        }
      })
      state.socket_backS.addEventListener('message', data => state.socket_backS_msg = data)
    },
    // 对与后台的websocket发送消息
    WEBSOCKET_BACKS_SEND(state, data) {
      if(!state.socket_backS) return false
      state.socket_backS.send(data)
    },
    // 创建与插件的websocket
    WEBSOCKET_PLUGIN_INIT(state, url){
      let num = 0
      state.socket_plugin = new WebSocket(url)
      state.socket_plugin.addEventListener('open', () => console.log('--与插件连接成功--'))
      state.socket_plugin.addEventListener('error', () => {
        if(num >= 5){
          console.log('--与插件连接失败--')
          state.socket_plugin = 'err'
        }else {
          num ++
          console.log('--与插件连接失败，尝试重新连接--')
          this.WEBSOCKET_PLUGIN_INIT(state, url)
        }
      })
      state.socket_plugin.addEventListener('message', data => state.socket_plugin_msg = data)
    },
    // 对与插件的websocket发送消息
    WEBSOCKET_PLUGIN_SEND(state, data){
      if(!state.socket_plugin) return false
      state.socket_plugin.send(data)
    },
    // 与插件的websocket断开连接
    WEBSOCKET_PLUGIN_CLOSE(state){
      if(!state.socket_plugin) return false
      state.socket_plugin.close()
      state.socket_plugin = null
    },
    changeTaskType(s, val){
      s.taskType = val
    },
    changeIsGpu(s, val) {
      s.isGup = val
    },
    changeSocket_Plugin(s, val) {
      s.socket_Plugin = val
    },
    changeID(s, val) {
      s.user.id = val
    },
    changeZone(s, val) {
      s.zone = val
    },
    changeLogin(s, val) {
      s.login = val
    },
    changeAccount(s, val) {
      s.user.account = val
    },
    changeName(s, val) {
      s.user.name = val
    },
    changeUserBalance(s, val) {
      s.user.balance = val
    },
    // changeToken(s,val){
    //   s.user.token = val
    // }
    changeZoneId(s, val) {
      s.zoneId = val
    },
    changePayAmount(s, val) {
      s.user.payAmount = val  // 累计支付金额
    },
    changeGoldCoins(s, val) {
      s.user.goldCoins = val  // 累计到账金币
    },
    changeConsumption(s, val) {
      s.user.consumption = val// 累计消费金币
    },
    changePhone(s, val) {
      s.user.phone = val
    },
    changeLevel(s, val) {
      if (val == 0) s.user.level = '普通会员'
      else if (val == 1) s.user.level = '璀璨白银'
      else if (val == 2) s.user.level = '荣耀黄金'
      else if (val == 3) s.user.level = '尊贵铂金'
      else if (val == 4) s.user.level = '永恒钻石'
    },
    changeBirthday(s, val) {
      s.user.birthday = val
    },
    changeEmail(s, val) {
      s.user.email = val
    },
    changeSex(s, val) {
      s.user.sex = val
    },
    changeAvatar(s, val) {
      s.user.avatar = val
    },
    changeHaveCapacity(s, val) {
      s.user.haveCapacity = val
    }
  },
  actions: {}
})
