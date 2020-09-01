<template>
  <div class="header-wrapper" :class="[{'non-home': !inHome}]">
    <div class="wrapper">
      <!--公告-->
      <div class="bulletin" v-show="bulletin.length">
        <div class="c" :style="{'margin-top': bulletinIndex * -44 + 'px'}">
          <div v-for="(item,index) in bulletin" :key="index" class="k">
            <img src="@/icons/bulletin-icon.png" class="bulletin-icon">
            <span class="tit">{{ item.tit }}：</span>
            <span class="val">{{ item.detail }}</span>
          </div>
        </div>
      </div>
      <div class="oper" :class="[{'inhome': inHome}]">
        <!--选择分区-->
        <div class="workbench">
          <div class="switch"><img src="@/icons/switch-icon.png" alt=""></div>
          <el-select v-model="workBenchVal" class="workBench-optionBase">
            <el-option
              v-for="(item,index) in workBenchList"
              :key="index"
              :label="item.name"
              :value="item.val">
            </el-option>
          </el-select>
        </div>
        <div class="r">
          <!--消息-->
          <div class="messageE" :class="[{'active': showMessageList},{'isHome': inHome}]" v-operating3>
            <img src="@/icons/messageIconheaderM2.png"
                 @click="showMessageList = !showMessageList"
                 v-show="!showMessageList"
                 class="problemImg"
                 alt="">
            <img src="@/icons/messageIconheaderM-hover.png"
                 @click="showMessageList = !showMessageList"
                 v-show="showMessageList"
                 class="problemImg"
                 alt="">
            <!--下拉框-->
            <div class="messageBase" :class="[{'inHome': !inHome}]">
              <message-table v-show="showMessageList"/>
            </div>
          </div>
          <!--问号-->
          <div class="problemE" :class="[{'active': showProblemList},{'isHome': inHome}]" v-operating2>
            <img src="@/icons/problem2.png"
                 alt=""
                 class="problemImg"
                 @click="showProblemList = !showProblemList">
            <!--下拉框-->
            <div class="newsBase">
              <ul class="userOperate" v-show="showProblemList">
                <!--渲染指引-->
                <li class="operateLi" @click="guide">
                <span class="con">
                  <span class="t">
                     <span class="sb">
                       {{ problemOperateList[0]['text'] }}
                     </span>
                  </span>
                </span>
                </li>
                <!--帮助中心-->
                <li class="operateLi" @click="w">
                <span class="con">
                  <span class="t">
                     <span class="sb">
                       {{ problemOperateList[1]['text'] }}
                     </span>
                  </span>
                </span>
                </li>
              </ul>
            </div>
          </div>
          <!--头像-->
          <div class="userInfo" v-show="!inHome" :class="[{'active': showUserList}]" v-operating>
            <img :src="user.avatar"
                 alt=""
                 class="userImg">
            <!--:class="[{'show': showUserList}]"-->
            <!--下拉框-->
            <div class="newsBase" :class="[{'show': showUserList}]">
              <ul class="userOperate" v-show="showUserList">

                <!--帐号-->
                <li class="operateLi userName">
                <span class="con">
                  <span class="t">
                     <span class="sb">
                       {{ user.name }}
                     </span>
                      <img :src="userOperateList[0]['iconUrl']" alt="" class="iconUrl">
                  </span>
                </span>
                </li>
                <!--剩余金币-->
                <li class="operateLi balance" @click="$router.push('/upTop')">
                  <span class="con">
                    <span class="t">
                       <span class="sb">
                         {{ userOperateList[1]['text'] }}
                       </span>
                       <span class="balanceNow">
                         <span class="amount">
                            {{ user.balance }}
                         </span>
                       </span>
                    </span>
                  </span>
                  <div class="btnU" @click="$router.push('/upTop')">
                    <span>{{ uptop }}</span>
                  </div>
                </li>
                <!--剩余容量-->
                <li class="operateLi balance2">
                <span class="con">
                  <span class="t">
                     <span class="sb">
                       {{ userOperateList[2]['text'] }}
                     </span>
                     <span class="balanceNow">
                       <span class="amount">
                          {{ user.haveCapacity }} GB
                       </span>
                     </span>
                  </span>
                </span>
                </li>
                <!--基本信息-->
                <li class="operateLi Pinfo" @click="$router.push('/Pinfo')">
                <span class="con">
                  <span class="t">
                     <span class="sb">
                       {{ userOperateList[3]['text'] }}
                     </span>
                  </span>
                </span>
                </li>
                <!--退出-->
                <li class="operateLi quit" @click="quitFun">
                <span class="con">
                  <span class="t">
                     <span class="sb">
                       {{ userOperateList[4]['text'] }}
                     </span>
                  </span>
                </span>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>
      <!--渲染指引-->
      <div class="guide-wrapper" v-if="guideShow">
        <!--第一步-->
        <div class="guide-step step-one" v-show="guideShowStep == 1">
          <img src="@/icons/step-jump-over.png" alt="" class="jump-btn" @click="showGuide">
          <div class="step-content">
            <img src="@/assets/step-one.png" alt="" class="welcome" @click="guideShowStep = 2">
          </div>
        </div>
        <!--第二步-->
        <div class="guide-step step-two" v-show="guideShowStep == 2">
          <img src="@/icons/step-jump-over.png" alt="" class="jump-btn" @click="showGuide">
          <div class="step-content">
            <img src="@/assets/step-two.png" class="newTesk" alt="">
            <div class="step-btn">
              <img src="@/icons/step-previous.png" alt="" class="previous first">
              <img src="@/icons/step-next.png" alt="" class="next" @click="guideShowStep = 3">
            </div>
          </div>
        </div>
        <!--第三步-->
        <div class="guide-step step-three" v-show="guideShowStep == 3">
          <img src="@/icons/step-jump-over.png" alt="" class="jump-btn" @click="showGuide">
          <div class="step-content">
            <img src="@/assets/step-three.png" alt="" class="newMode">
            <div class="step-btn">
              <img src="@/icons/step-next.png" alt="" class="previous" style="transform: rotate(180deg)"
                   @click="guideShowStep = 2">
              <img src="@/icons/step-next.png" alt="" class="next" @click="guideShowStep = 4">
            </div>
          </div>
        </div>
        <!--第四步-->
        <div class="guide-step step-four" v-show="guideShowStep == 4">
          <img src="@/icons/step-jump-over.png" alt="" class="jump-btn" @click="showGuide">
          <div class="step-content">
            <img src="@/assets/step-four.png" alt="" class="set">
            <div class="step-btn">
              <img src="@/icons/step-next.png" alt="" class="previous" style="transform: rotate(180deg)"
                   @click="guideShowStep = 3">
              <img src="@/icons/step-next.png" alt="" class="next" @click="guideShowStep = 5">
            </div>
          </div>
        </div>
        <!--第五步-->
        <div class="guide-step step-five" v-show="guideShowStep == 5">
          <img src="@/icons/step-jump-over.png" alt="" class="jump-btn" @click="showGuide">
          <div class="step-content">
            <img src="@/assets/step-five.png" alt="" class="down">
            <div class="step-btn">
              <img src="@/icons/step-next.png" alt="" class="previous" style="transform: rotate(180deg)"
                   @click="guideShowStep = 4">
              <img src="@/icons/step-next.png" alt="" class="next" @click="guideShowStep = 6">
            </div>
          </div>
        </div>
        <!--第六步 补加-->
        <div class="guide-step step-additional" v-show="guideShowStep == 6">
          <img src="@/icons/step-jump-over.png" alt="" class="jump-btn" @click="showGuide">
          <div class="step-content">
            <img src="@/assets/step-six.png" alt="" class="additional">
            <div class="step-btn">
              <img src="@/icons/step-next.png" alt="" class="previous" style="transform: rotate(180deg)"
                   @click="guideShowStep = 5">
              <img src="@/icons/step-next.png" alt="" class="next" @click="guideShowStep = 7">
            </div>
          </div>
        </div>
        <!--第7步-->
        <div class="guide-step step-six" v-show="guideShowStep == 7" @click="showGuide">
          <div class="step-content">
            <img src="@/assets/six-main.png" alt="" class="main">
            <img src="@/assets/six-top-left.png" alt="" class="tl">
            <img src="@/assets/six-top-right.png" alt="" class="tr">
            <img src="@/assets/six-bottom-left.png" alt="" class="bl">
            <img src="@/assets/six-bottom-right.png" alt="" class="br">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    homeSelect,
    getInfo,
    putNewZoneID
  } from '@/api/api.js'
  import {
    identify
  } from '@/api/newTask-api'
  import {
    getBulletin
  } from '@/api/header-api'
  import {setInfo} from '@/assets/common'
  import {mapState} from 'vuex'
  import messageTable from '@/components/headerM/message-table'


  export default {
    name: 'headerM',
    data() {
      return {
        inHome: false,
        workBenchList: [
          // {
          //   name: '影视版CPU 1区',
          //   val: '影视版CPU 1区'
          // }
        ],
        workBenchVal: null,
        // showNews: false                      // 展示消息
        showUserList: false,                    // 个人信息下拉
        showProblemList: false,                 // 问题下拉
        showMessageList: false,                 // 消息下拉
        userOperateList: [
          {
            text: this.$t('header.userOLT')[0],
            moreClass: 'userName',
            iconUrl: require('@/icons/vipIcon.png')
          },
          {
            text: this.$t('header.userOLT')[1],
            moreClass: 'balance',
            routerUrl: ''
          },
          {
            text: this.$t('header.userOLT')[2],
            moreClass: 'capacity',
            routerUrl: ''
          },
          {
            text: this.$t('header.userOLT')[3],
            moreClass: 'info'
          },
          {
            text: this.$t('header.userOLT')[4],
            moreClass: 'quit'
          }
        ],
        problemOperateList: [
          {
            text: this.$t('header.problemOLT')[0]
          },
          {
            text: this.$t('header.problemOLT')[1]
          }
        ],
        guideShow: false,
        guideShowStep: 1,
        uptop: this.$t('header.uptopBtn'),
        bulletin: [],             // 公告
        bulletinRealLength: null, // 公告真实长度
        bulletinIndex: 0          // 显示的公告索引
      }
    },
    computed: {
      ...mapState(['user', 'login', 'zoneId', 'socket_backS']),
    },
    mounted() {
      this.getList()
      this.getUserInfo()
      this.getIdentify()
      this.getBulletinF()   // 获取公告
    },
    watch: {
      login: {
        handler: function (val) {
          if (val) return false
          this.getList()
          this.userOperateList[0]['text'] = JSON.parse(sessionStorage.getItem('info'))['account']
          this.userOperateList[1]['balance'] = JSON.parse(sessionStorage.getItem('info'))['balance']
          // 新手教程
          setTimeout(() => {
            if (localStorage.getItem(this.user.name) == 'false') {
              this.guide();
              localStorage.setItem(this.user.name, true)
            }
          }, 100)
        },
        // immediate: true
      },
      workBenchVal: {
        handler: function (val) {
          if (val == this.zoneId) return false
          this.$store.commit('changeZoneId', val)
          sessionStorage.setItem('zoneUuid', val)
          this.$store.commit('changeZone', this.workBenchList.find(item => item.val == val).zone)
        },
        immediate: true,
        deep: true
      },
      '$route': {
        handler: function (val) {
          if (val.name == 'home') this.inHome = true
          else this.inHome = false
        },
        immediate: true
      },
      zoneId: {
        handler: function (val) {
          if (!val || val == this.workBenchVal) return false
          putNewZoneID({"zoneUuid": val})   // 传达切换分区事件
          this.workBenchVal = val
          this.changeIsGpu()
        },
        immediate: true
      },
      'user.account': {
        handler: function (val) {
          if (!val || this.socket_backS) return false
          this.$store.commit('WEBSOCKET_PLUGIN_INIT')
          this.$store.commit('WEBSOCKET_BACKS_INIT', val)
        },
        immediate: true
      }
    },
    methods: {
      // 公告滚动
      top() {
        if(!this.bulletinRealLength) return false
        this.bulletinIndex ++
        if(this.bulletinIndex == this.bulletinRealLength) this.bulletinIndex = 0
        setTimeout(() => this.top(), 10000)
      },
      // 获取公告
      async getBulletinF() {
        let data = await getBulletin()
        if (data.data.code != 200) return false
        else {
          this.bulletin = data.data.data.map(item => {
            return {
              'tit': item.newsTitle,
              'detail': item.newsDetail
            }
          })
          this.bulletinRealLength = this.bulletin.length
          if(this.bulletinRealLength) this.bulletin.push(this.bulletin[0])
          this.top()
        }
      },
      // 跳转到帮助网站
      w() {
        window.open('http://223.80.107.190:8081', '_blank')
      },
      showGuide() {
        this.guideShow = false
        this.guideShowStep = 1
      },
      // 退出
      quitFun() {
        this.$confirm(this.$t('message.configExit'), this.$t('message.prompt'), {
          confirmButtonText: this.$t('message.config'),
          cancelButtonText: this.$t('message.cancel'),
          type: 'warning'
        })
          .then(() => {
            sessionStorage.setItem('token', '')
            this.$router.push('/login')
            this.$message({
              type: 'success',
              message: this.$t('message.sucExit')
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('message.cancelExit')
            })
          })

      },
      // 工作台 下拉框
      getList() {
        homeSelect()
          .then(data => {
            let d = data.data
            if (d.code != 200) return false
            this.workBenchList = d.data.map(curr => {
              return {
                name: curr.zoneName,
                val: curr.zoneUuid,
                isGpu: curr.isGpu,
                zone: curr.zone
              }
            })

          })
          .catch(error => console.log(`工作台下拉框获取报错，${error}`))
      },
      changeIsGpu() {
        this.$store.commit('changeIsGpu', this.workBenchList.find(curr => curr.val == this.workBenchVal).isGpu)
      },
      async getUserInfo() {
        let data = await getInfo(),
          d = data.data.data
        if (data.data.code != 200) return false
        setInfo(data.data.data)
        this.userOperateList[0]['text'] = d.account
        this.userOperateList[1]['balance'] = d.goldBalance
      },
      // 渲染指引
      guide() {
        this.guideShow = true
      },
      // 0.获取文件渲染模式
      async getIdentify() {
        let data = await identify()
        if (data.data.data == 1) this.$store.commit('changeTaskType', 'profession')   // 专业版
        else if (data.data.data == 0) this.$store.commit('changeTaskType', 'easy')    // 一键版
      },
    },
    directives: {
      operating: {
        bind(el, bindings, vnode) {
          let handler = e => {
            if (el.contains(e.target)) {
              // 点击事件触发在目标DOM内
              if (e.target.classList.contains('userImg')) vnode.context.showUserList ? vnode.context.showUserList = false : vnode.context.showUserList = true
              if (e.target.classList.contains('balance') || e.target.classList.contains('Pinfo')) vnode.context.showUserList = false
            } else {
              // 点击事件触发在目标DOM外
              // 且DOM处于显示状态
              if (vnode.context.showUserList) {
                vnode.context.showUserList = false
              }
            }
          }
          el.handler = handler
          document.addEventListener('click', handler)
        },
        unbind(el) {
          document.removeEventListener('click', el.handler)
        }
      },
      operating2: {
        bind(el, bindings, vnode) {
          let handler = e => {
            if (el.contains(e.target)) {
              // 点击事件触发在目标DOM内
            } else {
              // 点击事件触发在目标DOM外
              // 且DOM处于显示状态
              if (vnode.context.showProblemList) {
                vnode.context.showProblemList = false
              }
            }
          }
          el.handler = handler
          document.addEventListener('click', handler)
        },
        unbind(el) {
          document.removeEventListener('click', el.handler)
        }
      },
      operating3: {
        bind(el, bindings, vnode) {
          let handler = e => {
            if (el.contains(e.target)) {
              // 点击事件触发在目标DOM内
              if (e.target.classList.contains('showMeAll'))
                vnode.context.showMessageList = false
            } else {
              // 点击事件触发在目标DOM外
              // 且DOM处于显示状态
              if (vnode.context.showMessageList)
                vnode.context.showMessageList = false
            }
          }
          el.handler = handler
          document.addEventListener('click', handler)
        },
        unbind(el) {
          document.removeEventListener('click', el.handler)
        }
      }
    },
    components: {
      messageTable
    }
  }
