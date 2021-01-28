<template>
  <div class="outPut-wrapper">
    <div class="outPut-table" ref="outPutTable">
      <!--面包屑-->
      <div class="bread">
        <span v-for="(item,index) in bread.list"
              :key="'bread_' + index"
              @click="navChange(item.name)"
              class="h">
          {{ item.text }}
          <img src="@/icons/enter.png" class="img">
        </span>
      </div>
      <!--table-->
      <el-table
        :data="table.outPutData"
        :border=true
        v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0.49)"
        element-loading-spinner="el-icon-loading"
        element-loading-text="拼命加载中..."
        @selection-change="handleSelectionChange"
        @filter-change="filterHandler"
        @row-click="seeRow"
        @sort-change="sortChangeHandle"
        class="o"
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
          sortable="custom"
          show-overflow-tooltip
          min-width="180">
          <template slot-scope="scope">
            <img src="@/icons/folder-a-icon.png" v-if="['文件夹'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/mp3-a-icon.png" v-else-if="['aiff', 'cd', 'MP3', 'wav', 'wma', 'vqf'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/mp4-a-icon.png" v-else-if="['mp4', '3pg', 'avi', 'asf', 'flv', 'mpeg', 'mov', 'rm', 'wmv'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/ppt-a-icon.png" v-else-if="['ppt'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/word-a-icon.png" v-else-if="['doc', 'docx'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/exe-a-icon.png" v-else-if="['zip', '7z', 'rar', 'rar4', 'tar.gz', 'tar.xz', 'tar.bz2', 'tar.z'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/txt-a-icon.png" v-else-if="['txt'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/html-a-icon.png" v-else-if="['html'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/img-a-icon.png" v-else-if="['ai', 'als', 'avif', 'bmp', 'bit', 'cdr', 'cin', 'cth', 'ct', 'dds', 'dxf', 'exr', 'exif', 'eps', 'fpx', 'gif', 'hdr', 'iff', 'jpg', 'mt', 'nt', 'pcx', 'pcd', 'pic', 'picture','png','psd', 'ppm', 'ps', 'raw', 'rla', 'rgb', 'svg', 'sgi', 'st', 'tga', 'tif', 'tiff', 'tim', 'tt', 'ufo', 'WMF', 'webp', 'xpm', 'yuv', 'zt'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/pdf-a-icon.png" v-else-if="['pdf'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/maya-a-icon.png" v-else-if="['ma', 'mb'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/max-a-icon.png" v-else-if="['max'].some(type => type == scope.row.fileType)" class="a-icon">
            <img src="@/icons/file-a-icon.png" v-else class="a-icon">
            <span class="fileName">{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>
        <!--所属项目-->
        <el-table-column
          label="所属项目"
          show-overflow-tooltip
          :filters="projectList"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.project }}</span>
          </template>
        </el-table-column>
        <!--文件大小【文件夹 不可排序】-->
