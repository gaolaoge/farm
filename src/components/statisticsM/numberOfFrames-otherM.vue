<template>
  <div class="numberOfFramesEchart-wrapper echartsM">
    <div class="header">
      <div class="c">
        <!--名称-->
        <span class="name fc">{{ $t('statistics_mainM.numberOfFrames.name') }}</span>
        <!--新增任务数统计-->
        <span class="navLi fc"
              :class="[{'active': navIndex == 0}]"
              @click="navIndex = 0">
          {{ $t('statistics_mainM.numberOfFrames.navLi_one') }}
        </span>
        <!--累计任务数统计-->
        <span class="navLi fc"
              :class="[{'active': navIndex == 1}]"
              @click="navIndex = 1">
          {{ $t('statistics_mainM.numberOfFrames.navLi_two') }}
        </span>
      </div>
      <div class="c filter">
        <!--时间区间-->
        <div class="filter-item">
          <el-date-picker
            v-model="date"
            type="daterange"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <!--下拉框-->
        <div class="select bl">
          <el-select v-model="dateInterval" placeholder="请选择" @change="changeDateInterval">
            <el-option
              v-for="item in dateIntervalList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!--全屏-->
        <span class="bigger fc bl" v-show="fullBtn">
          <img src="@/icons/bigger.png" alt="" @click="f">
        </span>
        <!--返回-->
        <div class="farm-primary-form-btn" v-show="!fullBtn" @click="e">
          <img src="@/icons/back_icon-black.png" alt="" class="btnIcon default">
          <img src="@/icons/back_icon-white.png" alt="" class="btnIcon hover">
          <span>返回</span>
        </div>
      </div>
    </div>
    <section>
      <div class="selectData h">
        <el-select v-model="taskV"
                   :multiple-limit="5"
                   @change="changeTaskV"
                   multiple
                   collapse-tags
                   placeholder="">
          <el-option
            v-for="item in taskList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="itemList">
        <div class="item" v-for="(item,index) in taskL" :key="index">
          <span>{{ item.label }}</span>
          <img src="@/icons/b.png" alt="" @click="taskV.splice(index, 1)">
        </div>
      </div>
      <div class="ec" ref="ec"/>
    </section>
  </div>
</template>

