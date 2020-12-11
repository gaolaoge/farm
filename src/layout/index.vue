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
    <div class="gz" v-show="showGZ" @click="openPlugin">
      <img src="@/icons/gz-black.png" alt="" class="d">
      <img src="@/icons/gz-blue.png" alt="" class="h">
      <span>{{ $t('transportBtn') }}</span>
    </div>
    <!--帧大图-->
    <div class="thumb" v-show="thumb.showLargeThumbWin" @click="$store.commit('setShowThumb', false)">
      <img :src="thumb.LargeImgHref" alt="">
    </div>
    <!--打开插件窗口-->
    <el-dialog :visible.sync="pluginDialog"
               :show-close="false"
               top="34vh"
               width="360px">
      <header class="dl_header">
        <span>{{ pluginDialog_.title }}</span>
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
        <span>{{ remoteLoginDialog.title }}</span>
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
        pluginDialog_: {
          title: '提示信息',
          dialogMainText: '需要安装传输插件才能进行文件传输若已安装过插件，请点此',
          triggerText: '启动传输插件',
          downloadText: '下载传输插件',
          warnInfo: '若已启用，依然无法传输，\n' + '请联系24小时在线客服18560651927',
        },
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
      ...mapState(['login', 'user', 'thumb', 'socket_plugin', 'pluginDialog', 'remoteLoginDate', 'socket_backS_msg'])
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
        if(!date) return false
        this.remoteLoginDialog.date = createDateFun(new Date(date), null, true)
        this.remoteLoginDialog.show = true
      },
      'socket_backS_msg': {
        handler: function (e) {
          let data = JSON.parse(e.data)
          if (data.code == 858) setTimeout(() => getInfo(), 1000)
        },
      },
    },
    methods: {
      shutRemoteLogin(editPS){
        this.remoteLoginDialog.show = false
        editPS ? this.$router.push({name: 'login', params: {modify: true}}) : this.$router.push({name: 'login', params: {modify: false}})
      },
      // 跳转到下载
      w() {
        this.$store.commit('downloadPlugin')
      },
      // 触发插件
      triggerPlugin() {
        let son = document.createElement('IFRAME')
        document.body.appendChild(son)
        // son.src = 'jhzy://'
        son.src= 'cloudtransfer://'
        son.contentDocument.open()
      },
      // 打开【传输列表】
      openPlugin() {
        if (this.socket_plugin) this.$store.commit('WEBSOCKET_PLUGIN_SEND', 'open')
        else this.$store.dispatch('WEBSOCKET_PLUGIN_INIT', true).then(() => this.$store.commit('WEBSOCKET_PLUGIN_SEND', 'open'))
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
    height: 100vh;
    min-height: 810px;
    width: 100vw;

    .navbar {
      flex-shrink: 0;
    }

    .main {
      flex-grow: 1;
      flex-shrink: 1;
      width: calc(100vw - 120px);
    }

    .mm {
      flex-shrink: 0;
      width: 366px;
      height: 100%;
      padding: 20px 20px 0px 0px;
    }

    .gz {
      position: fixed;
      bottom: 34px;
      right: 34px;
      width: 86px;
      height: 24px;
      border-radius: 2px;
      border: 1px solid rgba(22, 29, 37, 0.19);
      background-color: rgba(255, 255, 255, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: rgba(22, 29, 37, 0.8);
      }

      .h {
        display: none;
      }

      &:hover {
        border: 1px solid rgba(27, 83, 244, 0.19);

        span {
          color: rgba(27, 83, 244, 1);
        }

        .d {
          display: none;
        }

        .h {
          display: inline-block;
        }
      }
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
    height: 36px;
    text-align: center;
    background-color: rgba(241, 244, 249, 1);
    box-shadow: 0px 1px 6px 0px rgba(27, 83, 244, 0.3);
    padding: 0px 30px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 14px;
      font-weight: 600;
      color: rgba(22, 29, 37, 1);
    }

    img {
      cursor: pointer;
    }
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
