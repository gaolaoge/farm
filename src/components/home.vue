<template>
  <div class="home-wrapper" ref="homeWrapper">
    <div class="hi">
      <span>{{hi}} {{user.name}}</span>
    </div>
    <div class="firRow">
      <!--任务状态-->
      <div class="taskStatus">
        <header class="label">{{ $t('home.taskStatus.label') }}</header>
        <div class="statusList">
          <div class="item"
               v-for="(item,index) in taskStatus.list"
               :key="index"
               @click="$router.push({name: 'task',params: {'name': item.name}})">
            <h6 class="n">{{ item.num }}</h6>
            <span class="name">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="secRow">
      <!--echarts-->
      <div class="pastWeek">
        <header class="label">
          {{ $t('home.pastWeek.label') }}
          <span class="miniUnit">{{ $t('home.pastWeek.miniLabel') }}</span>
        </header>
        <HomeCharts class="HomeCharts" :cData="chartsData" :cDate="chartsDate"/>
      </div>
      <!--数据统计-->
      <div class="statistics">
        <header class="label">
          {{ $t('home.statistics.label') }}
        </header>
        <section class="s">
          <div class="sw" v-for="(item,index) in statistics.list" :key="index">
            <div class="dd">
              <div class="d">
                <img :src="item.iconImg" alt="">
                <span>{{ item.text }}</span>
              </div>
            </div>
            <span class="n" :title="item.num">{{ item.num }}</span>
            <span class="k">{{ item.unit }}</span>
          </div>
        </section>
      </div>
    </div>
    <div class="thiRow">
      <div class="recentProjects">
        <header class="label">
          {{ $t('home.recentProjects.label') }}
        </header>
        <div class="g">
          <ul class="ul" :style="{left: -423 * recentShowIndex + 'px'}">
            <li v-for="(item,index) in recentList"
                :key="index"
                class="itemLi"
                :class="[{'active': recentIndex == index}]"
                @click="recentIndex = index">
              <div class="a">
                <div class="avatarBox">
                  <img :src="item.thumbnail" alt="">
                </div>
                <div class="t">
                  <h6>{{ item.projectName || 'null'}}</h6>
                  <span class="date">{{ item.updateTime || 'null-null-null'}}</span>
                </div>
              </div>
              <div class="l">
                <span>分析中：{{ item.analyzing }}</span>
                <span>分析失败：{{ item.analyseFail }}</span>
                <span>分析警告：{{ item.analyseWarn }}</span>
                <span>待设置参数：{{ item.waitSetUpParam }}</span>
                <span>渲染中：{{ item.rendering }}</span>
                <span>待全部渲染：{{ item.waitAllRender }}</span>
                <span>渲染失败：{{ item.renderPause }}</span>
                <span>渲染完成：{{ item.finishRender }}</span>
              </div>
            </li>
          </ul>
          <div class="occlusion"></div>
          <div class="btnList" v-show="recentList.length > 3">
            <div class="btnL btn">
              <img src="@/icons/recentLeftA.png" alt="" class="c" v-show="recentShowIndex > 0" @click="recentShowIndex --">
              <img src="@/icons/recentLeft.png" alt="" v-show="recentShowIndex == 0">
            </div>
            <div class="btnR btn">
              <img src="@/icons/recentRightA.png" alt="" class="c" v-show="recentList.length - 4 > recentShowIndex" @click="recentShowIndex ++">
              <img src="@/icons/recentRight.png" alt="" v-show="recentList.length - 4 == recentShowIndex">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import HomeCharts from '@/components/home/home-charts'
  import newTask from '@/components/home/new-task'
  import {
    homeT,
    echartsData,
  } from '@/api/api.js'
  import {
    getRecentTaskList
  } from '@/api/home-api'
  import {
    IEVersion,
    createDateFun
  } from "../assets/common"

  export default {
    name: 'home',
    data() {
      return {
        taskStatus: {
          list: [
            {
              name: this.$t('home.taskStatus.list')[0],
              num: 0
            },
            {
              name: this.$t('home.taskStatus.list')[1],
              num: 0
            },
            {
              name: this.$t('home.taskStatus.list')[2],
              num: 0
            },
            {
              name: this.$t('home.taskStatus.list')[3],
              num: 0
            },
            {
              name: this.$t('home.taskStatus.list')[4],
              num: 0
            },
          ],
          haveNewItem: false
        },
        statistics: {
          list: [
            {
              text: this.$t('home.statistics.list.text')[0],
              num: '0',
              unit: this.$t('home.statistics.list.unit')[0],
              iconImg: require('@/icons/gold.png')
            },
            {
              text: this.$t('home.statistics.list.text')[1],
              num: '0',
              unit: this.$t('home.statistics.list.unit')[1],
              iconImg: require('@/icons/time.png')
            }
          ]
        },
        showNewTask: false,
        chartsData: [],
        chartsDate: [],
        // 工程文件
        fileList: [],
        hi: 'Hello,',
        recentList: [],
        recentIndex: 0,        // 近期项目相中项
        recentShowIndex: 0,    // 近期项目显示位第一索引
      }
    },
    computed: {
      ...mapState(['zoneId', 'user'])
    },
    watch: {
      zoneId: {
        handler: function (val) {
          if (!val) return false
          this.getHomeTData(val)
          this.getEchartsData(val)
          this.getTaskList()                // 获取近期项目列表
        },
        immediate: true
      },
      'user': {
        handler: function (val) {
          this.statistics['list'][0]['num'] = val.consumption   //数据统计-累计消费
        },
        immediate: true,
        deep: true
      },
      'taskStatus.list': {
        handler: function (val) {
          if (val[0].num != 0) this.taskStatus.haveNewItem = true
        },
        immediate: true
      },
    },
    components: {
      HomeCharts,
      newTask
    },
    methods: {
      async getTaskList(){
        let data = await getRecentTaskList(`zoneUuid=${this.zoneId}`)
        this.recentList = data.data.data.map(item => {
          return Object.assign(item, {
            updateTime: createDateFun(new Date(item.updateTime), 'mini')
          })
        })
        // {
        //   analyseFail: 0,       分析失败
        //   analyseWarn: 0,       分析警告
        //   analyzing: 0,         分析中
        //   finishRender: 0,      渲染完成
        //   projectName: "项目一", 项目名
        //   projectUuid: "1",     项目Uuid
        //   renderPause: 0,       渲染失败
        //   rendering: 0,         渲染中
        //   updateTime: 1597649061283,   时间
        //   waitAllRender: 1,     待全部渲染
        //   waitSetUpParam: 0,    待设置参数
        //   thumbnail:            图像
        // }
      },
      // 关闭
      closeDialogFun() {
        this.showNewTask = false
      },
      // 获取任务状态数据统计
      async getHomeTData(val) {
        let data = await homeT(val),
          d = data.data.data,
          m
        this.taskStatus['list'][1]['num'] = d.ing                 // 任务状态-渲染中
        this.taskStatus['list'][3]['num'] = d.stop                // 任务状态-渲染暂停
        this.taskStatus['list'][4]['num'] = d.finish              // 任务状态-渲染完成
        this.taskStatus['list'][2]['num'] = d.wait                // 任务状态-待全部渲染
        this.taskStatus['list'][0]['num'] = d.finishAnalyse       // 任务状态-待设置参数
        if (d.useTime == null) {
          m = 0;
          this.statistics.list[1]['unit'] = '秒钟'
        }
        if (d.useTime / 3600000 >= 1) {
          m = d.useTime / 3600000;
          this.statistics.list[1]['unit'] = '小时'
        } else if (d.useTime / 3600000 / 60 >= 1) {
          m = d.useTime / 3600000 / 60;
          this.statistics.list[1]['unit'] = '分钟'
        } else {
          m = d.useTime / 3600000 / 60 / 60;
          this.statistics.list[1]['unit'] = '秒钟'
        }
        this.statistics['list'][1]['num'] = m.toFixed(2)          // 数据统计-累计渲染用时
      },
      // 获取曲线图数据
      async getEchartsData(val) {
        let data = await echartsData(val)
        this.chartsDate = []
        this.chartsData = []
        data.data.data.forEach(curr => {
          let month = new Date(curr.date).getMonth() + 1,
            month_ = month > 9 ? month : '0' + month,
            day = new Date(curr.date).getDate(),
            day_ = day > 9 ? day : '0' + day
          this.chartsDate.push(month_ + '.' + day_)
          this.chartsData.push(curr.sum)
        })
      },
      // 触发新建任务
      createTaskFun() {
        let inputDom = document.createElement('INPUT'),
          Fun = function () {
            if (inputDom.files.length == 1) {
              this.fileList = [{
                sceneFile: inputDom.files[0],
                projectFileList: null,
                projectFileName: '',
                inputStatus: false,
                path: '',
                id: Math.floor(Math.random() * 100000000000000)
              }]
              this.showNewTask = true
            }
          }.bind(this)
        inputDom.type = 'file'
        inputDom.accept = '.ma,.mb'

        if (IEVersion() == -1) inputDom.addEventListener('change', Fun)
        else if (IEVersion() == 'edge') inputDom.onchange = Fun
        else inputDom.onpropertychange = Fun

        inputDom.click()
      },
    }
  }
