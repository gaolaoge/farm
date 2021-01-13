<template>
  <div id="app" class="setScollBarStyle">
    <win />
  </div>
</template>

<script>

import '@/assets/font.css'
import win from '@/layout/index'

export default {
  name: 'App',
  components: {
    win
  },
}
</script>

<style lang="less">
  @import './assets/common.less';
  * {
    margin: 0px;
    padding: 0px;
  }
  #app {
    height: 100vh;
    width: 100vw;
    min-height: 950px;
    min-width: 1920px;
  }


</style>
