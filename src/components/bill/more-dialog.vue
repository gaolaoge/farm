<template>
  <div class="more-dialog">
    <header class="header">
      <img src="@/icons/shutDialogIcon.png"
           alt=""
           @click="closeDialogFun"
           class="closeBtn">
    </header>
    <section>
      <div class="label-table">
        <span class="label">
          {{ dialogTit }}
        </span>
      </div>
      <div class="tableList">
        <!--下载消费详情-->
        <div class="table-box" v-show="dialogTableType == '下载消费'">
          <el-table
            :data="downloadTableData"
            class="o"
            :border=true
            style="width: 100%">

            <!--帧数-->
            <el-table-column
              prop="framesNum"
              label="帧数"
              sortable
              width="140"
              show-overflow-tooltip/>
            <!--下载次数-->
            <el-table-column
              prop="downloadNum"
              label="下载次数"
              sortable
              show-overflow-tooltip/>
            <!--费用（金币）-->
            <el-table-column
              prop="cost"
              label="费用（金币）"
              sortable
              show-overflow-tooltip/>
            <!--大小-->
            <el-table-column
              prop="size"
              label="大小"
              show-overflow-tooltip/>
            <!--单价（金币/核对）-->
            <el-table-column
              prop="price"
              label="单价（金币/核对）"
              sortable
              show-overflow-tooltip/>
            <!--下载完成时间 -->
            <el-table-column
              prop="date"
              label="下载完成时间"
              show-overflow-tooltip/>

          </el-table>
        </div>
        <!--渲染消费详情-->
        <div class="table-box" v-show="dialogTableType == '渲染消费'">
          <el-table
            :data="expendTableData"
            class="o"
            :border=true
            style="width: 100%">

            <!--帧数-->
            <el-table-column
              prop="num"
              label="帧数"
              width="140"
              sortable
              show-overflow-tooltip/>
            <!--渲染费用（金币）-->
            <el-table-column
              prop="gold"
              label="渲染费用（金币）"
              sortable
              show-overflow-tooltip/>
            <!--渲染时长-->
            <el-table-column
              prop="duration"
              label="渲染时长"
              show-overflow-tooltip/>
            <!--渲染开始时间-->
            <el-table-column
              prop="startDate"
              label="渲染开始时间"
              sortable
              show-overflow-tooltip
              width="192"/>
            <!--渲染结束时间 -->
            <el-table-column
              prop="endDate"
              label="渲染结束时间"
              show-overflow-tooltip
              width="192"/>
            <!--单价（金币/核时）-->
            <el-table-column
              prop="price"
              label="单价（金币/核时）"
              show-overflow-tooltip/>
            <!--CPU利用率-->
            <!--<el-table-column-->
            <!--prop="percent"-->
            <!--label="CPU利用率"-->
            <!--show-overflow-tooltip />-->
            <!--内存峰值-->
            <!--<el-table-column-->
            <!--prop="peak"-->
            <!--label="内存峰值"-->
            <!--show-overflow-tooltip />-->

          </el-table>
        </div>
        <!--分页-->
        <!--<div class="page">-->
        <!--<el-pagination-->
        <!--background-->
        <!--layout="prev, pager, next, jumper"-->
        <!--:current-page.sync="table.currentPage"-->
        <!--:total="table.outPutTableTotal">-->
        <!--</el-pagination>-->
        <!--</div>-->
      </div>
    </section>
  </div>
</template>

<script>
  import {
    createCalendar,
    createTableIconList
  } from '@/assets/common.js'

  export default {
    name: 'more-dialog',
    data() {
      return {
        dialogTit: '消费详情',
        // 下载消费详情
        downloadTableData: [
          // {
          //   framesNum: null,       //帧数
          //   downloadNum: null,     //已下载次数
          //   cost: null,            //费用（金币）
          //   size: null,            //大小
          //   price: null,           //单价（金币/核对）
          //   date: ''               //下载完成时间
          // },
        ],
        // 渲染消费详情
        expendTableData: [
          // {
          //   num: null,        //帧数
          //   gold: null,      // 渲染费用（金币）
          //   duration: null,  // 渲染时长
          //   startDate: '',   // 渲染开始时间
          //   endDate: '',     // 渲染结束时间
          //   price: null,     // 单价（金币/核对）
          //   percent: '',     // CPU利用率
          //   peak: ''         // 内存峰值
          // },
        ],

      }
    },
    props: {
      dialogTableType: {
        type: String,
        default: 'as'
      },
      downloadDialogTableData: {
        type: Array,
        default: function () {
          return []
        }
      },
      renderDialogTableData: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    watch: {
      downloadDialogTableData: {
        handler: function (val) {
          this.downloadTableData = val.map(curr => {
            let {year, month, day, hour, minutes, seconds} = createCalendar(new Date(curr.finishTime))
            return {
              framesNum: curr.frameNo,          //帧数
              downloadNum: curr.downloadNo,     //已下载次数
              cost: curr.actualPayment,         //费用（金币）
              size: curr.fileSize,              //大小
              price: curr.unitPrice,            //单价（金币/核对）
              date: `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`             //下载完成时间
            }
          })
        },
        deep: true,
        immediate: true
      },
      renderDialogTableData: {
        handler: function (val) {
          this.expendTableData = val.map(curr => {

            return {
              num: curr.frameNo,              //帧数
              gold: curr.actualPayment,       // 渲染费用（金币）
              // duration: `${hour - 8}时${min}分${sec}秒`,         // 渲染时长
              duration: curr.useTime,
              startDate: curr.startTime,      // 渲染开始时间
              endDate: curr.endTime,          // 渲染结束时间
              price: curr.unitPrice,          // 单价（金币/核对）
              percent: curr.cpuRate,          // CPU利用率
              peak: curr.memoryPeak           // 内存峰值
            }
          })
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      // 关闭
      closeDialogFun() {
        this.$emit('closeDialog', false)
      }
    },
    mounted() {
      createTableIconList()
    }
  }
</script>

<style lang="less" scoped>
  .more-dialog {
    background-color: #f1f4f9;
    overflow: hidden;
    height: 87vh;
    position: relative;

    .header {
      position: absolute;
      width: 100%;

      .closeBtn {
        position: relative;
        z-index: 9;
        float: right;
        width: 18px;
        height: 18px;
        cursor: pointer;
        opacity: 0.6;
      }
    }

    section {
      .label-table {
        position: relative;

        .label {
          display: inline-block;
          font-size: 16px;
          background-color: rgba(255, 255, 255, 1);
          padding: 10px 30px;
          cursor: pointer;
          color: rgba(22, 29, 37, 0.6);
          border-radius: 8px 8px 0px 0px;
          font-weight: 600;
        }
      }

      .tableList {
        background-color: rgba(255, 255, 255, 1);
        border-radius: 0px 0px 8px 8px;
      }
    }
  }

  /deep/ .el-table {
    th:nth-of-type(1),
    td:nth-of-type(1) {
      padding-left: 18px;
    }
  }

  /deep/ .el-table__body-wrapper {
    height: calc(100vh - 220px);
  }

  /*.page {*/
  /*margin: 4px 25px 30px;*/
  /*}*/
  @media screen and (orientation: portrait) {
    .more-dialog {
      height: 87vw;
    }

    /deep/ .el-table__body-wrapper {
      height: calc(100vw - 220px);
    }
  }

</style>
