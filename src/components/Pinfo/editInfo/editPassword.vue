<template>
  <div class="editPassword farm-dialog">
    <div class="container">
      <p class="title">
        <span>{{ title }}</span>
        <img src="@/icons/shutDialogIcon.png" alt="" class="shutImg" @click="cancelFun">
      </p>
      <!--编辑-->
      <div class="content" v-show="editing">
        <!--手机号-->
        <div class="farm-item">
          <div class="phone">
            <span>{{ String(user.phone).substr(0, 3) + '****' + String(user.phone).substr(7,4) }}</span>
          </div>
        </div>
        <!--验证码-->
        <div class="farm-item">
          <input type="text"
                 class="farm-input code"
                 :class="[{'error': status.code === false}]"
                 v-model="codeVal"
                 :placeholder="codePlaceholder"
                 @blur="verifCode"
                 @focus="status.code = null">
          <div class="getCode" :class="[{'cannotBe': !canBeTrigger}]">
            <span class="getSpan" @click="getCode" v-show="canBeTrigger">{{ codeLabel }}</span>
            <span class="countdown" v-show="!canBeTrigger">{{ countdown }}{{ unit }}</span>
          </div>
          <span class="errorInfo" v-show="status.code === false">{{ codeTypeErr }}</span>
        </div>
        <!--新密码-->
        <div class="farm-item">
          <input type="password"
                 ref="passWordVal"
                 class="farm-input"
                 v-model="passWordVal"
                 :placeholder="passWordPlaceholder"
                 @blur="verifPS"
                 @focus="status.ps = null">
          <span class="errorInfo" v-show="status.ps === false">{{ psTypeErr }}</span>
          <img src="@/icons/login-success.png" class="i"
               v-show="status.ps == true">
          <img src="@/icons/login-error .png" class="i canClick"
               v-show="status.ps == false"
               @click="deleteInput('passWordVal')">
        </div>
        <!--再次输入-->
        <div class="farm-item">
          <input type="password"
                 ref="passWordAgainVal"
                 class="farm-input"
                 v-model="passWordAgainVal"
                 :placeholder="passWordAgainPlaceholder"
                 @blur="verifPSA"
                 @focus="status.psa = null">
          <span class="errorInfo" v-show="status.psa === false">{{ psaTypeErr }}</span>
          <img src="@/icons/login-success.png" class="i"
               v-show="status.psa == true">
          <img src="@/icons/login-error .png" class="i canClick"
               v-show="status.psa == false"
               @click="deleteInput('passWordAgainVal')">
        </div>
        <div class="x">
          <div class="farm-btn cancel" @click="cancelFun">
            <span>{{ btnCancel }}</span>
          </div>
          <div class="farm-btn save" @click="saveFun">
            <span>{{ btnSave }}</span>
          </div>
        </div>
      </div>
      <!--修改成功-->
      <div class="success" v-show="!editing">
        <img src="@/icons/smail.png" alt="">
        <h5 class="tit">{{ successTit }}</h5>
        <span class="dire">{{ time }}{{ unit }}{{ dire }}</span>
        <div class="btnn" @click="cancelFun"><span>{{ btnn }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getCodeFromPS,
    editPassWord
  } from '@/api/editInfo-api.js'
  import {
    messageFun
  } from "@/assets/common.js"
  import {mapState} from 'vuex'

  export default {
    name: 'editPassword',
    data() {
      return {
        title: '更换密码',
        passWordVal: '',
        passWordPlaceholder: '新密码',
        passWordAgainVal: '',
        passWordAgainPlaceholder: '再次确认密码',
        codeVal: '',
        codePlaceholder: '验证码',
        codeLabel: '获取验证码',
        btnSave: '确定',
        btnCancel: '取消',
        editing: true,
        successTit: '更换密码成功',
        time: 3,
        unit: 's',
        dire: ' 后自动返回“个人资料”',
        btnn: '完成',
        codeTypeErr: '',
        psTypeErr: '',
        psaTypeErr: '',
        countdown: 60,         // 验证码倒计时
        canBeTrigger: true,    // 验证码按钮可触发
        setTimeoutF: null,     // 3秒倒计时函数
        setTimeoutF2: null,    // 60秒倒计时函数
        status: {
          code: null,
          ps: null,
          psa: null
        }
      }
    },
    computed: {
      ...mapState(['user'])
    },
    watch: {},
    methods: {
      // 取消 - 关闭
      cancelFun() {
        this.editing = true
        if (this.setTimeoutF) {
          clearTimeout(this.setTimeoutF)
          this.setTimeoutF = null
          this.time = 3
        }
        if (this.setTimeoutF2) {
          clearTimeout(this.setTimeoutF2)
          this.setTimeoutF2 = null
          this.canBeTrigger = true
          this.countdown = 60
        }
        this.reset()
        this.$emit('cancel')
      },
      // 确定修改btn
      async saveFun() {
        if (!this.status.code || !this.status.ps || !this.status.psa) return false
        let data = await editPassWord({
          password: this.passWordVal,
          code: this.codeVal
        })
        if (data.data.code == 999) {
          messageFun('error', '未知错误')
        } else if (data.data.code == 4043) {
          messageFun('error', '验证码已过期')
        } else if (data.data.code == 200) {
          this.reset()
          messageFun('success', '修改成功')
          this.editing = false
          this.sucLoading()
        }
      },
      // 修改成功后3秒
      sucLoading() {
        this.setTimeoutF = setTimeout(() => {
          this.time--
          if (!this.time) {
            this.cancelFun()
          } else this.sucLoading()
        }, 1000)
      },
      // 复位
      reset() {
        this.status = {
          code: null,
          ps: null,
          psa: null
        }
        this.passWordVal = ''
        this.passWordAgainVal = ''
        this.codeVal = ''
      },
      // 获取验证码
      async getCode() {
        let data = await getCodeFromPS()
        if (data.data.code == 200) {
          messageFun('success', '验证码已发送，请注意查收')
          this.canBeTrigger = false
          this.codeCountdown()
        }
      },
      // 获取验证码后60s倒计时
      codeCountdown() {
        this.setTimeoutF2 = setTimeout(() => {
          this.countdown--
          if (this.countdown) this.codeCountdown()
          else {
            this.canBeTrigger = true
            this.countdown = 60
          }
        }, 1000)
      },
      // 验证验证码格式
      verifCode() {
        // 为空
        if (!this.codeVal) {
          this.status.code = null
          return false
        }
        if (/^\d{6}$/.test(this.codeVal)) {
          this.status.code = true
        } else {
          this.codeTypeErr = '验证码格式错误'
          this.status.code = false
        }
      },
      // 验证第一个密码
      verifPS() {
        // 为空
        if (!this.passWordVal) {
          this.status.ps = null
          return false
        }
        if (!/^\w{8,18}$/.test(this.passWordVal)) {
          this.psTypeErr = '请输入8-18个字符'
          this.status.ps = false
          return false
        }
        if (!/^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?!^.*[\u4E00-\u9FA5].*$)/.test(this.passWordVal)) {
          this.psTypeErr = '请至少包含大小写字母、数字、特殊字符中任意2种字符'
          this.status.ps = false
          return false
        }
        this.status.ps = true
      },
      // 验证第二个密码
      verifPSA() {
        if (!this.passWordAgainVal || !this.status.ps) {
          this.status.psa = null
          return false
        }
        if (this.passWordAgainVal != this.passWordVal) {
          this.status.psa = false
          this.psaTypeErr = '两次密码输入不一致，请重新输入'
          return false
        }
        this.status.psa = true
      },
      // 检验报错删除input
      deleteInput(ee) {
        this[ee] = ''
        this.$refs[ee].focus()
      }
    }
  }
