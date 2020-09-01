<template>
  <div class="upload-table" ref="uploadTable">
    <el-table
      :data="table.UploadAnalysisData"
      @selection-change="handleSelectionChange"
      @row-click="showDetails"
      :row-class-name="tableRowStyle"
      class="u"
      :border=true
      style="width: 100%">

      <el-table-column
        type="selection"
        align="right"
        show-overflow-tooltip
        min-width="58"
        width="58" />

      <el-table-column
        prop="id"
        label="任务ID"
        sortable
        show-overflow-tooltip
        width="100" />

      <el-table-column
        prop="scenesName"
        label="场景名"
        show-overflow-tooltip
        min-width="180" />
      <!--状态-->
      <el-table-column
        label="状态"
        show-overflow-tooltip
        :filter-method="filterStatus"
        :filters="table.statusList"
        width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '上传失败' || scope.row.status == '分析失败'" style="color: #F90023">
            {{ scope.row.status }}
          </span>
          <span v-if="scope.row.status == '待设置参数'" style="color: #00E3FF">
            {{ scope.row.status }}
          </span>
          <span v-if="scope.row.status == '分析警告' || scope.row.status == '上传暂停'" style="color: #E5C78A">
            {{ scope.row.status }}
          </span>
          <span v-if="scope.row.status == '已取消' || scope.row.status == '已放弃'" style="color: #555">
            {{ scope.row.status }}
          </span>
          <span v-if="scope.row.status == '上传中...' || scope.row.status == '上传成功' || scope.row.status == '分析中...'">
            {{ scope.row.status }}
          </span>
        </template>
      </el-table-column>
      <!--所属项目-->
      <!--<el-table-column-->
        <!--prop="project"-->
        <!--label="所属项目"-->
        <!--show-overflow-tooltip-->
        <!--:filters="table.projectList"-->
        <!--width="200" />-->
      <!--分析开始时间-->
      <el-table-column
        prop="startingTime"
        label="分析开始时间"
        sortable
        show-overflow-tooltip
        width="180" />

      <el-table-column
        prop="endTime"
        label="分析结束时间"
        sortable
        show-overflow-tooltip
        width="180" />
      <!--创建人-->
      <el-table-column
        prop="founder"
        label="创建人"
        show-overflow-tooltip
        :filters="table.usersList"
        width="100" />

      <el-table-column
        prop="creationTime"
        label="创建时间"
        sortable
        show-overflow-tooltip
        width="180" />

    </el-table>
    <!--暂无数据-->
    <div class="nullTableData" v-if="table.UploadAnalysisData.length == 0">
      <img src="@/icons/tableDataNull.png" alt="">
      <span>
        暂无数据
      </span>
    </div>
    <!--分页-->
    <div class="page">
      <el-pagination
        background
        :current-page.sync="table.current"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper"
        :total="table.uploadTableTotal">
      </el-pagination>
    </div>
    <!--详情抽屉-->
    <farmDrawer :showDrawer="showDrawer"
                :typeInfo="itemName"
                :taskData="drawerTaskData"
                @changeTypeInfo="changeTypeInfo"
                @toRenderTable="$emit('toRenderTable')"
                @getListAgain="getList()"
                @closeDrawer="closeDrawer"/>
  </div>
</template>

