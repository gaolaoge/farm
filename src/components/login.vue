<template>
  <div class="login-wrapper">
    <canvas ref="canvas" class="canvas" :width="screenWidth" :height="screenHeight"/>
    <img src="@/icons/login-logo.png" alt="" class="img_logo">
    <div class="vv">
      <section>
        <!--登录-->
        <aside class="logIn" v-show="navActive == 1">
          <!--登录模块-->
          <div class="loginMode" v-show="login.mode == 'login'">
            <!--登录方式导航-->
            <div class="loginNav">
            <span class="phone"
                  :class="[{'active': login.nav.activeIndex == 1}]"
                  @click="login.nav.activeIndex = 1">
              {{ $t('login_page.nav_phoneText') }}
            </span>
              <span class="account"
                    :class="[{'active': login.nav.activeIndex == 2}]"
                    @click="login.nav.activeIndex = 2">
            {{ $t('login_page.nav_accountText') }}
          </span>
            </div>
            <!--短信验证登录模板-->
            <div class="phoneForm" v-show="login.nav.activeIndex == 1">
              <!--手机号-->
              <div class="b">
                <input v-model="login.phoneForm.phone"
                       autofocus
                       :placeholder="$t('login_page.SMS_verif.phone_placeholder')"
                       @blur="jk"
                       @input="jkC"
                       @focus="login.phoneForm.phoneVerif = null"
                       ref="phoneForm_phone"
                       class="farm-input"
                       :class="[{'inputError': login.phoneForm.phoneVerif === false}]"/>
                <span class="warnInfo" v-show="login.phoneForm.phoneVerif === false">{{ login.warnInfo.phone }}</span>
                <img src="@/icons/login-success.png" class="i"
                     v-show="login.phoneForm.phoneVerif === true">
                <img src="@/icons/login-error .png" class="i canClick"
                     v-show="login.phoneForm.phoneVerif === false"
                     @click="loginDeleteInput('phoneForm','phone')">
              </div>
              <!--验证码-->
              <div class="b">
                <input v-model="login.phoneForm.code"
                       :placeholder="$t('login_page.SMS_verif.code_placeholder')"
                       ref="phoneForm_code"
                       type="text"
                       @blur="phoneCodeVerif"
                       @focus="login.phoneForm.codeVerif = null"
                       class="farm-input"
                       :class="[{'inputError': login.phoneForm.codeVerif === false}]"/>
                <!--获取验证码-->
                <div class="verif">
                  <div class="btn"
                       :class="[{'suc': login.phoneForm.phoneVerif}]"
                       @click="verifPhone"
                       v-show="login.phoneForm.verifShow">
                    {{ login.phoneForm.btnText }}
                  </div>
                  <span class="delayDate" v-show="!login.phoneForm.verifShow">{{ login.phoneForm.countdown }}</span>
                </div>
                <span class="warnInfo" v-show="login.phoneForm.codeVerif === false">{{ login.warnInfo.code }}</span>
                <img src="@/icons/login-success.png" class="i"
                     v-show="login.phoneForm.codeVerif === true">
                <img src="@/icons/login-error .png" class="i canClick"
                     v-show="login.phoneForm.codeVerif === false"
                     @click="loginDeleteInput('phoneForm','code')">
              </div>
              <!--5天内自动登录-->
              <el-switch v-model="login.phoneForm.autoLogin"
                         active-color="RGBA(27, 83, 244, 1)"
                         inactive-color="rgba(230, 230, 230, 1)"/>
              <span class="switchLabel">
              {{ $t('login_page.SMS_verif.auto_login') }}
            </span>
              <!--登录按钮-->
              <div class="btnLogin" :class="[{'canBeClick': login.phoneForm.phoneVerif && login.phoneForm.codeVerif}]"
                   @click="phoneLoginFun">
                <span>{{ $t('login_page.loginText') }}</span>
              </div>
            </div>
            <!--帐号密码登录模板-->
            <div class="accountForm" v-show="login.nav.activeIndex == 2">
              <input type="password" style="display: none"/>
              <!--帐号-->
              <div class="b">
                <input v-model="login.accountForm.account"
                       :placeholder="$t('login_page.account_verif.ac_placeholder')"
                       ref="accountForm_account"
                       @blur="accouVerif('login')"
                       @focus="login.formStatus.account = null"
                       class="farm-input"
                       :class="[{'inputError': login.formStatus.account === false}]"/>
                <span class="warnInfo" v-show="login.formStatus.account === false">{{ login.warnInfo.account }}</span>
                <img src="@/icons/login-success.png" class="i"
                     v-show="login.formStatus.account === true">
                <img src="@/icons/login-error .png" class="i canClick"
                     v-show="login.formStatus.account === false"
                     @click="loginDeleteInput('accountForm','account')">
              </div>
              <!--密码-->
              <div class="b">
                <input v-model="login.accountForm.password"
                       ref="accountForm_password"
                       :placeholder="$t('login_page.account_verif.ps_placeholder')"
                       @keyup.enter="accountloginFun"
                       @focus="login.formStatus.password = null"
                       @blur="passwVerif('login')"
                       autocomplete="new-password"
                       type="password"
                       class="farm-input"/>
                <div class="swicthPWI">
                  <img src="@/icons/openPW.png" alt="" v-show="login.accountForm.passwordEye"
                       @click="login.accountForm.passwordEye = false">
                  <img src="@/icons/shuPW.png" alt="" v-show="!login.accountForm.passwordEye"
                       @click="login.accountForm.passwordEye = true">
                </div>
                <span class="warnInfo" v-show="login.formStatus.password === false">{{ login.warnInfo.password }}</span>
                <img src="@/icons/login-error .png" class="i canClick"
                     v-show="login.formStatus.password === false"
                     @click="loginDeleteInput('accountForm','password')">
              </div>
              <!--5天内自动登录-->
              <el-switch
                v-model="login.accountForm.isAutoLogin">
              </el-switch>
              <span class="switchLabel">{{ $t('login_page.account_verif.auto_login') }}</span>
              <!--忘记密码-->
              <span class="w">
                <span @click="login.mode = 'findBack'">{{ $t('login_page.account_verif.forgetPw') }}</span>
                |
                <span @click="navActive = 2">{{ $t('login_page.account_verif.register') }}</span>
              </span>
              <!--登录按钮-->
              <div class="btnLogin" :class="[{'canBeClick': login.formStatus.account && login.formStatus.password}]"
                   @click="accountloginFun">
                <span>{{ $t('login_page.loginText') }}</span>
              </div>
            </div>
          </div>
          <!--找回密码模块-->
          <div class="findBack" v-show="login.mode == 'findBack'">
            <!--返回登陆btn-->
            <div class="loginNav">
              <span class="forgetPW active">{{ $t('login_page.forgetMode.tit') }}</span>
            </div>
            <!--验证身份-->
            <div class="f" v-show="login.forgetMode.step == 'one'">
              <!--手机号-->
              <div class="b">
                <input v-model="login.forgetMode.phone"
                       autofocus
                       :placeholder="$t('login_page.forgetMode.phone_placeholder')"
                       @blur="findBackPhoneVerif"
                       @focus="login.forgetMode.phoneFormat = null"
                       ref="forgetMode_phone"
                       class="farm-input"
                       :class="[{'inputError': login.forgetMode.phoneFormat === false}]"/>
                <span class="warnInfo" v-show="login.forgetMode.phoneFormat === false">{{ login.forgetMode.warnInfo.phone }}</span>
                <img src="@/icons/login-success.png" class="i"
                     v-show="login.forgetMode.phoneFormat === true">
                <img src="@/icons/login-error .png" class="i canClick"
                     v-show="login.forgetMode.phoneFormat === false"
                     @click="loginDeleteInput('forgetMode','phone')">
              </div>
              <!--验证码-->
              <div class="b">
                <input v-model="login.forgetMode.code"
                       :placeholder="$t('login_page.forgetMode.code_placeholder')"
                       ref="forgetMode_code"
                       @blur="findBackCodeVerif"
                       @focus="login.forgetMode.codeFormat = null"
                       class="farm-input"
                       :class="[{'inputError': login.forgetMode.codeFormat === false}]"/>
                <span class="warnInfo" v-show="login.forgetMode.codeFormat === false">{{ login.forgetMode.warnInfo.code }}</span>
                <img src="@/icons/login-success.png" class="i"
                     v-show="login.forgetMode.codeFormat === true">
                <img src="@/icons/login-error .png" class="i canClick"
                     v-show="login.forgetMode.codeFormat === false"
                     @click="loginDeleteInput('forgetMode','code')">
                <!--验证-->
                <div class="verif">
                  <div class="btn"
                       @click="findBackGetCode"
                       v-show="login.forgetMode.verifShow">
                    {{ login.forgetMode.btnText }}
                  </div>
                  <span class="delayDate" v-show="!login.forgetMode.verifShow">
                  {{ login.forgetMode.countdown }}
                </span>
                </div>
              </div>
              <!--按钮-->
              <div class="btnLogin"
                   :class="[{'canBeClick': login.forgetMode.codeFormat && login.forgetMode.phoneFormat}]"
                   @click="verificationCode">
                <span>{{ $t('login_page.forgetMode.confirm') }}</span>
              </div>
            </div>
            <!--新密码-->
            <div class="n" v-show="login.forgetMode.step == 'two'">
              <!--新密码-->
              <div class="kj">
                <input v-model="login.forgetMode.newPassWord"
                       @blur="psFormat"
                       @focus="login.formStatus.newPassWord = null"
                       type="password"
                       ref="forgetMode_newPassWord"
                       :placeholder="$t('login_page.forgetMode.ps_new')"
                       class="farm-input"/>
                <!--查看密码-->
                <div class="swicthPWI">
                  <img src="@/icons/openPW.png" alt="" v-show="login.forgetMode.passwordEye"
                       @click="login.forgetMode.passwordEye = false">
                  <img src="@/icons/shuPW.png" alt="" v-show="!login.forgetMode.passwordEye"
                       @click="login.forgetMode.passwordEye = true">
                </div>
                <span class="warnInfo" v-show="login.formStatus.newPassWord === false">
                  {{ login.forgetMode.warnInfo.newPassWord }}
                </span>
                <img src="@/icons/login-success.png" class="i"
                     v-show="login.formStatus.newPassWord === true">
                <img src="@/icons/login-error .png" class="i canClick"
                     v-show="login.formStatus.newPassWord === false"
                     @click="loginDeleteInput('forgetMode','newPassWord')">
              </div>
              <!--再次输入新密码-->
              <div class="kj">
                <input v-model="login.forgetMode.newPassWordAgain"
                       @blur="npsFormat"
                       @focus="login.formStatus.newPassWordAgain = null"
                       type="password"
                       ref="forgetMode_newPassWordAgain"
                       :placeholder="$t('login_page.forgetMode.ps_again')"
                       class="farm-input"/>
                <!--查看密码-->
                <div class="swicthPWI">
                  <img src="@/icons/openPW.png" alt="" v-show="login.forgetMode.passwordEyeAgain"
                       @click="login.forgetMode.passwordEyeAgain = false">
                  <img src="@/icons/shuPW.png" alt="" v-show="!login.forgetMode.passwordEyeAgain"
                       @click="login.forgetMode.passwordEyeAgain = true">
                </div>
                <span class="warnInfo" v-show="login.formStatus.newPassWordAgain === false">
                  {{ login.forgetMode.warnInfo.newPassWordAgain }}
                </span>
                <img src="@/icons/login-success.png" class="i"
                     v-show="login.formStatus.newPassWordAgain === true">
                <img src="@/icons/login-error .png" class="i canClick"
                     v-show="login.formStatus.newPassWordAgain === false"
                     @click="loginDeleteInput('forgetMode','newPassWordAgain')">
              </div>
              <!--按钮-->
              <div class="btnLogin"
                   :class="[{'canBeClick': login.formStatus.newPassWord && login.formStatus.newPassWordAgain}]"
                   @click="c">
                <span>{{ $t('login_page.forgetMode.btnAgain') }}</span>
              </div>
            </div>
            <div class="operateBtn">
              <!--返回登录-->
              <div class="returnToLogin" @click="login.mode = 'login'">{{ $t('login_page.forgetMode.toLogin') }}</div>
              <!--返回注册-->
              <div class="returnToLogin" @click="toRegisterF">{{ $t('login_page.forgetMode.toRegister') }}
              </div>
            </div>
          </div>
        </aside>
        <!--注册-->
        <aside class="registered" v-show="navActive == 2">
          <div class="registeredForm">
            <!--返回登录-->
            <div class="rl">
              <span>{{ $t('login_page.register.rl1') }}</span>
              <span @click="navActive = 1">{{ $t('login_page.register.rl2') }}</span>
            </div>
            <!--帐号-->
            <div class="u">
              <input v-model="registered.form.account" :placeholder="$t('login_page.register.ac_placeholder')"
                     @blur="accouVerif('register')" @focus="inputGetFocus('account')" ref="accountRegister"
                     class="farm-input"/>
              <span class="warnInfo" v-show="registered.status.account === false && !registered.status.accountInit">{{ registered.warnInfo.account }}</span>
              <img src="@/icons/login-success.png" class="i"
                   v-show="registered.status.account === true && !registered.status.accountInit">
              <img src="@/icons/login-error .png" class="i canClick"
                   v-show="registered.status.account === false && !registered.status.accountInit"
                   @click="deleteInput('account')">
            </div>
            <!--密码-->
            <div class="u">
              <input v-model="registered.form.password" type="password"
                     :placeholder="$t('login_page.register.ps_placeholder')"
                     @blur="passwVerif('register')"
                     @focus="inputGetFocus('password')"
                     ref="passwordRegister"
                     class="farm-input"/>
              <div class="swicthPWI">
                <img src="@/icons/openPW.png" alt="" v-show="registered.passwordEye" @click="changePSType(false)">
                <img src="@/icons/shuPW.png" alt="" v-show="!registered.passwordEye" @click="changePSType(true)">
              </div>
              <span class="warnInfo" v-show="registered.status.password === false && !registered.status.passwordInit">{{ registered.warnInfo.password }}</span>
              <img src="@/icons/login-success.png" class="i"
                   v-show="registered.status.password === true && !registered.status.passwordInit">
              <img src="@/icons/login-error .png" class="i canClick"
                   v-show="registered.status.password === false && !registered.status.passwordInit"
                   @click="deleteInput('password')">
            </div>
            <!--手机号-->
            <div class="u">
              <input v-model="registered.form.phone" :placeholder="$t('login_page.register.ph_placeholder')"
                     @blur="phoneVerif" @focus="inputGetFocus('phone')" ref="phoneRegister" class="farm-input"/>
              <span class="warnInfo" v-show="registered.status.phone === false && !registered.status.phoneInit">{{ registered.warnInfo.phone }}</span>
              <img src="@/icons/login-success.png" class="i"
                   v-show="registered.status.phone === true && !registered.status.phoneInit">
              <img src="@/icons/login-error .png" class="i canClick"
                   v-show="registered.status.phone === false && !registered.status.phoneInit"
                   @click="deleteInput('phone')">
            </div>
            <!--验证码-->
            <div class="v">
              <input v-model="registered.form.code"
                     :placeholder="$t('login_page.register.code_placeholder')"
                     @blur="codeVerif"
                     @focus="registered.status.code = null"
                     ref="codeRegister"
                     class="farm-input"/>
              <span class="warnInfo" v-show="registered.status.code === false">{{ registered.warnInfo.code }}</span>
              <img src="@/icons/login-success.png" class="i" v-show="registered.status.code === true">
              <img src="@/icons/login-error .png" class="i canClick" v-show="registered.status.code === false"
                   @click="deleteInput('code')">
              <div class="verif">
                <div class="btn"
                     :class="[{'canClick': registered.status.phone}]"
                     @click="den"
                     v-show="registered.verifShow">
                  {{ registered.btnText }}
                </div>
                <span class="delayDate" v-show="!registered.verifShow">
              {{ registered.countdown }}
            </span>
              </div>
            </div>
            <!--拖动验证-->
            <!--<div class="drag" ref="drag">-->
            <!--<div class="bg" ref="bg" />-->
            <!--<div class="text" onselectstart="return false;" ref="text">-->
            <!--按住滑块，拖动到最右边-->
            <!--</div>-->
            <!--<div class="btn" ref="btn" />-->
            <!--</div>-->
            <div class="c">
              <label>{{ $t('login_page.register.type') }}：</label>
              <el-radio-group v-model="registered.form.zone" class="radio">
                <el-radio :label=1>{{ $t('login_page.register.typeRadio')[0] }}</el-radio>
                <el-radio :label=2>{{ $t('login_page.register.typeRadio')[1] }}</el-radio>
              </el-radio-group>

            </div>
            <!--协议-->
            <div class="v">
              <div class="protocol">
                <img src="@/icons/df.png" alt="" class="protocolIcon" v-show="!registered.tick"
                     @click="registered.tick = true">
                <img src="@/icons/dfg.png" alt="" class="protocolIcon" v-show="registered.tick"
                     @click="registered.tick = false">
                <span class="r">{{ $t('login_page.register.text1') }}</span>
                <span class="protocolLetter" @click="showPDF">{{ $t('login_page.register.text2') }}</span>
              </div>
              <span class="warnInfo" v-show="registered.status.tick === false && registered.tick === false">
                {{ registered.warnInfo.tick }}
              </span>
            </div>
            <!--注册btn-->
            <div class="btnLogin"
                 :class="[{'canClick': this.registered.status.account && this.registered.status.password && this.registered.status.phone && this.registered.status.code }]"
                 @click="registerFun">
              <span>{{ $t('login_page.register.label') }}</span>
            </div>
          </div>
        </aside>
      </section>
      <div class="promptList">
        <span class="prompt" :class="[{show: registered.status.accountInit}]">{{ $t('login_page.register.prompt.account') }}</span>
        <span class="prompt" :class="[{show: registered.status.passwordInit}]">{{ $t('login_page.register.prompt.password') }}</span>
      </div>
    </div>
    <!--备案-->
    <div class="record_">
      <span>{{ $t('login_page.record.text1') }}</span>
      <span>{{ $t('login_page.record.text2') }}</span>
    </div>
  </div>

