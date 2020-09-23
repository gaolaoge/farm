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
      avatar: null,  // 头像
      token: '',
      balance: '0.000',     // 金币余额
      totalCapacity: 0,     // 总容量
      usedCapacity: 0,      // 已用容量
      haveCapacity: '0.000',// 剩余容量
      payAmount: '0.000',   // 累计支付金币
      goldCoins: '0.000',   // 累计到账金币
      consumption: '0.00',  // 累计消费金币
      totalInvoiceAmount: 0,// 已开票金额
      totalInvoiceAble: 0,  // 可开票金额
      level: null,
      birthday: null,
      email: null,
      sex: null,
      id: null
    },
    regExp: {
      email: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
      phone: /^1(3|4|5|6|7|8|9)\d{9}$/,
      pwLength: /^[\w\W]{8,18}$/,
      pwFormat: /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?!^.*[\u4E00-\u9FA5].*$)/,
      code: /^\d{6}$/,
      accountLength: /^[\w\W]{8,14}$/,
      accountFormat: /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![_]+$)(?![\u4E00-\u9FA5\w]+$)/,
      // 纳税人识别号
      identificationNumber: /^[\w]{15,20}$/,
      // 发票抬头
      header: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
    },
    login: false,
    zoneId: null,           // 所在区ID
    zone: null,             // 分区 1影视区 2效果图区
    taskType: null,         // 渲染模式 「profession」专业版 「easy」一键版
    isGup: null,
    socket_plugin: null,    // 与插件关联的websocket
    socket_plugin_msg: null,// 与插件关联的websocket接收的参数
    socket_plugin_time: 0,  // 重连次数
    socket_backS: null,     // 与后台关联的websocket
    socket_backS_msg: null, // 与后台关联的websocket接收的参数
    socket_backS_time: 0,
    thumb: {
      showLargeThumbWin: false,
      LargeImgHref: null
    },
    pluginDialog: false,    // 打开插件窗口
    redirectToTask: null,   // 站内信跳转到task
  },
  getter: {},
  mutations: {
    // 创建与后台的websocket
    WEBSOCKET_BACKS_INIT(state, account) {
      state.socket_backS = new WebSocket(`${process.env.BACK_WS_API}${account}`)
      state.socket_backS.addEventListener('open', () => {
        console.log('--与后台连接成功--')
        this.commit('toZore', 'socket_backS_time')
      })
      state.socket_backS.addEventListener('error', () => {
        if (state.socket_backS_time >= 5) {
          console.log('--与后台连接失败--')
          this.commit('becomeErr', 'socket_backS')
        } else {
          this.commit('addOne', 'socket_backS_time')
          console.log('--与后台连接失败，尝试重新连接--')
          this.WEBSOCKET_BACKS_INIT(state, account)
        }
      })
      state.socket_backS.addEventListener('message', data => state.socket_backS_msg = data)
      state.socket_backS.addEventListener('close', e => {
        console.log(`--与后台连接断开，code码为${e.code},尝试重新连接--` + new Date().toLocaleString())
        this.WEBSOCKET_BACKS_INIT(state, account)
      })
    },
    // 对与后台的websocket发送消息
    WEBSOCKET_BACKS_SEND(state, data) {
      if (!state.socket_backS) return false
      state.socket_backS.send(JSON.stringify(data))
    },
    // 创建与插件的websocket
    WEBSOCKET_PLUGIN_INIT(state, triggerPlugin) {
      state.socket_plugin = new WebSocket(process.env.PLUGIN_WS_API)
      state.socket_plugin.addEventListener('open', () => {
        console.log('--与插件连接成功--')
        this.commit('toZore', 'socket_plugin_time')
      })
      state.socket_plugin.addEventListener('error', () => {
        if (state.socket_plugin_time >= 5) {
          console.log('--与插件连接失败--')
          this.commit('becomeErr', 'socket_plugin')
          if(triggerPlugin) this.commit('openPluginDialog', true)
        } else {
          this.commit('addOne', 'socket_plugin_time')
          console.log('--与插件连接失败，尝试重新连接--')
          this.commit('WEBSOCKET_PLUGIN_INIT')
        }
      })
      state.socket_plugin.addEventListener('message', data => state.socket_plugin_msg = data)
    },
    // 对与插件的websocket发送消息
    WEBSOCKET_PLUGIN_SEND(state, data) {
      if (!state.socket_plugin) return false
      state.socket_plugin.send(JSON.stringify(data))
    },
    // 与插件的websocket断开连接
    WEBSOCKET_PLUGIN_CLOSE(state) {
      if (!state.socket_plugin) return false
      state.socket_plugin.close()
      state.socket_plugin = null
    },
    // 总容量
    changeTotalCapacity(s, num){
      s.user.totalCapacity = num
    },
    // 已用容量
    changeUsedCapacity(s, num){
      s.user.usedCapacity = num
    },
    // 站内信跳转到task
    newRedirectToTask(state, data){
      state.redirectToTask = data
    },
    // 打开插件窗口
    openPluginDialog(s, bool){
      s.pluginDialog = bool
    },
    // 渲染结果 缩略图 展示
    setShowThumb(s, bool){
      s.thumb.showLargeThumbWin = bool
    },
    // 渲染结果 缩略图 地址
    setThumbURL(s, url){
      s.thumb.LargeImgHref = url
    },
    changeTotalInvoiceAble(s, val) {
      s.user.totalInvoiceAble = val
    },
    changeTotalInvoiceAmount(s, val) {
      s.user.totalInvoiceAmount = val
    },
    becomeErr(s, val){
      s[val] = null
    },
    addOne(s, val) {
      s[val] ++
    },
    toZore(s, val) {
      s[val] = 0
    },
    changeTaskType(s, val) {
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
