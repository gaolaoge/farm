<template>
  <div class="demo">
    <img src="@/assets/404.png" alt="">
    <span>{{ text }}</span>
    <div class="btn" @click="$router.push('/')">{{ btn }}</div>
  </div>
</template>

<script>
  // import {
  //   upTopGC
  // } from '@/api/api'
  export default {
    name: 'demo',
    data() {
      return {
        text: '页面突然溜走了，可以手动刷新试试哦～',
        btn: '返回首页'
      }
    },
    methods: {}
  }
</script>

<style scoped lang="less">
  .demo {
    width: 100%;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin: 0px 50px;
    user-select: none;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      margin: 14vh -50px 50px 0px;
    }

    span {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.59);
    }

    .btn {
      margin-top: 30px;
      width: 132px;
      height: 38px;
      background: rgba(10, 98, 241, 1);
      border-radius: 20px;
      font-size: 16px;
      color: rgba(255, 255, 255, 1);
      text-align: center;
      line-height: 38px;
      cursor: pointer;
    }
  }
</style>
