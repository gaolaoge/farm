<template>
  <div class="iv">
    <div class="userInfo">
      <div class="f">
        <!--头像-->
        <div class="avatar">
          <img :src="user.avatar" alt="">
        </div>
        <!--账号&等级-->
        <div class="nl">
          <div class="name">{{ user.name }}</div>
          <div class="level"><img src="@/icons/vipIcon.png" alt="">{{ user.level }}</div>
        </div>
        <!--下拉框-->
        <div class="list" v-operating>
          <!--按钮-->
          <div class="listBtn" :class="[{'active': isShowMe}]">
            <div class="to"/>
            <div class="bo"/>
          </div>
          <!--下拉-->
          <div class="operateList" v-show="isShowMe">
            <ul>
              <li class="li" @click="operateFun(item.text)" v-for="(item,index) in operateList">
                <span>{{ item.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--金币余额-->
      <div class="s">
        <div class="balanceItem item">
          <span class="label">{{ info.balanceLabel }}：</span>
          <span class="val">{{ user.balance }}</span>
        </div>
        <div class="btn" @click="$router.push('/upTop')"><img src="@/icons/in.png" alt=""></div>
      </div>
      <!--剩余容量-->
      <div class="t">
        <div class="capacityItem item">
          <span class="label">{{ info.capacityLabel }}：</span>
          <span class="val">{{ user.haveCapacity }} GB</span>
        </div>
      </div>
      <div class="line"></div>
      <!--存储统计-->
      <div class="echarts">
        <div class="tt">
          <span class="main">{{ echartsT.main }}</span>
          <span class="mini">{{ echartsT.mini }}</span>
        </div>
        <storageCharts class="storage-charts"/>
      </div>
    </div>
    <div class="recharge">
      <img src="@/assets/recharge-home-icon.png" alt="" class="l">
      <p class="p">{{ recharge.p1 }}</p>
      <p class="p">{{ recharge.p2 }}</p>
      <div class="btn" @click="$router.push('/upTop')">{{ recharge.btn }}</div>
    </div>
  </div>
</template>

<script>
  import storageCharts from '@/components/home/storage-charts'
  import {mapState} from 'vuex'
  import {
    messageFun,
    clearUserCookie
  } from "../../assets/common"

  export default {
    name: 'iv',
    data() {
      return {
        info: {
          balanceLabel: '金币余额',
          capacityLabel: '剩余容量',
        },
        isShowMe: false,
        operateList: [
          {
            text: '基本信息'
          },
          {
            text: '退出登录'
          }
        ],
        echartsT: {
          main: '存储统计',
          mini: '/容量GB'
        },
        recharge: {
          p1: '想要更多的充值优惠么？',
          p2: '快点而点击进来查看详情吧！',
          btn: '立即充值'
        }
      }
    },
    methods: {
      // 操作
      operateFun(active) {
        switch (active) {
          case '基本信息':
            this.$router.push('/Pinfo')
            break
          case '退出登录':
            this.quitFun()
            break
        }
      },
      // 退出
      quitFun() {
        this.$confirm('确认退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            messageFun('success', '退出成功')
            this.$router.push('/login')
            sessionStorage.setItem('token', '')
            // clearUserCookie(this.user.phone, this.user.account, sessionStorage.getItem('token'))
          })
          .catch(() => messageFun('info', '已取消退出'))

      },
    },
    computed: {
      ...mapState(['user', 'login']),
    },
    directives: {
      operating: {
        bind(el, bindings, vnode) {
          let handler = e => {
            if (el.contains(e.target)) {
              // 点击事件触发在目标DOM内
              if (e.target.classList.contains('active')) vnode.context.isShowMe = false
              else vnode.context.isShowMe = true
            } else {
              // 点击事件触发在目标DOM外
              // 且DOM处于显示状态
              if (vnode.context.isShowMe) {
                vnode.context.isShowMe = false
              }
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
      storageCharts
    }
  }
</script>

<style lang="less" scoped>
  .iv {
    height: calc(100% - 48px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .userInfo {
      width: 366px;
      height: calc(100% - 340px);
      /*min-height: 670px;*/
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 4px 20px 0px rgba(27, 83, 244, 0.05);
      border-radius: 20px;
      padding: 15px 50px;
      box-sizing: border-box;
      flex-shrink: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .f {
        position: relative;
        display: flex;
        /*margin-bottom: 30px;*/

        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          border: 1px solid rgba(22, 29, 37, 0.09);
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 60px;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(22, 29, 37, 0.19);
          }
        }

        .nl {
          margin-left: 15px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .name,
          .level {
            font-size: 16px;
            font-family: NexaBold;
            color: rgba(22, 29, 37, 1);
            line-height: 19px;
            font-weight: 600;
          }

          .level {
            margin-top: 5px;
            font-weight: 400;
            color: rgba(22, 29, 37, 0.3);

            img {
              margin-right: 2px;
            }
          }
        }

        .list {
          position: absolute;
          right: 0px;
          top: 16px;

          .listBtn {
            width: 18px;
            height: 18px;
            cursor: pointer;

            .to,
            .bo {
              position: absolute;
              top: 0px;
              right: 0px;
              width: 18px;
              height: 2px;
              border-radius: 2px;
              box-shadow: 0px 0px 1px 1px rgba(27, 83, 244, 1);
              background-color: rgba(27, 83, 244, 1);
              transition: all 0.2s;
            }

            .bo {
              top: 8px;
              right: -4px;
              width: 10px;
            }

            &.active {
              .to {
                width: 10px;
              }

              .bo {
                right: 0px;
              }
            }
          }
        }

        .operateList {
          position: absolute;
          right: 0px;
          top: 20px;
          width: 107px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 2px 6px 0px rgba(27, 83, 244, 0.16);
          border-radius: 5px;
          padding: 0px 20px;
          box-sizing: border-box;

          .li {
            padding: 14px 0px;
            cursor: pointer;
            border-bottom: 1px solid rgba(22, 29, 37, 0.04);

            span {
              font-size: 14px;
              font-family: SourceHanSansCN-Regular, SourceHanSansCN;
              font-weight: 400;
              color: rgba(22, 29, 37, 0.6);
              line-height: 21px;
              width: 67px;
              display: inline-block;
              text-align: center;

              &:hover {
                font-weight: 600;
                color: rgba(22, 29, 37, 1);
              }
            }

            &:nth-last-of-type(1) {
              border-bottom: 0px;
            }
          }
        }
      }

      .s {
        /*margin-bottom: 15px;*/
      }

      .s,
      .t {
        width: 266px;
        height: 74px;
        background-color: rgba(27, 83, 244, 0.04);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item {
          margin-left: 30px;
          display: flex;
          flex-direction: column;

          .label {
            font-size: 12px;
            font-family: SourceHanSansCN-Regular, SourceHanSansCN;
            font-weight: 400;
            color: rgba(27, 83, 244, 0.79);
            line-height: 18px;
            margin-bottom: 7px;
          }

          .val {
            font-size: 18px;
            font-family: Helvetica;
            color: rgba(27, 83, 244, 1);
            line-height: 22px;
          }
        }

        .btn {
          margin-right: 30px;
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 2px 10px 0px rgba(27, 83, 244, 0.05);
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        &:hover {
          box-shadow: 0px 0px 0px 2px rgba(27, 83, 244, 1);
        }
      }

      .line {
        width: 267px;
        height: 1px;
        background-color: rgba(22, 29, 37, 0.09);
      }

      .echarts {
        position: relative;
        width: 266px;
        height: 228px;
        background-color: rgba(27, 83, 244, 0.04);
        border-radius: 10px;
        flex-shrink: 1;

        .tt {
          position: relative;
          width: 100%;
          text-align: center;

          .main {
            font-size: 20px;
            font-family: SourceHanSansCN-Regular, SourceHanSansCN;
            color: rgba(22, 29, 37, 1);
            font-weight: 700;
            line-height: 20px;
          }

          .mini {
            font-size: 12px;
            font-family: SourceHanSansCN-Regular, SourceHanSansCN;
            color: rgba(22, 29, 37, 0.59);
            line-height: 18px;
          }
        }
      }
    }

    .recharge {
      /*margin-top: 20px;*/
      position: relative;
      width: 366px;
      height: 300px;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 4px 20px 0px rgba(27, 83, 244, 0.05);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 1;

      .l {
        position: relative;
        top: -34px;
        margin-bottom: -20px;
      }

      .p {
        font-size: 14px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: rgba(22, 29, 37, 1);
        line-height: 26px;
      }

      .btn {
        margin-top: 8px;
        width: 272px;
        height: 44px;
        background-color: RGBA(26, 84, 246, 1);
        color: #fff;
        font-size: 14px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;

      }
    }
  }
</style>
