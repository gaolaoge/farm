<template>
  <div class="Navbar-wrapper">
    <svg height="100%" width="130" class="svg">
      <defs>
        <radialGradient id="gg" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" style="stop-color:rgba(27,83,244,0.05)"></stop>
          <stop offset="100%" style="stop-color:rgba(27,83,244,0.01)"></stop>
        </radialGradient>
        <filter id="f3" x="-110%" y="-110%" width="400%" height="400%">
          <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0"></feOffset>
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10"></feGaussianBlur>
          <feBlend in="SourceGraphic" in2="blurOut" mode="multiply"></feBlend>
        </filter>
      </defs>
      <path :d="d" stroke="url(#gg)" stroke-width="5" fill="rgba(255,255,255,1)"/>
    </svg>
    <img src="@/icons/logo2.png" alt="" class="mainLogo" @click="$router.push('/')">
    <div class="navList">
      <ul>
        <li v-for="(item,index) in navList"
            :key="index"
            class="navLink"
            :class="[
              {'active': index == navActive},
            ]"
            @click="jump(index,item.link)">
          <div class="ib">
            <img :src="item.iconUrl" alt="" class="selectIcon">
            <img :src="item.iconsUrlDefault" alt="" class="defaultIcon">
          </div>
          <span class="text">
            {{ item.text }}
          </span>
        </li>
      </ul>
    </div>
    <div class="addTask" @click="createTask">
      <img src="@/icons/addIcon-Whit.png" alt="" class="addTaskIcon">
    </div>
    <div class="systemList">
      <ul>
        <li v-for="(item,index) in systemList"
            :key="index"
            class="systemLink"
            :class="[
              {'active': index + 4 == navActive},
            ]"
            @click="jump(index + 4,item.link)">
          <div class="ib">
            <img :src="item.iconUrl" alt="" class="selectIcon">
            <img :src="item.iconsUrlDefault" alt="" class="defaultIcon">
          </div>
          <span class="text">
            {{ item.text }}
          </span>
        </li>
      </ul>
    </div>
    <!--弹窗 新建任务-->
    <el-dialog :visible.sync="createTaskDialog"
               :show-close=false
               :destroy-on-close=true
               top="8vh"
               @opened="r()"
               width="862px">
      <newTask @closeDialogFun="closeDialogFun" ref="dialog"/>
    </el-dialog>
  </div>
</template>

<script>
  import newTask from '@/components/home/new-task'

  export default {
    name: 'Navbar',
    data() {
      return {
        navList: [
          {
            link: '/',
            iconUrl: require('@/icons/console-icon-home-h.png'),
            iconsUrlDefault: require('@/icons/console-icon-home.png'),
            text: this.$t('navbar')[0]
          },
          {
            link: '/task',
            iconUrl: require('@/icons/console-icon-task-h.png'),
            iconsUrlDefault: require('@/icons/console-icon-task.png'),
            text: this.$t('navbar')[1]
          },
          {
            link: '/assets',
            iconUrl: require('@/icons/console-icon-assets-h.png'),
            iconsUrlDefault: require('@/icons/console-icon-assets.png'),
            text: this.$t('navbar')[2]
          },
          {
            link: '/bill',
            iconUrl: require('@/icons/console-icon-bill-h.png'),
            iconsUrlDefault: require('@/icons/console-icon-bill.png'),
            text: this.$t('navbar')[3]
          }
        ],
        systemList: [
          {
            link: '/statisticsM',
            iconUrl: require('@/icons/console-icon-statistics-h.png'),
            iconsUrlDefault: require('@/icons/console-icon-statistics.png'),
            text: this.$t('navbar')[4],
            align: 'bottom'
          },
          {
            link: '/setting',
            iconUrl: require('@/icons/console-icon-set-h.png'),
            iconsUrlDefault: require('@/icons/console-icon-set.png'),
            text: this.$t('navbar')[5],
            align: 'bottom'
          }
        ],
        navActive: 0,
        createTaskDialog: false,
        d: null
      }
    },
    components: {
      newTask
    },
    methods: {
      r() {
        this.$refs.dialog.readyToWork()
      },
      jump(index, url) {
        this.navActive = index
        this.$router.push(url)
      },
      // 新建任务
      createTask() {
        this.createTaskDialog = true
      },
      // 关闭新建任务弹窗
      closeDialogFun() {
        this.createTaskDialog = false
      },
      // 背景 svg
      createSVG() {
        this.d = `M 0 0 H 100 A 20 20 0 0 1 120 20 V 552 C 120 567 123 569 114 598 C 104 627 52 632 52 676 C 51 735 120 723 120 786 V ${document.body.clientHeight - 20} A 20 20 0 0 1 100 ${document.body.clientHeight} H 0 Z`
      }
    },
    mounted() {
      this.createSVG()
      window.addEventListener('resize', this.createSVG)
    },
    watch: {
      '$route.name': {
        handler: function (val) {
          switch (val) {
            case 'home':
              this.navActive = 0
              break
            case 'task':
              this.navActive = 1
              break
            case 'assets':
              this.navActive = 2
              break
            case 'bill':
              this.navActive = 3
              break
          }
        },
        immediate: true
      }
    }
  }
