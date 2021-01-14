<template>
  <div class="bill-wrapper">
    <!--公共部分-->
    <div class="personInfo">
      <div class="info">
        <img :src="user.avatar ? user.avatar : require('@/assets/userImg.png')" class="avatar">
        <div class="name">
          {{ user.name }}
        </div>
        <div class="level">
          <img :src="info.levelIcon" class="i">
          <span>
            {{ user.level }}
          </span>
        </div>
      </div>
      <div class="data">
        <div class="a">
          <div class="label">
            {{ info.balanceLabel }}
          </div>
          <div class="balance">
            {{ user.balance }}
          </div>
        </div>
        <div class="l"></div>
        <div class="b">
          <!--立即充值-->
          <div class="btn" @click="$router.push('/upTop')"><span>{{ info.btn }}</span></div>
          <!--立即开票-->
          <div class="btn n" @click="$router.push('/invoiceImmediately')"><span>{{ info.btnn }}</span></div>
        </div>
      </div>
    </div>
    <!--table-->
    <div class="tableGroup">
      <div class="navList">
        <span class="navBtn"
              :class="[{'active': index == table.navListActiveIndex}]"
              @click="table.navListActiveIndex = index"
              v-for="(item,index) in table.navList"
              :key="index">
          {{ item.text }}
        </span>
      </div>
      <!--统计-->
      <div class="remind">
        <!--充值记录统计-->
        <span v-show="table.navListActiveIndex == 0" class="t">
          <span class="it">
            <span class="label">
              {{ remind.payLabel }}：
            </span>
            <span class="val">
              {{ user.payAmount }}
            </span>
          </span>
          <span class="it">
            <span class="label">
              {{ remind.gainLabel }}：
            </span>
            <span class="val">
              {{ user.goldCoins }}
            </span>
          </span>
        </span>
        <!--消费记录统计-->
        <span v-show="table.navListActiveIndex == 1" class="t">
          <span class="it">
            <span class="label">
              {{ remind.consumptionLabel }}：
            </span>
            <span class="val">
              {{ user.consumption }}
            </span>
          </span>
        </span>
        <!--开票记录统计-->
        <span v-show="table.navListActiveIndex == 2" class="t">
          <span class="it">
            <span class="label">
              {{ remind.cumulativeBillingAmount }}：
            </span>
            <span class="val">
              {{ user.totalInvoiceAmount }}
            </span>
          </span>
          <span class="it">
            <span class="label">
              {{ remind.invoicableAmount }}：
            </span>
            <span class="val">
              {{ user.totalInvoiceAble }}
            </span>
          </span>
        </span>
      </div>
      <!--table-->
      <div class="tableList">
        <!--充值中心-->
        <div ref="rechargeTable"
             class="rechargeTable"
             v-show="table.navListActiveIndex == 0">
          <!--充值中心表格-->
          <recharge-centre/>
        </div>
        <!--消费记录-->
        <div ref="consumptionTable"
             class="consumptionTable"
             v-show="table.navListActiveIndex == 1">
          <!--消费记录表格-->
          <consumption/>
        </div>
        <!--开票记录-->
        <div ref="invoicingTable"
             class="invoicingTable"
             v-show="table.navListActiveIndex == 2">
          <!--开票记录表格-->
          <invoicing/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import rechargeCentre from '@/components/bill/rechargeCentre-tableM.vue'
  import consumption from '@/components/bill/consumption-tableM.vue'
  import invoicing from '@/components/bill/invoice-tableM.vue'
  import {
    mapState
  } from 'vuex'
  import {
    createTableIconList
  } from '@/assets/common.js'

  export default {
    name: 'bill',
    data() {
      return {
        info: {
          levelIcon: require('@/icons/vipIcon.png'),
          balanceLabel: '账户余额(金币)：',
          balanceVal: 'null',
          btn: '立即充值',
          btnn: '立即开票'
        },
        remind: {
          payLabel: '累计支付金额',
          gainLabel: '累计到账金币',
          consumptionLabel: '累计消费金币',
          cumulativeBillingAmount: '累计开票金额',
          invoicableAmount: '可开票金额'
        },
        table: {
          navListActiveIndex: 0,
          navList: [
            {
              text: '充值记录'
            },
            {
              text: '消费记录'
            },
            {
              text: '开票记录'
            }
          ]
        }
      }
    },
    mounted() {
      createTableIconList()
    },
    components: {
      rechargeCentre,
      consumption,
      invoicing
    },
    computed: {
      ...mapState(['user'])
    },
    watch: {
      '$route.params': {
        handler: function(val){
          if(val.index) this.table.navListActiveIndex = val.index
        },
        immediate: true
      }
    }
  }
