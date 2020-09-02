import {
  Message,
  MessageBox
} from 'element-ui'
import store from '../store'

// 读取时间戳
const createCalendar = function (date) {
  let year = date.getFullYear(),
    month = date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1),
    day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate(),
    hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours(),
    minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes(),
    seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
  return {year, month, day, hour, minutes, seconds}
}

// 获得日期时间
const createDateFun = function (date, mini) {
  if (date.getFullYear() == '1970') return '-'
  let {year, month, day, hour, minutes, seconds} = createCalendar(date)
  if (mini) return `${year}-${month}-${day}`
  else return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
}

// 耗时
const consum = function (time) {
  let result = ''
  if (time >= 1000) {
    let day = parseInt(time / (24 * 60 * 60 * 1000)),
      hour = parseInt((time % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
      minute = parseInt(((time % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) / (60 * 1000)),
      second = parseInt((((time % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000)
    if (day != 0) {
      result += day + '天'
    }
    if (hour != 0 || result != '') {
      result += hour + '小时'
    }
    if (minute != 0 || result != '') {
      result += minute + '分'
    }
    if (second != 0 || result != '') {
      result += second + '秒'
    }
  }
  return result == '' ? '0秒' : result
}

// 获得时间戳
const getDate = (year, month, day) => {
  return new Date(year, month - 1, day)
}

// 下载
const exportDownloadFun = (data, name, type, isProtocal) => {
  // arguments isProtocal=>用户协议
  let blob = null
  if (type == 'xlsx') {
    blob = new Blob([data.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    const a = document.createElement("A"),
      url = window.URL.createObjectURL(blob),
      filename = name + '.xlsx'
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  } else if (type == 'pdf') {
    let url = window.URL.createObjectURL(new Blob([data.data], {type: `application/pdf;charset-UTF-8`})),
      link = document.createElement('A')
    link.style.display = 'none'
    if (isProtocal) link.setAttribute('target', '_blank')
    link.href = url
    if (!isProtocal) link.setAttribute('download', name + '.pdf')
    document.body.appendChild(link)
    link.click()
  } else {
    let url = window.URL.createObjectURL(new Blob([data.data], {'type': data.headers['content-type']})),
      a = document.createElement('A')
    a.style.display = 'none'
    a.target = '_blank'
    a.href = url
    a.download = name
    a.click()
  }
}

// 2位排序
const sortF = function(a, b){
  if(a < b) return
  a += b
  b = a - b
  a -= b
}

// table 筛选icon样式
const createTableIconList = function () {
  setTimeout(() => {
    // 筛选图标
    if (document.getElementsByClassName('iconshaixuan').length) return false
    let t = [...document.getElementsByClassName('el-icon-arrow-down')]
    t.forEach(curr => {
      let i = document.createElement('I'),
        ii = document.createElement('I')
      i.classList.add('iconfont')
      i.classList.add('iconshaixuan')
      ii.classList.add('iconfont')
      ii.classList.add('iconshaixuan1')
      curr.appendChild(i)
      curr.appendChild(ii)
    })
    // 排序图标
    let q = [...document.getElementsByClassName('ascending')]
    q.forEach(curr => {
      let i = document.createElement('I')
      i.classList.add('el-icon-arrow-up')
      i.classList.add('k')
      curr.appendChild(i)
    })
    let w = [...document.getElementsByClassName('descending')]
    w.forEach(curr => {
      let i = document.createElement('I')
      i.classList.add('el-icon-arrow-up')
      i.classList.add('k')
      curr.appendChild(i)
    })
    // 展开图标
    let s = [...document.getElementsByClassName('el-table__expand-icon')]
    s.forEach(curr => {
      let img = document.createElement('IMG')
      img.src = require('@/icons/iii.png')
      curr.appendChild(img)
    })
  }, 0)
}

// message 信息
const messageFun = function (type, message) {
  return Message({
    message: message,
    type: type,
    showClose: true,
    duration: 3000
  })
}

// 渲染帧范围
const renderingRange = function (min, max, interval) {
  let a = [min],
    m = min + interval
  while (m <= max) {
    a.push(m)
    m += interval
  }
  return a
}

//
const itemDownloadStatus = function (num) {
  switch (num) {
    case 1:
      return '等待'
      break
    case 2:
      return '渲染中'
      break
    case 3:
      return '渲染完成'
      break
    case 4:
      return '渲染暂停'
      break
    case 5:
      return '待全速渲染'
      break
    case 6:
      return '渲染放弃'
      break
  }
}

// Uuid
const UuidFun = function () {
  var s = []
  var hexDigits = "0123456789abcdef"
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = "4"                                                        // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)      // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-"

  var uuid = s.join("")
  return uuid
}

const setInfo = function (data) {
  sessionStorage.setItem('info', JSON.stringify({
    account: data.account,
    phone: data.phone,
    level: data.vipLevel,
    balance: data.goldBalance
  }))
  store.commit('changeID', data.customerUuid)                                                    // ID
  store.commit('changeAvatar', data.headImg)                                                     // 头像
  store.commit('changeName', data.nickname)                                                      // 昵称
  store.commit('changeAccount', data.account)                                                    // 帐号
  store.commit('changePhone', data.phone)                                                        // 手机号
  store.commit('changeLevel', data.vipLevel)                                                     // 会员等级
  store.commit('changeBirthday', data.birthday)                                                  // 生日
  store.commit('changeEmail', data.email)                                                        // email
  store.commit('changeSex', data.sex)                                                            // 性别
  store.commit('changeZone', data.zone)                                                          // 分区 1影视区 2效果图区
  store.commit('changeZoneId', data.zoneUuid)                                                    // 所在区ID
  store.commit('changeTotalInvoiceAmount', data.totalInvoiceAmount)                              // 已开票金额
  store.commit('changeTotalInvoiceAble', data.totalInvoiceAble)                                  // 可开票金额
  store.commit('changeUserBalance', data.goldBalance.toFixed(3))                      // 金币余额
  store.commit('changeHaveCapacity', (data.haveCapacity / 1073741824).toFixed(3))     // 剩余容量
  store.commit('changePayAmount', data.cumulativeRecharge.toFixed(3))                 // 累计支付金额
  store.commit('changeGoldCoins', data.totalArrival.toFixed(3))                       // 累计到账金币
  store.commit('changeConsumption', data.cumulativeConsume.toFixed(2))                // 累计消费金币
}

// 判断是否为IE等版本
const IEVersion = function () {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 7) {
      return 7;
    } else if (fIEVersion == 8) {
      return 8;
    } else if (fIEVersion == 9) {
      return 9;
    } else if (fIEVersion == 10) {
      return 10;
    } else {
      return 6;//IE版本<=7
    }
  } else if (isEdge) {
    return 'edge';//edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return -1;//不是ie浏览器
  }
}

const clearUserCookie = function (phone, account, token) {
  if (!document.cookie) return false
  let s = {},
    f = false
  document.cookie.split(';').forEach(curr => s[curr.split('=')[0].trim()] = curr.split('=')[1].trim())
  if ('phone' in s) f = s['phone'] == phone
  else if ('account' in s) f = s['account'] == account
  if (f) {
    document.cookie = `token=${token};max-age=-1`
    if ('phone' in s) document.cookie = `phone=${phone};max-age=-1`
    if ('account' in s) document.cookie = `account=${account};max-age=-1`
  }
}

// 文件大小单位转换
function getFileSize(fileByte) {
  var fileSizeByte = fileByte,
    fileSizeMsg = ""
  if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB"
  else if (fileSizeByte == 1048576) fileSizeMsg = "1MB"
  else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB"
  else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB"
  else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB"
  else fileSizeMsg = "文件超过1TB"
  return fileSizeMsg
}

export {
  createCalendar,
  createDateFun,
  getDate,
  exportDownloadFun,
  consum,
  createTableIconList,
  messageFun,
  renderingRange,
  itemDownloadStatus,
  UuidFun,
  setInfo,
  IEVersion,
  clearUserCookie,
  getFileSize,
  sortF
}


