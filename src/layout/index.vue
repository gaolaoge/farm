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
        <span>{{ title }}</span>
        <img src="@/icons/shutDialogIcon.png" class="closeIcon" @click="$store.commit('openPluginDialog', false)">
      </header>
      <div class="dl_wrapper">
        <span class="main">
          {{ dialogMainText }} <span class="blue" @click="triggerPlugin">{{ triggerText }}</span> {{ dialogMainText2 }}
        </span>
        <div class="download_btn" @click="w"><span>{{ downloadText }}</span></div>
        <div class="warnInfo">
          <span>{{ warnInfo }}</span>
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
  import iv from '@/components/home/Info&Vip'
  import { mapState } from 'vuex'
  import store from "../store";

  export default {
    name: 'layout-wrapper',
    data() {
      return {
        inHome: false,
        showGZ: false,
        title: '提示信息',
        dialogMainText: '需要安装传输插件才能进行文件传输若已安装过插件，请点此',
        triggerText: '启动传输插件',
        dialogMainText2: '并刷新此页面',
        downloadText: '下载传输插件',
        warnInfo: '若已启用，依然无法传输，\n' + '请联系24小时在线客服0531-2635521'
      }
    },
    components: {
      Header,
      Navbar,
      appMain,
      iv
    },
    computed: {
      ...mapState(['login', 'thumb', 'socket_plugin', 'pluginDialog'])
    },
    watch: {
      '$route': {
        handler: function (val) {
          if (val.name == 'home') this.inHome = true
          else this.inHome = false
          if(val.name == 'assets' || val.name == 'task') this.showGZ = true
          else this.showGZ = false
        },
        immediate: true
      }
    },
    methods: {
      // 跳转到下载
      w() {
        window.open('http://223.80.107.190:8084/Setup.exe', '_blank')
      },
      // 触发插件
      triggerPlugin() {
        let son = document.createElement('IFRAME')
        document.body.appendChild(son)
        son.src = 'jhzy://'
        son.contentDocument.open()
      },
      // 打开【传输列表】
      openPlugin(){
        if(this.socket_plugin) this.$store.commit('WEBSOCKET_PLUGIN_SEND', 'open')
        else this.$store.commit('openPluginDialog', true)
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
        color: rgba(255,255,255,1);
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
  }

  /deep/.el-dialog__body {
    padding: 0px 0px 20px 0px;
    background-color: rgba(255,255,255,1);
  }
  /deep/.el-dialog {
    border-radius: 8px;
    overflow: hidden;
  }

  @media screen and (orientation: portrait) {
    .layout-wrapper {
      height: 100vw;
      width: 100vh;
    }
  }
</style>