<!--        <el-table-column-->
<!--          v-if="table.nextTableType !== 'null'"-->
<!--          prop="fileSize"-->
<!--          label="文件大小1"-->
<!--          show-overflow-tooltip-->
<!--          width="140"/>-->
        <!--文件大小【文件 可排序】-->
        <el-table-column
          prop="fileSize"
          label="文件大小"
          sortable="custom"
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
          v-if="table.nextTableType == 'layer' && false"
          width="140"/>
        <!--下载次数 -->
        <el-table-column
          prop="downloadCount"
          label="下载次数"
          sortable="custom"
          show-overflow-tooltip
          v-if="table.nextTableType != 'layer'"
          width="140"/>
        <!--剩余有效期-->
        <el-table-column
          v-if="false"
          prop="date"
          label="剩余有效期（天）"
          sortable="custom"
          show-overflow-tooltip
          width="180"/>
        <!--更新时间-->
        <el-table-column
          prop="updateTime"
          label="更新时间"
          sortable="custom"
          show-overflow-tooltip
          width="240"/>

      </el-table>
    </div>
    <!--分页-->
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :current-page.sync="table.pageIndex"
        :page-size="table.pageSize"
        :total="table.outPutTableTotal">
      </el-pagination>
      <div class="farm-primary-form-btn btn" @click="refreshF(false)">
        <span>{{ $t('public_text.refresh') }}</span>
      </div>
      <div class="gz" @click="openPlugin">
        <img src="@/icons/gz-black.png" class="d">
        <img src="@/icons/gz-blue.png" class="h">
        <span>{{ $t('transportBtn') }}</span>
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
    pFConversion,
    getFileSize
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
          outPutData: [],
          outPutTableTotal: 0,
          pageIndex: 1,
          pageSize: 10,
          sortBy: 'fileName',
          sortType: 0,                  // 排序方向 0递减 1递增
          selectionList: [],            // 渲染输出选中项
          rowUuid: null,                // 选中行Uuid
          nextTableType: 'layer',
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
          ]
        },
        loading: false
      }
    },
    props: {
      keyword: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapState(['user', 'socket_plugin'])
    },
    methods: {
      // 排序
      sortChangeHandle({column, prop, order}) {
        console.log(prop)
        let {table} = this
        if (order == 'ascending') table.sortType = 1
        else table.sortType = 0
        if (!order) table.sortBy = 'fileName'
        else table.sortBy = prop
        this.refreshF(false)
      },
      // 打开【传输列表】
      openPlugin() {
        if (this.socket_plugin) this.$store.commit('WEBSOCKET_PLUGIN_SEND', 'open')
        else this.$store.dispatch('WEBSOCKET_PLUGIN_INIT', true).then(() => this.$store.commit('WEBSOCKET_PLUGIN_SEND', 'open'))
      },
      // 刷新
      refreshF(refresh) {
        if (refresh) this.$emit('clearInput', 'render')
        let step = this.table.nextTableType
        if (step == 'layer') this.getList()
        else if (step == 'frame') this.getLayerList()
        else this.getFrameList()
      },
      // 翻页
      handleCurrentChange(val) {
        if (this.table.nextTableType == 'layer') {
          this.getList()
        } else if (this.table.nextTableType == 'frame') {
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
        let {table, bread} = this
        this.$emit('clearInput')
        table.rowUuid = row.itemUuid
        if (table.nextTableType == 'layer') {
          this.getLayerList()
          table.objectName = row.project
          table.layerObj = row
          bread.list.push({
            text: row.fileName,
            name: 'layer'
          })
        }
        if (table.nextTableType == 'frame') {
          this.getFrameList()
          table.frameObj = row
          bread.list.push({
            text: row.fileName,
            name: 'frame'
          })
        }
      },
      // 查询主任务
      async getList() {
        this.loading = true
        this.fullscreenLoading = true
        let {table, keyword} = this,
          {pageIndex, pageSize, sortBy, sortType} = table,
          {data} = await assetsExportMain(pFConversion({
            keyword,
            pageIndex,
            pageSize,
            sortBy,
            sortType
          })),
          projectList = new Set()
        this.fullscreenLoading = false
        table.main = true
        table.outPutData = data.data.map(curr => {
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
            updateTime: createDateFun(curr.updateTime),         // 更新时间
            itemUuid: curr.taskUuid,
            type: 'task'
          }
        })
        this.projectList = [...projectList].map(item => ({
          'text': item,
          'value': item
        }))
        table.outPutTableTotal = data.total
        this.loading = false
      },
      // 查询层任务
      async getLayerList() {
        this.loading = true
        this.fullscreenLoading = true
        let {table, keyword} = this,
          {rowUuid, pageIndex, pageSize, objectName, sortBy, sortType} = table,
          {data} = await assetsExportLayer(pFConversion({
            'taskUuid': rowUuid,
            keyword,
            pageIndex,
            pageSize,
            sortBy,
            sortType
          }))
        this.fullscreenLoading = false
        table.nextTableType = 'frame'
        table.outPutData = data.data.map(curr => {
          return {
            id: curr.layerNo,                   // 任务ID
            fileName: curr.layerName,           // 文件名
            project: objectName,                // 所属项目
            fileSize: curr.fileSize,            // 文件大小
            fileType: '文件夹',                  // 文件类型
            downloadCount: '-',                 // 下载次数
            date: '',                           // 剩余有效期（天）
            updateTime: createDateFun(curr.updateTime),     // 更新时间
            itemUuid: curr.layerTaskUuid,       // 层任务Uuid
            mainUuid: curr.taskUuid,            // 主任务Uuid
            mainTaskSceneName: curr.fileName,   // 主场景文件
            type: 'layer'
          }
        })
        table.outPutTableTotal = data.total
        this.loading = false
      },
      // 查询帧任务
      async getFrameList() {
        this.loading = true
        this.fullscreenLoading = true
        let {table, keyword} = this,
          {rowUuid, pageIndex, pageSize, objectName, sortBy, sortType} = table,
          {data} = await assetsExportFrame(pFConversion({
            'layerTaskUuid': rowUuid,
            keyword,
            pageIndex,
            pageSize,
            sortBy,
            sortType
          }))
        this.fullscreenLoading = false
        table.nextTableType = 'null'
        table.outPutData = data.data.map(curr => {
          let fileType = curr.fileName.split('.')
          return {
            fileName: curr.fileName,                        // 文件名
            project: objectName,                            // 所属项目
            fileSize: getFileSize(curr.fileSize),           // 文件大小
            fileType: fileType[fileType.length - 1],        // 文件类型
            downloadCount: curr.downloadCount,              // 下载次数
            date: curr.indate == 0 ? '-' : consum(curr.indate - new Date().getTime()), // 剩余有效期（天）
            updateTime: createDateFun(new Date(curr.updateTime)),                      // 更新时间
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
        table.outPutTableTotal = data.total
        this.loading = false
      },
      // nav change
      navChange(name) {
        let {table, bread} = this
        switch (name) {
          case 'main':
            table.nextTableType = 'layer'
            table.objectName = null
            table.layerObj = {}
            table.frameObj = {}
            bread.list.splice(1, 2)
            this.getList()
            break
          case 'layer':
            table.nextTableType = 'frame'
            table.frameObj = {}
            bread.list.splice(2, 1)
            table.rowUuid = table.layerObj.itemUuid
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
              if (this.table.selectionList[0]['type'] == 'layer' || this.table.selectionList[0]['type'] == 'task')
                for (const taskItem of this.table.selectionList) {
                  let val
                  if (taskItem.type == 'layer') val = `transferType=2&userID=${this.user.id}&isRender=1&parent=&taskUuid=${taskItem['mainUuid']}&layerTaskUuid=${taskItem['itemUuid']}&fileName=${taskItem['mainTaskSceneName']}`
                  else val = `transferType=2&userID=${this.user.id}&isRender=1&parent=${taskItem['id'] + '-' + taskItem['taskSceneName']}&taskUuid=${taskItem['taskUuid']}&layerTaskUuid=&fileName=${taskItem['taskSceneName']}`
                  let {data} = await downloadCompleteFrame(val)
                  this.$store.commit('WEBSOCKET_PLUGIN_SEND', data.data)
                }
              else {
                // 下载帧任务
                let {data} = await downloadCompleteFrameMini({
                  'transferType': 2,
                  'userID': this.user.id,
                  isRender: 1,
                  parent: '',
                  fileName: this.table.selectionList[0]['taskFileName'],
                  layerTaskUuid: this.table.selectionList[0]['layerTaskUuid'],
                  frameTaskUuid: this.table.selectionList.map(frame => frame.frameTaskUuid)
                })
                this.$store.commit('WEBSOCKET_PLUGIN_SEND', data.data)
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
              if (this.table.nextTableType == 'layer') type = 1   // 主任务
              if (this.table.nextTableType == 'frame') type = 2   // 层任务
              let data = await assetsDeleteItem({
                type,
                uuidList: this.table.selectionList.map(item => {
                  if (type == 3) return item.frameTaskUuid
                  return item.itemUuid
                })
              })

              if (data.data.code == 204) {
                messageFun('success', '操作成功')
                if (type == 1) await this.getList()
                if (type == 2) await this.getLayerList()
                if (type == 3) await this.getFrameList()
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
      'table.nextTableType': {
        handler: function (val) {
          if (val == 'frame') this.$emit('showJump', true)
          else this.$emit('showJump', false)
        },
        immediate: true
      }
    }
  }
</script>

<style lang="less" scoped>
  .fileName {
    padding-left: 1px;
    vertical-align: text-bottom;
  }
</style>
