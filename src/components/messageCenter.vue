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
