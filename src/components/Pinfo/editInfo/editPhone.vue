<template>
  <div class="editPhone farm-dialog">
    <div class="container">
      <p class="title">
        <span>{{ title }}</span>
        <img src="@/icons/shutDialogIcon.png" alt="" class="shutImg" @click="cancelFun">
      </p>
      <!--选择验证方式-->
      <div class="content" v-show="step == 'chooseVerificationMethod'">
        <ul>
          <li v-for="(item,index) in verificationList"
              :key="index"
              @click="chooseFun(item)"
              class="veri">
            <img :src="item.imgUrl" alt="">
            <div class="t">
              <h6>{{ item.tit }}</h6>
              <span>{{ item.direSpan }}</span>
            </div>
            <div class="btn"><span>{{ item.btn }}</span></div>
          </li>
        </ul>
      </div>
      <!--手机验证-->
      <div class="choosePhone" v-show="step == 'choosePhone'">
        <!--验证旧手机-->
        <div class="farm-item">
          <div class="phone"><span>{{ String(user.phone).substr(0,3) + '****' + String(user.phone).substr(7,4) }}</span>
          </div>
        </div>
        <div class="farm-item">
          <!--输入旧手机号验证码-->
          <input type="text"
                 v-model="phoneFrom.oldPhoneCode"
                 class="farm-input code"
                 @focus="phoneVeri.oldPhoneCodeError = null"
                 @blur="verifOldCodeForPhone"
                 :class="[{'oldPhoneCodeError': phoneVeri.oldPhoneCodeError == false}]"
                 :placeholder="phoneVeri.codePlaceHolder">
          <span class="errorInfo">{{ phoneVeri.oldPhoneCodeErrorInfo }}</span>
          <!--旧手机号获取验证码-->
          <div class="getCode" @click="oldPhoneGetCode"><span>{{ phoneVeri.btn }}</span></div>
        </div>
        <!--验证新手机-->
        <div class="farm-item">
          <!--新手机号-->
          <input type="text"
                 class="farm-input"
                 @focus="phoneVeri.newPhoneError = null"
                 @blur="verifNewPhoneForPhone"
                 :class="[{'newPhoneError': phoneVeri.newPhoneError == false}]"
                 v-model="phoneFrom.newPhone"
                 :placeholder="phoneVeri.newPhoneNumberLabel">
          <span class="errorInfo">{{ phoneVeri.newPhoneErrorInfo }}</span>
        </div>
        <!--新手机号验证码-->
        <div class="farm-item">
          <!--输入新手机号验证码-->
          <input type="text"
                 v-model="phoneFrom.newPhoneCode"
                 class="farm-input code"
                 @focus="phoneVeri.newPhoneCodeError = null"
                 @blur="verifNewCodeForPhone"
                 :class="[{'newPhoneCodeError': phoneVeri.newPhoneCodeError == false}]"
                 :placeholder="phoneVeri.codePlaceHolder">
          <span class="errorInfo">{{ phoneVeri.newPhoneCodeErrorInfo }}</span>
          <!--获取新手机号验证码-->
          <div class="getCode" @click="newPhoneGetCode('phone')"><span>{{ phoneVeri.btn }}</span></div>
        </div>
        <div class="x">
          <div class="farm-btn cancel" @click="step = 'chooseVerificationMethod'">
            <span>{{ btnCancel }}</span>
          </div>
          <div class="farm-btn save" @click="editPhoneForPhone">
            <span>{{ btnSave }}</span>
          </div>
        </div>
      </div>
      <!--邮箱验证-->
      <div class="chooseEmail" v-show="step == 'chooseEmail'">
        <!--验证邮箱-->
        <div class="farm-item">
          <div class="phone"><span>{{ user.email }}</span></div>
        </div>
        <div class="farm-item">
          <input type="text"
                 v-model="emailFrom.emailCode"
                 class="farm-input code"
                 :class="[{'oldPhoneCodeError': emailVeri.emailCodeError == false}]"
                 @focus="emailVeri.emailCodeError = null"
                 @blur="verifEmailCodeForEmail"
                 :placeholder="emailVeri.codePlaceHolder">
          <span class="errorInfo">{{ emailVeri.emailCodeErrorInfo }}</span>
          <div class="getCode" @click="emailGetCode"><span>{{ emailVeri.btn }}</span></div>
        </div>
        <!--验证新手机-->
        <div class="farm-item">
          <input type="text"
                 v-model="emailFrom.newPhone"
                 class="farm-input"
                 :class="[{'oldPhoneCodeError': emailVeri.newPhoneError == false}]"
                 @focus="emailVeri.newPhoneError = null"
                 @blur="verifNewPhoneForEmail"
                 :placeholder="emailVeri.newPhoneNumberLabel">
          <span class="errorInfo">{{ emailVeri.newPhoneErrorInfo }}</span>
        </div>
        <div class="farm-item">
          <input type="text"
                 v-model="emailFrom.newCode"
                 class="farm-input code"
                 :class="[{'newPhoneCodeError': emailVeri.newPhoneCodeError == false}]"
                 @focus="emailVeri.newPhoneCodeError = null"
                 @blur="verifPhoneCodeForEmail"
                 :placeholder="emailVeri.codePlaceHolder">
          <span class="errorInfo">{{ emailVeri.newPhoneCodeErrorInfo }}</span>
          <div class="getCode" @click="newPhoneGetCode('email')"><span>{{ emailVeri.btn }}</span></div>
        </div>
        <div class="x">
          <div class="farm-btn cancel" @click="step = 'chooseVerificationMethod'">
            <span>{{ btnCancel }}</span>
          </div>
          <div class="farm-btn save" @click="editPhoneForEmail">
            <span>{{ btnSave }}</span>
          </div>
        </div>
      </div>
      <!--密码验证-->
      <div class="choosePassword" v-show="step == 'choosePassword'">
        <!--验证密码-->
        <div class="farm-item">
          <input type="password"
                 class="farm-input"
                 v-model="psFrom.password"
                 @focus="passwordVeri.passWordError = null"
                 @blur="verifPSForPS"
                 :class="[{'passWordCodeError': passwordVeri.passWordError == false}]"
                 :placeHolder="passwordVeri.passwordPlaceholder">
          <span class="errorInfo">{{ passwordVeri.passWordErrorInfo }}</span>
        </div>
        <!--验证新手机-->
        <div class="farm-item">
          <input type="text"
                 class="farm-input"
                 :class="[{'passWordCodeError': passwordVeri.newPhoneError == false}]"
                 v-model="psFrom.newPhone"
                 @focus="passwordVeri.newPhoneError = null"
                 @blur="verifPhoneForPS"
                 :placeholder="passwordVeri.newPhoneNumberLabel">
          <span class="errorInfo">{{ passwordVeri.newPhoneErrorInfo }}</span>
        </div>
        <div class="farm-item">
          <input type="text"
                 class="farm-input code"
                 :class="[{'newPhoneCodeError': passwordVeri.newPhoneCodeError == false}]"
                 v-model="psFrom.newCode"
                 @focus="passwordVeri.newPhoneCodeError = null"
                 @blur="verifPhoneCodeForPS"
                 @keyup.enter="x"
                 :placeholder="passwordVeri.codePlaceHolder">
          <span class="errorInfo">{{ passwordVeri.newPhoneCodeErrorInfo }}</span>
          <div class="getCode" @click="newPhoneGetCode('ps')"><span>{{ passwordVeri.btn }}</span></div>
        </div>
        <div class="x">
          <div class="farm-btn cancel" @click="step = 'chooseVerificationMethod'">
            <span>{{ btnCancel }}</span>
          </div>
          <div class="farm-btn save" @click="editPhoneForPS">
            <span>{{ btnSave }}</span>
          </div>
        </div>
      </div>
      <!--修改成功-->
      <div class="success" v-show="step == 'success'">
        <img src="@/icons/smail.png" alt="">
        <h5 class="tit">{{ success.tit }}</h5>
        <span class="dire">{{ success.dire }}</span>
        <div class="btnn" @click="cancelFun"><span>{{ success.btnn }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    editPhoneGetOC,
    editPhoneGetNC,
    editPhoneP,
    editPhoneGetEC,
    editPhonePP,
    editPhonePS
  } from '@/api/editInfo-api'
  import {messageFun} from "../../../assets/common"
  import {
    mapState
  } from 'vuex'

  export default {
    name: 'editPhone',
    data() {
      return {
        step: 'chooseVerificationMethod',
        title: '更换手机',
        verificationList: [
          {
            imgUrl: require('@/icons/phoneIcon.png'),
            tit: '手机验证',
            direSpan: '如果您手机可以正常使用，则可通过向当前绑定手机发送验证码修改。',
            btn: '立即验证',
            f: 'choosePhone'
          },
          {
            imgUrl: require('@/icons/emailIcon.png'),
            tit: '邮箱验证',
            direSpan: '如果您账号已绑定邮箱，则可通过向绑定邮箱发送验证码修改。',
            btn: '立即验证',
            f: 'chooseEmail'
          },
          {
            imgUrl: require('@/icons/passwordIcon.png'),
            tit: '密码验证',
            direSpan: '如果您账号当前登录密码可用，则可通过验证登录密码修改。',
            btn: '立即验证',
            f: 'choosePassword'
          }
        ],
        btnCancel: '返回',
        btnSave: '确定',
        phoneVeri: {
          btn: '获取验证码',
          codePlaceHolder: '验证码',
          newPhoneNumberLabel: '新手机号',
          oldPhoneCodeError: null,
          newPhoneCodeError: null,
          newPhoneError: null,
          oldPhoneCodeErrorInfo: null,
          newPhoneCodeErrorInfo: null,
          newPhoneErrorInfo: null,
        },
        emailVeri: {
          btn: '获取验证码',
          codePlaceHolder: '验证码',
          newPhoneNumberLabel: '新手机号',
          emailCodeError: null,
          newPhoneCodeError: null,
          newPhoneError: null,
          emailCodeErrorInfo: null,
          newPhoneCodeErrorInfo: null,
          newPhoneErrorInfo: null,
        },
        passwordVeri: {
          btn: '获取验证码',
          passwordPlaceholder: '登录密码',
          codePlaceHolder: '验证码',
          newPhoneNumberLabel: '新手机号',
          passWordError: null,
          newPhoneError: null,
          newPhoneCodeError: null,
          passWordErrorInfo: null,
          newPhoneErrorInfo: null,
          newPhoneCodeErrorInfo: null,
        },
        phoneFrom: {
          oldPhoneCode: null,
          newPhoneCode: null,
          newPhone: null
        },
        emailFrom: {
          emailCode: null,
          newCode: null,
          newPhone: null
        },
        psFrom: {
          password: null,
          newCode: null,
          newPhone: null
        },
        success: {
          tit: '更换手机号成功',
          dire: '3s 后自动返回“个人资料”',
          btnn: '完成'
        }
      }
    },
    methods: {
      cancelFun() {
        this.step = 'chooseVerificationMethod'
        this.title = '更换手机'
        this.$emit('cancel')
      },
      chooseFun(item) {
        this.step = item.f
        this.title = item.tit
      },
      saveFun() {
        this.step = 'success'
      },
      // 根据手机号修改 - 旧手机号获取验证码
      async oldPhoneGetCode() {
        let data = await editPhoneGetOC()
        if (data.data.code == 200) messageFun('success', '验证码已发送')
      },
      // 通用 - 新手机号获取验证码
      async newPhoneGetCode(type) {
        let p
        if (type == 'phone') {
          if (!this.phoneVeri.newPhoneError) return false
          p = this.phoneFrom.newPhone
        } else if (type == 'email') {
          if (!this.emailVeri.newPhoneError) return false
          p = this.emailFrom.newPhone
        } else if (type == 'ps') {
          if (!this.passwordVeri.newPhoneError) return false
          p = this.psFrom.newPhone
        }
        let data = await editPhoneGetNC(p)
        if (data.data.code == 200) messageFun('success', '验证码已发送')
      },
      // 根据手机号修改 - 确认修改
      async editPhoneForPhone() {
        let {oldPhoneCodeError: oc, newPhoneCodeError: nc, newPhoneError: np} = this.phoneVeri
        if (!oc || !nc || !np) return false
        let {newPhone, oldPhoneCode, newPhoneCode} = this.phoneFrom
        let data = await editPhoneP({newPhone, oldPhoneCode, newPhoneCode})
        let d_ = data.data,
          v = this.phoneVeri
        if (d_.code == 10001) {
          // 输入的新手机号已被注册使用
          v.newPhoneErrorInfo = '手机号码已被注册'
          v.newPhoneError = false
        } else if (d_.code == 4034) {
          if (d_.data.errorCode == 1) {
            // 旧手机号验证码错误
            v.oldPhoneCodeErrorInfo = '验证码错误'
            v.oldPhoneCodeError = false
          } else if (d_.data.errorCode == 2) {
            // 新手机号验证码错误
            v.newPhoneCodeErrorInfo = '验证码错误'
            v.newPhoneCodeError = false
          }
        } else if (d_.code == 200) {
          messageFun('success', '修改成功')
          Object.assign(this.phoneVeri, {
            oldPhoneCodeError: null,
            newPhoneCodeError: null,
            newPhoneError: null,
            oldPhoneCodeErrorInfo: null,
            newPhoneCodeErrorInfo: null,
            newPhoneErrorInfo: null,
          })
          this.step = 'success'
        }
      },
      // 根据手机号修改 - 验证旧手机号验证码格式
      verifOldCodeForPhone() {
        let v = this.phoneVeri
        if (!this.phoneFrom.oldPhoneCode) {
          v.oldPhoneCodeError = null
          return false
        }
        if (!/^\d{6}$/.test(this.phoneFrom.oldPhoneCode)) {
          v.oldPhoneCodeErrorInfo = '验证码格式错误'
          v.oldPhoneCodeError = false
        } else v.oldPhoneCodeError = true
      },
      // 根据手机号修改 - 验证新手机号验证码格式
      verifNewCodeForPhone() {
        let v = this.phoneVeri
        if (!this.phoneFrom.newPhoneCode) {
          v.newPhoneCodeError = null
          return false
        }
        if (!/^\d{6}$/.test(this.phoneFrom.newPhoneCode)) {
          v.newPhoneCodeErrorInfo = '验证码格式错误'
          v.newPhoneCodeError = false
        } else v.newPhoneCodeError = true
      },
      // 根据手机号修改 - 验证新手机号格式
      verifNewPhoneForPhone() {
        let v = this.phoneVeri
        if (!this.phoneFrom.newPhone) {
          v.newPhoneError = null
          return false
        }
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneFrom.newPhone)) {
          v.newPhoneErrorInfo = '手机号码格式错误'
          v.newPhoneError = false
        } else v.newPhoneError = true
      },
      // 根据邮箱修改 - 验证邮箱验证码格式
      verifEmailCodeForEmail() {
        let v = this.emailVeri
        if (!this.emailFrom.emailCode) {
          v.emailCodeError = null
          return false
        }
        if (!/^\d{6}$/.test(this.emailFrom.emailCode)) {
          v.emailCodeErrorInfo = '验证码格式错误'
          v.emailCodeError = false
        } else v.emailCodeError = true
      },
      // 根据邮箱修改 - 验证新手机号验证码格式
      verifPhoneCodeForEmail() {
        let v = this.emailVeri
        if (!this.emailFrom.newCode) {
          v.newPhoneCodeError = null
          return false
        }
        if (!/^\d{6}$/.test(this.emailFrom.newCode)) {
          v.newPhoneCodeErrorInfo = '验证码格式错误'
          v.newPhoneCodeError = false
        } else v.newPhoneCodeError = true
      },
      // 根据邮箱修改 - 验证新手机号格式
      verifNewPhoneForEmail() {
        let v = this.emailVeri
        if (!this.emailFrom.newPhone) {
          v.newPhoneError = null
          return false
        }
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.emailFrom.newPhone)) {
          v.newPhoneErrorInfo = '手机号码格式错误'
          v.newPhoneError = false
        } else v.newPhoneError = true
      },
      // 根据邮箱修改 - 邮箱获取验证码
      async emailGetCode() {
        let data = await editPhoneGetEC()
        if (data.data.code == 200) messageFun('success', '验证码已发送')
      },
      // 根据邮箱修改 - 确认修改
      async editPhoneForEmail() {
        let {emailCodeError: ec, newPhoneCodeError: nc, newPhoneError: np} = this.emailVeri
        if (!ec || !nc || !np) return false
        let {newPhone, emailCode, newCode: newPhoneCode} = this.emailFrom
        let data = await editPhonePP({newPhone, emailCode, newPhoneCode})
        let d_ = data.data,
          v = this.emailVeri
        if (d_.code == 10001) {
          // 输入的新手机号已被注册使用
          v.newPhoneErrorInfo = '手机号码已被注册'
          v.newPhoneError = false
        } else if (d_.code == 4034) {
          if (d_.data.errorCode == 3) {
            // 邮箱验证码错误
            v.emailCodeErrorInfo = '验证码错误'
            v.emailCodeError = false
          } else if (d_.data.errorCode == 2) {
            // 新手机号验证码错误
            v.newPhoneCodeErrorInfo = '验证码错误'
            v.newPhoneCodeError = false
          }
        } else if (d_.code == 200) {
          messageFun('success', '修改成功')
          Object.assign(this.emailVeri, {
            emailCodeError: null,
            newPhoneCodeError: null,
            newPhoneError: null,
            emailCodeErrorInfo: null,
            newPhoneCodeErrorInfo: null,
            newPhoneErrorInfo: null,
          })
          this.step = 'success'
        }
      },
      // 根据密码修改 - 验证新密码格式
      verifPSForPS() {
        let v = this.passwordVeri
        if (!this.psFrom.password) {
          v.passWordError = null
          return false
        }
        if (!/^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![_]+$){8,18}/.test(this.psFrom.password)) {
          v.passWordErrorInfo = '密码格式错误'
          v.passWordError = false
        } else v.passWordError = true
      },
      // 根据密码修改 - 验证手机号格式
      verifPhoneForPS() {
        let v = this.passwordVeri
        if (!this.psFrom.newPhone) {
          v.newPhoneError = null
          return false
        }
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.psFrom.newPhone)) {
          v.newPhoneErrorInfo = '手机号式错误'
          v.newPhoneError = false
        } else v.newPhoneError = true
      },
      // 根据密码修改 - 验证新手机号证码格式
      verifPhoneCodeForPS() {
        let v = this.passwordVeri
        if (!this.psFrom.newCode) {
          v.newPhoneCodeError = null
          return false
        }
        if (!/^\d{6}$/.test(this.psFrom.newCode)) {
          v.newPhoneCodeErrorInfo = '验证码格式错误'
          v.newPhoneCodeError = false
        } else v.newPhoneCodeError = true
      },
      // 根据密码修改 - 确认修改
      async editPhoneForPS() {
        let {passWordError: pc, newPhoneCodeError: nc, newPhoneError: np} = this.passwordVeri
        if (!pc || !nc || !np) return false
        let {newPhone, password, newCode: newPhoneCode} = this.psFrom
        let data = await editPhonePS({newPhone, password, newPhoneCode})
        let d_ = data.data,
          v = this.passwordVeri
        if (d_.code == 101) {
          // 输入的新手机号已被注册使用
          v.newPhoneErrorInfo = '手机号码已被注册'
          v.newPhoneError = false
        } else if (d_.code == 4032) {
          // 密码错误
          v.newPhoneErrorInfo = '手机号码已被注册'
          v.newPhoneError = false
        } else if (d_.code == 4034) {
          // 验证码错误
          v.newPhoneCodeErrorInfo = '验证码错误'
          v.newPhoneCodeError = false
        } else if (d_.code == 200) {
          messageFun('success', '修改成功')
          Object.assign(this.emailVeri, {
            emailCodeError: null,
            newPhoneCodeError: null,
            newPhoneError: null,
            emailCodeErrorInfo: null,
            newPhoneCodeErrorInfo: null,
            newPhoneErrorInfo: null,
          })
          this.step = 'success'
        }
      },
      x() {
        this.verifPhoneCodeForPS()
        setTimeout(() => this.editPhoneForPS(), 0)
      }
    },
    computed: {
      ...mapState(['user'])
    }
  }
