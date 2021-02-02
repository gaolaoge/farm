<template>
  <div class="messageTable">
    <!--模块切换导航-->
    <div class="nav">
      <ul>
        <li v-for="(item,index) in navList"
            :key="'nav_' + index"
            :class="[{'active': messageKey.noticeType == index + 1}]"
            @click="changeNavTable(index)">
          <span :class="['navLi', {hasNews: item.unReadLength > 0}]">{{ item.name }}</span>
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
              :class="['statusBtn', {'active': messageKey.isRead === item.val}]"
              @click="changeStatusBtn(item.val)">
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>
      <!--系统 all-->
      <div class="item-system" v-show="messageKey.noticeType == 1 && messageKey.isRead !== 0">
        <span v-show="!systemTableData.length" class="null">{{ null_ }}</span>
        <el-table
          v-show="systemTableData.length"
          :show-header=false
          :data="systemTableData"
          @selection-change="systemSelectionChange"
          @row-click="tableClick"
          style="width: 100%">
          <!--多选-->
          <el-table-column
            type="selection"
            align="right"
            width="45"/>
          <!--消息-->
          <el-table-column
            width="250">
            <template slot-scope="scope">
              <span :class="[
                'messageItem',
                {'readed': scope.row.isRead == 1},
                {'unread': scope.row.isRead == 0}
              ]" :title="scope.row.noticeDetail">{{ scope.row.noticeDetail }}</span>
            </template>
          </el-table-column>
          <!--时间-->
          <el-table-column
            prop="createTime"/>
        </el-table>
      </div>
      <!--系统 unread-->
      <div class="item-system" v-show="messageKey.noticeType == 1 && messageKey.isRead === 0">
        <span v-show="!systemUnreadTabData.length" class="null">{{ null_ }}</span>
        <el-table
          v-show="systemUnreadTabData.length"
          :show-header=false
          :data="systemUnreadTabData"
          @selection-change="systemSelectionChange"
          @row-click="tableClick"
          style="width: 100%">
          <!--多选-->
          <el-table-column
            type="selection"
            align="right"
            width="45"/>
          <!--消息-->
          <el-table-column
            width="250">
            <template slot-scope="scope">
              <span :class="[
                'messageItem',
                {'readed': scope.row.isRead == 1},
                {'unread': scope.row.isRead == 0}
              ]" :title="scope.row.noticeDetail">{{ scope.row.noticeDetail }}</span>
            </template>
          </el-table-column>
          <!--时间-->
          <el-table-column
            prop="createTime"/>
        </el-table>
      </div>
      <!--活动 all-->
      <div class="item-activity" v-show="messageKey.noticeType == 2 && messageKey.isRead !== 0">
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
            width="250">
            <template slot-scope="scope">
              <span :class="[
                'messageItem',
                {'readed': scope.row.isRead == 1},
                {'unread': scope.row.isRead == 0}
              ]" :title="scope.row.noticeDetail">{{ scope.row.noticeDetail }}</span>
            </template>
          </el-table-column>
          <!--时间-->
          <el-table-column
            prop="createTime"/>
        </el-table>
      </div>
      <!--活动 unread-->
      <div class="item-activity" v-show="messageKey.noticeType == 2 && messageKey.isRead === 0">
        <span v-show="!activityUnreadTableData.length" class="null">{{ null_ }}</span>
        <el-table
          v-show="activityUnreadTableData.length"
          :show-header=false
          :data="activityUnreadTableData"
          style="width: 100%">
          <!--多选-->
          <el-table-column
            type="selection"
            align="right"
            width="45"/>
          <!--消息-->
          <el-table-column
            width="250">
            <template slot-scope="scope">
              <span :class="[
                'messageItem',
                {'readed': scope.row.isRead == 1},
                {'unread': scope.row.isRead == 0}
              ]" :title="scope.row.noticeDetail">{{ scope.row.noticeDetail }}</span>
            </template>
          </el-table-column>
          <!--时间-->
          <el-table-column
            prop="createTime"/>
        </el-table>
      </div>
      <!--公共模块-footer-->
      <div class="footer">
        <div>
          <!--系统-->
          <span class="s"
                v-show="messageKey.isRead != 1 && messageKey.noticeType == 1"
                @click="readedAll('system')">
            {{ checkboxBtn }}
          </span>
          <!--活动-->
          <span class="s"
                v-show="messageKey.isRead != 1 && messageKey.noticeType == 2"
                @click="readedAll('activity')">
            {{ checkboxBtn }}
          </span>
        </div>
        <span class="showMeAll" @click="showMeAll">{{ all }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getMessageList,
    readMessages,
    getTaskPosition,
  } from "../../api/header-api"
  import {
    createDateFun,
  } from '@/assets/common'
  import {
    mapState
  } from 'vuex'
  import {messageFun, pFConversion} from "../../assets/common";
  import task from "../task";

  export default {
    name: 'messageTable',
    data() {
      return {
        navList: [
          {
            name: '系统',
            unReadLength: 0
          },
          {
            name: '活动',
            unReadLength: 0
          }
        ],
        statusList: [
          {label: '全部', val: ''},
          {label: '未读', val: 0},
          // {label: '已读', val: 1}
        ],
        all: '查看所有消息',
        checkboxBtn: '标记为已读',
        checkboxBtnVal: '',
        systemTableData: [],
        systemUnreadTabData: [],
        activityTableData: [],
        activityUnreadTableData: [],
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
    computed: {
      ...mapState['zoneId', 'user']
    },
    watch: {
      systemUnreadTabData() {
        this.switchMessageStatus()
      },
      activityUnreadTableData() {
        this.switchMessageStatus()
      }
    },
    methods: {
      //
      switchMessageStatus() {
        let status
        status = this.systemUnreadTabData.length || this.activityUnreadTableData.length
        this.navList[0]['unReadLength'] = this.systemUnreadTabData.length
        this.navList[1]['unReadLength'] = this.activityUnreadTableData.length
        this.$emit('changeNewsStatus', status)
      },
      // 打开消息详情
      async tableClick(row, column, event) {
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
            sessionStorage.setItem('taskListActive', type == 2 ? 0 : 1)
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
        if (data.code == 201) {
          await this.getMessageListF()
          if (row.isRead) await this.getMessageListF(true, this.messageKey.noticeType)
        }
      },
      // 标记为已读
      async readedAll(type) {
        let list = type == 'system' ? this.systemSelectionList : this.activitySelectionList
        if (!list.length) return
        let {data} = await readMessages({
          'isRead': 1,
          'noticeUuidList': list.map(item => item.noticeUuid)
        })
        if (data.code == 201) {
          messageFun('success', '操作成功')
          this.$emit('refreshStatus')   // 判断是否存在已读
          await this.getMessageListF()        // 更新当前列表
        }
      },
      // 系统多选
      systemSelectionChange(val) {
        this.systemSelectionList = val
      },
      //活动多选
      activitySelectionChange(val) {
        this.activitySelectionList = val
      },
      // 切换Table
      changeNavTable(index) {
        this.messageKey.noticeType = ++index
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
      async getMessageListF(isRead_, noticeType_) {
        // isRead 是否已读 1已读 0未读 3全部
        // noticeType 1系统 2活动
        // keyword 关键字
        // pageIndex 索引
        // pageSize 页大小
        let {isRead, noticeType, pageIndex} = this.messageKey,
          index_ = noticeType_ || noticeType,
          read = isRead_ ? 0 : isRead,
          {data} = await getMessageList(pFConversion({
            'isRead': read,
            'noticeType': index_,
            pageIndex,
            'pageSize': 10,
            'keyword': ''
          }))
        if (data.code == 200) {
          let halfDay = 1000 * 60 * 60 * 12,                               // 半天的毫秒时
            todayZore = new Date(new Date().toDateString()).getTime(),     // 当日零时时间戳
            yesterdayZore = todayZore - halfDay * 2,                       // 昨天零时时间戳
            theDayBeforeYesterday = todayZore - halfDay * 4,               // 前天零时时间戳
            list = data.data.map(item => {
              let createTime
              if (item.createTime > todayZore) createTime = createDateFun(item.createTime, false, false, true)                    // 当日
              else if (item.createTime > yesterdayZore) createTime = '昨天 ' + createDateFun(item.createTime, false, false, true)
              else if (item.createTime > theDayBeforeYesterday) createTime = '前天 ' + createDateFun(item.createTime, false, false, true)
              else createTime = createDateFun(item.createTime, true)
              return Object.assign(item, {createTime})
            })
          if (index_ == 1 && read !== 0) this.systemTableData = list
          else if (index_ == 1 && read === 0) this.systemUnreadTabData = list
          else if (index_ == 2 && read !== 0) this.activityTableData = list
          else if (index_ == 2 && read === 0) this.activityUnreadTableData = list
        }
      },
      initialization() {
        this.getMessageListF(true, 1)  // 获取站内信列表
        this.getMessageListF(true, 2)  // 获取站内信列表
        this.getMessageListF(false, 1)  // 获取站内信列表
      }
    },
    mounted() {
      this.initialization()
    }
  }
</script>

<style lang="less" scoped>
  .messageTable {
    display: flex;
    background-color: rgba(255, 255, 255, 1);
    height: 100%;

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
          position: relative;
          font-size: 14px;
          color: rgba(22, 29, 37, 0.59);
          line-height: 20px;

          &.hasNews::after {
            position: absolute;
            top: -2px;
            right: -4px;
            content: '';
            width: 8px;
            height: 8px;
            background-color: rgba(255, 62, 77, 0.8);
            border-radius: 50%;
          }
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

        /deep/ .el-checkbox {
          margin-right: 8px;
        }

        .showMeAll,
        .s {
          font-size: 12px;
          color: rgba(22, 29, 37, 0.79);
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

  .messageItem {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .readed {
    opacity: 0.6;
  }

  .unread {
    color: rgba(0, 0, 0, 0.79);
  }
</style>