</script>

<style scoped lang="less">
  .header-wrapper {
    position: relative;
    z-index: 10;
    height: 120px;
    width: 100%;

    .wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      padding: 0px 20px 0px 50px;
      box-sizing: border-box;
      justify-content: space-between;

      .oper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 500px;
        flex-shrink: 1;
        box-sizing: border-box;

        &.inhome {
          padding-right: 30px;
        }

        .r {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;

          .userInfo,
          .problemE,
          .messageE {
            position: relative;
            width: 44px;
            height: 44px;
            background-color: rgba(255, 255, 255, 1);
            box-shadow: 0px 2px 12px 0px rgba(27, 83, 244, 0.05);
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;

            .newsBase,
            .messageBase {
              position: absolute;
              z-index: 9;
              height: 0px;
              background-color: rgba(255, 255, 255, 1);
              box-shadow: 0px 2px 6px 0px rgba(27, 83, 244, 0.16);
              transition: height 0.2s ease-out;
            }

            .newsBase {
              width: 250px;
              right: 0px;
              border-radius: 4px;
              overflow: hidden;

              .userOperate {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-left: 0px;
                box-sizing: border-box;

                .operateLi {
                  position: relative;
                  padding-left: 20px;
                  list-style: none;
                  width: 230px;
                  text-align: left;
                  cursor: pointer;
                  line-height: 50px;
                  height: 50px;

                  &:nth-of-type(1) {
                    border-bottom: 1px solid rgba(22, 29, 37, 0.04);
                  }

                  .con {
                    .t {
                      font-size: 14px;
                      font-weight: 400;
                      color: rgba(22, 29, 37, 0.6);
                    }
                  }

                  .btnU {
                    position: absolute;
                    right: 10px;
                    top: calc(50% - 12px);
                    background-color: #0f46a1;
                    width: 32px;
                    height: 24px;
                    display: flex;
                    justify-content: center;
                    border-radius: 4px;
                    align-items: center;
                    cursor: pointer;

                    span {
                      color: #fff;
                      font-size: 10px;
                    }
                  }
                }
              }

              li:hover {
                background: rgba(0, 97, 255, 0.2);
              }
            }

            .messageBase {
              width: 476px;
              left: 0px;
              border-radius: 6px;
              overflow: hidden;
              box-shadow: 0px 2px 6px 0px rgba(27, 83, 244, 0.16);

              &.inHome {
                right: 0px;
                left: auto;
              }
            }
          }

          .userInfo {
            width: 44px;
            height: 44px;

            .userImg {
              width: 28px;
              display: block !important;
              cursor: pointer;
              border-radius: 5px;
            }

            &.active {

              .newsBase {
                height: 254px;
              }
            }
          }

          .problemE,
          .messageE,
          .userInfo {
            margin-left: 30px;

            .problemImg {
              cursor: pointer;
              user-select: none;
            }

            .newsBase,
            .messageBase {
              top: 50px;
            }

            &.active {
              .newsBase {
                height: 103px;
              }

              .messageBase {
                height: 400px;
              }
            }

            &.isHome {
              right: 0px;
            }
          }

          .userInfo.active {
            .newsBase {
              height: auto;
            }
          }

          .problem,
          .news {
            margin-right: 14px;
            cursor: pointer;
          }

          .messageE {
            &::after {
              position: absolute;
              top: 10px;
              right: 10px;
              content: '';
              width: 8px;
              height: 8px;
              background-color: rgba(255, 62, 77, 0.8);
              border-radius: 50%;
            }
          }

          .problemE {
            .newsBase {
              width: 150px;

              .operateLi {
                width: 130px !important;
              }
            }
          }
        }

        .workbench {
          position: relative;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          width: 219px;
          height: 44px;
          border-radius: 14px;
          box-sizing: border-box;
          background-color: rgba(27, 83, 244, 1);
          box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.22);

          /deep/ .el-input__inner {
            padding-left: 54px;
          }

          .switch {
            position: relative;
            left: 4px;
            width: 40px;
            height: 38px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            flex-shrink: 0;
          }
        }

        //下拉选择框
        .workBench-optionBase {
          /deep/ .el-input.el-input--suffix {
            margin-left: -40px;

            .el-input__inner {
              background-color: transparent;
              color: rgba(255, 255, 255, 0.79);
              outline: none;
              border: 0px;
              /*width: 122px;*/
              /*padding-left: 0px;*/
              /*box-sizing: content-box;*/
            }

            span.el-input__suffix {
              left: 0px;
              width: 60px;

              .el-input__suffix-inner {
                opacity: 0;
              }
            }
          }

          &.haveBorder {
            /deep/ .el-input.el-input--suffix {
              .el-input__inner {
                border: 1px solid rgba(255, 255, 255, 0.79);
                width: 240px;
                padding-left: 20px;
                border-radius: 8px;
                box-sizing: border-box;
              }

              span.el-input__suffix {
              }
            }
          }
        }
      }

      .bulletin {
        width: 1px;
        height: 44px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 20px 0px rgba(27, 83, 244, 0.05);
        border-radius: 14px;
        padding: 0px 20px;
        margin-right: 40px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        flex-shrink: 1;
        flex-grow: 1;
        flex-direction: column;
        overflow: hidden;

        .c,
        .k {
          width: 100%;
        }

        .k {
          height: 44px;
          flex-shrink: 0;
          display: flex;
          align-items: center;

          .bulletin-icon {
            margin-right: 10px;
          }

          span {
            font-size: 14px;
            line-height: 44px;
            font-family: PingFangSC-Semibold, PingFang SC;
            vertical-align: text-bottom;

            &.tit {
              font-weight: 600;
              color: rgba(22, 29, 37, 1);
            }

            &.val {
              width: calc(100% - 140px);
              color: rgba(22, 29, 37, 0.6);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }

      .guide-wrapper {
        position: fixed;
        z-index: 999;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        background-color: rgba(28, 36, 47, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;

        .guide-step {
          position: relative;
          width: 100%;
          max-width: 1920px;
          height: 100%;
          max-height: 1080px;

          img {
            user-select: none;
          }

          .step-content {
            height: 100%;
            width: 100%;
            /*border: 1px solid ;*/

            .welcome {
              display: block;
              max-width: 74%;
              margin: 160px auto;
            }

            .newTesk {
              margin: 50vh 0px 0px 0px;
            }

            .newMode {
              display: block;
              max-width: 74%;
              margin: 90px auto;
            }

            .set {
              position: absolute;
              right: 0px;
              height: 100vh;
            }

            .down {
              position: absolute;
              width: 96vw;
              right: 10px;
            }

            .additional {
              position: absolute;
              bottom: 10px;
              left: 10px;
              height: 94vh;
            }

            .step-btn {
              display: inline-block;
              vertical-align: top;

              img {
                cursor: pointer;

                &.first {
                  cursor: auto;
                }

                &:nth-of-type(1) {
                  margin-right: 30px;
                }
              }
            }
          }

          .jump-btn { // 跳过
            position: absolute;
            z-index: 2;
            top: 40px;
            right: 40px;
            cursor: pointer;
          }

          .tl {
            position: absolute;
            top: 0px;
            left: 0px;
          }

          .tr {
            position: absolute;
            top: 0px;
            right: 0px;
          }

          .bl {
            position: absolute;
            bottom: 0px;
            left: 0px;
          }

          .br {
            position: absolute;
            bottom: 0px;
            right: 0px;
          }

          .main {
            width: 100vw;
          }

          &.step-two {
            .step-btn {
              margin-top: 70vh;
              margin-left: -200px;
            }
          }

          &.step-three {
            .step-btn {
              position: absolute;
              bottom: 30vh;
              left: 50%;
            }
          }

          &.step-four {
            .step-btn {
              position: absolute;
              top: 700px;
              right: 980px;
            }
          }

          &.step-five {
            .step-btn {
              position: absolute;
              top: 550px;
              left: 550px;
            }
          }

          &.step-additional {
            .step-btn {
              position: absolute;
              top: 44vh;
              left: 44vw;
            }
          }

          &.step-six {
            cursor: pointer;
          }
        }
      }
    }

    &.non-home {
      height: 80px;
    }
  }

  @media screen and (orientation: portrait) {
    .header-wrapper {
      width: calc(100vh - 175px);
    }
  }
</style>
