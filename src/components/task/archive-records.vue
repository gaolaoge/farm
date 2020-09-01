<template>
  <div class="archive-records">
    <div class="tableBox">
      <!--标签-->
      <div class="btn">
        {{ dialogTable.text }}（{{ dialogTable.total }}）
      </div>
      <!--表格主体-->
      <div class="table">
        <!--表格操作-->
        <div class="dialogOperate">
          <div class="dialogBtnGroup">
            <div class="farm-primary-form-btn"
                 v-for="(item,index) in dialogTable.btnGroup"
                 @click="operatFun(item['text'])"
                 :key="index">
            <span>
              {{ item['text'] }}
            </span>
            </div>
          </div>
          <div class="searchItem">
            <input type="text"
                   v-model="dialogTable.searchInputVal"
                   class="farm-form-input"
                   @keyup.enter="getList"
                   placeholder="输入场景名、任务ID">
            <img src="@/icons/global-search-icon.png"
                 alt=""
                 class="searchIcon"
                 @click="getList">
          </div>
        </div>
        <!--表格-->
        <div class="dialogTable" ref="dialogTable">
          <el-table
            class="gd"
            :data="dialogTable.tableData"
            :tree-props="{'children': 'children'}"
            @select="tableSelect"
            @row-click="showDetails"
            @select-all="selectAll"
            row-key="rowId"
            ref="archiveTable"
            style="width: 100%">

            <el-table-column
              type="selection"
              align="right"
              width="92"/>
            <!--任务ID-->
            <el-table-column
              prop="id"
              label="任务ID"
              sortable
              width="100"/>
            <!--场景名-->
            <el-table-column
              prop="sceneName"
              label="场景名"
              show-overflow-tooltip
              width="180"/>
            <!--状态-->
            <el-table-column
              prop="status"
              label="状态"
              width="110"/>
            <!--所属项目-->
            <el-table-column
              prop="viewProject"
              label="所属项目"
              show-overflow-tooltip
              width="180"/>
            <!--渲染中-->
            <el-table-column
              prop="rendering"
              sortable
              width="100"
              label="渲染中"/>
            <!--等待-->
            <el-table-column
              prop="wait"
              sortable
              width="100"
              label="等待"/>
            <!--暂停-->
            <el-table-column
              prop="timeOut"
              sortable
              width="100"
              label="暂停"/>
            <!--完成-->
            <el-table-column
              prop="carryOut"
              sortable
              width="100"
              label="完成"/>
            <!--失败-->
            <el-table-column
              prop="failure"
              label="失败"
              width="100"
              sortable/>
            <!--渲染时长-->
            <el-table-column
              prop="renderingTime"
              label="渲染时长"
              sortable
              width="180"/>
            <!--渲染费用（金币）-->
            <el-table-column
              prop="renderingCost"
              label="渲染费用（金币）"
              sortable
              width="156"/>
            <!--帧范围-->
            <el-table-column
              prop="frameRange"
              label="帧范围"
              sortable
              width="100"/>
            <!--间隔帧-->
            <el-table-column
              prop="intervalFrame"
              label="间隔帧"
              sortable
              width="100"/>
            <!--相机-->
            <el-table-column
              prop="camera"
              label="相机"
              sortable
              show-overflow-tooltip
              width="120"/>
            <!--层名-->
            <el-table-column
              prop="layerName"
              label="层名"
              sortable
              show-overflow-tooltip
              width="140"/>
            <!--下载情况-->
            <el-table-column
              prop="downloadStatus"
              label="下载情况"
              sortable
              width="110"/>
            <!--渲染开始时间-->
            <el-table-column
              prop="renderDateStart"
              label="渲染开始时间"
              sortable
              width="180"/>
            <!--渲染结束时间-->
            <el-table-column
              prop="renderDateEnd"
              label="渲染结束时间"
              sortable
              width="180"/>
            <!--创建人-->
            <el-table-column
              prop="person"
              label="创建人"
              sortable
              width="120"/>
            <!--创建时间-->
            <el-table-column
              prop="createDate"
              label="创建时间"
              sortable
              width="180"/>

          </el-table>
          <!--分页-->
          <div class="page">
            <el-pagination
              background
              layout="prev, pager, next, jumper"
              :current-page.sync="dialogTable.pageIndex"
              :total="dialogTable.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    createTableIconList,
    createDateFun,
    consum,
    itemDownloadStatus,
    messageFun,
    exportDownloadFun,
    UuidFun
  } from '@/assets/common.js'
  import {
    getRecordList,
    reductionDownloadList,
    compressionFiles,
    seeBalance
  } from '@/api/api'
  import {
    mapState
  } from 'vuex'

  export default {
    name: 'archive-records',
    data() {
      return {
        dialogTable: {
          text: '归档记录',
          total: 0,
          pageSize: 10,
          pageIndex: 1,
          btnGroup: [
            {
              text: '下载完成帧'
            },
            {
              text: '还原到渲染下载'
            }
          ],
          tableData: [],
          dialogTableSelection: [],
          searchInputVal: ''
        },
        attribution: 'drawer'
      }
    },
    computed: {
      ...mapState(['zoneId'])
    },
    methods: {
      // 操作触发
      operatFun(val) {
        switch (val) {
          case '下载完成帧':
            this.downloadLayerFun()
            break
          case '还原到渲染下载':
            this.reductionFUn()
        }
      },
      // 下载完成帧
      async downloadLayerFun() {
        if (!this.dialogTable.dialogTableSelection.length) return false
        let r = await seeBalance()
        if (r.data.code == 1001) {
          messageFun('info', `当前账户余额为${r.data.data}，请先进行充值！`);
          return false
        }
        let taskList = []
        this.dialogTable.dialogTableSelection.forEach(curr => {
          if ('selfIndex' in curr) {
            let i = taskList.findIndex(item => item['taskUuid'] == curr['taskUuid'])
            if (i == -1) taskList.push({taskUuid: curr.taskUuid, layerUuidList: [], hasFather: true})
            if (i != -1) taskList[i]['hasFather'] = true
          } else {
            let i = taskList.findIndex(item => {
              return item['taskUuid'] == curr['FatherTaskUuId']
            })
            if (i != -1) taskList[i]['layerUuidList'].push(curr['layerTaskUuid'])
            if (i == -1) taskList.push({taskUuid: curr.FatherTaskUuId, layerUuidList: [curr.layerTaskUuid]})
          }
        })
        taskList = taskList.map(curr => {
          if (curr['hasFather']) return {'taskUuid': curr.taskUuid, 'layerUuidList': []}
          else return {'taskUuid': '', 'layerUuidList': curr['layerUuidList']}
        })
        messageFun('success', '发起文件打包请求')
        let code = UuidFun(),
          // socket_ = new WebSocket(`ws://192.168.1.182:5000/professional/websocket/package/${code}`)
          socket_ = new WebSocket(`ws://223.80.107.190:5000/professional/websocket/package/${code}`)
        socket_.addEventListener('open', function () {
          socket_.send(JSON.stringify({
            'message': {
              type: 3,
              taskList
            }
          }))
        })
        socket_.addEventListener('message', e => {
          let data = JSON.parse(e.data)
          if (data.code == 200) {
            this.downloadingFun(data.data)
          }
          if (data.code == 209) {
            socket_.close();
            this.downloadingFun(data.data)
          }
        })
      },
      // 打包后下载
      async downloadingFun(path) {
        let data = await compressionFiles(path)
        exportDownloadFun(data, data.headers.file, 'zip')
      },
      // 还原到渲染下载
      reductionFUn() {
        if (!this.dialogTable.dialogTableSelection.length) return false

        this.$confirm('将选中项还原到渲染下载列表, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            async () => {
              let data = await reductionDownloadList({
                taskUuids: this.dialogTable.dialogTableSelection.map(curr => {
                  if ('children' in curr) return curr.rowId
                }),
                zoneUuid: this.zoneId
              })
              if (data.data.code == 200) {
                messageFun('success', '还原成功')
                this.getList()
                this.$emit('refreshTaskBase', '')
              }
            },
            () => messageFun('info', '已取消还原')
          )
          .catch(() => {
          })
      },
      // 上传分析详情查看
      showDetails(row, column, event) {

      },
      // 【非业务逻辑】手动勾选数据行 Checkbox 时触发
      tableSelect(selection, row) {
        let result = selection.some(curr => curr.rowId == row.rowId),     // 【选中事件】or【取消事件】
          tableData = this.dialogTable.tableData,
          allSonSelected = false,
          fatherSelected = false,
          selectionList = this.dialogTable.dialogTableSelection,
          table = this.$refs.archiveTable

        // 事件触发在子项
        if ('FatherId' in row && result) {
          selectionList.push(row)
          // 判断该组子项是否已全部选中进而选中父项
          allSonSelected = tableData[row.FatherIndex]['children'].every(son => selection.some(item => item.rowId == son.rowId))
          if (allSonSelected) {
            fatherSelected = selection.some(item => tableData[row.FatherIndex].rowId == item.rowId)
          }
          // 将父级推入选中项
          if (allSonSelected && !fatherSelected) {
            table.toggleRowSelection(tableData[row.FatherIndex], true)
            selectionList.push(tableData[row.FatherIndex])
          }
        }
        if ('FatherId' in row && !result) {
          selectionList.splice(selection.findIndex(curr => curr.rowId == row.rowId), 1)
          // 父项是否被选中 取消选中
          fatherSelected = selection.findIndex(item => tableData[row.FatherIndex].rowId == item.rowId)
          // 取消父级选中状态
          if (fatherSelected != -1) {
            table.toggleRowSelection(tableData[row.FatherIndex], false)
            selectionList.splice(fatherSelected, 1)
          }
        }

        // 事件触发在父项
        if (!('FatherId' in row) && result) {
          selectionList.push(row)
          // 勾选全部子项
          tableData[row.selfIndex]['children'].forEach(son => {
            // 将此子项勾选
            if (!selection.some(item => item.rowId == son.rowId)) {
              table.toggleRowSelection(son, true)
              selectionList.push(son)
            }
          })
        }
        if (!('FatherId' in row) && !result) {
          // 取消勾选全部子项
          tableData[row.selfIndex]['children'].forEach(son => {
            // 将此子项取消勾选
            let sonDefault = selection.some(item => item.rowId == son.rowId)
            if (sonDefault != -1) {
              table.toggleRowSelection(son, false)
              selectionList.splice(sonDefault, 1)
            }
          })
          // 取消自身勾选
          selectionList.splice(selection.findIndex(curr => curr.rowId == row.rowId), 1)
          table.toggleRowSelection(row, false)
        }
      },
      // 【非业务逻辑】全选
      selectAll(selection) {
        if (!('children' in selection[0])) {
          this.dialogTable.dialogTableSelection = []
          this.dialogTable.tableData.forEach(curr => curr.children.forEach(item => this.$refs.archiveTable.toggleRowSelection(item, false)))
          return false
        }
        let data = []
        this.dialogTable.tableData.forEach(curr => {
          data.push(curr)
          curr.children.forEach(item => {
            data.push(item)
            this.$refs.archiveTable.toggleRowSelection(item, true)
          })
        })
        this.dialogTable.dialogTableSelection = data
      },
      // 获取列表
      async getList() {
        // {
        //   projectIds: '',    // 项目id数组
        //   zoneUuid: '',      // 分区id
        //   queryStr: '',      // 用户输入的查询字符
        //   pageSize: '',      // 分页尺寸
        //   pageIndex: ''      // 当前页
        // }
        let t = `projectIds=&zoneUuid=${this.zoneId}&queryStr=${this.dialogTable.searchInputVal}&pageSize=${this.dialogTable.pageSize}&pageIndex=${this.dialogTable.pageIndex}`,
          data = await getRecordList(t)
        this.dialogTable.total = data.data.total
        this.dialogTable.tableData = data.data.data.map((curr, fatherIndex) => {
          let children
          if (curr['historyLayerTaskDTOList'] != null) children = curr.historyLayerTaskDTOList.map(item => {
            let downloadStatus = ''
            switch (item.downloadStatus) {
              case 0:
                downloadStatus = '待下载'
                break
              case 1:
                downloadStatus = '部分下载'
                break
              case 2:
                downloadStatus = '全部下载'
                break
            }
            return {
              id: '-',
              sceneName: '-',
              status: itemDownloadStatus(item.downloadStatus),
              viewProject: item.projectName,
              rendering: item.renderRunning,
              wait: item.renderWaiting,
              timeOut: item.renderPause,
              carryOut: item.renderFinished,
              failure: item.renderFailed,
              renderingTime: consum(item.useTime),
              renderingCost: item.cost,
              frameRange: item.frameStart + '-' + item.frameEnd,
              intervalFrame: item.frameInterval,
              rowId: item.taskUuid + '-' + item.layerTaskUuid,
              camera: item.camera,
              layerName: item.layerName,
              downloadStatus,
              renderDateStart: createDateFun(new Date(item.startTime)),
              renderDateEnd: createDateFun(new Date(item.endTime)),
              person: item.createByAccount,
              createDate: createDateFun(new Date(item.createTime)),
              layerTaskUuid: item.layerTaskUuid,
              FatherTaskUuId: curr.taskUuid,
              fatherIndex
            }
          })
          return {
            id: curr.taskNo,
            sceneName: curr.taskName,
            status: itemDownloadStatus(curr.renderStatus),
            viewProject: curr.projectName,
            rendering: curr.renderRunning,
            wait: curr.renderWaiting,
            timeOut: curr.renderPause,
            carryOut: curr.renderFinished,
            failure: curr.renderFailed,
            renderingTime: consum(curr.useTime),
            renderingCost: curr.cost,
            frameRange: '-',
            intervalFrame: '-',
            children,
            rowId: curr.taskUuid,
            camera: '-',
            layerName: '-',
            downloadStatus: '-',
            renderDateStart: createDateFun(new Date(curr.startTime)),
            renderDateEnd: createDateFun(new Date(curr.endTime)),
            person: curr.createByAccount,
            createDate: createDateFun(new Date(curr.createTime)),
            selfIndex: fatherIndex,
            taskUuid: curr.taskUuid
          }
        })
      },

    },
    mounted() {
      createTableIconList()
      this.getList()
    }
  }
</script>

<style lang="less" scoped>
  .archive-records {
    .tableBox {
      height: 87vh;

      .btn {
        font-size: 16px;
        color: rgba(27, 83, 244, 1);
        font-family: 'PingFangSCRegular';
        padding: 10px 30px;
        width: 116px;
        text-shadow: 0px 0px 6px rgba(256, 256, 256, 0.4);
        background-color: rgba(255, 255, 255, 1);
        border-radius: 8px 8px 0px 0px;
      }

      .table {
        height: calc(87vh - 42px);
        border-radius: 0px 8px 8px 8px;
        background-color: rgba(255, 255, 255, 1);

        .dialogOperate {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
        }

        .dialogTable {
          position: relative;
          height: calc(87vh - 114px);

          .page {
            position: absolute;
            left: 8px;
            bottom: 14px;
          }
        }
      }
    }
  }
</style>