<script>
  import calendar from '@/components/farm-model/farm-calendar.vue'
  import {
    geFramesData
  } from '@/api/statistics-api.js'
  import {
    mapState
  } from 'vuex'
  import {
    createCalendar,
    messageFun
  } from "../../assets/common"

  export default {
    name: '',
    data() {
      return {
        navIndex: 0,
        ec: null,
        dateIntervalList: [
          {
            value: 'nearlySevenDays',
            label: '近7天'
          },
          {
            value: 'nearlyThirtyDays',
            label: '近30天'
          },
          {
            value: 'customize',
            label: '自定义'
          }
        ],
        itemList: [
          {
            value: '选项1',
            label: '近7天'
          },
          {
            value: '近30天',
            label: '近30天'
          },
          {
            value: '自定义',
            label: '自定义'
          }
        ],
        dateInterval: 'nearlySevenDays',
        taskV: [],
        taskL: [],
        date: [],
        fullBtn: true,
        chartsSeries: [],
        lock: false,
        cProjectUuid: [],
        nProjectUuid: [],
        color: [
          'rgba(27, 83, 244, 1)',
          'rgba(255, 191, 0, 1)',
          'rgba(255, 62, 77, 1)',
          'rgba(70, 203, 93, 1)',
          'rgba(236, 60, 255, 1)'
        ],
        linearGradientT: [
          'rgba(27, 83, 244, 0.2)',
          'rgba(255, 191, 0, 0.2)',
          'rgba(255, 62, 77, 0.2)',
          'rgba(70, 203, 93, 0.2)',
          'rgba(236, 60, 255, 0.2)'
        ],
        linearGradientB: [
          'rgba(27, 83, 244, 0)',
          'rgba(255, 191, 0, 0)',
          'rgba(255, 62, 77, 0)',
          'rgba(70, 203, 93, 0)',
          'rgba(236, 60, 255, 0)'
        ],
      }
    },
    props: {
      taskList: Array,
      chartsData: {
        type: Object,
        default: null
      }
    },
    watch: {
      date(val) {
        let {year, month, day} = createCalendar(val[0])
        let {year: year2, month: month2, day: day2} = createCalendar(val[1])
        this.$emit('monitorVal', [`${year}-${month}-${day}`, `${year2}-${month2}-${day2}`, 'numOfFrames'])
        this.aisle()
      },
      taskV(v) {
        if (!v) return false
        this.aisle()
        let t = []
        v.forEach(curr => t.push(this.taskList.find(item => item.value == curr)))
        this.taskL = t
      },
      navIndex() {
        this.navIndex == 0 ? this.taskV = this.cProjectUuid : this.taskV = this.nProjectUuid
      },
      'chartsData': {
        handler: function (val) {
          if (!val) return false
          else {
            this.cProjectUuid = val.count.projectUuid
            this.nProjectUuid = val.newly.projectUuid
            this.navIndex == 0 ? this.taskV = this.cProjectUuid : this.taskV = this.nProjectUuid
          }
        },
        immediate: true
      }
    },
    mounted() {
      window.addEventListener('resize', () => this.ec.resize())
      this.date = [this.getDateE(6), this.getDateE(0)]
    },
    computed: {
      ...mapState(['zoneId'])
    },
    methods: {
      changeTaskV() {
        this.navIndex == 0 ? this.cProjectUuid = this.taskV : this.nProjectUuid = this.taskV
      },
      // 日期区间下拉框修改
      changeDateInterval(val) {
        switch (val) {
          case 'nearlySevenDays':   // 近7天
            this.date = [this.getDateE(6), new Date()]
            break
          case 'nearlyThirtyDays':   // 近30天
            this.date = [this.getDateE(29), new Date()]
            break
        }
      },
      // 获取指定日期date
      getDateE(num) {
        let date = new Date().getTime() - num * 1000 * 60 * 60 * 24
        return new Date(date)
      },
      // echarts 初始化
      init() {
        this.ec = this.$echarts.init(this.$refs.ec)
        this.ec.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
            backgroundColor: 'rgba(27, 83, 244, 0.59)'
          },
          xAxis: {
            type: 'time',
            maxInterval: 3600 * 24 * 1000,
            splitLine: {
              show: false
            },
            axisLabel: {
              color: 'rgba(22, 29, 37, 0.4)'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(22, 29, 37, 0.1)'
              }
            },
          },
          yAxis: {
            type: 'value',
            axisTick: {
              inside: true
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              inside: false,
              formatter: '{value}',
              color: 'rgba(22, 29, 37, 0.4)'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(22, 29, 37, 0.1)'
              }
            },
            z: 10
          },
          grid: {
            top: 50,
            left: 36,
            right: 26,
          },
          series: this.chartsSeries
        })
      },
      // 日期选择模块选择结果
      changeSelectDate([startDate, endDate]) {
        this.startDate = startDate
        this.endDate = endDate
      },
      // 全屏
      f() {
        this.$emit('fullScreen', 'showNumOfFrames')
        setTimeout(this.ec.resize, 120)
        this.fullBtn = false
      },
      // 取消全屏
      e() {
        this.$emit('miniScreen')
        setTimeout(this.ec.resize, 120)
        this.fullBtn = true
      },
      // 获取charts数据通道
      aisle() {
        if (!this.taskV.length || this.lock) return false
        this.lock = true
        this.getChartsData()
        setTimeout(() => this.lock = false, 200)
      },
      // 获取charts数据
      async getChartsData() {
        let num
        if (this.dateInterval == 'nearlySevenDays') num = '1'
        else if (this.dateInterval == 'nearlyThirtyDays') num = '2'
        else if (this.dateInterval == 'customize') num = '3'
        let data = await geFramesData({
          "type": String(this.navIndex + 1),
          "projectUuid": this.taskV,
          "dateBegin": this.date[0].getTime(),
          "dateEnd": this.date[1].getTime(),
          "defaultDateStatus": num,
          "zoneuuid": this.zoneId
        })
        if (data.data.code != 200) messageFun('error', '获取数据失败')
        else {
          if (this.navIndex == 1) {
            let base = data.data.data,
              data_ = await geFramesData({
                "type": 1,
                "projectUuid": this.taskV,
                "dateBegin": this.date[0].getTime(),
                "dateEnd": this.date[1].getTime(),
                "defaultDateStatus": num,
                "zoneuuid": this.zoneId
              })
            this.chartsSeries = Object.keys(data_.data.data).map((item, index) => {
              let base_ = base[item],
                result = data_.data.data[item]

              const result_ = {}
              Object.keys(result)
                .sort((preItem, nextItem) => preItem.replace(/-/g, '') - nextItem.replace(/-/g, ''))
                .forEach(key => {
                  result_[key] = result[key]
                  base_ += result[key]
                  result_[key] = base_
                })

              return {
                name: this.taskList.find(curr => curr.value == item).label,
                type: 'line',
                smooth: true,         // 是否平滑曲线显示
                symbol: 'circle',     // 标记的样式
                symbolSize: 5,
                sampling: 'average',
                itemStyle: {
                  color: this.color[index]
                },
                areaStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: this.linearGradientT[index]
                    },
                    {
                      offset: 1,
                      color: this.linearGradientB[index]
                    }
                  ])
                },
                data: this.transformType(result_)
              }
            })
          } else if (this.navIndex == 0) {
            this.chartsSeries = Object.keys(data.data.data).map((item, index) => {
              return {
                name: this.taskList.find(curr => curr.value == item).label,
                type: 'line',
                smooth: true,         // 是否平滑曲线显示
                symbol: 'circle',     // 标记的样式
                symbolSize: 5,
                sampling: 'average',
                itemStyle: {
                  color: this.color[index]
                },
                areaStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: this.linearGradientT[index]
                    },
                    {
                      offset: 1,
                      color: this.linearGradientB[index]
                    }
                  ])
                },
                data: this.transformType(data.data.data[item])
              }
            })
          }
          this.init()
        }
      },
      // 格式转换
      transformType(data) {
        let l = []
        Object.keys(data).forEach(item => {
          l.push([item, data[item]])
        })
        return l
      },
    },
    components: {
      calendar
    }
  }
</script>

<style lang="less" scoped>
  .el-date-editor {
    border: 0px;

    .el-range__icon,
    .el-range-separator,
    .el-input__icon.el-range__close-icon {
      line-height: 22px;
    }
  }

  .numberOfFramesEchart-wrapper {
    /deep/ .el-tag.el-tag--info.el-tag--small.el-tag--light {
      display: flex;
      align-items: center;

      .el-select__tags-text {
        display: inline-block;
        width: 54px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .el-tag__close.el-icon-close {
        margin: 0px;
        position: inherit;
      }

      &:nth-last-of-type(1) {
        width: 38px;
      }
    }
  }
</style>
