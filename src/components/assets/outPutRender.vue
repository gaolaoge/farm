<template>
  <div class="outPut-wrapper">
    <div class="outPut-table"
         ref="outPutTable">
      <!--面包屑-->
      <div class="bread">
        <span v-for="(item,index) in bread.list"
              :key="index"
              @click="navChange(item.name)"
              class="h">
          {{ item.text }}
          <img src="@/icons/enter.png" alt="" class="img">
        </span>
      </div>
      <!--table-->
      <el-table
        :data="table.outPutData"
        @selection-change="handleSelectionChange"
        @filter-change="filterHandler"
        @row-click="seeRow"
        class="o"
        :border=true
        style="width: 100%">

        <el-table-column
          type="selection"
          align="right"
          show-overflow-tooltip
          min-width="58"
          width="58"/>
        <!--文件名-->
        <el-table-column
          prop="fileName"
          label="文件名"
          sortable
          show-overflow-tooltip
          min-width="180"/>
        <!--所属项目-->
        <el-table-column
          label="所属项目"
          show-overflow-tooltip
          :filters="projectList"
          width="200">
          <template slot-scope="scope">
                  <span>
                    {{ scope.row.project }}
                  </span>
          </template>
        </el-table-column>
        <!--文件大小-->
        <el-table-column
          prop="fileSize"
          label="文件大小"
          sortable
          show-overflow-tooltip
          width="140"/>
        <!--文件类型-->
        <el-table-column
          prop="fileType"
          label="文件类型"
          show-overflow-tooltip
          width="140"/>
        <!--下载情况 -->
        <el-table-column
          prop="downLoadTime"
          label="下载情况"
          sortable
          show-overflow-tooltip
          v-if="table.nextTbaleType == 'layer' && false"
          width="140"/>
        <!--下载次数 -->
        <el-table-column
          prop="downLoadTime"
          label="下载次数"
          sortable
          show-overflow-tooltip
          v-if="table.nextTbaleType != 'layer'"
          width="140"/>
        <!--剩余有效期-->
        <el-table-column
          v-if="false"
          prop="date"
          label="剩余有效期（天）"
          sortable
          show-overflow-tooltip
          width="180"/>
        <!--更新时间-->
        <el-table-column
          prop="upDate"
          label="更新时间"
          sortable
          show-overflow-tooltip
          width="240"/>

      </el-table>
    </div>
    <!--分页-->
    <div class="page">
      <el-pagination
        background
        :current-page.sync="table.pageIndex"
        @current-change="handleCurrentChange"
        :page-size="table.pageSize"
        layout="prev, pager, next, jumper"
        :total="table.outPutTableTotal">
      </el-pagination>
      <div class="farm-primary-form-btn btn" @click="refreshF(false)">
        <span>{{ refresh }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    assetsExportMain,
    assetsExportLayer,
    assetsExportFrame,
    assetsDeleteItem,
    seeBalance
  } from '@/api/api'
  import {
    downloadCompleteFrame,
    downloadCompleteFrameMini
  } from '@/api/task-api'
  import {
    consum,
    createDateFun,
    messageFun,
  } from '@/assets/common.js'
  import {
    mapState
  } from 'vuex'

  export default {
    name: 'outPut',
    data() {
      return {
        fullscreenLoading: false,
        table: {
          outPutData: [
            // {
            //   id: '',               //任务ID
            //   fileName: '',         //文件名
            //   project: '',          //所属项目
            //   fileSize: '',         //文件大小
            //   fileType: '',         //文件类型
            //   downLoadTime: '',     //已下载次数
            //   date: '',             //剩余有效期（天）
            //   upDate: '',           //更新时间
            // },
          ],
          outPutTableTotal: 0,
          pageIndex: 1,
          pageSize: 10,
          selectionList: [],            // 渲染输出选中项
          rowUuid: null,                // 选中行Uuid
          nextTbaleType: 'layer',
          objectName: null,             // 项目名
          layerObj: {},                 // 层名
          frameObj: {}                  // 帧名
        },
        projectList: [],
        bread: {
          list: [
            {
              text: '资产',
              name: 'main'
            }
          ],
        },
        refresh: '刷新'
      }
    },
    props: {
      searchInputVal: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapState(['user', 'socket_plugin'])
    },
    methods: {
      // 刷新
      refreshF(refresh) {
        if(refresh) this.$emit('clearInput', 'render')
        let step = this.table.nextTbaleType
        if (step == 'layer') this.getList()
        else if (step == 'frame') this.getLayerList()
        else this.getFrameList()
        if(!refresh) this.$emit('clearInput', 'render')
      },
      // 翻页
      handleCurrentChange(val) {
        if (this.table.nextTbaleType == 'layer') {
          this.getList()
        } else if (this.table.nextTbaleType == 'frame') {
          this.getLayerList()
        } else {
          this.getFrameList()
        }
      },
      // 多选
      handleSelectionChange(val) {
        this.table.selectionList = val
        this.$emit('renderSelectionF', val)
      },
      // 筛选条件发生变化
      filterHandler(value, row, column) {
        console.log(value, row, column)
      },
      // 主任务table 查看层任务
      seeRow(row) {
        this.$emit('clearInput')
        this.table.rowUuid = row.itemUuid
        if (this.table.nextTbaleType == 'layer') {
          this.getLayerList()
          this.table.objectName = row.project
          this.table.layerObj = row
          this.bread.list.push({
            text: row.fileName,
            name: 'layer'
          })
        }
        if (this.table.nextTbaleType == 'frame') {
          this.getFrameList()
          this.table.frameObj = row
          this.bread.list.push({
            text: row.fileName,
            name: 'frame'
          })
        }
      },
      // 查询主任务
      async getList() {
        this.fullscreenLoading = true
        // {
        //   keyword: '',         // 关键字
        //   pageIndex: '',
        //   pageSize: '',
        //   projectUuid: ''      // 选中项Uuid
        // }
        let t = `keyword=${this.searchInputVal}&pageIndex=${this.table.pageIndex}&pageSize=${this.table.pageSize}`,
          data = await assetsExportMain(t),
          projectList = new Set()
        this.fullscreenLoading = false
        this.table.main = true
        this.table.outPutData = data.data.data.map(curr => {
          let downLoadTime = curr.downloadFrameCount == 0 ? '未下载' : curr.downloadFrameCount == curr.allFrameCount ? '已下载' : '部分下载'
          projectList.add(curr.projectName)
          return {
            id: curr.taskNo,                                    // 任务ID
            fileName: curr.taskNo + ' _ ' + curr.fileName,      // 文件名
            taskSceneName: curr.fileName,                       // 场景名
            taskUuid: curr.taskUuid,                            // Uuid
            project: curr.projectName,                          // 所属项目
            fileSize: '-',                                      // 文件大小
            fileType: '文件夹',                                  // 文件类型
            downLoadTime,                                       // 下载状态
            date: '-',                                          // 剩余有效期（天）
            upDate: createDateFun(new Date(curr.updateTime)),   // 更新时间
            itemUuid: curr.taskUuid,
            type: 'task'
          }
        })
        this.projectList = [...projectList].map(item => {
          return {
            'text': item,
            'value': item
          }
        })
        this.table.outPutTableTotal = data.data.total
      },
      // 查询层任务
      async getLayerList() {
        this.fullscreenLoading = true
        // {
        //   keyword: '',         // 关键字
        //   pageIndex: '',
        //   pageSize: '',
        //   taskUuid: ''      // 选中项Uuid
        // }
        let t = `taskUuid=${this.table.rowUuid}&keyword=${this.searchInputVal}&pageIndex=${this.table.pageIndex}&pageSize=${this.table.pageSize}`,
          data = await assetsExportLayer(t)
        this.fullscreenLoading = false
        this.table.nextTbaleType = 'frame'
        this.table.outPutData = data.data.data.map(curr => {
          return {
            id: curr.layerNo,                   // 任务ID
            fileName: curr.layerName,           // 文件名
            project: this.table.objectName,     // 所属项目
            fileSize: curr.fileSize,            // 文件大小
            fileType: '文件夹',                  // 文件类型
            downLoadTime: '-',                  // 下载次数
            date: '',                           // 剩余有效期（天）
            upDate: createDateFun(new Date(curr.updateTime)),  // 更新时间
            itemUuid: curr.layerTaskUuid,       // 层任务Uuid
            mainUuid: curr.taskUuid,            // 主任务Uuid
            mainTaskSceneName: curr.fileName,   // 主场景文件
            type: 'layer'
          }
        })
        this.table.outPutTableTotal = data.data.total
      },
      // 查询帧任务
      async getFrameList() {
        this.fullscreenLoading = true
        // {
        //   keyword: '',           // 关键字
        //   pageIndex: '',
        //   pageSize: '',
        //   layerTaskUuid: ''      // 选中项Uuid
        // }
        let t = `layerTaskUuid=${this.table.rowUuid}&keyword=${this.searchInputVal}&pageIndex=${this.table.pageIndex}&pageSize=${this.table.pageSize}`,
          data = await assetsExportFrame(t)
        this.fullscreenLoading = false
        this.table.nextTbaleType = 'null'
        this.table.outPutData = data.data.data.map(curr => {
          let fileType = curr.fileName.split('.')
          return {
            fileName: curr.fileName,                        // 文件名
            project: this.table.objectName,                 // 所属项目
            fileSize: curr.fileSize,                        // 文件大小
            fileType: fileType[fileType.length - 1],        // 文件类型
            downLoadTime: curr.downloadCount,               // 下载次数
            date: curr.indate == 0 ? '-' : consum(curr.indate - new Date().getTime()), // 剩余有效期（天）
            upDate: createDateFun(new Date(curr.updateTime)),                        // 更新时间
            itemUuid: curr.taskUuid,
            layerNo: curr.layerNo,
            frameTaskUuid: curr.frameTaskUuid,
            layerTaskUuid: curr.layerTaskUuid,
            taskFileName: curr.taskFileName,
            layerFileName: curr.layerName,
            outputPath: curr.outputPath,
            type: 'frame'
          }
        })
        // console.log(this.table.outPutData)
        this.table.outPutTableTotal = data.data.total
      },
      // nav change
      navChange(name) {
        switch (name) {
          case 'main':
            this.table.nextTbaleType = 'layer'
            this.table.objectName = null
            this.table.layerObj = {}
            this.table.frameObj = {}
            this.bread.list.splice(1, 2)
            this.getList()
            break
          case 'layer':
            this.table.nextTbaleType = 'frame'
            this.table.frameObj = {}
            this.bread.list.splice(2, 1)
            this.table.rowUuid = this.table.layerObj.itemUuid
            this.getLayerList()
            break
          case 'frame':
            break
        }
      },
      // 下载选中项 - 前期预判
      downloadFun() {
        if (!this.table.selectionList.length) return false
        if (!this.socket_plugin) this.$store.dispatch('WEBSOCKET_PLUGIN_INIT', true).then(() => this.downloadingFun())
        else this.downloadingFun()
        // let r = await seeBalance()
        // if (r.data.code == 1001) {
        //   messageFun('info', `当前账户余额为${r.data.data}，请先进行充值！`);
        //   return false
        // }
      },
      // 下载选中项 - ing
      async downloadingFun() {
        this.$confirm('将下载选中选, 是否继续?', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            async () => {
              if (this.table.selectionList[0]['type'] == 'layer' || this.table.selectionList[0]['type'] == 'task') for (const taskItem of this.table.selectionList) {
                let val
                if (taskItem.type == 'layer') val = `transferType=2&userID=${this.user.id}&isRender=1&parent=&taskUuid=${taskItem['mainUuid']}&layerTaskUuid=${taskItem['itemUuid']}&fileName=${taskItem['mainTaskSceneName']}`
                else val = `transferType=2&userID=${this.user.id}&isRender=1&parent=${taskItem['id'] + '-' + taskItem['taskSceneName']}&taskUuid=${taskItem['taskUuid']}&layerTaskUuid=&fileName=${taskItem['taskSceneName']}`
                let data = await downloadCompleteFrame(val)
                this.$store.commit('WEBSOCKET_PLUGIN_SEND', data.data.data)
              } else {
                // 下载帧任务
                let data = await downloadCompleteFrameMini({
                  'transferType': 2,
                  'userID': this.user.id,
                  isRender: 1,
                  parent: '',
                  fileName: this.table.selectionList[0]['taskFileName'],
                  layerTaskUuid: this.table.selectionList[0]['layerTaskUuid'],
                  frameTaskUuid: this.table.selectionList.map(frame => frame.frameTaskUuid)
                })
                this.$store.commit('WEBSOCKET_PLUGIN_SEND', data.data.data)
              }
            },
            () => messageFun('info', '已取消下载')
          )
      },
      // 删除选中项
      deleteFun() {
        if (!this.table.selectionList.length) return false
        this.$confirm('将删除选中选, 是否继续?', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            async () => {
              let type = 3   // 帧任务
              if (this.table.nextTbaleType == 'layer') type = 1   // 主任务
              if (this.table.nextTbaleType == 'frame') type = 2   // 层任务
              let data = await assetsDeleteItem({
                type,
                uuidList: this.table.selectionList.map(item => {
                  if (type == 3) return item.frameTaskUuid
                  return item.itemUuid
                })
              })

              if (data.data.code == 204) {
                messageFun('success', '操作成功')
                if (type == 1) this.getList()
                if (type == 2) this.getLayerList()
                if (type == 3) this.getFrameList()
              } else messageFun('error', '报错，操作失败')
            },
            () => messageFun('info', '已取消删除')
          )
      }
    },
    mounted() {
      this.getList()
    },
    watch: {
      'table.nextTbaleType': {
        handler: function(val) {
          if(val == 'frame') this.$emit('showJump', true)
          else this.$emit('showJump', false)
        },
        immediate: true
      }
    }
  }
</script>
