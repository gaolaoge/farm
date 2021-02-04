<template>
  <div class="systemTable">
    <div class="btnList">
      <div>
        <div v-for="(item,index) in btnList"
             @click="changeNav(item.val)"
             :class="['btn', {'active': item.val === navIndex}]"
             :key="'btn_' + index">
          <span>{{ item.label }}</span>
        </div>
      </div>
      <span class="readAll"
            v-show="selectionList.length && navIndex != 1"
            @click="readAllMessage">
        {{ readAll }}
      </span>
    </div>
    <div class="table">
      <el-table
        ref="multipleTable"
        :show-header="false"
        :data="table.tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @row-click="rowClick"
        @selection-change="handleSelectionChange">
        <!--多选-->
        <el-table-column
          type="selection"
          align="left"
          width="55"/>
        <!--消息-->
        <el-table-column
          label="消息详情"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="s">
              <span :class="[
                {'readed': scope.row.isRead == 1},
                {'unread': scope.row.isRead == 0}
              ]">
                {{ scope.row.noticeDetail }}
              </span>
            </div>
          </template>
        </el-table-column>
        <!--日期-->
        <el-table-column
          label="日期"
          prop="createTime"
          width="180"/>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        @current-change="jump"
        :current-page.sync="table.currentPage"
        :total="table.total"/>
    </div>
  </div>
</template>

<script>
  import {
    getMessageList,
    getTaskPosition,
    readMessages
  } from "../../api/header-api"
  import {
    createDateFun,
    messageFun,
    pFConversion
  } from '@/assets/common'

  export default {
    name: 'systemTable',
    data() {
      return {
        readAll: '标记为已读',
        btnList: [
          {label: '全部', val: ''},
          {label: '未读', val: 0},
          {label: '已读', val: 1}
        ],
        navIndex: '',
        table: {
          tableData: [],
          total: null,
          currentPage: 1,
        },
        selectionList: []
      }
    },
    methods: {
      // 打开消息详情
      async rowClick(row, column, event) {
        console.log(row)
        let taskUuid = JSON.parse(row.noticeParam)['taskUuid'],
          zoneUuid = row.noticeData.split('&').find(item => item.split('=')[0] == 'zoneUuid').split('=')[1],
          type = row.noticeUrl
        // analyse  =>  分析页面
        // render   =>  渲染页面
        // recharge =>  充值页面
        // info     =>  用户基本信息页面
        if (type == 'info') await this.$router.push('/Pinfo')
        else if (type == 'recharge') await this.$router.push('/upTop')
        else {
          let {data} = await getTaskPosition(pFConversion({
              taskUuid,
              zoneUuid
            })),
            {taskIndex, type} = data.data
          // taskIndex: 1
          // type: 0          0没查到，2分析列表，3渲染列表，4归档列表
          if (type == 0) messageFun('info', '项目已删除')
          else {
            if (this.zoneId != zoneUuid) this.$store.commit('changeZoneId', zoneUuid)
            sessionStorage.setItem('taskListActive', type === 2 ? 0 : 1)
            if (this.$route.name != 'task') await this.$router.push({
              name: 'task',
              params: {
                from: 'stationLetter',
                index: taskIndex,
                taskUuid,
                type
              }
            })
            else this.$store.commit('setTaskState', {
              index: taskIndex,
              taskUuid,
              type
            })
            if (this.messageKey.isRead === 0 && this.messageKey.noticeType === 1) this.navList[0]['num']--
            if (this.messageKey.isRead === 0 && this.messageKey.noticeType === 2) this.navList[1]['num']--
          }
        }
        this.$emit('shutMe')
        let {data} = await readMessages({
          'isRead': 1,
          'noticeUuidList': [row.noticeUuid]
        })
      },
      // 切换信息类别
      changeNav(val) {
        this.navIndex = val
        this.table.currentPage = 1
        this.getList()
      },
      // 批量标记为已读
      async readAllMessage() {
        let {data} = await readMessages({
          'isRead': 1,
          'noticeUuidList': this.selectionList.map(item => item.noticeUuid)
        })
        if (data.code == 201) {
          messageFun('success', '操作成功')
          await this.getList()
        }
      },
      // 多选
      handleSelectionChange(val) {
        this.selectionList = val
      },
      // 跳转
      jump(index) {
        this.table.currentPage = index
        this.getList()
      },
      // 获取信息列表
      async getList() {
        // isRead 是否已读 1已读 0未读 3全部
        // noticeType 1系统 2活动
        // keyword 关键字
        // pageIndex 索引
        // pageSize 页大小
        let {data} = await getMessageList(pFConversion({
          'isRead': this.navIndex,
          'noticeType': 1,
          'keyword': '',
          'pageIndex': this.table.currentPage,
          'pageSize': 10
        }))
        this.table.tableData = data.data.map(item => Object.assign(item, {
            createTime: createDateFun(new Date(item.createTime))
          })
        )
        this.table.total = data.total
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>