</script>

<style lang="less" scoped>
  .editPassword {
    .container {
      width: 574px;
      height: 507px;
    }

    .content {
      display: flex;
      align-items: center;
      flex-direction: column;

      .x {
        margin-top: 70px;
      }
    }

    .success {
      display: flex;
      align-items: center;
      flex-direction: column;

      img {
        margin-top: 74px;
        margin-bottom: 23px;
      }

      .tit {
        font-size: 20px;
        font-weight: 500;
        color: rgba(22, 29, 37, 0.8);
        line-height: 28px;
        letter-spacing: 2px;
        margin-bottom: 10px;
      }

      .dire {
        font-size: 12px;
        color: rgba(22, 29, 37, 0.6);
        line-height: 17px;
      }

      .btnn {
        width: 154px;
        height: 32px;
        border-radius: 8px;
        border: 1px solid rgba(39, 95, 239, 1);
        text-align: center;
        cursor: pointer;
        margin-top: 60px;
        opacity: 0.78;

        span {
          font-size: 14px;
          color: rgba(39, 95, 239, 1);
          line-height: 32px;
        }

        &:hover {
          opacity: 1;
        }
      }
    }

    .farm-item {
      position: relative;
      width: 300px;
      height: 36px;
      margin-bottom: 20px;
      display: flex;

      .phone {
        width: 100%;

        span {
          font-size: 14px;
          color: rgba(22, 29, 37, 0.6);
          line-height: 36px;
        }
      }

      .getCode {
        flex-shrink: 1;
        display: inline-block;
        width: 90px;
        height: 34px;
        border-radius: 8px;
        border: 1px solid rgba(39, 95, 239, 1);
        vertical-align: top;
        margin-left: 8px;
        text-align: center;

        &.cannotBe {
          border: 1px solid rgba(22, 29, 37, 0.3);
        }

        span {
          font-size: 14px;
          line-height: 36px;

          &.getSpan {
            color: rgba(39, 95, 239, 1);
            cursor: pointer;
          }

          &.countdown {
            color: rgba(22, 29, 37, 0.3);
          }
        }
      }

      .phone,
      .farm-input {
        border-radius: 8px;
        height: 36px;
        border: 1px solid rgba(22, 29, 37, 0.2);
        color: rgba(22, 29, 37, 0.8);
        padding-left: 20px;
        box-sizing: border-box;

        &.code {
          width: 200px;
        }

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

      .errorInfo {
        position: absolute;
        width: 300px;
        left: 0px;
        top: 36px;
        color: rgba(255, 62, 77, 0.79);
        font-size: 12px;
      }

      .i {
        position: absolute;
        right: -24px;
        top: 8px;

        &.canClick {
          cursor: pointer;
        }
      }
    }
  }
</style>
