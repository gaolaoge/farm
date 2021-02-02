<template>
  <div class="layout-wrapper">
    <Navbar v-show="!login" class="navbar"/>
    <div class="main">
      <Header v-show="!login"/>
      <appMain/>
    </div>
    <div class="mm" v-show="inHome">
      <iv/>
    </div>
    <!--帧大图-->
    <div class="thumb" v-show="thumb.showLargeThumbWin" @click="$store.commit('setShowThumb', false)">
      <img :src="thumb.LargeImgHref">
    </div>
    <!--打开插件窗口-->
    <el-dialog :visible.sync="pluginDialog"
               :show-close="false"
               top="34vh"
               width="360px">
      <header class="dl_header">
        <span class="title">{{ pluginDialog_.title }}</span>
        <img src="@/icons/shutDialogIcon.png" class="closeIcon" @click="$store.commit('openPluginDialog', false)">
      </header>
      <div class="dl_wrapper">
        <span class="main">
          {{ pluginDialog_.dialogMainText }}
          <span class="blue" @click="triggerPlugin">{{ pluginDialog_.triggerText }}</span>
        </span>
        <div class="download_btn" @click="w"><span>{{ pluginDialog_.downloadText }}</span></div>
        <div class="warnInfo">
          <span>{{ pluginDialog_.warnInfo }}</span>
        </div>
      </div>
    </el-dialog>
    <!--打开异地登录窗口-->
    <el-dialog :visible.sync="remoteLoginDialog.show"
               :show-close="false"
               top="30vh"
               width="520px">
      <header class="dl_header">
        <span class="title">{{ remoteLoginDialog.title }}</span>
        <img src="@/icons/shutDialogIcon.png" class="closeIcon" @click="shutRemoteLogin(false)">
      </header>
      <div class="dl_wrapper">
        <div class="body">
          <p class="header">
            {{ remoteLoginDialog.header1 }}{{ user.account }}{{ remoteLoginDialog.header2 }}
          </p>
          <p class="contant">
            {{ remoteLoginDialog.contant1 }}{{ remoteLoginDialog.date }}{{ remoteLoginDialog.contant2 }}
          </p>
          <p class="contant">
            {{ remoteLoginDialog.contant3 }}
            <span class="editPS" @click="shutRemoteLogin(true)">{{ remoteLoginDialog.contant4 }}</span>
            {{ remoteLoginDialog.contant5 }}
          </p>
          <div class="download_btn z" @click="shutRemoteLogin(false)"><span>{{ remoteLoginDialog.btn }}</span></div>
        </div>
      </div>
    </el-dialog>
    <!--金币余额不足通知-->
    <el-dialog :visible.sync="rechargeDialog.show"
               :show-close=false
               :destroy-on-close=true
               top="30vh"
               width="548px">
      <section>
        <header class="dl_header">
          <span class="title">{{ rechargeDialog.title }}</span>
          <img src="@/icons/shutDialogIcon.png"
               class="closeIcon"
               @click="rechargeDialog.show = false">
        </header>
        <div class="dl_wrapper">
          <div class="body">
            <p class="header">{{ rechargeDialog.header1 }}{{ user.account }}{{ rechargeDialog.header2 }}</p>
            <!--欠费-->
            <p class="contant" v-if="rechargeDialog.state == 'overdue'">
              {{ rechargeDialog.contant1 }}
              <span class="balanceOverdue">{{ user.balance }}</span>
              {{ rechargeDialog.contant2 }}
              {{ rechargeDialog.action }}
              {{ rechargeDialog.contant3 }}
            </p>
            <!--余额为零-->
            <p class="contant" v-if="rechargeDialog.state == 'empty'">
              {{ rechargeDialog.contant4 }}
              <span class="balanceEmpty">{{ user.balance }}</span>
              {{ rechargeDialog.contant2 }}
              {{ rechargeDialog.action }}
              {{ rechargeDialog.contant3 }}
            </p>
            <div class="download_btn z" @click="goToUpTopPage">
              <span>{{ rechargeDialog.btn }}</span>
            </div>
          </div>
        </div>
      </section>
    </el-dialog>
  </div>
</template>

