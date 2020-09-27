<template>
  <div class="messageCenter">
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
      <div class="tableList">
        <!--系统-->
        <div ref="rechargeTable"
             class="rechargeTable"
             v-show="table.navListActiveIndex == 0">
          <!--系统表格-->
          <system-table/>
        </div>
        <!--活动-->
        <div ref="consumptionTable"
             class="consumptionTable"
             v-show="table.navListActiveIndex == 1">
          <!--活动表格-->
          <activity-table/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import systemTable from '@/components/message/system-table'
  import activityTable from '@/components/message/activity-table'

  export default {
    name: 'messageCenter',
    data() {
      return {
        table: {
          navListActiveIndex: 0,
          navList: [
            {
              text: '系统'
            },
            {
              text: '活动'
            }
          ]
        },
      }
    },
    components: {
      systemTable,
      activityTable
    },
  }
</script>

<style lang="less">
  .readed {
    opacity: 0.6;
    font-size: 14px;
  }

  .unread {
    color: rgba(0, 0, 0, 0.9);
  }

  .systemTable,
  .activityTable {
    overflow: hidden;
    padding: 10px;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;

    .btnList {
      padding: 10px 0px;
      display: flex;
      justify-content: space-between;

      .btn {
        display: inline-block;
        width: 68px;
        height: 24px;
        background-color: rgba(248, 248, 248, 1);
        border-radius: 13px;
        text-align: center;
        margin: 0px 15px;
        cursor: pointer;

        span {
          font-size: 14px;
          color: rgba(22, 29, 37, 0.39);
          line-height: 24px;
        }

        &.active {
          background-color: rgba(39, 95, 239, 1);

          span {
            color: rgba(255, 255, 255, 1);
          }
        }
      }
    }

    .table {
      flex-grow: 1;
    }

    .page {

    }
  }

  .readAll {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(22, 29, 37, 0.8);
    margin-right: 40px;
    cursor: pointer;

    &:hover {
      color: rgba(22, 29, 37, 1);
    }
  }

  .s {
    display: flex;
    align-items: center;
    span {
      position: relative;
      font-size: 14px;
    }
  }

  .el-table__body-wrapper {
    height: calc(100vh - 250px);
  }

  .el-table__row {
    td:nth-of-type(3) .cell {
      color: rgba(22, 29, 37, 0.5);
      font-size: 10px;
    }
  }
</style>

<style lang="less" scoped>
  .messageCenter {
    overflow: hidden;
    width: 100%;

    .tableGroup {
      height: calc(100% - 20px);

      .tableList {
        height: calc(100% - 44px);

        .rechargeTable,
        .consumptionTable {
          height: 100%;
        }
      }
    }
  }
</style>
