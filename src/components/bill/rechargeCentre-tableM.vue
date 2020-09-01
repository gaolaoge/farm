<template>
  <div class="recharge-centre">
    <!--table-->
    <div class="recharge-table" ref="rechargeTable">

      <!--条件筛选-->
      <div class="filter">
        <!--交易状态-->
        <div class="filter-item">
          <span class="filter-item-label">
            {{ filter.tradingtatusLabel }}：
          </span>
          <el-select v-model="filter.tradingtatusVal"
                     placeholder="-"
                     class="filter-item-i filter-item-select filter-item-select-mini">
            <el-option
              v-for="item in filter.tradingtatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!--支付方式-->
        <div class="filter-item">
          <span class="filter-item-label">
            {{ filter.paymentMethodLabel }}：
          </span>
          <el-select v-model="filter.paymentMethodVal"
                     placeholder="-"
                     class="filter-item-i filter-item-select filter-item-select-mini">
            <el-option
              v-for="item in filter.paymentMethodList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!--开票标识-->
        <div class="filter-item">
          <span class="filter-item-label">
            {{ filter.markLabel }}：
          </span>
          <el-select v-model="filter.markVal"
                     placeholder="-"
                     class="filter-item-i filter-item-select filter-item-select-mini">
            <el-option
              v-for="item in filter.markList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!--支付账单-->
        <div class="filter-item">
          <span class="filter-item-label">
            {{ filter.singleNumberLabel }}：
          </span>
          <input type="text"
                 class="filter-item-i filter-item-input"
                 placeholder="请输入"
                 @keyup.enter="getList"
                 v-model="filter.singleNumberVal">
        </div>
        <!--查询时间-->
        <div class="filter-item f">
          <span class="filter-item-label">
            {{ filter.inquireLabel }}：
          </span>
          <el-date-picker
            v-model="filter.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <!--查询-->
        <div class="filter-btn primary" @click="getList">
          {{ filter.iquireBtn }}
        </div>
        <!--重置-->
        <div class="filter-btn" @click="reset">
          {{ filter.resetBtn }}
        </div>
        <!--导出记录-->
        <div class="filter-btn r" @click="exportTable">
          {{ filter.exportBtn }}
        </div>
      </div>

      <div class="l"/>

      <!--table-->
      <el-table
        :data="table.rechargeData"
        @selection-change="handleSelectionChange"
        @filter-change="filterHandler"
        class="o"
        :border=true
        style="width: 100%">

        <el-table-column
          type="selection"
          align="right"
          show-overflow-tooltip
          min-width="58"
          width="58"/>
        <!--交易ID-->
        <el-table-column
          prop="id"
          label="交易ID"
          sortable
          show-overflow-tooltip
          min-width="180"/>
        <!--交易状态-->
        <el-table-column
          prop="state"
          label="交易状态"
          show-overflow-tooltip
          width="100">
        </el-table-column>
        <!--实际支付金额（元）-->
        <el-table-column
          prop="realPay"
          label="实际支付金额（元）"
          show-overflow-tooltip
          sortable
          width="200"/>
        <!--充值到账（金币）-->
        <el-table-column
          prop="realArrive"
          label="充值到账（金币）"
          sortable
          show-overflow-tooltip
          width="200"/>
        <!--充值说明 -->
        <el-table-column
          prop="directions"
          label="充值说明"
          show-overflow-tooltip
          width="200"/>
        <!--充值方式-->
        <el-table-column
          prop="paymentMethod"
          label="充值方式"
          show-overflow-tooltip
          width="120"/>
        <!--支付单号-->
        <el-table-column
          label="支付单号"
          show-overflow-tooltip
          width="180">
          <template slot-scope="scope">
            <span @click="copySingleNumber(scope.row.singleNumber)">
              {{ scope.row.singleNumber }}
            </span>
          </template>
        </el-table-column>
        <!--交易时间-->
        <el-table-column
          prop="date"
          label="交易时间"
          show-overflow-tooltip
          width="180"/>
        <!--操作-->
        <el-table-column
          label="操作"
          show-overflow-tooltip
          width="200">
          <template slot-scope="scope">
            <div class="download-tab"
                 @click="operateFun(scope.row)"
                 v-show="scope.row.operate != '-'">
              {{ scope.row.operate }}
            </div>
            <div class="download-tab-none" v-show="scope.row.operate == '-'">
              -
            </div>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!--分页-->
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        @current-change="jump"
        :current-page.sync="table.currentPage"
        :total="table.outPutTableTotal"/>
    </div>
  </div>
</template>