</script>

<style scoped lang="less">
  .Navbar-wrapper {
    position: relative;
    width: 120px;
    height: 100vh;
    min-height: 950px;
    border-radius: 0px 20px 20px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .svg {
      position: absolute;
      top: 0px;
      left: 0px;
    }

    img.mainLogo {
      position: relative;
      z-index: 1;
      flex-shrink: 0;
      width: 56px;
      margin-top: 30px;
      cursor: pointer;
      margin-bottom: 52px;
    }

    .navList,
    .systemList {
      .navLink,
      .systemLink {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 56px;
        list-style: none;
        margin-bottom: 23px;
        cursor: pointer;

        .ib {
          width: 44px;
          height: 44px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 12px;
          border: 1px solid rgba(22, 29, 37, 0.15);

          img {
            width: 18px;

            &.defaultIcon {

            }

            &.selectIcon {
              display: none;
            }
          }
        }

        .text {
          margin-top: 8px;
          color: rgba(22, 29, 37, 0.39);
          font-size: 14px;
        }

        &.active,
        &:hover {
          .ib {
            border: 1px solid rgba(27, 83, 244, 1);
            background-color: rgba(255, 255, 255, 1);
            box-shadow: 0px 2px 12px 0px rgba(27, 83, 244, 0.15);

            img {
              &.defaultIcon {
                display: none;
              }

              &.selectIcon {
                display: inline-block;
                box-shadow: 0px 2px 12px 0px rgba(27, 83, 244, 0.15);
              }
            }
          }

          .text {
            /*font-weight: 600;*/
            color: rgba(22, 29, 37, 1);
            text-shadow: 0px 0px 2px rgba(256, 256, 256, 0.9);
          }

          &::after {
            /*content: '';*/
            /*position: absolute;*/
            /*top: -12px;*/
            /*left: -50px;*/
            /*width: 145px;*/
            /*height: 40px;*/
            /*background-color: rgba(14, 71, 161, 1);*/
            /*border-radius:0px 20px 20px 0px;*/
          }
        }

        &.floatBottom {
          float: bottom;
        }
      }
    }

    .systemList {
      position: absolute;
      bottom: 10px;
      left: calc(50% - 26px);
    }

    .addTask {
      position: absolute;
      top: 640px;
      left: 64px;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: rgba(27, 83, 244, 1);
      box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.25);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;

    }
  }


  /deep/ .el-dialog {
    border-radius: 8px;
    overflow: hidden;

    .el-dialog__body {
      padding: 0px;
      background-color: rgba(255, 255, 255, 1);
    }
  }

</style>
