<template>
  <div class="statisticsM-wrapper" :class="[{'fullItem': fullItem}]">
    <!--任务数据统计-->
    <taskData ref="taskData"
              @monitorVal="monitorVal"
              @fullScreen="fullScreen"
              @miniScreen="miniScreen"
              :taskList="projectList"
              :chartsData="taskTemplate"
              v-show="screen.showTaskData"/>
    <!--帧数统计-->
    <numberOfFrames ref="numOfFrames"
                    @monitorVal="monitorVal"
                    @fullScreen="fullScreen"
                    @miniScreen="miniScreen"
                    :taskList="projectList"
                    :chartsData="framesTemplate"
                    v-show="screen.showNumOfFrames"/>
    <!--消费统计-->
    <consumption ref="consumption"
                 @monitorVal="monitorVal"
                 @fullScreen="fullScreen"
                 @miniScreen="miniScreen"
                 :taskList="projectList"
                 :chartsData="consumptionTemplate"
                 v-show="screen.showConsumption"/>
    <!--任务状态统计-->
    <taskStatus ref="taskStatus"
                @monitorVal="monitorVal"
                @fullScreen="fullScreen"
                @miniScreen="miniScreen"
                :taskList="projectList"
                :chartsData="statusTemplate"
                v-show="screen.showTaskStatus"/>
  </div>
</template>

<script>
  import taskData from '@/components/statisticsM/taskData-otherM'
  import numberOfFrames from '@/components/statisticsM/numberOfFrames-otherM'
  import consumption from '@/components/statisticsM/consumption-otherM'
  import taskStatus from '@/components/statisticsM/taskStatus-otherM'
  import {
    createCalendar
  } from '@/assets/common.js'
  import {
    getQueryConditions
  } from '@/api/statistics-api.js'

  export default {
    name: 'statisticsM-wrapper',
    data() {
      return {
        fullItem: false,
        screen: {
          showTaskData: true,
          showNumOfFrames: true,
          showConsumption: true,
          showTaskStatus: true
        },
        projectList: null,            // 项目列表
        taskTemplate: null,           // 任务数统计数据
        framesTemplate: null,         // 帧数数统计数据
        consumptionTemplate: null,    // 消费统计数据
        statusTemplate: null,         // 消费统计数据
      }
    },
    methods: {
      // 通过日期选择器修改区间 监听结果是否匹配下拉框选项
      monitorVal([s, e, dom]) {
        let {year, month, day} = createCalendar(new Date()),
          t = `${year}-${month}-${day}`
        if (t != e) {
          this.$refs[dom].dateInterval = 'customize'
          return false
        }
        let num = 1000 * 60 * 60 * 24
        let {year: y, month: m, day: d} = createCalendar(new Date(new Date().getTime() - 6 * num))
        let {year: y2, month: m2, day: d2} = createCalendar(new Date(new Date().getTime() - 29 * num))
        if (s == `${y}-${m}-${d}`) this.$refs[dom].dateInterval = 'nearlySevenDays'
        else if (s == `${y2}-${m2}-${d2}`) this.$refs[dom].dateInterval = 'nearlyThirtyDays'
        else this.$refs[dom].dateInterval = 'customize'
      },
      // 全屏
      fullScreen(selectScreen) {
        this.fullItem = true
        for (let i in this.screen) {
          if (i == selectScreen) this.screen[i] = true
          else this.screen[i] = false
        }
      },
      // 取消全屏
      miniScreen() {
        this.fullItem = false
        for (let i in this.screen) if (!this.screen[i]) this.screen[i] = true
      },
      // 获取全局数据
      async getData() {
        // 获取图表条件历史记录
        let data = await getQueryConditions()
        this.projectList = data.data.data.project.map(curr => {
          return {
            'value': curr.taskProjectUuid,
            'label': curr.projectName,
          }
        })
        this.taskTemplate = data.data.data.chart.taskTemplate
        this.framesTemplate = data.data.data.chart.frameTemplate
        this.consumptionTemplate = data.data.data.chart.consumeTemplate
        this.statusTemplate = data.data.data.chart.statusTemplate
        setTimeout(() => {
          this.$refs.taskData.getChartsData()
          this.$refs.numOfFrames.getChartsData()
          this.$refs.consumption.getChartsData()
          this.$refs.taskStatus.getChartsData()
        }, 500)
      }
    },
    mounted() {
      this.getData()
    },
    components: {
      taskData,
      numberOfFrames,
      consumption,
      taskStatus
    }
  }
</script>

