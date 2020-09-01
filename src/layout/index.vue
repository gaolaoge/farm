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
    <div class="gz" v-show="showGZ">
      <img src="@/icons/gz-black.png" alt="" class="d">
      <img src="@/icons/gz-blue.png" alt="" class="h">
      <span>{{ $t('transportBtn') }}</span>
    </div>
    <!--帧大图-->
    <div class="thumb" v-show="thumb.showLargeThumbWin" @click="$store.commit('setShowThumb', false)">
      <img :src="thumb.LargeImgHref" alt="">
    </div>
  </div>
</template>

<script>
  import {
    Header,
    Navbar,
    appMain
  } from './components'
  import iv from '@/components/home/Info&Vip'
  import {mapState} from 'vuex'

  export default {
    name: 'layout-wrapper',
    data() {
      return {
        inHome: false,
        showGZ: false
      }
    },
    components: {
      Header,
      Navbar,
      appMain,
      iv
    },
    computed: {
      ...mapState(['login', 'thumb'])
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
      bottom: 40px;
      right: 60px;
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
    z-index: 9;
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

  @media screen and (orientation: portrait) {
    .layout-wrapper {
      height: 100vw;
      width: 100vh;
    }
  }
</style>