</template>

<script>
  import {
    register,
    registerAccount,
    registerPhone,
    accountLogin,
    phoneVerifFun,
    phoneLogin,
    getInfo,
    registerTelephone,
    getPhoneVeriFG,
    getVeriVal,
    editPS,
    getProtocal
  } from '@/api/api'
  import {
    messageFun,
    exportDownloadFun,
    setInfo
  } from '@/assets/common.js'
  import {clearUserCookie} from "../assets/common";

  export default {
    name: 'login',
    data() {
      return {
        navActive: 1,
        login: {
          mode: 'login',
          nav: {
            activeIndex: '1'
          },
          phoneForm: {
            phone: '',
            code: '',
            autoLogin: true,
            v: false,
            verifShow: true,
            countdown: '60s',
            intervalFun: null,
            phoneVerif: null,
            codeVerif: null,
            btnText: this.$t('login_page.getCode')
          },
          accountForm: {
            account: 'gaoge1834',
            password: 'gaoge1834',
//            account: '',
//            password: '',
            isAutoLogin: true,
            passwordEye: false
          },
          formStatus: {
            account: null,
            password: null,
            phone: null,
            code: null,
            accountInit: false,
            newPassWord: null,
            newPassWordAgain: null,
          },
          forgetMode: {
            phone: '',
            code: '',
            verifShow: true,
            countdown: '60s',
            newPassWord: '',
            newPassWordAgain: '',
            passwordEye: false,
            passwordEyeAgain: false,
            step: 'one',
            phoneFormat: null,
            codeFormat: null,
            intervalFun: null,
            codeObtained: false,               // 已获取验证码
            btnText: this.$t('login_page.getCode'),
            warnInfo: {
              phone: '',
              newPassWord: '',
              newPassWordAgain: ''
            }
          },
          warnInfo: {
            code: this.$t('login_page.message.codeTypeErr_two'),
            phone: '',
            account: '',
            password: this.$t('login_page.message.ps_err')
          }
        },
        registered: {
          tick: false,
          countdown: '60s',
          verifShow: true,
          intervalFun: null,
          passwordEye: false,
          warnInfo: {
            account: '',
            password: '',
            phone: '',
            tick: '',
            code: this.$t('login_page.register.warnInfo.code')
          },
          clickEye: false,                   // 刚刚点击了密码展示状态切换
          form: {
            account: '',
            password: '',
            phone: '',
            code: '',
            zone: 1
          },
          status: {                 // 输入文本是否通过正则 && 是否获得焦点
            account: null,
            password: null,
            phone: null,
            code: null,
            tick: null,
            accountInit: false,
            passwordInit: false,
            phoneInit: false
          },
          codeObtained: false,               // 已获取验证码
          btnText: this.$t('login_page.getCode')
        },
        // sliderVerification: false         // 注册滑块验证
        reg: {
          phoneReg: /^1(3|4|5|6|7|8|9)\d{9}$/,
          codeReg: /^\d{6}$/,
          passwordReg1: /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?!^.*[\u4E00-\u9FA5].*$)/,
          passwordReg2: /^[\w\W]{8,18}$/
        },
        pdf: null,
        screenWidth: '',
        screenHeight: ''
      }
    },
    mounted() {
      this.$store.commit('changeLogin', true)

      this.screenWidth = document.body.clientWidth
      this.screenHeight = document.body.clientHeight

      setTimeout(() => this.setCanvas(), 10)

      window.addEventListener('resize', () => {
        this.screenWidth = document.body.clientWidth
        this.screenHeight = document.body.clientHeight
        setTimeout(() => this.setCanvas(), 0)
      })

      if (this.login.accountForm.account) this.accouVerif('login')
      if (this.login.accountForm.password) this.passwVerif('login')

      this.login.nav.activeIndex = localStorage.getItem('loginPageIndex') || '1'
      // if(this.login.accountForm.password) this.

      // //一、定义一个获取DOM元素的方法
      // let box = this.$refs.drag,//容器
      //     bg = this.$refs.bg,//背景
      //     text = this.$refs.text,//文字
      //     btn = this.$refs.btn,//滑块
      //     success = false,//是否通过验证的标志
      //     distance = box.offsetWidth - btn.offsetWidth,//滑动成功的宽度（距离）
      //     self = this
      //
      // //二、给滑块注册鼠标按下事件
      // btn.onmousedown = function(e){
      //
      //   //1.鼠标按下之前必须清除掉后面设置的过渡属性
      //   btn.style.transition = "";
      //   bg.style.transition ="";
      //
      //   //说明：clientX 事件属性会返回当事件被触发时，鼠标指针向对于浏览器页面(或客户区)的水平坐标。
      //
      //   //2.当滑块位于初始位置时，得到鼠标按下时的水平位置
      //   var e = e || window.event;
      //   var downX = e.clientX;
      //
      //   //三、给文档注册鼠标移动事件
      //   document.onmousemove = function(e){
      //
      //     var e = e || window.event;
      //     //1.获取鼠标移动后的水平位置
      //     var moveX = e.clientX;
      //
      //     //2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
      //     var offsetX = moveX - downX;
      //
      //     //3.在这里判断一下：鼠标水平移动的距离 与 滑动成功的距离 之间的关系
      //     if( offsetX > distance){
      //       offsetX = distance;//如果滑过了终点，就将它停留在终点位置
      //     }else if( offsetX < 0){
      //       offsetX = 0;//如果滑到了起点的左侧，就将它重置为起点位置
      //     }
      //
      //     //4.根据鼠标移动的距离来动态设置滑块的偏移量和背景颜色的宽度
      //     btn.style.left = offsetX + "px";
      //     bg.style.width = offsetX + 10 + "px";
      //
      //     //如果鼠标的水平移动距离 = 滑动成功的宽度
      //     if( offsetX == distance){
      //
      //       //1.设置滑动成功后的样式
      //       text.innerHTML = "验证通过";
      //       text.style.color = "#fff";
      //       btn.innerHTML = "&radic;";
      //       btn.style.color = "green";
      //       bg.style.backgroundColor = "#0f46a1";
      //
      //       //2.设置滑动成功后的状态
      //       success = true;
      //       //成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
      //       btn.onmousedown = null;
      //       document.onmousemove = null;
      //
      //       //3.成功解锁后的回调函数
      //       self.sliderVerification = true
      //     }
      //   }

      //   //四、给文档注册鼠标松开事件
      //   document.onmouseup = function(e){
      //
      //     //如果鼠标松开时，滑到了终点，则验证通过
      //     if(success){
      //       return;
      //     }else{
      //       //反之，则将滑块复位（设置了1s的属性过渡效果）
      //       btn.style.left = 0;
      //       bg.style.width = '10px';
      //       btn.style.transition = "left 1s ease";
      //       bg.style.transition = "width 1s ease";
      //     }
      //     //只要鼠标松开了，说明此时不需要拖动滑块了，那么就清除鼠标移动和松开事件。
      //     document.onmousemove = null;
      //     document.onmouseup = null;
      //   }
      // }

    },
    methods: {
      // 找回密码 - 退回到注册
      toRegisterF() {
        this.login.mode = 'login'
        this.navActive = 2
      },
      // 创建画布
      setCanvas() {
        let canvas = document.getElementsByClassName('canvas')[0]
        if (!canvas.getContext) return
        let ctx = canvas.getContext('2d')

        ctx.beginPath()
        let bgi = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight / 2)
        bgi.addColorStop(1, 'rgba(162, 203, 255, 1)')
        bgi.addColorStop(0, 'rgba(0, 75, 206, 1)')
        ctx.fillStyle = bgi
        ctx.moveTo(0, 0)
        ctx.lineTo(this.screenWidth, 0)
        ctx.lineTo(this.screenWidth, this.screenHeight / 3)
        ctx.lineTo(0, this.screenHeight / 2)
        ctx.closePath()
        ctx.fill()
      },
      // 注册 - 帐号格式验证
      async accouVerif(obj) {
        let rfa, rs, w
        if (obj == 'register') {
          rfa = this.registered.form.account
          rs = this.registered.status
          w = this.registered.warnInfo
        } else if (obj == 'login') {
          rfa = this.login.accountForm.account
          rs = this.login.formStatus
          w = this.login.warnInfo
        }
        rs.accountInit = false
        // 为空
        if (!rfa) {
          rs.account = null;
          return false
        }
        // 验证帐号长度
        if (!/^[\w\W]{8,14}$/.test(rfa)) {
          w.account = this.$t('login_page.message.ac_verif_one')
          rs.account = false
          return false
        }
        // 验证帐号格式
        let reg = /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![_]+$)(?![\u4E00-\u9FA5]+$)/,
          reg2 = /^[\u4E00-\u9FA5\w]+$/
        if (!reg.test(rfa) || !reg2.test(rfa)) {
          w.account = this.$t('login_page.message.ac_verif_two')
          rs.account = false
          return false
        }
        // 验证帐号是否可用
        let data = await registerAccount(rfa)
        if (data.data.code == 4031) {
          // 账号未被注册
          if (obj == 'register') rs.account = true
          else {
            rs.account = false
            w.account = this.$t('login_page.message.ac_verif_four')
          }
        } else {
          // 账号已被注册
          if (obj == 'login') rs.account = true
          else {
            rs.account = false
            w.account = this.$t('login_page.message.ac_verif_three')
          }
        }
      },
      passwVerif(type) {
        // type == 'login' 登录 : 'register' 注册
        let t = type == 'register' ? this.registered.form.password : this.login.accountForm.password,
          s = type == 'register' ? this.registered.status : this.login.formStatus,
          i = type == 'register' ? this.registered.warnInfo : this.login.warnInfo
        s.passwordInit = false
        // 若密码值为空，不显示校验结果icon提示
        if (!t) {
          s.password = null
          return false
        }
        // 验证密码长度
        if (!this.reg.passwordReg2.test(t)) {
          i.password = this.$t('login_page.message.ps_verif_two')
          s.password = false
          return false
        }
        // 验证密码复杂度
        if (!this.reg.passwordReg1.test(t)) {
          i.password = this.$t('login_page.message.ps_verif_one')
          s.password = false
          return false
        }
        // 密码正确
        s.password = true
      },
      // 注册-切换密码显示状态
      changePSType(boolean) {
        this.registered.clickEye = true
        this.registered.passwordEye = boolean
        let inp = this.$refs['passwordRegister'],
          len = this.registered.form.password.length
        inp.focus()
      },
      // 注册-手机号码验证
      async phoneVerif() {
        let r = this.registered
        r.status.phoneInit = false
        if (!r.form.phone) {
          r.status.phone = null;
          return false
        }
        if (!this.reg.phoneReg.test(r.form.phone)) {
          this.registered.warnInfo.phone = this.$t('login_page.message.phoneTypeErr_one')
          r.status.phone = false
          return false
        }
        let data = await registerPhone(r.form.phone)
        //code:200   手机号已存在
        //code:4031  手机号未注册
        if (data.data.code == 4031) {
          r.status.phone = true
        } else {
          this.registered.warnInfo.phone = this.$t('login_page.message.phoneTypeErr_two');
          r.status.phone = false
        }
      },
      // 注册-获取验证码
      den() {
        let r = this.registered
        if (!r.status.phone) return false
        this.delayFun('registered')
        registerTelephone(r.form.phone)
        r.codeObtained = true
      },
      // 注册-验证验证码
      codeVerif() {
        let r = this.registered
        // 若未填写验证码 不做校验
        if (!r.form.code) {
          r.status.code = null
          return false
        }
        // 校验
        if (/^\d{6}$/.test(r.form.code)) r.status.code = true
        else {
          // '请正确输入验证码'
          this.registered.warnInfo.code = this.$t('login_page.message.codeTypeErr_two')
          r.status.code = false
        }
      },
      // 注册 input获得焦点后
      inputGetFocus(item) {
        this.registered.status[item + 'Init'] = true
        this.registered.warnInfo[item] = ''
      },
      // 注册 点击errIcon
      deleteInput(item) {
        this.registered.form[item] = ''
        this.$refs[item + 'Register'].focus()
        this.inputGetFocus(item)
      },
      // 注册
      async registerFun() {
        // if(!this.sliderVerification) return false
        let rf = this.registered.form,
          rs = this.registered.status
        if (!rs.account || !rs.password || !rs.phone || !rs.code) return false
        // 请阅读用户服务协议
        if (!this.registered.tick) {
          this.registered.warnInfo.tick = this.$t('login_page.message.tickTypeErr_one')
          rs.tick = false
          return false
        }
        // 未获取验证码
        if (!this.registered.codeObtained) {
          this.registered.warnInfo.code = this.$t('login_page.message.codeTypeErr_three')
          rs.code = false
          return false
        }
        let data = await register(rf)
        //code:101 帐号或手机号重复
        if (data.data.code == '200') {
          // 注册成功
          localStorage.setItem(rf.account, false)
          messageFun('success', this.$t('login_page.message.registerSuc'))
          setTimeout(function () {
            // 返回登录窗口
            this.navActive = 1    // 切换回登录窗口
            rf = {account: '', password: '', phone: '', code: ''}
            rs = {account: false, password: false, phone: false}
          }.bind(this), 800)
        } else if (data.data.code == '4032') messageFun('error', this.$t('login_page.message.registerCodeErr'))
        else messageFun('error', this.$t('login_page.message.registerErr'))
      },
      // 短信验证登录 - 验证手机格式
      jk() {
        let f = this.login.phoneForm
        if (!f.phone) {
          f.phoneVerif = null
          return false
        } else if (!this.reg.phoneReg.test(f.phone)) {
          this.login.warnInfo.phone = this.$t('login_page.SMS_verif.phone_warnInfo')
          f.phoneVerif = false
          return false
        }
      },
      jkC() {
        let f = this.login.phoneForm
        if (this.reg.phoneReg.test(f.phone)) f.phoneVerif = true
        else f.phoneVerif = null
      },
      // 登录 点击errIcon
      loginDeleteInput(list, item) {
        this.login[list][item] = ''
        this.$refs[list + '_' + item].focus()
        this.login.formStatus[item] = null
      },
      // 短信登录-验证验证码
      phoneCodeVerif() {
        let r = this.login.phoneForm
        // 若未填写验证码 不做校验
        if (!r.code) {
          r.codeVerif = null
          return false
        }
        // 校验
        if (/^\d{6}$/.test(r.code)) r.codeVerif = true
        else {
          // '请正确输入验证码'
          r.codeVerif = false
        }
      },
      // 帐号 登录
      async accountloginFun() {
        if (this.login.formStatus.password === false) return false
        let {account, password, isAutoLogin} = this.login.accountForm
        // 验证
        if (!account || !password) {
          messageFun('error', this.$t('login_page.message.ac_ps_null'));
          return false
        }
        try {
          let data = await accountLogin({account, password, isAutoLogin})
          if (data.data.code == '4032') {
            this.login.formStatus.password = false
            return false
          } else if (data.data.code == 200) this.loginSuc(isAutoLogin, '', account, data.data.data.token)
        } catch (err) {
          console.log('登录连接失败, ' + err)
        }
      },
      // 登录 手机号验证
      async verifPhone() {
        let f = this.login.phoneForm
        if (!f.phoneVerif) return false
        this.delayFun('login')
        let data = await phoneVerifFun(f.phone)
        if (data.data.code == 200) {
          f.v = true
          messageFun('info', this.$t('login_page.message.code_is_coming'))
        } else if (data.data.code == 10001) {
          this.login.warnInfo.phone = this.$t('login_page.message.need_to_register')
          f.phoneVerif = false
        }
      },
      // 手机号验证事件60秒延迟
      delayFun(obj) {
        let showDom
        if (obj == 'login') showDom = this.login.phoneForm
        else if (obj == 'registered') showDom = this.registered
        else if (obj == 'findBack') showDom = this.login.forgetMode
        // arguments showDom=>显示切换
        showDom.verifShow = false
        showDom.intervalFun = window.setInterval(() => {
          showDom.countdown = parseInt(showDom.countdown) - 1 + 's'
          if (showDom.countdown == '0s') {
            window.clearInterval(showDom.intervalFun)
            showDom.verifShow = true
            showDom.countdown = '60s'
            showDom.btnText = this.$t('login_page.getCodeAgain')
          }
        }, 1000)
      },
      // 短信登录 登录btn
      async phoneLoginFun() {
        let {v, phone, code, isAutoLogin, phoneVerif, codeVerif} = this.login.phoneForm
        // 若手机号或验证码未通过格式验证，直接忽略
        if (!phoneVerif || !codeVerif) return false
        // 检验是否已发送验证短信
        if (!v) {
          this.login.warnInfo.code = this.$t('login_page.message.no_sms')
          this.login.phoneForm.codeVerif = false
          return false
        }
        try {
          // 判断验证码是否正确
          let data = await phoneLogin({phone, code, isAutoLogin})
          if (data.data.code == 4032) {
            messageFun('error', this.$t('login_page.message.code_err'));
            return false
          } else if (data.data.code == 200) this.loginSuc(isAutoLogin, phone, data.data.data.account, data.data.data.token)
        } catch (err) {
          console.log('登录连接失败, ' + err)
        }
      },
      // 登录成功
      loginSuc(isAutoLogin, phone, account, token) {
        messageFun('success', this.$t('login_page.message.login_suc'))
        this.autoLogin(isAutoLogin, phone, account, token)
        sessionStorage.setItem('token', token)
        localStorage.setItem('loginPageIndex', this.login.nav.activeIndex)
        this.getUserInfo()
      },
      // 找回密码 验证手机号格式是否有效
      findBackPhoneVerif() {
        let f = this.login.forgetMode
        if (!f.phone) return false
        if (!this.reg.phoneReg.test(f.phone)) {
          f.warnInfo.phone = this.$t('login_page.message.phoneTypeErr_one')
          f.phoneFormat = false
          return false
        }
        f.phoneFormat = true
      },
      // 找回密码 验证验证码格式
      findBackCodeVerif() {
        let f = this.login.forgetMode
        // 若手机号格式不正确或验证码未空，不进行验证
        if (!f.phoneFormat || !f.code) return false
        // 验证码格式不正确
        if (!this.reg.codeReg.test(f.code)) {
          f.warnInfo.code = this.$t('login_page.message.codeTypeErr_two')
          f.codeFormat = false
          return false
        }
        f.codeFormat = true
      },
      // 找回密码 获取验证码
      async findBackGetCode() {
        let f = this.login.forgetMode
        if (!f.phoneFormat) return false
        let data = await getPhoneVeriFG(f.phone)
        if (data.data.code == '4031') {
          f.warnInfo.phone = this.$t('login_page.message.phoneTypeErr_four')
          f.phoneFormat = false
        } else {
          // 验证码已发送
          f.codeObtained = true
        }
        this.delayFun('findBack')
      },
      // 找回密码 确定btn 验证验证码是否为真
      async verificationCode() {
        let f = this.login.forgetMode
        // 若手机号或验证码未填写 不向下操作
        if (!f.phoneFormat || !f.codeFormat) return false
        // 若没获取验证码 报错
        if (!f.codeObtained) {
          f.warnInfo.code = this.$t('login_page.message.codeTypeErr_three')
          f.codeFormat = false
          return false
        }
        let data = await getVeriVal(`phone=${f.phone}&code=${f.code}`)
        if (data.data.code == 4034) {
          f.warnInfo.code = this.$t('login_page.message.code_err_two')
          f.codeFormat = false
          return false
        } else if (data.data.code == 200) {
          f.step = 'two'
        } else messageFun('error', this.$t('login_page.message.verifErr'))
      },
      // 找回密码 验证新密码
      psFormat() {
        let t = this.login.forgetMode,
          f = this.login.formStatus
        if (!this.reg.passwordReg1.test(t.newPassWord) || !this.reg.passwordReg2.test(t.newPassWord)) {
          t.warnInfo.newPassWord = this.$t('login_page.message.psTypeErr_one')
          f.newPassWord = false
          return false
        }
        f.newPassWord = true
        this.npsFormat()
      },
      // 找回密码 验证第二次输入新密码
      npsFormat() {
        let t = this.login.forgetMode,
          f = this.login.formStatus
        // 若一或二次输入框未输入 不做验证
        if (!t.newPassWord || !t.newPassWordAgain) return false
        if (t.newPassWord !== t.newPassWordAgain) {
          t.warnInfo.newPassWordAgain = this.$t('login_page.message.psTypeErr_two')
          f.newPassWordAgain = false
          return false
        }
        f.newPassWordAgain = true
      },
      // 找回密码 验证密码
      async c() {
        let t = this.login.formStatus,
          f = this.login.forgetMode
        if (!t.newPassWord || !t.newPassWordAgain) return false
        let data = await editPS({
          phone: f.phone,
          code: f.code,
          password: f.newPassWord,
          repeatPassword: f.newPassWordAgain
        })
        if (data.data.code == 200) {
          messageFun('success', this.$t('login_page.message.edit_suc'))
          setTimeout(() => {
            this.login.mode = 'login'
            window.clearInterval(this.login.forgetMode.intervalFun)
            this.login.forgetMode = Object.assign(this.login.forgetMode, {
              phone: '',
              code: '',
              newPassWord: '',
              newPassWordAgain: '',
              verifShow: true,
              countdown: '60s',
              passwordEye: false,
              passwordEyeAgain: false,
              step: 'one',
              phoneFormat: false,
              codeFormat: false,
              newPassWordFormat: false,
              newPassWordAgainFormat: false,
            })
          }, 1000)
        }

      },
      // 获取个人信息
      async getUserInfo() {
        let data = await getInfo()
        if (data.data.code != 200) return false
        setInfo(data.data.data)
        this.$store.commit('changeLogin', false)                         // 打开导航
        this.$router.push('/')
      },
      // 用户服务协议
      async showPDF() {
        let data = await getProtocal()
        exportDownloadFun(data, '《用户服务协议》', 'pdf', true)
      },
      // 5天自动登录
      autoLogin(boolean, phone, account, token) {
        // 勾选
        if (boolean) {
          document.cookie = `token=${token};max-age=432000`
          if (phone) document.cookie = `phone=${phone};max-age=432000`
          if (account) document.cookie = `account=${account};max-age=432000`
          return false
          // 未勾选
        } else clearUserCookie(phone, account, sessionStorage.getItem('token'))
      },
    },
    watch: {
      'login.accountForm.passwordEye': function (val) {
        if (val) {
          this.$refs.accountForm_password.type = "text"
        } else {
          this.$refs.accountForm_password.type = 'password'
        }
      },
      'login.forgetMode.passwordEye': function (val) {
        if (val) {
          this.$refs.forgetMode_newPassWord.type = "text"
        } else {
          this.$refs.forgetMode_newPassWord.type = 'password'
        }
      },
      'login.forgetMode.passwordEyeAgain': function (val) {
        if (val) {
          this.$refs.forgetMode_newPassWordAgain.type = "text"
        } else {
          this.$refs.forgetMode_newPassWordAgain.type = 'password'
        }
      },
      'registered.passwordEye': function (val) {
        if (val) {
          this.$refs.passwordRegister.type = "text"
        } else {
          this.$refs.passwordRegister.type = 'password'
        }
      },
    },
    created() {
      sessionStorage.setItem('info', JSON.stringify({
        account: '',
        phone: '',
        level: '',
        balance: ''
      }))
    }
  }