<script>
  import farmDrawer from '@/components/task/farm-drawer'
  import {
    mapState
  } from 'vuex'
  import {
    getTaskItemList,
    getTaskTableList,
    upTopTableSeeMore,
    upTopTableDelete,
    upTopTableSet,
    analyseAgain
  } from '@/api/api'
  import {
    createCalendar,
    createDateFun,
    messageFun
  } from '@/assets/common.js'

  export default {
    name: 'upload-table',
    data(){
      return {
        table: {
          // tableList
          UploadAnalysisData: [
            // {
            //   id: '',               //任务ID
            //   scenesName: '',       //场景名
            //   status: '',           //状态
            //   project: '',          //所属项目
            //   startingTime: '',     //分析开始时间
            //   endTime: '',          //分析结果时间
            //   founder: '',          //创建人
            //   creationTime: '',     //创建时间
            //   source: '',           //来源
            //   taskMode: '',         //任务模式
            //   wayOfAdding: ''       //添加方式
            // },
          ],
          uploadTableTotal: 0,
          pageSize: 10,
          current: 1,                   // 当前页码
          selectionList: [],            // table 选中项
          uploadStatus: [],             // 上传状态数组
          analyseStatus: [],            // 分析状态数组
          // 所属项目筛选数组
          projectList: [],
          statusList: [
            {text: '上传中', value: '上传中...'},
            {text: '上传暂停', value: '上传暂停'},
            {text: '上传失败', value: '上传失败'},
            {text: '已取消', value: '已取消'},
            {text: '分析中', value: '分析中...'},
            {text: '分析警告', value: '分析警告'},
            {text: '待设置参数', value: '待设置参数'},
            {text: '分析失败', value: '分析失败'},
            {text: '已放弃', value: '已放弃'},
          ],
          usersList: []
        },
        showDrawer: false,
        itemName: 'upload-table',
        drawerTaskData: null,
        searchInput: ''
      }
    },
    methods: {
      // farm-drawer 翻页
      changeTypeInfo(val){
        this.itemName = val
      },
      // 翻页
      handleCurrentChange(val){
        this.table.current = val
        this.getList()
      },
      // table 行样式
      tableRowStyle({row, rowIndex}){
        switch(row.status){
          case '分析警告':
          case '上传暂停':
            return 'warning-row style-row'
            break
          case '上传失败':
          case '分析失败':
            return 'error-row style-row'
            break
          case '待设置参数':
            return 'wait-row style-row'
            break
        }
      },
      // 上传分析多选
      handleSelectionChange(val){
        this.table.selectionList = val
        this.closeDrawer()
        let r = new Set()
        val.forEach(curr => r.add(curr.status))
        this.$emit('upLoadSeletedList',[...r])
      },
      // 上传分析 - 筛选 - 状态
      filterStatus(value, row){
        return row.status === value
      },
      // 上传分析 - 打开详情
      showDetails(row, column, event){
        if(row.status == '分析中...' || row.status == '等待' || !row.status) {
          this.showDrawer = false
          return false
        }
        this.showDrawer = true
        this.drawerTaskData = row
        let tableDomList = this.$refs.uploadTable.getElementsByClassName('el-table__row'),
          d = this.$refs.uploadTable.getElementsByClassName('farmTableSelected')[0],
          index_ = this.table.UploadAnalysisData.findIndex(curr_ => curr_.id == row.id )
        if(d) d.classList.remove('farmTableSelected')
        tableDomList[index_].classList.add('farmTableSelected')
      },
      // 上传分析 - 关闭详情
      closeDrawer(){
        this.showDrawer = false
        let d = this.$refs.uploadTable.getElementsByClassName('farmTableSelected')[0]
        if(d) d.classList.remove('farmTableSelected')
      },
      // 获取项目列表
      async getTaskItemListFun(){
        let data = await getTaskItemList()
        this.table.projectList = data.data.data.map(curr => {
          return {
            value: curr.taskProjectUuid,
            text: curr.projectName
          }
        })
        if(!this.$route.params.name) this.getList()
      },
      // 获取 table 列表
      async getList(uploadStatus = ''){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        // {
        //   zoneUuid: this.zoneId,             //分区UUID
        //   keyword: this.searchInput,         //查询关键字
        //   pageIndex: this.table.current,     //当前页码
        //   pageSize: this.table.pageSize,     //页大小
        //   uploadStatus: this.table.uploadStatus,               //上传状态数组
        //   analyseStatus: this.table.analyseStatus,             //分析状态数组
        //   projectUuid: this.projectUuidList                    //项目UUID数组
        // }
        let t = `zoneUuid=${this.zoneId}&keyword=${this.searchInput}&pageIndex=${this.table.current}&pageSize=${this.table.pageSize}&uploadStatus=&analyseStatus=&projectUuid=${this.projectUuidList.length == 0 ? '' : JSON.stringify(this.projectUuidList)}&setParameters=${uploadStatus ? 1 : ''}`
        let data = await getTaskTableList(t),
            usersList = new Set(),
            statusList = new Set()
        this.table.UploadAnalysisData = data.data.data.map(curr => {
              let statusData = ''
              // 状态转换
              if(curr['taskStage'] == 2){
                switch(curr['analyseStatus']){
                  case 1:
                  case 2:
                  case 9:
                    statusData = '分析中...'
                    break
                  case 3:
                    statusData = '待设置参数'
                    break
                  case 4:
                    statusData = '分析警告'
                    break
                  case 5:
                    statusData = '分析失败'
                    break
                  case 6:
                    statusData = '已放弃'
                    break
                }
              }else if(curr['taskStage'] == 1){
                switch(curr['uploadStatus']){
                  case 1:
                  case 2:
                    statusData = '上传中...'
                    break
                  case 3:
                    statusData = '上传成功'
                    break
                  case 4:
                    statusData = '上传暂停'
                    break
                  case 5:
                    statusData = '上传失败'
                    break
                  case 6:
                    statusData = '已取消'
                    break
                }
              }
              usersList.add(curr['account'])
              statusList.add(statusData)
              return {
                  taskUuid: curr['taskUuid'],
                  id: curr['taskNo'],                                                // 任务ID
                  scenesName: curr['fileName'],                                      // 场景名
                  status: statusData,                                                // 状态
                  project: curr['projectName'],                                      // 所属项目
                  startingTime: createDateFun(new Date(curr['analyseStartTime'])),   // 分析开始时间
                  endTime: createDateFun(new Date(curr['analyseEndTime'])),          // 分析结果时间
                  founder: curr['account'],                                          // 创建人
                  creationTime: createDateFun(new Date(curr['createTime'])),         // 创建时间
                //   source: '',           //来源
                //   taskMode: '',         //任务模式
                //   wayOfAdding: ''       //添加方式
              }
            })
        this.table.usersList = [...usersList].map(curr => { return {'text': curr, 'value':curr }})
        // this.table.statusList = [...statusList].map(curr => { return {'text': curr, 'value':curr }})
        this.table.uploadTableTotal = data.data.total
        this.$emit('uploadTbaleTotalItem', data.data.total)
        loading.close()
      },
      // 关键字检索
      searchFun(val){
        this.searchInput = val
        this.getList()
      },
      // 操作 - 删除
      deleteItem(){
        if(!this.table.selectionList.length) return false
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            () => {
              return upTopTableDelete(this.table.selectionList.map(curr => curr.taskUuid))
              this.table.loading = true
            },
            () => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
              return Promise.reject()
            }
          )
          .then(data => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
          .catch(() => {

          })
          .finally(() => this.table.loading = false)
      },
      // 操作 - 重新分析
      analyseAgainFun(){
        if(!this.table.selectionList.length) return false
        this.$confirm('确认重新分析?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            let list = []
            this.table.selectionList.forEach(curr => {
              list.push(curr.taskUuid)
            })
            let data = await analyseAgain(list)
            messageFun('success','重新分析成功')
            setTimeout(() => this.getList(),1000)
          })
          .catch(() => messageFun('info','已取消重新分析'))
      }
    },
    mounted(){
      this.getTaskItemListFun()
    },
    watch: {
      'zoneId': function (val) {
        this.getList()
      }
    },
    computed: {
      ...mapState(['zoneId']),
      projectUuidList(){
        return []
      },
    },
    components: {
      farmDrawer
    },
  }
</script>

<style lang="less" scoped>
  .upload-table {
    position: relative;
    height: 100%;
    .page {
      position: absolute;
      left: 25px;
      bottom: 30px;
    }

  }
</style>