</script>

<style lang="less" scoped>
  .bill-wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .personInfo {
      margin: 0px 20px 20px 50px;
      height: 191px;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 4px 20px 0px rgba(27, 83, 244, 0.05);
      border-radius: 14px;
      display: flex;
      align-items: center;
      overflow: hidden;
      flex-shrink: 0;

      .info {
        width: 240px;
        height: 100%;
        background-color: RGBA(250, 251, 253, 1);
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        box-shadow: inset -15px 0px  10px -15px rgba(0, 0, 0, 0.11);

        .avatar {
          margin-bottom: 10px;
          width: 60px;
          border-radius: 16px;
          padding: 5px;
          border: 1px solid rgba(22, 29, 37, 0.09);
        }

        .name {
          font-size: 14px;
          font-weight: 600;
          color: rgba(22, 29, 37, 1);
          font-family: NexaBold;
        }

        .level {
          margin-top: 5px;

          .i {
            width: 12px;
            margin-right: 3px;
          }

          span {
            font-size: 12px;
            color: rgba(22, 29, 37, 0.3);
          }
        }
      }

      .data {
        display: flex;

        .a {
          padding-left: 60px;
          box-sizing: border-box;
          width: 400px;

          .label {
            font-size: 14px;
            font-weight: 500;
            color: rgba(27, 83, 244, 1);
            margin-bottom: 4px;
          }

          .balance {
            font-size: 30px;
            font-weight: 600;
            color: rgba(27, 83, 244, 1);
            line-height: 37px;
            font-family: Cabin-Bold;
          }
        }

        .l {
          width: 1px;
          height: 80px;
          background-color: rgba(22, 29, 37, 0.09);
          user-select: none;
        }

        .b {
          width: 216px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .btn {
          width: 114px;
          height: 30px;
          background-color: rgba(0, 97, 255, 1);
          border: 1px solid rgba(0, 97, 255, 1);
          text-align: center;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 10px;

          span {
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 30px;
          }

          &.n {
            border: 1px solid rgba(22, 29, 37, 0.2);
            background-color: rgba(248, 248, 248, 1);

            span {
              color: rgba(22, 29, 37, 1);
            }
          }
        }
      }


    }

    .tableGroup {
      flex-grow: 1;
      height: calc(100% - 191px - 20px - 20px);

      .remind {
        position: absolute;
        top: 0px;
        right: 0px;

        .t {
          .it {
            font-size: 13px;
            font-weight: 400;
            color: rgba(22, 29, 37, 1);
            margin-right: 30px;
            line-height: 36px;
          }
        }
      }

      .tableList {
        height: calc(100% - 42px);
      }
    }
  }

  /*@media screen and (orientation: portrait) {*/
  /*  .bill-wrapper {*/

  /*  }*/
  /*}*/
</style>

<style lang="less">
  .rechargeTable,
  .consumptionTable,
  .invoicingTable {
    height: 100%;
  }

  .recharge-centre,
  .invoicing,
  .consumption-wrapper {
    overflow: hidden;
    height: 100%;

    /deep/ .el-table__body-wrapper {
      height: calc(100% - 530px);
    }

    /deep/ .el-date-editor {
      .el-range__icon,
      .el-range-separator,
      .el-input__icon.el-range__close-icon {
        line-height: 22px;
      }
    }

    .recharge-table,
    .invoicing-table,
    .recharge-table {
      overflow: hidden;
      height: calc(100% - 52px);

      .filter {
        position: relative;
        height: 50px;
        background-color: rgba(255, 255, 255, 1);
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

      .el-table {
        height: calc(100% - 70px - 9px);
      }

      .el-table__body-wrapper {
        height: 100%;

        tbody {

          overflow-y: scroll;
        }
      }
    }

    .operateBtn,
    .download-tab {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 97, 255, 1);
      text-decoration: underline;
      cursor: pointer;
    }

    .filter-item {
      display: flex;
      align-items: center;

      &.f {
        margin-right: 20px;
      }
    }

    .page {
      margin: 10px;
      display: inline-flex;

      .btn {
        margin-left: 20px;
      }
    }

    /*@media screen and (orientation: portrait) {*/
    /*  /deep/ .el-table__body-wrapper {*/
    /*    height: calc(100vw - 557px);*/
    /*  }*/
    /*}*/
  }
</style>
