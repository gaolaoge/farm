<template>
  <div class="messageSetting">
    <el-table
      :data="tableData"
      style="width: 100%">

      <el-table-column
        prop="noticeSettingName"
        label="通知名称"
        show-overflow-tooltip
        width="220"/>

      <el-table-column
        prop="noticeSettingDetail"
        label="通知描述"
        show-overflow-tooltip
        min-width="600"/>

      <el-table-column
        width="340"
        label="通知方式">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isMessage" true-label="1" false-label="0" label="站内信"
                       @change="changeCheckBox(scope.row.noticeSettingUuid, scope.row.customerNoticeSettingUuid, 1, scope.row.isMessage)"/>
          <el-checkbox v-model="scope.row.isEmail" true-label="1" false-label="0" label="邮件"
                       @change="changeCheckBox(scope.row.noticeSettingUuid, scope.row.customerNoticeSettingUuid, 2, scope.row.isEmail)"/>
          <el-checkbox v-model="scope.row.isNote" true-label="1" false-label="0" label="短信"
                       @change="changeCheckBox(scope.row.noticeSettingUuid, scope.row.customerNoticeSettingUuid, 3, scope.row.isNote)"/>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
  import {
    getMessageData,
    setMessageData
  } from '@/api/setting-api'
  import {messageFun} from "../../assets/common";

  export default {
    name: 'messageSetting',
    data() {
      return {
        tableData: [
          // {
          //   noticeSettingName: '添加任务通知',
          //   noticeSettingDetail: '任务[任务ID_场景名]已添加到渲染任务列表。',
          //   customerNoticeSettingUuid: null,
          //   noticeSettingUuid
          //   isEmail: null,   // 邮箱
          //   isMessage: null, // 站内信
          //   isNote: null,    // 短信
          // },
        ],
      }
    },
    methods: {
      // 获取设置记录
      async getData() {
        let data = await getMessageData()
        if (data.data.code != 200) return false
        this.tableData = data.data.data.map(item => {
          return Object.assign(item,{
            isEmail: item.isEmail == 1 ? '1' : '0',   // 邮箱
            isMessage: item.isMessage == 1 ? '1' : '0', // 站内信
            isNote: item.isNote == 1 ? '1' : '0',    // 短信
          })
        })
      },
      // 修改设置
      async changeCheckBox(noticeSettingUuid, customerNoticeSettingUuid, noticeWay, noticeStatus){
        let data = await setMessageData({
          noticeSettingUuid,
          customerNoticeSettingUuid,
          noticeWay,
          noticeStatus
        })
        if(data.data.code == 201) messageFun('success', '修改成功')
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>

<style lang="less" scoped>
  .messageSetting {
    height: calc(100vh - 203px);
    padding: 10px;
    box-sizing: border-box;
  }

  /deep/ .el-table .el-table__row:hover::after {
    display: none
  }
</style>
