<template>
  <div class="activityTable">
    <div class="btnList">
      <div>
        <div class="btn"
             v-for="(item,index) in btnList"
             @click="changeNav(item.val)"
             :class="[{'active': item.val === navIndex}]"
             :key="index">
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
                <div v-show="scope.row.isRead == 0" class="unread"/>
              </span>
            </div>
          </template>
        </el-table-column>
        <!--日期-->
        <el-table-column
          label="日期"
          prop="createTime"
          width="160"/>
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
    readMessages
  } from "../../api/header-api"
  import {
    createDateFun,
    messageFun
  } from '@/assets/common'

  export default {
    name: 'activityTable',
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
        selectionList: [],
      }
    },
    methods: {
      // 切换信息类别
      changeNav(val) {
        this.navIndex = val
        this.table.currentPage = 1
        this.getList()
      },
      // 批量标记为已读
      async readAllMessage() {
        let data = await readMessages({
          'isRead': 1,
          'noticeUuidList': this.selectionList.map(item => item.noticeUuid)
        })
        if (data.data.code == 201) {
          messageFun('success', '操作成功')
          this.getList()
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
      async getList() {
        // isRead 是否已读 1已读 0未读 3全部
        // noticeType 1系统 2活动
        // keyword 关键字
        // pageIndex 索引
        // pageSize 页大小
        let v = `isRead=${this.navIndex}&noticeType=2&keyword=&pageIndex=${this.table.currentPage}&pageSize=10`
        let data = await getMessageList(v)
        this.table.tableData = data.data.data.map(item => {
          return Object.assign(item, {
            createTime: createDateFun(new Date(item.createTime))
          })
        })
        this.table.total = data.data.total
        // {
        //  createBy: "system"
        //  createTime: 1591061954296
        //  customerUuid: "1"
        //  dataStatus: 1
        //  frameTaskUuid: null
        //  id: 1
        //  isRead: 1
        //  isSend: 0
        //  noticeCycle: null
        //  noticeData: null
        //  noticeDetail: "任务[任务ID_场景名]新建成功，请您查看。"
        //  noticeIconPath: ""
        //  noticeParam: ""
        //  noticeTemplateUuid: "ea37a176-058b-49a0-8c48-02e3874da001"
        //  noticeTime: null
        //  noticeTitle: "添加任务通知"
        //  noticeType: 1
        //  noticeUrl: ""
        //  noticeUuid: "1"
        //  noticeWay: 1
        //  requestType: null
        //  updateBy: "1"
        //  updateTime: 1591942821051
        // }
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>
