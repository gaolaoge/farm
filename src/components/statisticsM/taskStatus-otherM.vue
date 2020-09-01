<template>
  <div class="taskStatusEchart-wrapper echartsM">
    <div class="header">
      <div class="c">
        <!--名称-->
        <span class="name fc">{{ $t('statistics_mainM.taskStatus.name') }}</span>
      </div>
      <div class="c filter">
        <!--时间区间-->
        <div class="filter-item">
          <el-date-picker
            v-model="date"
            type="daterange"
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
      <div class="selectData">
        <el-select v-model="taskV" placeholder="请选择">
          <el-option
            v-for="item in taskList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="ec" ref="ec"/>
    </section>
  </div>
</template>

<script>
  import calendar from '@/components/farm-model/farm-calendar.vue'
  import {
    getStatusData
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
        statusList: {
          'daiquanbuxuanran': '待全部渲染',
          'fenxizhong': '分析中',
          'fenxijinggao': '分析警告',
          'daishezhicanshu': '待设置参数',
          'shangchuanzanting': '上传暂停',
          'fenxishibai': '分析失败',
          'xuanranzanting': '渲染暂停',
          'xuanranzhong': '渲染中',
          'shangchuanzhong': '上传中',
          'shangchuanshibai': '上传失败',
          'xuanranwancheng': '渲染完成'
        },
        dateInterval: 'nearlySevenDays',
        taskV: [],
        date: [],
        fullBtn: true,
        chartsSeries: [],
        lock: false,
        cProjectUuid: [],
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
        this.$emit('monitorVal', [`${year}-${month}-${day}`, `${year2}-${month2}-${day2}`, 'taskData'])
        this.aisle()
      },
      taskV(v) {
        this.aisle()
      },
      navIndex() {
        this.taskV = this.cProjectUuid
        this.aisle()
      },
      'chartsData': {
        handler: function (val) {
          if (!val) return false
          else {
            this.cProjectUuid = val.projectUuid
            this.taskV = this.cProjectUuid
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
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: ['待全部渲染', '分析中', '分析警告', '待设置参数', '上传暂停', '分析失败', '渲染暂停', '渲染中', '上传中', '上传失败', '渲染完成']
          },
          calculable: true,//手柄拖拽调整选中的范围

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
        this.$emit('fullScreen', 'showTaskStatus')
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
        if (this.lock) return false
        this.lock = true
        this.getChartsData()
        setTimeout(() => this.lock = false, 200)
      },
      // 获取charts数据
      async getChartsData() {
        let data = await getStatusData(this.taskV)
        if (data.data.code != 200) messageFun('error', '获取数据失败')
        else {
          this.chartsSeries = [
            {
              type: 'pie',
              radius: ['10%', '60%'],
              center: ['50%', '50%'],
              roseType: 'radius',
              data: Object.keys(data.data.data).map(item => {
                return {
                  name: this.statusList[item],
                  value: data.data.data[item]
                }
              }),
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ]
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

  .taskStatusEchart-wrapper {
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