</script>

<style lang="less" scoped>
  .login-wrapper {
    position: relative;

    .img_logo {
      position: absolute;
      top: -40px;
      left: calc(50% - 40px);
      width: 80px;
      z-index: 9;
    }

    .vv {
      position: relative;
      width: 480px;
      height: 533px;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 40px 0px rgba(22, 29, 37, 0.15);
      border-radius: 12px;
      display: flex;
      flex-wrap: nowrap;
      overflow: hidden;
      user-select: none;

      section {
        flex-shrink: 0;
        width: 960px;
        height: 100%;
        display: flex;
        flex-wrap: nowrap;
        margin-left: 0px;
        transition: all 0.2s;

        .logIn {
          flex-shrink: 0;
          width: 480px;
          padding: 105px 80px 60px;
          box-sizing: border-box;

          .loginNav {
            margin-bottom: 60px;
            display: flex;
            justify-content: space-around;

            .phone,
            .account,
            .forgetPW {
              font-size: 18px;
              color: rgba(22, 29, 37, 0.5);
              cursor: pointer;
              text-shadow: 0px 0px 4px rgba(256, 256, 256, 0.2);

              &.active {
                color: rgba(27, 83, 244, 1);
              }
            }
          }

          .phoneForm,
          .accountForm {
            position: relative;

            .switchLabel {
              font-size: 12px;
              color: rgba(22, 29, 37, 1);
              vertical-align: middle;
              margin-left: 8px;
            }

            .swicthPWI {
              position: absolute;
              top: 0px;
              right: 10px;
              height: 40px;
              display: flex;
              align-items: center;
              cursor: pointer;
            }

            .w {
              float: right;
              font-size: 12px;
              color: rgba(22, 29, 37, 1);
              line-height: 22px;
              cursor: pointer;
            }

            .verif {
              right: 10px;
              height: 40px;

              .btn.suc {
                cursor: pointer;

                &:hover {
                  color: rgba(22, 29, 37, 0.6);
                }
              }
            }
          }
        }

        .operateBtn {
          margin-top: 60px;
          display: flex;
          justify-content: center;

          .returnToLogin {
            color: rgba(27, 83, 244, 1);
            font-size: 12px;
            cursor: pointer;
            line-height: 1em;

            &:nth-of-type(1) {
              padding-right: 9px;
              border-right: 1px solid rgba(22, 29, 37, 0.29);
            }

            &:nth-of-type(2) {
              padding-left: 9px;
            }
          }
        }

        .b {
          position: relative;

          .i {
            position: absolute;
            width: 14px;
            right: -20px;
            top: 14px;
            cursor: pointer;
          }
        }

        .farm-input {
          margin-bottom: 30px;
        }

        .warnInfo {
          user-select: none;
          position: absolute;
          left: 0px;
          bottom: 9px;
          font-size: 11px;
          color: rgba(255, 62, 77, 0.79);
          line-height: 16px;
          width: 400px;
        }
      }

      .registered {
        flex-shrink: 0;
        width: 480px;
        padding: 60px 80px;
        box-sizing: border-box;

        .label {
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.2);
          margin-bottom: 30px;
        }

        .farm-input {
          margin-bottom: 30px;
          height: 36px !important;
        }

        .c {
          margin-bottom: 20px;

          label {
            font-size: 14px;
            color: rgba(22, 29, 37, 0.4);
          }

          .radio {
            vertical-align: super;
            margin-left: 30px;

            /deep/ .el-radio .el-radio__label {
              font-size: 14px;
            }
          }
        }

        .registeredForm {
          .u,
          .v {
            position: relative;

            .swicthPWI {
              position: absolute;
              top: 0px;
              right: 10px;
              height: 36px;
              cursor: pointer;
              display: flex;
              align-items: center;
            }

            .warnInfo {
              user-select: none;
              position: absolute;
              left: 0px;
              bottom: 9px;
              font-size: 11px;
              color: rgba(255, 62, 77, 0.79);
              line-height: 16px;
              width: 400px;
            }

            .i {
              position: absolute;
              width: 14px;
              right: -20px;
              top: 10px;

              &.canClick {
                cursor: pointer;
              }
            }
          }

          .rl {
            position: relative;
            text-align: right;
            margin-bottom: 10px;
            z-index: 1;

            span {
              font-size: 12px;

              &:nth-of-type(1) {
                color: rgba(22, 29, 37, 1);
              }

              &:nth-of-type(2) {
                color: rgba(27, 83, 244, 1);
                cursor: pointer;
              }
            }
          }
        }

        .protocol {
          position: relative;
          padding-bottom: 28px;
          font-size: 12px;

          .protocolIcon {
            vertical-align: sub;
            cursor: pointer;
          }

          .r {
            color: rgba(22, 29, 37, 1);
          }

          .protocolLetter {
            color: rgba(22, 113, 255, 0.8);
            cursor: pointer;

            &:hover {
              color: rgba(22, 113, 255, 1)
            }
          }
        }

        /*注册模块-btn*/

        .btnLogin {
          margin-top: 0px;
          width: 320px;
          height: 36px;
          background-color: rgba(240, 240, 240, 1);
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 1;
          cursor: not-allowed;

          span {
            user-select: none;
            font-size: 16px;
            color: rgba(22, 29, 37, 0.39);
          }

          &.canClick {
            cursor: pointer;
            background-color: RGBA(14, 71, 161, 1);

            span {
              color: rgba(255, 255, 255, 1);
            }
          }
        }

        /*滑动条*/

        .drag {
          width: 343px;
          height: 20px;
          position: relative;
          background-color: rgba(255, 255, 255, 0.1711);
          border-radius: 8px;
          margin-bottom: 18px;
          margin-left: 10px;
          /*已划过部分*/

          .bg {
            width: 10px;
            height: 20px;
            position: absolute;
            background-color: #0f46a1;
            border-radius: 8px 0px 0px 8px;
          }

          /*文本*/

          .text {
            position: absolute;
            width: 100%;
            height: 100%;
            text-align: center;
            user-select: none;
            font-size: 12px;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.79);
            line-height: 20px;
          }

          /*拖动按钮*/

          .btn {
            position: absolute;
            top: -3px;
            cursor: move;
            text-align: center;
            user-select: none;
            border-radius: 50%;
            width: 26px;
            height: 26px;
            background-color: rgba(255, 255, 255, 1);
          }
        }
      }

    }

    .promptList {
      position: fixed;
      top: 0px;
      left: calc(50% + 246px);
      top: calc(50% - 218px);

      .prompt {
        display: block;
        width: 400px;
        margin-bottom: 32px;
        border-radius: 4px;
        padding: 10px;
        font-size: 12px;
        line-height: 1.2;
        min-width: 10px;
        background: #303133;
        color: rgba(255, 255, 255, 1);
        opacity: 0;

        &.show {
          opacity: 1;
        }
      }
    }
  }

  /deep/ .el-switch__core {
    background-color: RGBA(29, 52, 94, 1);
    border: 1px solid RGBA(29, 52, 94, 1);
  }

  .verif {
    position: absolute;
    right: 10px;
    top: 0px;
    height: 36px;
    display: flex;
    align-items: center;

    .btn {
      font-size: 14px;
      font-weight: 500;
      color: rgba(22, 29, 37, 0.4);

      &.canClick {
        color: rgba(22, 29, 37, 0.8);
        cursor: pointer;
      }
    }

    .delayDate {
      font-size: 14px;
      text-align: center;
      color: rgba(22, 29, 37, 0.8);

    }
  }

  .f {
    position: relative;

    .verif {
      top: 0px;
      right: 10px;
      height: 40px;
      cursor: pointer;
    }
  }

  .btnLogin {
    margin-top: 54px;
    width: 320px;
    height: 36px;
    background-color: rgba(240, 240, 240, 1);
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      font-size: 16px;
      color: rgba(22, 29, 37, 0.39);
    }

    &.canBeClick {
      cursor: pointer;
      background-color: rgba(22, 113, 255, 0.8);

      span {
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  .kj {
    position: relative;

    .swicthPWI {
      position: absolute;
      right: 10px;
      top: 0px;
      cursor: pointer;
      height: 40px;
      display: flex;
      align-items: center;
    }

    .i {
      position: absolute;
      top: 14px;
      right: -20px;
      display: flex;
      align-items: center;
      width: 14px;
      cursor: pointer;
    }

  }

  .inputError {
    color: #f40 !important;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #0f46a1 inset;
    border-bottom: 1px solid RGBA(33, 86, 168, 1) !important;
    -webkit-text-fill-color: #fff;
    caret-color: #fff;
    color: #fff !important;
  }

  .farm-input {
    border: 1px solid rgba(22, 29, 37, 0.2);
    border-radius: 6px;
    padding-left: 20px;
    color: rgba(22, 29, 37, 1);
    box-sizing: border-box;

    &::-webkit-input-placeholder {
      color: rgba(22, 29, 37, 0.4);
    }
  }

  .record_ {
    position: absolute;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      font-size: 12px;
      color: rgba(22, 29, 37, 0.4);
      line-height: 22px;
    }
  }

  .canvas {
    position: fixed;
    z-index: 0;
    top: 0px;
    left: 0px;

  }

  .findBack {
    .loginNav .forgetPW {
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(22, 29, 37, 1) !important;
    }

    .btnLogin {
      margin-top: 0px;
    }
  }

</style>