<script>
  import {
    Header,
    Navbar,
    appMain
  } from './components'
  import {
    getInfo
  } from '@/api/api'
  import {
    createDateFun
  } from '@/assets/common'
  import iv from '@/components/home/Info&Vip'
  import {mapState} from 'vuex'
  import {messageFun} from "../assets/common";

  export default {
    name: 'layout-wrapper',
    data() {
      return {
        inHome: false,
        showGZ: false,
        // 下载或启动插件win
        pluginDialog_: {
          title: '提示信息',
          dialogMainText: '需要安装传输插件才能进行文件传输若已安装过插件，请点此',
          triggerText: '启动传输插件',
          downloadText: '下载传输插件',
          warnInfo: '若已启用，依然无法传输，\n' + '请联系24小时在线客服15610503237',
        },
        // 下线通知win
        remoteLoginDialog: {
          show: false,
          title: '下线通知',
          header1: '亲爱的',
          header2: '，您好！',
          contant1: '您的账号于',
          date: null,
          contant2: '在另一地点登录了CloudRender，为了您的账号安全，您当前登录已被迫下线。',
          contant3: '如果这不是您本人的操作，那么您的密码很可能已经泄露，建议您点击',
          contant4: '修改密码',
          contant5: '。',
          btn: '重新登录'
        },
        // 金币余额不足win
        rechargeDialog: {
          show: false,
          state: null,
          action: null,    // 触发验证的动作
          title: '充值通知',
          header1: '亲爱的',
          header2: '，您好！',
          contant1: '您当前账户已欠费',
          contant4: '您当前账户余额为',
          contant2: '金币，烦请您先充值后在进行【',
          contant3: '】操作。',
          btn: '立即充值'
        }
      }
    },
    components: {
      Header,
      Navbar,
      appMain,
      iv
    },
    computed: {
      ...mapState([
        'login',
        'user',
        'thumb',
        'socket_plugin',
        'pluginDialog',
        'remoteLoginDate',
        'socket_backS_msg',
        'openOverdueBillsWin',    // 打开已欠费窗口
        'openBalanceIsEmptyWin',  // 打开余额为零窗口
        'openCapacityIsLessWin'   // 打开容量不足窗口
      ])
    },
    watch: {
      '$route': {
        handler: function (val) {
          if (val.name == 'home') this.inHome = true
          else this.inHome = false
          if (val.name == 'assets' || val.name == 'task') this.showGZ = true
          else this.showGZ = false
        },
        immediate: true
      },
      'remoteLoginDate': function (date) {
        if (!date) return false
        this.remoteLoginDialog.date = createDateFun(new Date(date), null, true)
        this.remoteLoginDialog.show = true
      },
      'socket_backS_msg': {
        handler: function (e) {
          let data = JSON.parse(e.data)
          if (data.code == 858) setTimeout(() => getInfo(), 1000)
        },
      },
      'openOverdueBillsWin': function (obj) {
        if (!obj.bool) return false
        this.rechargeDialog.show = true
        this.rechargeDialog.state = 'overdue'
        this.rechargeDialog.action = obj.action
        this.$store.commit('hasBeenOverdueBills', false)
      },
      'openBalanceIsEmptyWin': function (obj) {
        if (!obj.bool) return false
        this.rechargeDialog.show = true
        this.rechargeDialog.state = 'empty'
        this.rechargeDialog.action = obj.action
        this.$store.commit('theBalanceIsZero', false)
      },
      'openCapacityIsLessWin': function (obj) {
        if (!obj.bool) return false
        this.rechargeDialog.show = true
        this.$store.commit('theCapacityIsLess', false)
      },
    },
    methods: {
      // 转到充值页面
      goToUpTopPage() {
        this.rechargeDialog.show = false
        this.$router.push({name: 'upTop'})
      },
      shutRemoteLogin(editPS) {
        this.remoteLoginDialog.show = false
        editPS ? this.$router.push({name: 'login', params: {modify: true}}) : this.$router.push({
          name: 'login',
          params: {modify: false}
        })
      },
      // 跳转到下载
      w() {
        this.$store.commit('downloadPlugin')
      },
      // 触发插件
      triggerPlugin() {
        let son = document.createElement('IFRAME')
        son.style.width = '0px'
        son.style.height = '0px'
        document.body.appendChild(son)
        // son.src = 'jhzy://'
        son.src = 'cloudtransfer://'
        son.contentDocument.open()
      }
    }
  }
</script>

<style lang="less" scoped>
  .layout-wrapper {
    position: relative;
    background-color: rgba(241, 244, 249, 1);
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: PingFangSC-Medium, PingFang SC;

    .navbar {
      flex-shrink: 0;
    }

    .main {
      flex-grow: 1;
      flex-shrink: 1;
      width: calc(100% - 120px);
    }

    .mm {
      flex-shrink: 0;
      width: 366px;
      height: 100%;
      padding: 20px 20px 0px 0px;
    }
  }

  .thumb {
    position: fixed;
    z-index: 10;
    top: 0vh;
    left: 0vw;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    img {
      max-width: 80vw;
      max-height: 80vh;
    }
  }

  .dl_header {
    text-align: center;
    padding: 0px 30px;
    box-sizing: border-box;
  }

  .dl_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

    .main {
      margin: 30px 0px;
      flex-grow: 0;
      width: 238px;
      font-size: 14px;
      color: rgba(22, 29, 37, 1);
      line-height: 26px;

      .blue {
        color: #1b53f4;
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .download_btn {
      width: 144px;
      height: 36px;
      background-color: rgba(53, 130, 254, 1);
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin-bottom: 10px;

      span {
        font-size: 14px;
        color: rgba(255, 255, 255, 1);
      }

      &.z {
        float: right;
        margin-top: 20px;
        width: 90px;
      }
    }

    .warnInfo {
      width: 188px;

      span {
        font-size: 11px;
        color: rgba(22, 29, 37, 0.6);
        line-height: 16px;
      }
    }

    .body {
      padding: 0px 30px;
    }

    .header {
      margin: 44px 0px 30px;
      width: 100%;
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      color: #000;
    }

    .contant {
      width: 100%;
      font-size: 14px;
      line-height: 2.0em;
      margin-bottom: 10px;

      .editPS {
        color: #0061ff;
        cursor: pointer;
        text-decoration: underline;
      }
    }

    .balanceOverdue {

    }

    .balanceEmpty,
    .balanceOverdue {
      display: inline-block;
      padding: 0px 4px;
      font-size: 18px;
    }
    .balanceEmpty {
      color: RGBA(255, 191, 0, 1);
    }
    .balanceOverdue {
      color: RGBA(255, 62, 77, 1);
    }
  }

  /deep/ .el-dialog__body {
    padding: 0px 0px 20px 0px;
    background-color: rgba(255, 255, 255, 1);
  }

  /deep/ .el-dialog {
    border-radius: 8px;
    overflow: hidden;
  }

  /*@media screen and (orientation: portrait) {*/
  /*  .layout-wrapper {*/
  /*    height: 100vw;*/
  /*    width: 100vh;*/
  /*  }*/
  /*}*/
</style>
