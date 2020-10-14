<template>
  <div class="editName farm-dialog">
    <div class="container">
      <p class="title">
        <span>{{ title }}</span>
        <img src="@/icons/shutDialogIcon.png" alt="" class="shutImg" @click="cancelFun">
      </p>
      <div class="content">
        <input type="text"
               class="farm-input"
               @input="nameVerif(true)"
               @blur="nameVerif(false)"
               @focus="status === false ? status = null : null"
               :placeholder="placeHolder"
               v-model="name">
        <span class="warn" v-show="status === false">请输入2-18位字符，支持数字、字母、汉字、下划线、特殊字符</span>
        <!--按钮-->
        <div class="btn-group">
          <div class="farm-btn cancel" @click="cancelFun"><span>取消</span></div>
          <div :class="[{'error': !status},'farm-btn','save']" @click="enterFun"><span>确定</span></div>
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
        name: null,
        status: null,
        reg: /^.{2,18}$/
      }
    },
    methods: {
      nameVerif(type) {
        if (!this.name.trim()) this.status = null
        else if (this.reg.test(this.name.trim())) this.status = true
        else type ? this.status = null : this.status = false
      },
      // 确定
      async enterFun() {
        if (!this.status) return false
        let data = await editBasicInfo({
          "nickname": this.name,
          "headImg": null,
          "sex": null,
          "birthday": null,
        })
        if (data.data.code == 200) {
          this.$store.commit('changeName', this.name)
          messageFun('success', this.$t('message.editSuc'))
        } else if (data.data.code == 999) messageFun('warning', this.$t('message.noTimes'))
        this.cancelFun()
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
      position: relative;
      padding: 0px 30px;
      height: 140px;

      .warn {
        position: absolute;
        width: 100%;
        top: 50px;
        left: 30px;
        color: rgba(255, 62, 77, 1);
        font-size: 12px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        line-height: 18px;
      }

      .btn-group {
        position: absolute;
        bottom: 30px;
        right: 30px;

        .error {
          cursor: no-drop;
          background-color: rgba(255, 255, 255, 1);
          border: 1px solid rgba(22, 29, 37, 0.19);

          span {
            color: rgba(22, 29, 37, 0.39);
          }
        }
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
