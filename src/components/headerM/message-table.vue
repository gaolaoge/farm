<template>
  <div class="messageTable">
    <!--模块切换导航-->
    <div class="nav">
      <ul>
        <li v-for="(item,index) in navList"
            :key="index"
            :class="[{'active': messageKey.noticeType == index + 1}]"
            @click="changeNavTable(index)">
          <span class="navLi">{{ item }}</span>
        </li>
      </ul>
    </div>
    <!--模块-->
    <div class="moudleList">
      <!--公共模块-btn-->
      <div class="statusBtnList">
        <ul>
          <li v-for="(item,index) in statusList"
              :key="index"
              :class="[{'active': messageKey.isRead === item.val}]"
              class="statusBtn"
              @click="changeStatusBtn(item.val)">
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>
      <!--系统-->
      <div class="item-system" v-show="messageKey.noticeType == 1">
        <span v-show="!systemTableData.length" class="null">{{ null_ }}</span>
        <el-table
          v-show="systemTableData.length"
          :show-header=false
          :data="systemTableData"
          @selection-change="systemSelectionChange"
          style="width: 100%">
          <!--多选-->
          <el-table-column
            type="selection"
            align="right"
            width="45"/>
          <!--消息-->
          <el-table-column
            prop="noticeDetail"
            width="250"/>
          <!--时间-->
          <el-table-column
            prop="createTime"/>
        </el-table>
      </div>
      <!--活动-->
      <div class="item-activity" v-show="messageKey.noticeType == 2">
        <span v-show="!activityTableData.length" class="null">{{ null_ }}</span>
        <el-table
          v-show="activityTableData.length"
          :show-header=false
          :data="activityTableData"
          style="width: 100%">
          <!--多选-->
          <el-table-column
            type="selection"
            align="right"
            width="45"/>
          <!--消息-->
          <el-table-column
            prop="noticeDetail"
            width="250"/>
          <!--时间-->
          <el-table-column
            prop="createTime"/>
        </el-table>
      </div>
      <!--公共模块-footer-->
      <div class="footer">
        <div>
          <!--系统-->
          <el-checkbox v-model="checkboxBtnVal" class="checkbox" v-show="messageKey.isRead != 1 && systemSelectionList.length" />
          <span class="s" v-show="messageKey.isRead != 1 && systemSelectionList.length" @click="readedAll('system')">{{ checkboxBtn }}</span>
          <!--活动-->
          <el-checkbox v-model="checkboxBtnVal" class="checkbox" v-show="messageKey.isRead != 1 && activitySelectionList.length" />
          <span class="s" v-show="messageKey.isRead != 1 && activitySelectionList.length" @click="readedAll('activity')">{{ checkboxBtn }}</span>
        </div>
        <span class="showMeAll" @click="showMeAll">{{ all }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getMessageList,
    readMessages
  } from "../../api/header-api"
  import {
    createDateFun
  } from '@/assets/common'
  import {messageFun} from "../../assets/common";
  export default {
    name: 'messageTable',
    data() {
      return {
        navList: ['系统', '活动'],
        statusList: [
          {label: '全部', val: ''},
          {label: '未读', val: 0},
          {label: '已读', val: 1}
        ],
        all: '查看所有消息',
        checkboxBtn: '标记为已读',
        checkboxBtnVal: '',
        systemTableData: [],
        activityTableData: [],
        null_: '空空如也～',
        messageKey: {
          isRead: '',         // isRead 是否已读 1已读 0未读 null全部
          noticeType: 1,      // noticeType 1系统 2活动
          pageIndex: 1        // pageIndex 索引
        },
        systemSelectionList: [],    // 系统多选结果
        activitySelectionList: [],  // 活动多选结果
      }
    },
    methods: {
      // 标记为已读
      async readedAll(type){
        let list = type == 'system' ? this.systemSelectionList : this.activitySelectionList,
          data = await readMessages({
          'isRead': 1,
          'noticeUuidList': list.map(item => item.noticeUuid)
        })
        if(data.data.code == 201){
          messageFun('success', '操作成功')
          this.getMessageListF()
        }
      },
      // 系统多选
      systemSelectionChange(val){
        this.systemSelectionList = val
      },
      //活动多选
      activitySelectionChange(val){
        this.activitySelectionList = val
      },
      // 切换Table
      changeNavTable(index) {
        this.messageKey.noticeType = ++ index
        this.getMessageListF()
      },
      // 切换btn
      changeStatusBtn(val) {
        this.messageKey.isRead = val
        this.getMessageListF()
      },
      showMeAll() {
        this.$router.push('/messageCenter')
      },
      // 获取站内信列表
      async getMessageListF(){
        // isRead 是否已读 1已读 0未读 3全部
        // noticeType 1系统 2活动
        // keyword 关键字
        // pageIndex 索引
        // pageSize 页大小
        let m = this.messageKey,
          v = `isRead=${m.isRead}&noticeType=${m.noticeType}&keyword=&pageIndex=${m.pageIndex}&pageSize=10`
        let data = await getMessageList(v)
        if(data.data.code == 200){
          if(m.noticeType == 1) this.systemTableData = data.data.data.map(item => {
            return Object.assign(item, {
              createTime: createDateFun(new Date(item.createTime), 'mini')
            })
          })
          else if(m.noticeType == 2) this.activityTableData = data.data.data.map(item => {
            return Object.assign(item, {
              createTime: createDateFun(new Date(item.createTime), 'mini')
            })
          })

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
      }
    },
    mounted() {
      this.getMessageListF()  // 获取站内信列表
    }
  }
</script>

<style lang="less" scoped>
  .messageTable {
    display: flex;
    background-color: rgba(255, 255, 255, 1);

    .nav {
      position: relative;
      z-index: 2;
      width: 80px;
      height: 400px;
      background-color: rgba(241, 244, 249, 1);
      padding: 20px 0px;
      box-sizing: border-box;

      li {
        position: relative;
        margin-bottom: 20px;
        padding-left: 20px;
        cursor: pointer;

        .navLi {
          font-size: 14px;
          color: rgba(22, 29, 37, 0.59);
          line-height: 20px;
        }

        &.active {
          &::before {
            position: absolute;
            left: 0px;
            top: 0px;
            content: '';
            width: 5px;
            height: 20px;
            background-color: rgba(27, 83, 244, 1);
          }

          .navLi {
            font-weight: 600;
            color: rgba(27, 83, 244, 1);
          }
        }
      }
    }

    .moudleList {
      position: relative;
      width: calc(100% - 80px);
      padding: 20px 0px;
      box-sizing: border-box;

      .item-activity,
      .item-system {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100% - 55px);

        .null {
          font-size: 14px;
          font-weight: 400;
          color: rgba(22, 29, 37, 0.4);
          line-height: 20px;
        }
      }

      .statusBtnList {
        padding: 0px 20px;
        box-sizing: border-box;

        .statusBtn {
          display: inline-block;
          width: 60px;
          height: 21px;
          background-color: rgba(248, 248, 248, 1);
          border-radius: 11px;
          text-align: center;
          margin-right: 10px;
          cursor: pointer;

          span {
            font-size: 12px;
            color: rgba(22, 29, 37, 0.4);
            line-height: 21px;
          }

          &.active {
            background-color: rgba(39, 95, 239, 1);

            span {
              color: rgba(255, 255, 255, 1);
            }
          }
        }
      }

      .footer {
        position: absolute;
        bottom: 0px;
        left: 0px;
        display: flex;
        justify-content: space-between;
        height: 55px;
        width: 100%;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 15px 0px rgba(27, 83, 244, 0.1);
        padding: 20px;
        box-sizing: border-box;

        /deep/.el-checkbox {
          margin-right: 8px;
        }

        .showMeAll,
        .s {
          font-size: 12px;
          color: rgba(22, 29, 37, 1);
          cursor: pointer;
        }

        .s {

        }
      }
    }
  }

  .checkbox {
    padding-left: 3px;
  }

  /deep/ .el-table__body-wrapper {
    height: 294px;
    overflow-x: hidden;
    margin-top: 10px;
  }

  /deep/ .el-table__body {
    border-spacing: 0px;
  }

  /deep/ .el-table .el-table__row:hover::after {
    display: none;
  }

  /deep/ .el-table .el-table__row {
    background-color: transparent;
  }

  /deep/ .el-table__row {
    td:nth-of-type(1) .cell {
      padding-right: 8px;
    }

    td:nth-of-type(2) .cell {
      padding-left: 2px;
      color: rgba(22, 29, 37, 0.79);
    }

    td:nth-of-type(3) .cell {
      color: rgba(22, 29, 37, 0.6);
      font-size: 10px;
    }
  }

  /deep/ .el-table td,
  /deep/ .el-table th {
    vertical-align: text-top;
  }
</style>
