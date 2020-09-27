<template>
  <div class="rechargepage-wrapper">
    <div></div>
  </div>
</template>

<script>
  export default {
    naem: 'rechargepage',
    data(){
      return {

      }
    },
    mounted(){
      setTimeout(() => {
          document.write(sessionStorage.getItem('aliPay'))
      },0)
    }
  }
</script>

<style lang="less" scoped>
  .rechargepage-wrapper {
    div {
      width: 200px;
      height: 200px;
      background-color: #55a532;
    }
  }
</style>
