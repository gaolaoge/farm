<template>
  <div class="appMain-wrapper" :class="[
      {'login': login},
      {'non-home': !inHome}
    ]">
    <router-view />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'appMain',
    data(){
      return {
        inHome: false
      }
    },
    computed: {
      ...mapState(['login'])
    },
    '$route': {
      handler: function (val) {
        if (val.name == 'home') this.inHome = true
        else this.inHome = false
      },
      immediate: true
    }
  }
</script>

<style scoped lang="less">
  .appMain-wrapper {
    width: 100%;
    height: calc(100vh - 120px);
    /*padding-bottom: 20px;*/
    /*box-sizing: border-box;*/
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;
    &.login {
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.non-home {
      height: calc(100vh - 80px);
    }
  }
  @media screen and (orientation: portrait) {
    .appMain-wrapper {
      width: calc(100vh - 175px);
      height: calc(100vw - 80px);
    }
  }
</style>
