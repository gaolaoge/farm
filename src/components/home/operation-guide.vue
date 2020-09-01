<template>
  <div class="operationGuide-wrapper">
    <header>
      <span> {{ headerText }} </span>
      <img src="@/icons/mini-shutBtn.png" alt="" @click="$emit('shutMe')">
    </header>
    <section class="setScollBarStyle">
      <span class="stepText"> {{ stepText[0] }} </span>
      <img src="@/assets/help-step1.png" alt="">
      <span class="stepText"> {{ stepText[1] }} </span>
      <img src="@/assets/help-step2.png" alt="">
      <span class="stepText"> {{ stepText[2] }} </span>
      <img src="@/assets/help-step3.png" alt="">
    </section>
  </div>
</template>

<script>
  export default {
    name: 'operation-guide',
    data(){
      return {
        headerText: '新建任务操作指南',
        stepText: [
          '1. 点击下拉框，选择工程路径所在文件夹',
          '2. 选中工程路径文件夹点击【上传】',
          '3. 将选中文件夹地址拷贝到“工程路径”中，点击【下一步】'
        ]
      }
    }
  }
</script>

<style lang="less" scoped>
  .operationGuide-wrapper {
    position: absolute;
    top: 150px;
    left: calc(50% - 285px - 58px);
    z-index: 2;
    width: 693px;
    height: 570px;
    background-color: rgba(28, 36, 47, 1);
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 36px;
      line-height: 36px;
      background-color: rgba(28, 36, 47, 1);
      padding: 0px 20px;
      box-sizing: border-box;
      box-shadow: 0px 1px 4px 0px rgba(20, 26, 34, 1);
      font-size: 14px;
      font-weight: 400;
      color: rgba(229, 199, 138, 1);
      img {
        width: 12px;
        height: 12px;
        cursor: pointer;
      }
    }
    section {
      box-sizing: border-box;
      padding: 0px 30px 30px;
      height: 534px;
      overflow-y: scroll;
      .stepText {
        margin: 20px 0px;
        display: inline-block;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        line-height: 20px;
      }
    }
  }
</style>
