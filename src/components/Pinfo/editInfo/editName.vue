<template>
  <div class="editName farm-dialog">
    <div class="container">
      <p class="title">
        <span>{{ title }}</span>
        <img src="@/icons/shutDialogIcon.png" alt="" class="shutImg" @click="cancelFun">
      </p>
      <div class="content">
        <input type="text" class="farm-input" :placeholder="placeHolder" v-model="name">
        <!--按钮-->
        <div class="btn-group">
          <div class="farm-btn cancel" @click="cancelFun"><span>取消</span></div>
          <div class="farm-btn save" @click="enterFun"><span>确定</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    editBasicInfo
  } from '@/api/editInfo-api.js'
  import {
    messageFun
  } from '@/assets/common.js'
  export default {
    name: 'editName',
    data() {
      return {
        title: '更改昵称',
        placeHolder: '输入新的昵称',
        name: null
      }
    },
    methods: {
      // 确定
      async enterFun() {
        if(!this.name){
          messageFun('info', '输入为空')
          return false
        }
        let data = await editBasicInfo({
            "nickname": this.name,
            "headImg": null,
            "sex": null,
            "birthday": null,
        })
        if(data.data.code == 200) {
          this.$store.commit('changeName', this.name)
          messageFun('success', this.$t('message.editSuc'))
        }else if(data.data.code == 999){
          messageFun('warning', this.$t('message.noTimes'))
        }
        this.$emit('cancel')
      },
      // 取消 && 关闭
      cancelFun() {
        this.name = null
        this.$emit('cancel')
      }
    }
  }
</script>

<style lang="less" scoped>
  .editName {
    .container {
      width: 574px;
      height: 207px;
    }

    .content {
      padding: 0px 30px;
      .btn-group {
        position: absolute;
        bottom: 30px;
        right: 30px;
      }
    }
  }

  .farm-input {
    border: 1px solid rgba(22, 29, 37, 0.2);
    border-radius: 6px;
    color: rgba(22, 29, 37, 1);
    padding-left: 20px;
    box-sizing: border-box;

    &::-webkit-input-placeholder { /* WebKit browsers */
      color: rgba(22, 29, 37, 0.4);
    }

    &::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: rgba(22, 29, 37, 0.4);
    }

    &:-ms-input-placeholder { /* Internet Explorer 10+ */
      color: rgba(22, 29, 37, 0.4);
    }

  }
</style>