<!--echarts公共样式-->
<style lang="less">

  .el-picker-panel.el-date-range-picker.el-popper {
    transform: scale(0.84);
    transform-origin: 0 0;
  }
  .el-date-editor .el-input__icon.el-range__close-icon,
  .el-date-editor .el-range-separator {
    line-height: 30px!important;
  }
  .el-input__inner {
    height: 35px;
    line-height: 35px;
  }
  .el-input__icon.el-range__icon.el-icon-date {
    display: none;
  }

  .statisticsM-wrapper {
    .echartsM {
      background-color: rgba(255, 255, 255, 1);
      width: calc(50% - 10px);
      min-width: 830px;
      height: calc(50% - 10px);
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      transition: all 0.1s;

      .header {
        height: 35px;
        box-shadow: 0px 1px 0px rgba(22, 29, 37, 0.3);
        display: flex;
        justify-content: space-between;

        .c {
          display: flex;
        }

        .name {
          width: 100px;
          height: 36px;
          color: rgba(255, 255, 255, 1);
          background-color: rgba(27, 83, 244, 1);
          font-size: 14px;
          user-select: none;
          border-radius: 14px 0px 0px;
          margin-right: 30px;
        }

        .navLi {
          position: relative;
          width: 130px;
          cursor: pointer;
          user-select: none;
          color: rgba(22, 29, 37, 0.6);
          font-size: 14px;

          &.active {
            color: rgba(22, 29, 37, 1);

            &::after {
              position: absolute;
              bottom: -2px;
              left: 0px;
              content: '';
              width: 130px;
              height: 1px;
              background-color: rgba(27, 83, 244, 1);
              box-shadow: 0px 0px 1px 1px rgba(27, 83, 244, 0.6);
            }
          }
        }

        .date {
          position: relative;
          padding: 0px 17px;
          color: rgba(22, 29, 37, 0.6);
          font-size: 12px;
          user-select: none;


        }

        .bigger {
          position: relative;
          padding: 0px 17px;
          cursor: pointer;
          height: 100%;
        }

        .select {
          position: relative;
          width: 90px;

          /deep/ .el-input__inner {
            border: 0px;
          }
        }

        .fc {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .bl {
          &::before {
            position: absolute;
            top: 12px;
            left: 0px;
            content: '';
            width: 2px;
            height: 12px;
            background-color: rgba(22, 29, 37, 0.15);
          }
        }

        .filter .filter-item .filter-item-i {
          border: 1px solid rgba(0, 0, 0, 0);
          margin-right: 0px;
          cursor: pointer;
        }
      }

      section {
        position: relative;
        flex-shrink: 1;
        flex-grow: 1;
        height: 1px;

        .selectData {
          position: absolute;
          z-index: 9;
          width: 100%;

          /deep/ .el-select {
            position: relative;
            padding: 10px 15px;

            .el-input__inner {
              height: 25px;
              width: 170px;
              background: rgba(248, 248, 248, 1);
              border-radius: 2px;
              border: 1px solid rgba(22, 29, 37, 0.1);
            }

            .el-input__suffix {
              display: flex;
              align-items: center;

              .el-input__suffix-inner {

              }
            }

            .el-tag {
              display: none!important;
            }
          }
          &.h {
            /deep/ .el-select::after {
              position: absolute;
              top: 12px;
              left: 24px;
              content: '按项目统计';
              font-size: 14px;
              color: rgba(22, 29, 37, 0.6);

            }
          }
        }

        .itemList {
          position: absolute;
          z-index: 9;
          top: 10px;
          left: 200px;
          display: flex;
          width: calc(100% - 220px);

          .item {
            position: relative;
            width: 90px;
            height: 25px;
            background: rgba(248, 248, 248, 1);
            border-radius: 2px;
            border: 1px solid rgba(22, 29, 37, 0.1);
            flex-shrink: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0px 10px 0px 14px;
            box-sizing: border-box;
            margin-right: 1%;

            span {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: rgba(22, 29, 37, 1);
              max-width: 50px;
              width: 70%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            img {
              cursor: pointer;
            }

            &::before {
              position: absolute;
              left: 0px;
              content: '';
              width: 4px;
              height: 25px;
              border-radius: 2px;
            }

            &:nth-of-type(1)::before {
              background-color: rgba(27, 83, 244, 1);
            }

            &:nth-of-type(2)::before {
              background-color: rgba(255, 191, 0, 1);
            }

            &:nth-of-type(3)::before {
              background-color: rgba(255, 62, 77, 1);
            }

            &:nth-of-type(4)::before {
              background-color: rgba(70, 203, 93, 1);
            }

            &:nth-of-type(5)::before {
              background-color: rgba(236, 60, 255, 1);
            }

          }
        }

        .ec {
          height: 100%;
        }
      }
    }
  }

</style>

<style lang="less" scoped>
  .statisticsM-wrapper {
    width: 100%;
    min-width: 1670px;
    padding: 0px 20px 20px 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;

    &.fullItem {
      .echartsM {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
