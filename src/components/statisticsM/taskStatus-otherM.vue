<template>
  <div class="taskStatusEchart-wrapper echartsM">
    <div class="header">
      <div class="c">
        <!--名称-->
        <span class="name fc">{{ $t('statistics_mainM.taskStatus.name') }}</span>
      </div>
      <div class="c filter">
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
        ec: null,
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
            this.taskV = this.cProjectUuid[0]
          }
        },
        immediate: true
      }
    },
    mounted() {
      window.addEventListener('resize', () => this.ec.resize())
    },
    computed: {
      ...mapState(['zoneId'])
    },
    methods: {
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
          calculable: true,   //手柄拖拽调整选中的范围

          series: this.chartsSeries
        })
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
        if (!this.taskV.length || this.lock) return false
        this.lock = true
        this.getChartsData()
        setTimeout(() => this.lock = false, 200)
      },
      // 获取charts数据
      async getChartsData() {
        let data = await getStatusData(this.taskV[0])
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
  .btnIcon {
    width: 16px;
  }
</style>