</script>

<style lang="less" scoped>
  .editPhone {
    .container {
      width: 638px;
      height: 432px;

      .content {
        .veri {
          height: 105px;
          display: flex;
          align-items: center;

          img {
            width: 50px;
            height: 50px;
            margin-left: 30px;
          }

          .t {
            position: relative;
            flex-grow: 1;
            margin-left: 10px;

            h6 {
              font-size: 16px;
              font-weight: 600;
              color: rgba(22, 29, 37, 0.8);
              line-height: 22px;
              margin-bottom: 5px;
            }

            span {
              font-size: 12px;
              color: rgba(22, 29, 37, 0.6);
              line-height: 17px;
            }
          }

          .btn {
            width: 76px;
            height: 32px;
            background-color: rgba(10, 98, 241, 1);
            border-radius: 8px;
            text-align: center;
            margin-right: 30px;

            span {
              font-size: 14px;
              color: rgba(255, 255, 255, 1);
              line-height: 32px;
              cursor: pointer;
            }
          }

          &:nth-of-type(1) .t::after,
          &:nth-of-type(2) .t::after {
            position: absolute;
            left: 0px;
            bottom: -30px;
            content: '';
            width: 373px;
            height: 2px;
            background-color: rgba(255, 255, 255, 0.05);
          }
        }
      }
    }

    .choosePhone,
    .chooseEmail,
    .choosePassword {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .farm-item {
      position: relative;
      width: 300px;
      height: 36px;
      margin-bottom: 20px;

      .phone {
        span {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 36px;
        }
      }

      .getCode {
        display: inline-block;
        width: 90px;
        height: 34px;
        border-radius: 8px;
        border: 1px solid rgba(39, 95, 239, 1);
        vertical-align: top;
        margin-left: 8px;
        cursor: pointer;
        text-align: center;

        span {
          font-size: 14px;
          color: rgba(39, 95, 239, 1);
          line-height: 34px;
        }
      }

      .phone,
      .farm-input {
        border-radius: 8px;
        height: 36px;
        border: 1px solid rgba(22, 29, 37, 0.2);
        padding-left: 20px;
        box-sizing: border-box;
        color: rgba(22, 29, 37, 0.8);

        span {
          color: rgba(22, 29, 37, 0.6);
        }

        &.code {
          width: 200px;
        }

        &.oldPhoneCodeError,
        &.newPhoneCodeError,
        &.passWordCodeError,
        &.newPhoneError {
          border: 1px solid rgba(255, 62, 77, 1);

          & + .errorInfo {
            position: absolute;
            top: 38px;
            left: 20px;
            font-size: 12px;
            color: rgba(255, 62, 77, 0.88);
            line-height: 17px;
          }
        }
      }
    }

    .x {
      margin-top: 50px;
    }

    .success {
      display: flex;
      align-items: center;
      flex-direction: column;

      img {
        margin-top: 43px;
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
  }
</style>