</script>

<style scoped lang="less">
  .home-wrapper {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    padding: 0px 50px;
    flex-grow: 1;
    align-content: flex-start;
    height: calc(100vh - 120px - 24px);
    overflow: hidden;

    .hi {
      position: absolute;
      font-size: 36px;
      font-family: NexaBold;
      color: rgba(22, 29, 37, 1);
    }

    .firRow {
      height: 148px;
      display: flex;
      flex-shrink: 1;
      flex-wrap: nowrap;

      .taskStatus {
        height: 100%;
        width: 100%;
        flex-shrink: 1;
        flex-grow: 1;
        box-sizing: border-box;

        .statusList {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          flex-wrap: nowrap;

          .item {
            position: relative;
            height: 100%;
            flex-grow: 1;
            flex-shrink: 1;
            margin-right: 20px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 2px 20px 0px rgba(27, 83, 244, 0.05);
            border-radius: 14px;
            cursor: pointer;
            overflow: hidden;

            .n {
              font-size: 40px;
              font-family: Helvetica;
              color: rgba(22, 29, 37, 1);
              line-height: 48px;
              margin: 49px 0px 5px 50px;
            }

            .name {
              position: relative;
              font-size: 14px;
              font-family: SourceHanSansCN-Regular, SourceHanSansCN;
              font-weight: 400;
              color: rgba(22, 29, 37, 0.6);
              line-height: 21px;
              margin-left: 50px;

              &::before {
                position: absolute;
                top: 4px;
                left: -10px;
                content: '';
                width: 6px;
                height: 6px;
                border-radius: 50%;
              }
            }

            &::before {
              position: absolute;
              content: '';
              width: 182px;
              height: 119px;
              border-radius: 50%;
              opacity: 0.1;
              filter: blur(15px);
            }

            &:nth-of-type(1) {
              .name::before {
                background-color: rgba(255, 62, 77, 1);
              }

              &::before {
                bottom: -20px;
                right: -20px;
                background-image: linear-gradient(180deg, rgba(253, 190, 94, 1) 0%, rgba(253, 94, 90, 1) 100%);
              }
            }

            &:nth-of-type(2) {
              .name::before {
                top: 4px;
                right: -8px;
                background-color: rgba(27, 83, 244, 1);
              }

              &::before {
                background-image: linear-gradient(180deg, rgba(55, 199, 225, 1) 0%, rgba(44, 145, 245, 1) 100%);
              }
            }

            &:nth-of-type(3) {
              .name::before {
                background-color: rgba(158, 152, 226, 1);
              }

              &::before {
                background-image: linear-gradient(45deg, rgba(75, 167, 156, 1) 0%, rgba(143, 236, 222, 1) 100%);
              }
            }

            &:nth-of-type(4) {
              .name::before {
                background-color: rgba(255, 191, 0, 1);
              }

              &::before {
                background-image: linear-gradient(315deg, rgba(83, 108, 255, 1) 0%, rgba(144, 121, 255, 1) 100%);
              }
            }

            &:nth-of-type(5) {
              margin-right: 0px;

              .name::before {
                background-color: rgba(70, 203, 93, 1);
              }

              &::before {
                bottom: 0px;
                right: 0px;
                background-image: linear-gradient(180deg, rgba(109, 212, 0, 1) 0%, rgba(247, 181, 0, 1) 100%);
              }
            }
          }
        }
      }
    }

    .secRow {
      display: flex;
      flex-wrap: nowrap;
      flex-shrink: 1;
      flex-grow: 1;

      .addBtn,
      .pastWeek,
      .statistics {
        background-color: rgba(255, 255, 255, 1);
      }

      .pastWeek {
        /*width: 630px;*/
        margin-right: 30px;
        flex-grow: 1;
        flex-shrink: 1;
        border-radius: 14px;
        display: flex;
        justify-content: center;
        align-items: center;

        .HomeCharts {
          width: calc(100% - 60px);
          height: calc(100% - 40px);
        }
      }

      .vip {
        position: relative;
        width: 259px;
        margin-right: 30px;

        .label {
          margin-bottom: 0px !important;
        }

        .storage-charts {
          position: absolute;
          width: calc(100% - 60px);
        }
      }

      .statistics {
        width: 516px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        /*justify-content: space-around;*/

        .s {
          width: 100%;
          /*padding: 40px 0px;*/
          box-sizing: border-box;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-around;

          .sw {
            width: 162px;

            .dd {
              position: relative;
              width: 162px;
              height: 72px;
              border-radius: 10px;
              padding: 6px;
              box-sizing: border-box;
              margin-bottom: 29px;

              .d {
                width: 150px;
                height: 60px;
                font-size: 14px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                  width: 18px;
                  padding-right: 9px;
                }

                span {
                  color: rgba(255, 255, 255, 1);
                }
              }
            }

            .n {
              display: block;
              font-size: 40px;
              font-family: Helvetica;
              color: rgba(22, 29, 37, 1);
              line-height: 48px;
              width: 162px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              margin-bottom: 15px;
            }

            .k {
              display: block;
              font-size: 14px;
              font-family: SourceHanSansCN-Regular, SourceHanSansCN;
              font-weight: 400;
              color: rgba(22, 29, 37, 0.29);
              line-height: 21px;
            }

            &:nth-of-type(1) {
              .dd {
                background-color: rgba(70, 203, 93, 0.15);

                .d {
                  background-color: rgba(70, 203, 93, 1);
                }

                &::after {
                  position: absolute;
                  right: -46px;
                  top: 0px;
                  content: '';
                  width: 2px;
                  height: 173px;
                  background-color: rgba(22, 29, 37, 0.06);
                }
              }
            }

            &:nth-of-type(2) {
              .dd {
                background-color: rgba(73, 172, 235, 0.15);

                .d {
                  background-color: rgba(73, 172, 235, 1);
                }
              }
            }
          }
        }
      }
    }

    .thiRow {
      display: flex;
      margin-top: 30px;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 14px;
      flex-shrink: 1;
      flex-grow: 1;

      .recentProjects {
        position: relative;
        width: 100%;
        padding: 2vh;

        .g {
          width: 100%;
          height: 222px;
          position: relative;
          overflow: hidden;

          ul {
            position: absolute;
            width: 9999px;

            .itemLi {
              display: inline-block;
              margin-right: 20px;
              width: 403px;
              height: 222px;
              background-color: rgba(27, 83, 244, 0.9);
              border-radius: 18px;
              padding: 20px;
              box-sizing: border-box;
              opacity: 0.2;

              .a {
                display: flex;

                .avatarBox {
                  width: 72px;
                  height: 72px;
                  border-radius: 50%;
                  background-color: rgba(255, 255, 255, 0.19);
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  img {
                    border-radius: 50%;
                    box-shadow: 0px 0px 1px 1px #aaa;
                    width: 63px;
                    height: 63px;
                  }
                }

                .t {
                  margin-left: 10px;

                  h6 {
                    margin-top: 13px;
                    font-size: 16px;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 1);
                    line-height: 24px;
                  }

                  .date {
                    margin-top: 10px;
                    font-size: 12px;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 0.6);
                    line-height: 18px;
                  }
                }
              }

              .l {
                display: flex;
                flex-direction: column;
                align-content: space-between;
                flex-wrap: wrap;
                height: 89px;
                width: 250px;
                margin-left: 82px;
                margin-top: 5px;

                span {
                  position: relative;
                  font-size: 14px;
                  font-weight: 400;
                  color: rgba(255, 255, 255, 0.8);
                  line-height: 21px;

                  &::before {
                    position: absolute;
                    left: -8px;
                    top: 7px;
                    content: '';
                    width: 1px;
                    height: 9px;
                    background-color: rgba(255, 255, 255, 1);
                    box-shadow: 0px 0px 1px 1px rgba(255, 255, 255, 1);
                  }
                }
              }

              &:hover,
              &.active {
                opacity: 1;
              }
            }
          }
        }

        .occlusion {
          position: absolute;
          right: 0px;
          top: 0px;
          width: 280px;
          height: 100%;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
          user-select: none;
        }

        .btnList {
          position: absolute;
          height: 222px;
          right: 10px;
          width: 120px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 1);
            box-shadow: 0px 2px 8px 0px rgba(27, 83, 244, 0.15);
            display: flex;
            justify-content: center;
            align-items: center;

            .c {
              cursor: pointer;
            }
          }
        }
      }
    }

    .firRow,
    .secRow,
    .thiRow {
      margin-top: 60px;
      box-sizing: border-box;
      width: 100%;

      .taskStatus,
      .statistics,
      .pastWeek,
      .vip,
      .recentProjects {
        position: relative;

        .label {
          position: absolute;
          top: -42px;
          right: 20px;
          font-size: 18px;
          font-weight: 600;
          color: rgba(22, 29, 37, 1);

          .miniUnit {
            font-size: 14px;
          }
        }
      }
    }
  }

  @media screen and (orientation: portrait) {
    .home-wrapper .thiRow {
      height: calc(100vw - 80px - 20px - 248px - 30px - 30px - 229px - 20px);
    }
  }
</style>
