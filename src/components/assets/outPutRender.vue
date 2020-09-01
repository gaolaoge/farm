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
          width="58" />
        <!--文件名-->
        <el-table-column
          prop="fileName"
          label="文件名"
          sortable
          show-overflow-tooltip
          min-width="180" />
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
          width="140" />
        <!--文件类型-->
        <el-table-column
          prop="fileType"
          label="文件类型"
          show-overflow-tooltip
          width="140" />
        <!--下载情况 -->
        <el-table-column
          prop="downLoadTime"
          label="下载情况"
          sortable
          show-overflow-tooltip
          v-if="table.nextTbaleType == 'layer'"
          width="140" />
        <!--下载次数 -->
        <el-table-column
          prop="downLoadTime"
          label="下载次数"
          sortable
          show-overflow-tooltip
          v-if="table.nextTbaleType != 'layer'"
          width="140" />
        <!--剩余有效期-->
        <el-table-column
          prop="date"
          label="剩余有效期（天）"
          sortable
          show-overflow-tooltip
          width="180" />
        <!--更新时间-->
        <el-table-column
          prop="upDate"
          label="更新时间"
          sortable
          show-overflow-tooltip
          width="240" />

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
    </div>
  </div>
</template>

<script>
  import {
    assetsExportMain,
    assetsExportLayer,
    assetsExportFrame,
    assetsDeleteItem,
    compressionFiles,
    downloadFrame,
    seeBalance
  } from '@/api/api'
  import {
    consum,
    createDateFun,
    messageFun,
    UuidFun,
    exportDownloadFun
  } from '@/assets/common.js'

  export default {
    name: 'outPut',
    data(){
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
        projectList:[],
        bread: {
          list: [
            {
              text: '资产',
              name: 'main'
            }
          ],
        }
      }
    },
    props: {
      searchInputVal: {
        type: String,
        default: ''
      }
    },
    methods: {
      // 翻页
      handleCurrentChange(val){
        if(this.table.nextTbaleType == 'layer'){ this.getList() }
        else if(this.table.nextTbaleType == 'frame'){ this.getLayerList() }
        else { this.getFrameList() }
      },
      // 多选
      handleSelectionChange(val){
        this.table.selectionList = val
        this.$emit('renderSelectionF', val)
      },
      // 筛选条件发生变化
      filterHandler(value, row, column){
        console.log(value, row, column)
      },
      // 主任务table 查看层任务
      seeRow(row){
        this.$emit('clearInput')
        this.table.rowUuid = row.itemUuid
        if(this.table.nextTbaleType == 'layer') {
          this.getLayerList()
          this.table.objectName = row.project
          this.table.layerObj = row
          this.bread.list.push({
            text: row.fileName,
            name: 'layer'
          })
        }
        if(this.table.nextTbaleType == 'frame') {
          this.getFrameList()
          this.table.frameObj = row
          this.bread.list.push({
            text: row.fileName,
            name: 'frame'
          })
        }
      },
      // 查询主任务
      async getList(){
        this.$emit('clearInput')
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
            id: curr.taskNo,                    // 任务ID
            fileName: curr.taskNo + ' _ ' + curr.fileName,            // 文件名
            project: curr.projectName,          // 所属项目
            fileSize: '-',                      // 文件大小
            fileType: '文件夹',                 // 文件类型
            downLoadTime,                       // 下载状态
            date: '-',                          // 剩余有效期（天）
            upDate: createDateFun(new Date(curr.updateTime)),  // 更新时间
            itemUuid: curr.taskUuid
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
      async getLayerList(){
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
            id: curr.layerNo,                    // 任务ID
            fileName: curr.layerName,            // 文件名
            project: this.table.objectName,      // 所属项目
            fileSize: curr.fileSize,             // 文件大小
            fileType: '文件夹',                  // 文件类型
            downLoadTime: '-',                  // 下载次数
            date: '',                           // 剩余有效期（天）
            upDate: createDateFun(new Date(curr.updateTime)),  // 更新时间
            itemUuid: curr.layerTaskUuid
          }
        })
        this.table.outPutTableTotal = data.data.total
      },
      // 查询帧任务
      async getFrameList(){
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
            itemUuid: curr.frameTaskUuid,
            frameTaskUuid: curr.frameTaskUuid,
            layerTaskUuid: curr.layerTaskUuid
          }
        })
        this.table.outPutTableTotal = data.data.total
      },
      // nav change
      navChange(name){
        switch(name){
          case 'main':
            this.table.nextTbaleType = 'layer'
            this.table.objectName = null
            this.table.layerObj = {}
            this.table.frameObj = {}
            this.bread.list.splice(1,2)
            this.getList()
            break
          case 'layer':
            this.table.nextTbaleType = 'frame'
            this.table.frameObj = {}
            this.bread.list.splice(2,1)
            this.table.rowUuid = this.table.layerObj.itemUuid
            this.getLayerList()
            break
          case 'frame':
            break
        }
      },
      // 下载item 申请打包
      async downloadFun(){
        if(!this.table.selectionList.length) return false
        let r = await seeBalance()
        if(r.data.code == 1001){ messageFun('info',`当前账户余额为${r.data.data}，请先进行充值！`); return false }
        this.$confirm('将下载选中选, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            async () => {
              let code = 1,
                  type = 3,
                  uuidList = this.table.selectionList.map(item => item.itemUuid)
              if(this.table.nextTbaleType == 'layer') type = 1
              if(this.table.nextTbaleType == 'frame') type = 2
              if(type != 3){
                messageFun('success','发起文件打包请求')
                let code = UuidFun(),
                    // socket_ = new WebSocket(`ws://192.168.1.182:5000/professional/websocket/package/${code}`)
                    socket_ = new WebSocket(`ws://223.80.107.190:5000/professional/websocket/package/${code}`)
                socket_.addEventListener('open',function(){
                  socket_.send(JSON.stringify({
                    'message': {
                      type,
                      uuidList: uuidList
                    }
                  }))
                })
                socket_.addEventListener('message',e => {
                  let data = JSON.parse(e.data)
                  if(data.code == 200){ this.downloadingFun(data.data) }
                  if(data.code == 209){ socket_.close(); this.downloadingFun(data.data) }
                })
              }
              if(type == 3){
                this.table.selectionList.forEach(async curr => {
                  let t = `frameTaskUuid=${curr.frameTaskUuid}&layerTaskUuid=${curr.layerTaskUuid}&type=3`,
                      data = await downloadFrame(t)
                  exportDownloadFun(data, data.headers.file, '')
                })
              }
            },
            () => { messageFun('info','已取消下载'); return false }
          )
      },
      // 打包后下载
      async downloadingFun(path){
        let data = await compressionFiles(path)
        exportDownloadFun(data,data.headers.file,'zip')
      },
      // 删除item
      deleteFun(){
        if(!this.table.selectionList.length) return false
        this.$confirm('将删除选中选, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            async () => {
              let type = 3
              if(this.table.nextTbaleType == 'layer') type = 1
              if(this.table.nextTbaleType == 'frame') type = 2
              let data = await assetsDeleteItem({
                type,
                uuidList: this.table.selectionList.map(item => item.itemUuid)
              })

              if(data.data.code == 204){
                messageFun('success','操作成功')
                if(type == 1) this.getList()
                if(type == 2) this.getLayerList()
                if(type == 3) this.getFrameList()
              }else{ messageFun('error','报错，操作失败') }
            },
            () => { messageFun('info','已取消删除'); return false }
          )
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>

<style lang="less" scoped>

  /deep/.el-table__body-wrapper {
    height: calc(100vh - 395px);
    tr {
      cursor: pointer;
    }
  }

  .page {
    margin: 4px 25px 30px;
  }
  .outPut-wrapper {
    overflow: hidden;
  }

  @media screen and (orientation: portrait) {
    /deep/.el-table__body-wrapper {
      height: calc(100vw - 395px);
    }
  }
</style>
