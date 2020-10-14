<template>
  <div class="editPhone farm-dialog">
    <div class="container">
      <p class="title">
        <span>{{ title }}</span>
        <img src="@/icons/shutDialogIcon.png" class="shutImg" @click="cancelFun">
      </p>
      <!--选择验证方式-->
      <div class="content" v-show="step == 'chooseVerificationMethod'">
        <ul>
          <li v-for="(item,index) in verificationList"
              :key="index"
              class="veri">
            <img :src="item.imgUrl" alt="">
            <div class="t">
              <h6>{{ item.tit }}</h6>
              <span>{{ item.direSpan }}</span>
            </div>
            <div class="btn" @click="chooseFun(item)"><span>{{ item.btn }}</span></div>
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
                 :placeholder="codePlaceHolder">
          <span class="errorInfo">{{ phoneVeri.oldPhoneCodeErrorInfo }}</span>
          <!--旧手机号获取验证码-->
          <div class="getCode">
            <!--获取验证码-->
            <span @click="oldPhoneGetCode" v-show="!phoneVeri.ing">{{ phoneVeri.btn }}</span>
            <!--倒计时-->
            <span class="countdown" v-show="phoneVeri.ing">{{ phoneVeri.countdown }}s</span>
          </div>
        </div>
        <!--验证新手机-->
        <div class="farm-item">
          <!--新手机号-->
          <input type="text"
                 class="farm-input"
                 v-model="phoneFrom.newPhone"
                 @focus="newPhoneVeri.phoneError = null"
                 @blur="verifNewPhoneForPhone(false)"
                 @input="verifNewPhoneForPhone(true)"
                 :class="[{'newPhoneError': newPhoneVeri.phoneError == false}]"
                 :placeholder="newPhoneVeri.phoneNumberLabel" ref="newPhoneInput">
          <span class="errorInfo">{{ newPhoneVeri.phoneErrorInfo }}</span>
          <img src="@/icons/login-success.png" class="i"
               v-show="newPhoneVeri.phoneError === true">
          <img src="@/icons/login-error .png" class="i canClick"
               v-show="newPhoneVeri.phoneError === false"
               @click="clearInput('newPhone')">
        </div>
        <!--新手机号验证码-->
        <div class="farm-item">
          <!--输入新手机号验证码-->
          <input type="text"
                 v-model="phoneFrom.newPhoneCode"
                 class="farm-input code"
                 @focus="newPhoneVeri.phoneCodeError = null"
                 @blur="verifNewCodeForPhone(false)"
                 @input="verifNewCodeForPhone(true)"
                 :class="[{'newPhoneCodeError': newPhoneVeri.phoneCodeError == false}]"
                 :placeholder="codePlaceHolder">
          <span class="errorInfo"
                v-show="newPhoneVeri.phoneCodeError == false">{{ newPhoneVeri.phoneCodeErrorInfo }}</span>
          <!--获取新手机号验证码-->
          <div class="getCode">
            <!--获取验证码-->
            <span @click="newPhoneGetCode('phone')"
                  v-show="!newPhoneVeri.ing"
                  :class="[{'error': !newPhoneVeri.phoneError}]">{{ newPhoneVeri.btn }}</span>
            <!--倒计时-->
            <span class="countdown" v-show="newPhoneVeri.ing">{{ newPhoneVeri.countdown }}s</span>
          </div>
        </div>
        <div class="x">
          <div class="farm-btn cancel" @click="phoneVerifToNav('chooseVerificationMethod')">
            <span>{{ btnCancel }}</span>
          </div>
          <div
            :class="[{'cannotBe': !newPhoneVeri.phoneCodeError || !newPhoneVeri.phoneError || !phoneVeri.oldPhoneCodeError}, 'farm-btn','save']"
            @click="editPhoneForPhone">
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
                 @input="verifEmailCodeForEmail(true)"
                 @blur="verifEmailCodeForEmail(false)"
                 :placeholder="emailVeri.codePlaceHolder">
          <span class="errorInfo">{{ emailVeri.emailCodeErrorInfo }}</span>
          <div class="getCode">
            <span @click="emailGetCode" v-show="!emailVeri.ing">{{ emailVeri.btn }}</span>
            <span class="countdown" v-show="emailVeri.ing">{{ emailVeri.countdown }}s</span>
          </div>
        </div>
        <!--新手机-->
        <div class="farm-item">
          <input type="text"
                 v-model="emailFrom.newPhone"
                 ref="emailNewPhoneInput"
                 @focus="emailVeri.newPhoneError = null"
                 @blur="verifNewPhoneForEmail(false)"
                 @input="verifNewPhoneForEmail(true)"
                 :class="[{'oldPhoneCodeError': emailVeri.newPhoneError == false}, 'farm-input']"
                 :placeholder="emailVeri.newPhoneNumberLabel">
          <span class="errorInfo" v-show="emailVeri.newPhoneError === false">{{ emailVeri.newPhoneErrorInfo }}</span>
          <img src="@/icons/login-success.png" class="i"
               v-show="emailVeri.newPhoneError === true">
          <img src="@/icons/login-error .png" class="i canClick"
               v-show="emailVeri.newPhoneError === false"
               @click="clearInput('email')">
        </div>
        <!--新手机验证码-->
        <div class="farm-item">
          <input type="text"
                 v-model="emailFrom.newCode"
                 @focus="emailPhoneVeri.phoneCodeError = null"
                 @blur="verifPhoneCodeForEmail(false)"
                 @input="verifPhoneCodeForEmail(true)"
                 :class="[{'newPhoneCodeError': emailPhoneVeri.phoneCodeError == false}, 'farm-input', 'code']"
                 :placeholder="codePlaceHolder">
          <span class="errorInfo"
                v-show="emailPhoneVeri.phoneCodeError == false">{{ emailPhoneVeri.phoneCodeErrorInfo }}</span>
          <!--获取新手机号验证码-->
          <div class="getCode">
            <span :class="[{'error': !emailVeri.newPhoneError}]"
                  @click="newPhoneGetCode('email')"
                  v-show="!emailPhoneVeri.ing">{{ emailPhoneVeri.btn }}</span>
            <span class="countdown" v-show="emailPhoneVeri.ing">{{ emailPhoneVeri.countdown }}s</span>
          </div>
        </div>
        <div class="x">
          <div class="farm-btn cancel" @click="phoneVerifToNav('chooseVerificationMethod')">
            <span>{{ btnCancel }}</span>
          </div>
          <div
            :class="[{'cannotBe': !emailVeri.emailCodeError || !emailVeri.newPhoneError || !emailPhoneVeri.phoneCodeError}, 'farm-btn','save']"
            @click="editPhoneForEmail">
            <span>{{ btnSave }}</span>
          </div>
        </div>
      </div>
      <!--密码验证-->
      <div class="choosePassword" v-show="step == 'choosePassword'">
        <!--验证密码-->
        <div class="farm-item">
          <input type="password"
                 v-model="psFrom.password"
                 @focus="passwordVeri.passWordError = null"
                 @blur="verifPSForPS(false)"
                 @input="verifPSForPS(true)"
                 ref="psInput"
                 :class="[{'passWordCodeError': passwordVeri.passWordError === false}, 'farm-input']"
                 :placeHolder="passwordVeri.passwordPlaceholder">
          <span class="errorInfo"
                v-show="passwordVeri.passWordError === false">{{ passwordVeri.passWordErrorInfo }}</span>
          <img src="@/icons/login-success.png" class="i"
               v-show="passwordVeri.passWordError === true">
          <img src="@/icons/login-error .png" class="i canClick"
               v-show="passwordVeri.passWordError === false"
               @click="clearInput('ps')">
        </div>
        <!--验证新手机-->
        <div class="farm-item">
          <input type="text"
                 :class="[{'passWordCodeError': passwordVeri.newPhoneError == false}, 'farm-input']"
                 :placeholder="passwordVeri.newPhoneNumberLabel"
                 v-model="psFrom.newPhone"
                 ref="psPInput"
                 @focus="passwordVeri.newPhoneError = null"
                 @blur="verifPhoneForPS(false)"
                 @input="verifPhoneForPS(true)">
          <span class="errorInfo">{{ passwordVeri.newPhoneErrorInfo }}</span>
          <img src="@/icons/login-success.png" class="i"
               v-show="passwordVeri.newPhoneError === true">
          <img src="@/icons/login-error .png" class="i canClick"
               v-show="passwordVeri.newPhoneError === false"
               @click="clearInput('psP')">
        </div>
        <!--验证码-->
        <div class="farm-item">
          <input type="text"
                 :class="[{'newPhoneCodeError': passwordVeri.newPhoneCodeError == false}, 'farm-input', 'code']"
                 v-model="psFrom.newCode"
                 @focus="passwordVeri.newPhoneCodeError = null"
                 @blur="verifPhoneCodeForPS(false)"
                 @input="verifPhoneCodeForPS(true)"
                 @keyup.enter="x"
                 :placeholder="passwordVeri.codePlaceHolder">
          <span class="errorInfo" v-show="passwordVeri.newPhoneCodeError === false">{{ passwordVeri.newPhoneCodeErrorInfo }}</span>
          <div class="getCode">
            <span :class="[{'error': !passwordVeri.newPhoneError}]" @click="newPhoneGetCode('ps')"
                  v-show="!passwordVeri.ing">{{ passwordVeri.btn }}</span>
            <span class="countdown" v-show="passwordVeri.ing">{{ passwordVeri.countdown }}s</span>
          </div>
        </div>
        <div class="x">
          <div class="farm-btn cancel" @click="phoneVerifToNav('chooseVerificationMethod')">
            <span>{{ btnCancel }}</span>
          </div>
          <div
            :class="[{'cannotBe': !passwordVeri.passWordError || !passwordVeri.newPhoneError || !passwordVeri.newPhoneCodeError}, 'farm-btn','save']"
            @click="editPhoneForPS">
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
        codePlaceHolder: '验证码',
        phoneVeri: {
          ing: false,
          countdown: 60,
          btn: '获取验证码',
          oldPhoneCodeError: null,
          oldPhoneCodeErrorInfo: null,
        },
        newPhoneVeri: {
          ing: false,
          countdown: 60,
          btn: '获取验证码',
          phoneNumberLabel: '新手机号',
          phoneCodeError: null,
          phoneError: null,
          phoneErrorInfo: null,
          phoneCodeErrorInfo: null,
        },
        emailVeri: {
          btn: '获取验证码',
          countdown: 60,
          newPhoneNumberLabel: '新手机号',
          emailCodeError: null,
          newPhoneError: null,
          emailCodeErrorInfo: null,
          newPhoneCodeErrorInfo: null,
          newPhoneErrorInfo: null,
        },
        emailPhoneVeri: {
          ing: false,
          phoneCodeError: null,
          btn: '获取验证码',
          countdown: 60,
        },
        passwordVeri: {
          btn: '获取验证码',
          ing: false,
          countdown: 60,
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
      phoneVerifToNav(step) {
        this.step = step
        this.resetFun()
      },
      // 复位
      resetFun() {
        this.phoneVeri = {
          ing: false,
          countdown: 60,
          btn: '获取验证码',
          oldPhoneCodeError: null,
          oldPhoneCodeErrorInfo: null,
        }
        this.newPhoneVeri = Object.assign(this.newPhoneVeri, {
          ing: false,
          countdown: 60,
          btn: '获取验证码',
          phoneCodeError: null,
          phoneError: null,
          phoneErrorInfo: null,
          phoneCodeErrorInfo: null,
        })
        this.phoneFrom = {
          oldPhoneCode: null,
          newPhoneCode: null,
          newPhone: null
        }
        this.emailFrom = {
          emailCode: null,
          newCode: null,
          newPhone: null
        }
        this.psFrom = {
          password: null,
          newCode: null,
          newPhone: null
        }
        this.emailVeri = Object.assign(this.emailVeri, {
          btn: '获取验证码',
          countdown: 60,
          emailCodeError: null,
          newPhoneError: null,
          emailCodeErrorInfo: null,
          newPhoneCodeErrorInfo: null,
          newPhoneErrorInfo: null,
        })
        this.emailPhoneVeri = Object.assign(this.emailPhoneVeri, {
          ing: false,
          phoneCodeError: null,
          btn: '获取验证码',
          countdown: 60,
        })
        this.passwordVeri = Object.assign(this.passwordVeri, {
          btn: '获取验证码',
          ing: false,
          countdown: 60,
          passWordError: null,
          newPhoneError: null,
          newPhoneCodeError: null,
          passWordErrorInfo: null,
          newPhoneErrorInfo: null,
          newPhoneCodeErrorInfo: null,
        })
        this.success = {
          tit: '更换手机号成功',
          dire: '3s 后自动返回“个人资料”',
          btnn: '完成'
        }
      },
      cancelFun() {
        this.step = 'chooseVerificationMethod'
        this.title = '更换手机'
        this.$emit('cancel')
        this.resetFun()
      },
      chooseFun(item) {
        if (item.f == 'chooseEmail' && !this.user.email) messageFun('info', '您的账号未绑定邮箱，无法通过邮箱验证更换手机')
        else {
          this.step = item.f
          this.title = item.tit
        }
      },
      saveFun() {
        this.step = 'success'
      },
      // 根据手机号修改 - 旧手机号获取验证码
      async oldPhoneGetCode() {
        this.phoneVeri.ing = true
        this.countdownFun('old')
        let data = await editPhoneGetOC()
        if (data.data.code == 200) messageFun('success', '验证码已发送')
      },
      // 通用 - 倒计时Fun
      countdownFun(type) {
        if (type == 'old') setTimeout(() => this.minusOneSecond(this.phoneVeri), 1000)
        else if (type == 'new') setTimeout(() => this.minusOneSecond(this.newPhoneVeri), 1000)
        else if (type == 'email') setTimeout(() => this.minusOneSecond(this.emailVeri), 1000)
        else if (type == 'emailNewPhone') setTimeout(() => this.minusOneSecond(this.emailPhoneVeri), 1000)
        else if (type == 'psNewPhone') setTimeout(() => this.minusOneSecond(this.passwordVeri), 1000)

      },
      // 通用 - 倒计时Fun 减一秒
      minusOneSecond(item) {
        item.countdown--
        if (item.countdown > 0) setTimeout(() => this.minusOneSecond(item), 1000)
        else {
          this.countdownReset(item)
          item.btn = '重新发送'
        }
      },
      // 通用 - 倒计时Fun 复位
      countdownReset(item) {
        item.ing = false
        item.countdown = 60
      },
      // 通用 - 新手机号获取验证码
      async newPhoneGetCode(type) {
        let p
        if (type == 'phone') {
          if (!this.newPhoneVeri.phoneError) return false
          p = this.phoneFrom.newPhone
          this.newPhoneVeri.ing = true
          this.countdownFun('new')
        } else if (type == 'email') {
          if (!this.emailVeri.newPhoneError) return false
          p = this.emailFrom.newPhone
          this.emailPhoneVeri.ing = true
          this.countdownFun('emailNewPhone')
        } else if (type == 'ps') {
          if (!this.passwordVeri.newPhoneError) return false
          p = this.psFrom.newPhone
          this.passwordVeri.ing = true
          this.countdownFun('psNewPhone')
        }
        let data = await editPhoneGetNC(p)
        if (data.data.code == 200) messageFun('success', '验证码已发送')
      },
      // 清空输入框
      clearInput(type) {
        if (type == 'newPhone') {
          this.phoneFrom.newPhone = ''
          this.newPhoneVeri.phoneError = null
          this.$refs.newPhoneInput.focus()
        } else if (type == 'email') {
          this.emailFrom.newPhone = ''
          this.emailVeri.newPhoneError = null
          this.$refs.emailNewPhoneInput.focus()
        } else if (type == 'ps') {
          this.psFrom.password = ''
          this.passwordVeri.passWordError = null
          this.$refs.psInput.focus()
        } else if (type == 'psP') {
          this.psFrom.newPhone = ''
          this.passwordVeri.newPhoneError = null
          this.$refs.psPInput.focus()
        }
      },
      // 根据手机号修改 - 确认修改
      async editPhoneForPhone() {
        let oc = this.phoneVeri.oldPhoneCodeError,
          nc = this.newPhoneVeri.phoneCodeError,
          np = this.newPhoneVeri.phoneError
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
      verifNewCodeForPhone(ing) {
        let v = this.newPhoneVeri
        if (!this.phoneFrom.newPhoneCode) v.phoneCodeError = null
        else if (!/^\d{6}$/.test(this.phoneFrom.newPhoneCode)) {
          if (ing) v.phoneCodeError = null
          else {
            v.phoneCodeErrorInfo = '验证码格式错误'
            v.phoneCodeError = false
          }
        } else v.phoneCodeError = true
      },
      // 根据手机号修改 - 验证新手机号格式
      verifNewPhoneForPhone(ing) {
        let v = this.newPhoneVeri
        if (!this.phoneFrom.newPhone) v.phoneError = null
        else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneFrom.newPhone)) {
          if (ing) v.phoneError = null
          else {
            v.phoneErrorInfo = '手机号码格式错误'
            v.phoneError = false
          }
        } else v.phoneError = true
      },
      // 根据邮箱修改 - 验证邮箱验证码格式
      verifEmailCodeForEmail(ing) {
        let v = this.emailVeri
        if (!this.emailFrom.emailCode) v.emailCodeError = null
        else if (!/^\d{6}$/.test(this.emailFrom.emailCode)) {
          if (ing) v.emailCodeError = null
          else {
            v.emailCodeErrorInfo = '验证码格式错误'
            v.emailCodeError = false
          }
        } else v.emailCodeError = true
      },
      // 根据邮箱修改 - 验证新手机号验证码格式
      verifPhoneCodeForEmail(ing) {
        let v = this.emailPhoneVeri
        if (!this.emailFrom.newCode) v.phoneCodeError = null
        else if (!/^\d{6}$/.test(this.emailFrom.newCode)) {
          if (ing) v.phoneCodeError = null
          else {
            v.phoneCodeErrorInfo = '验证码格式错误'
            v.phoneCodeError = false
          }
        } else v.phoneCodeError = true
      },
      // 根据邮箱修改 - 验证新手机号格式
      verifNewPhoneForEmail(ing) {
        let v = this.emailVeri
        if (!this.emailFrom.newPhone) v.newPhoneError = null
        else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.emailFrom.newPhone)) {
          if (ing) v.newPhoneError = null
          else {
            v.newPhoneErrorInfo = '手机号码格式错误'
            v.newPhoneError = false
          }
        } else v.newPhoneError = true
      },
      // 根据邮箱修改 - 邮箱获取验证码
      async emailGetCode() {
        this.emailVeri.ing = true
        this.countdownFun('email')
        let data = await editPhoneGetEC()
        if (data.data.code == 200) messageFun('success', '验证码已发送')
      },
      // 根据邮箱修改 - 确认修改
      async editPhoneForEmail() {
        let ec = this.emailVeri.emailCodeError,
          np = this.emailVeri.newPhoneError,
          nc = this.emailPhoneVeri.phoneCodeError
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
      verifPSForPS(ing) {
        let v = this.passwordVeri
        if (!this.psFrom.password) v.passWordError = null
        else if (!/^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?!^.*[\u4E00-\u9FA5].*$)/.test(this.psFrom.password) || !/^[\w\W]{8,18}$/.test(this.psFrom.password)) {
          if (ing) v.passWordError = null
          else {
            v.passWordErrorInfo = '密码格式错误'
            v.passWordError = false
          }
        } else v.passWordError = true
      },
      // 根据密码修改 - 验证手机号格式
      verifPhoneForPS(ing) {
        let v = this.passwordVeri
        if (!this.psFrom.newPhone) v.newPhoneError = null
        else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.psFrom.newPhone)) {
          if (ing) v.newPhoneError = null
          else {
            v.newPhoneErrorInfo = '手机号式错误'
            v.newPhoneError = false
          }
        } else v.newPhoneError = true
      },
      // 根据密码修改 - 验证新手机号证码格式
      verifPhoneCodeForPS(ing) {
        let v = this.passwordVeri
        if (!this.psFrom.newCode) v.newPhoneCodeError = null
        else if (!/^\d{6}$/.test(this.psFrom.newCode)) {
          if (ing) v.newPhoneCodeError = null
          else {
            v.newPhoneCodeErrorInfo = '验证码格式错误'
            v.newPhoneCodeError = false
          }
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
            border: 1px solid rgba(10, 98, 241, 0.19);
            border-radius: 8px;
            text-align: center;
            margin-right: 30px;
            cursor: pointer;

            span {
              font-size: 14px;
              color: rgba(255, 255, 255, 1);
              line-height: 32px;
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

      .i {
        position: absolute;
        right: -20px;
        top: 10px;
        width: 14px;

        &.canClick {
          cursor: pointer;
        }
      }

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
        border: 1px solid rgba(22, 29, 37, 0.19);
        vertical-align: top;
        margin-left: 8px;
        text-align: center;

        span {
          font-size: 14px;
          color: rgba(39, 95, 239, 1);
          line-height: 34px;
          cursor: pointer;

          &.countdown {
            color: rgba(27, 83, 244, .8);
            cursor: no-drop;
          }

          &.error {
            color: rgba(22, 29, 37, 0.39);
            cursor: no-drop;
          }
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

    .save.cannotBe {
      border: 1px solid rgba(22, 29, 37, 0.19);
      background-color: rgba(255, 255, 255, 1);
      cursor: no-drop;

      span {
        color: rgba(22, 29, 37, 0.39);
      }
    }
  }
</style>