<script>
  import modelCalendar from '@/components/farm-model/farm-calendar'
  import {
    createCalendar,
    getDate,
    exportDownloadFun
  } from '@/assets/common.js'
  import {
    getUpTopTable,
    exportUpTopTable,
    downloadReceipt
  } from '@/api/api'
  import {
    peddingPayment
  } from '@/api/bill-api'

  export default {
    name: 'recharge-centre',
    data() {
      return {
        table: {
          rechargeData: [
            // {
            //   id: '',               //交易ID
            //   state: '',            //交易状态
            //   realPay: '',          //实际支付金额（元）
            //   realArrive: '',       //充值到账（金币）
            //   directions: '',       //充值说明
            //   paymentMethod: '',    //充值方式
            //   singleNumber: '',     //支付单号
            //   date: '',             //交易时间
            //   operate: ''           //操作
            // },
          ],
          outPutTableTotal: 0,
          currentPage: 1,
          pageSize: 10,
          selectionList: [],            //渲染输出选中项
        },
        filter: {
          tradingtatusLabel: '交易状态',
          tradingtatusVal: '-1',
          tradingtatusList: [
            {
              label: '全部',
              value: '-1'
            },
            {
              label: '待付款',
              value: '3'
            },
            {
              label: '成功',
              value: '1'
            },
            {
              label: '失败',
              value: '2'
            }
          ],
          paymentMethodLabel: '支付方式',
          paymentMethodVal: '-1',
          paymentMethodList: [
            {
              label: '全部',
              value: '-1'
            },
            {
              label: '支付宝',
              value: '1'
            },
            // {
            //   label: '微信',
            //   value: '2'
            // }
          ],
          markLabel: '开票标识',
          markVal: '-1',
          markList: [
            {
              label: '全部',
              value: '-1'
            },
            {
              label: '不可开票',
              value: '0'
            },
            {
              label: '未开票',
              value: '1'
            },
            {
              label: '已开票',
              value: '2'
            }
          ],
          singleNumberLabel: '支付单号',
          singleNumberVal: '',
          inquireLabel: '查询时间',
          date: null,
          // inquireValS: 0,
          // inquireValV: new Date(),
          iquireBtn: '查询',
          resetBtn: '重置',
          exportBtn: '导出记录'
        }
      }
    },
    components: {
      modelCalendar
    },
    methods: {
      copySingleNumber(val) {
        let oInput = document.createElement('INPUT')
        oInput.style.display = 'none'
        oInput.value = val
        document.body.appendChild(oInput)
        oInput.select()                    // 选中
        document.execCommand("Copy")       // 复制
        document.body.removeChild(oInput)
      },
      // 充值中心多选
      handleSelectionChange(val) {
        this.table.selectionList = val
      },
      //筛选条件发生变化
      filterHandler(value, row, column) {
        console.log(value, row, column)
      },
      // 时间筛选条件修改
      changeFilterDate(val) {
        [].forEach.call(val, (curr, index) => {
          let [year, month, day] = curr.split('-'),
            r = getDate(year, month, day)
          if (index == 0) {
            this.filter.inquireValS = r
          } else {
            this.filter.inquireValV = r
          }
        })
      },
      // 获取table数据
      async getList() {
        let f = this.filter,
          t = `paymentStatus=${f.tradingtatusVal}&paymentTitle=${f.paymentMethodVal}&invoice=${f.markVal}&productOrderUuid=${f.singleNumberVal}&beginTime=${f.date ? f.date[0].getTime() : 0}&endTime=${f.date ? f.date[1].getTime() : new Date().getTime()}&sortColumn=1&sortBy=1&pageIndex=${this.table.currentPage}&pageSize=${Number(this.table.pageSize)}`,
          data = await getUpTopTable(t)
        this.table.outPutTableTotal = data.data.total
        this.table.rechargeData = data.data.data.map(curr => {
          curr.operate = '-'
          switch (curr.paymentStatus) {
            case 1:
              curr.paymentStatus = '成功'
              if (curr.actualPayment) curr.operate = '下载收据'
              break
            case 2:
              curr.paymentStatus = '失败'
              break
            case 3:
              curr.paymentStatus = '待付款'
              if (curr.actualPayment) curr.operate = '待付款'
              break
          }
          if (!curr.actualPayment) curr.actualPayment = '-'
          let {year, month, day, hour, minutes, seconds} = createCalendar(new Date(curr.updateTime))
          return {
            id: curr.outTradeNo,                // 交易ID
            state: curr.paymentStatus,            // 交易状态
            realPay: curr.actualPayment,          // 实际支付金额（元）
            realArrive: curr.arrivalAmount,       // 充值到账（金币）
            directions: curr.rechargeExplain,     // 充值说明
            paymentMethod: curr.paymentTitle == '1' ? '支付宝' : '-',                      // 充值方式
            singleNumber: curr.productOrderUuid ? curr.productOrderUuid : '-',  // 支付单号
            date: `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`,                // 交易时间
            dateDefault: curr.updateTime,
            invoice: curr.invoice,                // 开票标识
            operate: curr.operate                 // 操作
          }
        })
      },
      // table 筛选条件重置
      reset() {
        Object.assign(this.filter, {
          tradingtatusVal: '-1',
          paymentMethodVal: '-1',
          markVal: '-1',
          singleNumberVal: '',
          // inquireValS: 0,
          // inquireValV: new Date(),
          date: null
        })
        this.getList()
      },
      // 翻页
      jump(val) {
        this.table.currentPage = val
        this.getList()
      },
      // 导出记录
      async exportTable() {
        // {
        //   paymentTitle: 1,   // 支付方式 1支付宝
        //   paymentStatus: 1,  // 交易状态:1成功，2失败；3待付款
        //   invoice: 1,        // 开票标识:0不可开票,1未开票,2已开票
        //   beginTime: '',     // 查询起始时间,时间戳
        //   endTime: '',       // 查询结束时间,时间戳
        //   sortColumn: '',    // 排序字段:0:交易id, 1:交易状态,2:实际支付金额,3:充值到账金币,4:充值说明,5:支付方式,6:支付单号,7:修改时间
        //   sortBy: ''         // 排序方式:0降序,1升序
        // }
        let f = this.filter,
          t = `paymentStatus=${f.tradingtatusVal}&paymentTitle=${f.paymentMethodVal}&invoice=${f.markVal}&outTradeNo=${f.singleNumberVal}&beginTime=${f.date ? f.date[0].getTime() : 0}&endTime=${f.date ? f.date[1].getTime() : new Date().getTime()}&sortColumn=1&sortBy=1&pageIndex=${this.table.currentPage}&pageSize=${Number(this.table.pageSize)}`,
          data = await exportUpTopTable(t)
        // 导出下载
        exportDownloadFun(data, '充值记录', 'xlsx')
      },
      // 操作
      async operateFun(item) {
        let u = {
          outTradeNo: item.singleNumber,
          updateTime: item.dateDefault,
          actualPayment: item.realPay,
          paymentTitle: item.paymentMethod == '支付宝' ? '1' : '2',
          account: JSON.parse(sessionStorage.getItem('info'))['account']
        }
        let t = `outTradeNo=${u['outTradeNo']}&updateTime=${u['updateTime']}&actualPayment=${u['actualPayment']}&paymentTitle=${u['paymentTitle']}&account=${u['account']}`
        if (item.operate == "下载收据") {
          let data = await downloadReceipt(t)
          exportDownloadFun(data, '收据', 'pdf')
        } else if (item.operate == "待付款") {
          let data = await peddingPayment(item.id)
          sessionStorage.setItem('aliPay', data.data.data)
          let routerData = this.$router.resolve({name: 'rechargePage'})
          window.open(routerData.href, '_blank')
        }
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-date-editor {
    .el-range__icon,
    .el-range-separator,
    .el-input__icon.el-range__close-icon {
      line-height: 22px;
    }
  }

  .filter-item {
    display: flex;
    align-items: center;

    &.f {
      margin-right: 20px;
    }
  }

  .recharge-centre {
    overflow: hidden;
  }

  .page {
    margin: 4px 25px 30px;
  }

  /deep/ .el-table__body-wrapper {
    height: calc(100vh - 560px);
  }

  .recharge-table {
    overflow: hidden;

    .filter {
      position: relative;
      height: 50px;
      background: rgba(255, 255, 255, 0);
      border-radius: 4px;
      margin: 20px 10px 0px;
      width: calc(100% - 20px);
      padding: 0px 20px;
      box-sizing: border-box;

      .t {
        width: 200px;
      }

      .r {
        position: absolute;
        right: 0px;
      }
    }

    .l {
      margin-top: 8px;
      background-color: rgba(22, 29, 37, 0.1);
      height: 1px;
    }
  }

  .download-tab {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 97, 255, 1);
    text-decoration: underline;
    cursor: pointer;
  }

  .download-tab-none {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255 0.6);
  }

  @media screen and (orientation: portrait) {
    /deep/ .el-table__body-wrapper {
      height: calc(100vw - 557px);
    }
  }
</style>
