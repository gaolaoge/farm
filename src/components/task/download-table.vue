<template>
  <div class="download-table" ref="downLoadTable">
    <el-table
      :data="table.RenderDownloadData"
      @select="tableSelect"
      @filter-change="filterChangeF"
      @select-all="selectAll"
      @row-click="showDetails"
      :row-class-name="tableRowStyle"
      class="r"
      :border=true
      row-key="rowId"
      :tree-props="{children: 'children'}"
      ref="renderTableImportant"
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
        show-overflow-tooltip
        width="146"/>
      <!--场景名-->
      <el-table-column
        prop="sceneName"
        label="场景名"
        show-overflow-tooltip
        width="224"/>
      <!--状态-->
      <el-table-column
        label="状态"
        :filters="zone == 1 ? table.statusList : table.statusList2"
        column-key="status"
        show-overflow-tooltip
        width="110">
        <template slot-scope="scope">
            <span v-if="scope.row.status !== '渲染完成' && scope.row.status !== '待全部渲染' && scope.row.status !== '渲染暂停'">
              {{ scope.row.status }}
            </span>
          <span v-if="scope.row.status == '渲染完成'"
                style="color: rgba(0, 227, 255, 1)">
              {{ scope.row.status }}
            </span>
          <span v-if="scope.row.status == '待全部渲染'"
                style="color: rgba(70, 203, 93, 1)">
              {{ scope.row.status }}
            </span>
          <span v-if="scope.row.status == '渲染暂停'"
                style="color: rgba(255, 191, 0, 1)">
              {{ scope.row.status }}
            </span>
        </template>
      </el-table-column>
      <!--渲染进度-->
      <el-table-column
        label="渲染进度"
        sortable
        show-overflow-tooltip
        width="170">
        <template slot-scope="scope">
          <el-progress :percentage="isNaN(scope.row.percent) ? 0 : scope.row.percent"
                       :show-text="false"
                       class="progressL"/>
          <span clas="progressS">
              {{ scope.row.renderingProgress }}
            </span>
        </template>
      </el-table-column>
      <!--所属项目-->
      <el-table-column
        prop="viewProject"
        label="所属项目"
        show-overflow-tooltip
        column-key="task"
        :filters="table.itemList"
        width="186"/>
      <!--渲染中-->
      <el-table-column
        prop="rendering"
        sortable
        width="86"
        show-overflow-tooltip
        label="渲染中"/>
      <!--等待-->
      <el-table-column
        prop="wait"
        sortable
        width="86"
        show-overflow-tooltip
        label="等待"/>
      <!--暂停-->
      <el-table-column
        prop="timeOut"
        sortable
        width="86"
        show-overflow-tooltip
        label="暂停"/>
      <!--完成-->
      <el-table-column
        prop="carryOut"
        sortable
        width="86"
        show-overflow-tooltip
        label="完成"/>
      <!--失败-->
      <el-table-column
        prop="failure"
        label="失败"
        width="86"
        show-overflow-tooltip
        sortable/>
      <!--渲染时长-->
      <el-table-column
        prop="renderingTime"
        label="渲染时长"
        sortable
        show-overflow-tooltip
        width="170"/>
      <!--渲染费用（金币）-->
      <el-table-column
        prop="renderingCost"
        label="渲染费用（金币）"
        sortable
        show-overflow-tooltip
        width="150"/>
      <!--帧范围-->
      <el-table-column
        v-if="zone == 1"
        prop="frameRange"
        label="帧范围"
        sortable
        show-overflow-tooltip
        width="110"/>
      <!--间隔帧-->
      <el-table-column
        v-if="zone == 1"
        prop="intervalFrame"
        label="间隔帧"
        sortable
        show-overflow-tooltip
        width="86"/>
      <!--相机-->
      <el-table-column
        prop="camera"
        width="142"
        sortable
        show-overflow-tooltip
        label="相机"/>
      <!--层名-->
      <el-table-column
        v-if="zone == 1"
        prop="layerName"
        label="层名"
        sortable
        show-overflow-tooltip
        width="164"/>
      <!--下载情况-->
      <el-table-column
        v-if="false"
        label="下载情况"
        show-overflow-tooltip
        :filters="table.downloadStatusList"
        column-key="download"
        width="116">
        <template slot-scope="scope">
            <span v-if="scope.row.downloadStatus == '待下载'" style="color: #F90023">
              {{ scope.row.downloadStatus }}
            </span>
          <span v-if="scope.row.downloadStatus == '已下载'" style="color: rgba(0, 97, 255, 1)">
              {{ scope.row.downloadStatus }}
            </span>
          <span v-if="scope.row.downloadStatus == '部分下载'" style="color: #E5C78A">
              {{ scope.row.downloadStatus }}
            </span>
        </template>
      </el-table-column>
      <!--渲染开始时间-->
      <el-table-column
        prop="renderingStartTime"
        label="渲染开始时间"
        sortable
        show-overflow-tooltip
        width="174"/>
      <!--渲染结束时间-->
      <el-table-column
        prop="renderingEndTime"
        label="渲染结束时间"
        sortable
        show-overflow-tooltip
        width="174"/>
      <!--创建人-->
      <el-table-column
        prop="founder"
        label="创建人"
        show-overflow-tooltip
        column-key="founder"
        :filters="table.usersList"
        width="100"/>
      <!--创建时间-->
      <el-table-column
        prop="creationTime"
        label="创建时间"
        sortable
        show-overflow-tooltip
        width="174"/>

    </el-table>
    <!--暂无数据-->
    <div class="nullTableData" v-if="!table.RenderDownloadData.length">
      <img src="@/icons/tableDataNull.png">
      <span>
        暂无数据
      </span>
    </div>
    <!--分页-->
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :current-page.sync="table.current"
        :total="table.renderTableTotal">
      </el-pagination>
      <div class="farm-primary-form-btn btn" @click="getList(null, true)">
        <span>{{ refresh }}</span>
      </div>
      <div class="gz" @click="openPlugin">
        <img src="@/icons/gz-black.png" class="d">
        <img src="@/icons/gz-blue.png" class="h">
        <span>{{ $t('transportBtn') }}</span>
      </div>
    </div>
    <!--详情抽屉-->
    <farmDrawer ref="drawer"
                :showDrawer="showDrawer"
                :typeInfo="itemName"
                :taskData="drawerTaskData"
                @getListAgain="getList()"
                @changeTypeInfo="changeTypeInfo"
                @closeDrawer="closeDrawer"/>
    <!--重新渲染弹框-->
    <el-dialog :visible.sync="dialogTableVisible"
               :show-close="false"
               top="calc(50vh - 135px)"
               width="400px">
      <div class="header">
        <span>提示</span>
        <img src="@/icons/shutDialogIcon.png" @click="cancelBtn">
      </div>
      <div class="b">
        <span class="renderAgainBoxTit">{{ renderAgainBoxTit }}</span>
        <el-checkbox-group v-model="s">
          <el-checkbox label="4" class="kk">
            {{ renderAgainBoxcheckbox[0] }}
          </el-checkbox>
          <el-checkbox label="3" class="kk">
            {{ renderAgainBoxcheckbox[1] }}
            <span>
            {{ renderAgainBoxSupplement }}
          </span>
          </el-checkbox>
        </el-checkbox-group>
        <div style="text-align: right;margin-top: 50px;">
          <button class="el-button el-button--default el-button--small nn nx"
                  @click="cancelBtn">
            <span>{{ renderAgainBoxBtnList[0] }}</span>
          </button>
          <button class="el-button el-button--default el-button--small el-button--primary nn nz"
                  @click="certainBtn">
            <span>{{ renderAgainBoxBtnList[1] }}</span>
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import farmDrawer from '@/components/task/farm-drawer'
  import {
    getRenderTableList,
    itemStart,
    itemArchive,
    itemDelete,
    getTaskItemList,
    compressionFiles,
    seeBalance,
    getRenderTSeeMore
  } from '@/api/api'
  import {
    uploadTabGetList,
    getCopySetData,
    downloadCompleteFrame
  } from '@/api/task-api'
  import {
    mapState
  } from 'vuex'
  import {
    createDateFun,
    consum,
    messageFun,
    itemDownloadStatus,
    UuidFun,
    exportDownloadFun,
    updateBalance,
    createThrowInfo
  } from '@/assets/common'

  export default {
    name: 'download-table',
    data() {
      return {
        s: ['4'],
        table: {
          RenderDownloadData: [
            // {
            //   id: '',                   //任务ID
            //   sceneName: '',           //场景名
            //   status: '',               //状态
            //   renderingProgress: '',    //渲染进度
            //   viewProject: '',          //所属项目
            //   rendering: '',            //渲染中
            //   wait: '',                 //等待
            //   timeOut: '',              //暂停
            //   carryOut: '',             //完成
            //   failure: '',              //失败
            //   renderingTime: '',        //渲染时长
            //   renderingCost: '',        //渲染费用（金币）
            //   frameRange: '',           //帧范围
            //   intervalFrame: '',        //间隔帧
            //   camera: '',               //相机
            //   layerName: '',            //层名
            //   downloadStatus: '',       //下载情况
            //   renderingStartTime: '',   //渲染开始时间
            //   renderingEndTime: '',     //渲染结束时间
            //   founder: '',              //创建人
            //   creationTime: ''          //创建时间
            //   children: [
            //   {
            //     id: '56232233',
            //     sceneName: '场景.ma',
            //     status: '渲染中',
            //     renderingProgress: '276/1286',
            //     viewProject: '少年的你项目组',
            //     rendering: '1',
            //     wait: '1',
            //     timeOut: '1',
            //     carryOut: '1',
            //     failure: '1',
            //     renderingTime: '2小时23分34秒',
            //     renderingCost: '239.25',
            //     frameRange: '1-24',
            //     intervalFrame: '1',
            //     camera: '摄像机一',
            //     layerName: '第一层',
            //     downloadStatus: '待下载',
            //     renderingStartTime: '2020-03-02 00:23:46',
            //     renderingEndTime: '2020-03-02 00:59:41',
            //     founder: '管理员',
            //     creationTime: '2020-01-01 00:01:56'
            //   },
            //   ]
            // },
          ],
          renderSelectionList: [],      // 渲染下载选中项
          renderTableTotal: 0,          // 总数
          current: 1,                   // 当前页数
          pageSize: 10,
          unfoldList: [],               // 展开项
          downloadStatusList: [         // 筛选 - 下载情况
            {text: '全部', value: '全部'},
            {text: '待下载', value: '待下载'},
            {text: '部分下载', value: '部分下载'},
            {text: '已下载', value: '已下载'}
          ],
          projectUuidList: [],          // 筛选 - 所属项目
          renderStatus: [],             // 筛选 - 状态
          usersList: [],                // 筛选 - 创建人
          itemList: [],                 // 筛选 - 所属项目
          statusList: [                 // 筛选 - 状态label
            // {text: '全部', value: '全部'},
            {text: '待全部渲染', value: '待全部渲染'},
            {text: '渲染中', value: '渲染中'},
            {text: '渲染暂停', value: '渲染暂停'},
            {text: '渲染完成', value: '渲染完成'}
          ],
          statusList2: [                 // 筛选 - 状态label
            // {text: '全部', value: '全部'},
            // {text: '待全部渲染', value: '待全部渲染'},
            {text: '渲染中', value: '渲染中'},
            {text: '渲染暂停', value: '渲染暂停'},
            {text: '渲染完成', value: '渲染完成'}
          ],
        },
        showDrawer: false,
        itemName: 'result',
        drawerTaskData: null,
        searchInput: '',
        dialogTableVisible: false,
        renderAgainBoxcheckbox: ['失败帧', '完成帧'],
        renderAgainBoxSupplement: '（完成帧重新渲染会重复扣除费用）',
        renderAgainBoxTit: '确认重新渲染以下帧么？',
        renderAgainBoxBtnList: ['取消', '确定'],
        refresh: '刷新',
        specialJump: false,       // 特定跳转 请求带有指定参数 不再触发默认【获取列表】
      }
    },
    methods: {
      // 打开【传输列表】
      openPlugin() {
        if (this.socket_plugin) this.$store.commit('WEBSOCKET_PLUGIN_SEND', 'open')
        else this.$store.dispatch('WEBSOCKET_PLUGIN_INIT', true).then(() => this.$store.commit('WEBSOCKET_PLUGIN_SEND', 'open'))
      },
      // 获取项目列表 暂时关闭
      async getTaskItemListFun() {
        let data = await getTaskItemList()
        this.table.itemList = data.data.data.map(curr => {
          return {
            value: curr.taskProjectUuid,
            text: curr.projectName
          }
        })
        if (!this.specialJump) this.getList()
        else this.specialJump = false
      },
      // 清除筛选条件
      clearFilterF(type) {
        if (type == 'status') this.table.renderStatus = []
        else if (type == 'task') this.table.projectUuidList = []
        this.getList(null)
      },
      // farm-drawer 翻页
      changeTypeInfo(val) {
        this.itemName = val
      },
      // table 行样式
      tableRowStyle({row, rowIndex}) {
        let y = []
        if ('FatherIndex' in row) y.push('son-row')
        switch (row.status) {
          case '渲染暂停':
            // case '等待':
            y.push('warning-row')
            y.push('style-row')
            break
            // case '分析失败':
            //   return 'error-row style-row'
            break
          case '待全部渲染':
            y.push('wait-row')
            y.push('style-row')
            break
          case '渲染完成':
            y.push('waitAll-row')
            y.push('style-row')
            break
        }
        return y.join(' ')
      },
      // 关键字检索
      searchFun(val) {
        this.searchInput = val
        this.getList()
      },
      // 翻页
      handleCurrentChange(val) {
        this.table.current = val
        this.getList()
      },
      // 【非业务逻辑】手动勾选数据行 Checkbox 时触发
      tableSelect(selection, row) {
        // selection 为现选中结果 row 为此次事件的触发行
        let result = selection.some(curr => curr.rowId == row.rowId),     // 【选中事件】or【取消事件】
          tableData = this.table.RenderDownloadData,
          allSonSelected = false,
          fatherSelected = false,
          selectionList = this.table.renderSelectionList,
          table = this.$refs.renderTableImportant

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
          selectionList.splice(selectionList.findIndex(curr => curr.rowId == row.rowId), 1)
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
          tableData[row.selfIndex]['children'] ? tableData[row.selfIndex]['children'].forEach(son => {
            // 将此子项勾选
            if (!selection.some(item => item.rowId == son.rowId)) {
              table.toggleRowSelection(son, true)
              selectionList.push(son)
            }
          }) : null
        }
        if (!('FatherId' in row) && !result) {
          // 取消勾选全部子项
          tableData[row.selfIndex]['children'] ? tableData[row.selfIndex]['children'].forEach(son => {
            // 将此子项取消勾选
            let sonDefault = selection.findIndex(item => item.rowId == son.rowId)
            if (sonDefault != -1) {
              table.toggleRowSelection(son, false)
              selectionList.splice(sonDefault, 1)
            }
          }) : null
          // 取消自身勾选
          selectionList.splice(selectionList.findIndex(curr => curr.rowId == row.rowId), 1)
          table.toggleRowSelection(row, false)
        }
      },
      // 筛选条件修改
      filterChangeF(val) {
        if (Object.keys(val)[0] == 'status') {
          // 状态
          this.$emit('changeFilter', {
            'tab': 'downloadT',
            'type': 'status',
            'val': val['status']
          })
          this.table.renderStatus = val['status'].map(item => {
            if (item == '渲染中') return 2
            else if (item == '待全部渲染') return 5
            else if (item == '渲染暂停' || item == '渲染完成') return 3
          })
          this.getList(null)
        } else if (Object.keys(val)[0] == 'task') {
          // 所属项目
          this.$emit('changeFilter', {
            'tab': 'downloadT',
            'type': 'task',
            'val': val['task'].map(task => this.table.itemList.find(li => li['value'] == task)['text'])
          })
          this.table.projectUuidList = val['task']
          this.getList(null)
        } else if (Object.keys(val)[0] == 'download') {
          // 下载情况
          this.$emit('changeFilter', {
            'tab': 'downloadT',
            'type': 'download',
            'val': val['download']
          })
        } else if (Object.keys(val)[0] == 'founder') {
          // 创建人
          this.$emit('changeFilter', {
            'tab': 'downloadT',
            'type': 'founder',
            'val': val['founder']
          })
        }
      },
      // 【非业务逻辑】全选
      selectAll(selection) {
        // 取消全选
        if (!('children' in selection[0])) {
          this.table.renderSelectionList = []
          this.table.RenderDownloadData.forEach(curr => curr.children && curr.children.forEach(item => this.$refs.renderTableImportant.toggleRowSelection(item, false)))
        } else {
          // 全选
          let data = []
          this.table.RenderDownloadData.forEach(curr => {
            data.push(curr)
            curr.children && curr.children.forEach(item => {
              data.push(item)
              this.$refs.renderTableImportant.toggleRowSelection(item, true)
            })
          })
          this.table.renderSelectionList = data
        }
      },
      // 渲染下载详情查看
      showDetails(row, column, event) {
        // 若事件承受者为项目组
        if (row.children) {
          this.unfoldFun(row)   // 展开项目组
          return false
        }
        //打开抽屉
        this.showDrawer = true
        this.$refs.drawer.turnPage('result')
        this.drawerTaskData = row.secretChild ? row.secretChild[0] : row
        let d = this.$refs.downLoadTable.getElementsByClassName('farmTableSelected')[0]
        if (d) d.classList.remove('farmTableSelected')
        event.path.find(item => item.classList.contains('el-table__row')).classList.add('farmTableSelected')
      },
      // 渲染下载关闭详情
      closeDrawer() {
        this.showDrawer = false
        let d = this.$refs.downLoadTable.getElementsByClassName('farmTableSelected')[0]
        if (d) d.classList.remove('farmTableSelected')
      },
      // 获取列表
      async getList(obj, reset) {
        if (reset) this.closeDrawer()
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.49)'
        })
        // {
        //   zoneUuid: '',            // 分区ID
        //   keyword: '',             // 关键字
        //   pageIndex: '',           // 当前页码
        //   pageSize: '',            // 页大小
        //   uploadStatus '',         // 渲染状态
        //   renderStatus: ''         // 工程ID
        // }
        if (obj && obj.renderStatus) this.table.renderStatus = [obj.renderStatus]
        if (obj && obj.projectUuid) this.table.projectUuid = [obj.projectUuid]
        if (obj && obj.renderStatusFormHome) switch (obj.renderStatusFormHome) {
          case 'rendering':           // 渲染中
            this.table.renderStatus = [2]
            break
          case 'waitAllRender':       // 待全部渲染
            this.table.renderStatus = [5]
            break
          case 'renderPause':         // 渲染暂停
            this.table.renderStatus = [3]
            break
          case 'finishRender':        // 渲染完成
            this.table.renderStatus = [3]
            break
        }
        let data = this.zone == 1 ? await getRenderTableList({
            zoneUuid: this.zoneId,
            keyword: this.searchInput,
            pageIndex: this.table.current,
            pageSize: this.table.pageSize,
            renderStatus: this.table.renderStatus,
            projectUuid: this.table.projectUuidList
          }) : await uploadTabGetList({
            "zoneUuid": this.zoneId,
            "pageIndex": 1,
            "pageSize": 10,
            "projectUuid": this.table.projectUuidList,
            "status": this.table.renderStatus,
            "keyword": this.searchInput,
          }),
          usersList = new Set()
        this.table.renderTableTotal = data.data.total              // 【渲染下载】翻页长度
        this.$emit('renderTableTotalItem', data.data.total)  // 【渲染下载】标签后显示长度
        this.$emit('archiveNum', data.data.other)             // 【归档记录】长度
        this.table.RenderDownloadData = this.zone == 1 ? data.data.data.map((curr, fatherIndex) => {
          let children = [],
            downloadStatusS = [],
            downloadStatus = '部分下载'
          // 兼容数据结构错误 生产时删除判断
          curr.renderLayerTaskDTOList[0] && (children = curr.renderLayerTaskDTOList.map((item, sonIndex) => {
            // let status
            // switch(item.layerTaskStatus){
            //   case 1:
            //   case 2:
            //     status = '渲染中'
            //     break
            //   case 3:
            //     status = '渲染完成'
            //     break
            //   case 4:
            //     status = '渲染暂停'
            //     break
            //   case 6:
            //     status = '渲染放弃'
            //     break
            // }
            let downloadStatus = !Boolean(item.downloadFrameCount) ? '待下载' : (item.downloadFrameCount == item.allFrameCount ? '已下载' : '部分下载')
            downloadStatusS.push(downloadStatus)
            let status = itemDownloadStatus(item.layerTaskStatus)
            if (status == '渲染暂停' && item.result == 5) status = '待全部渲染'
            return {
              id: item.layerNo,                                                // 任务ID
              sceneName: curr.fileName + '-' + item.layerName,        // 场景名
              FatherSceneName: curr.fileName,                        // 主任务场景名
              status,                           // 状态
              renderingProgress: item.frameCount.done + '/' + item.frameCount.total,    //渲染进度
              percent: curr.frameCount.total == null ? 0 : Math.floor(item.frameCount.done / item.frameCount.total * 100),
              viewProject: curr.projectName,                         // 所属项目
              rendering: item.frameCount.running,                    // 渲染中
              wait: item.frameCount.wait,                            // 等待
              timeOut: item.frameCount.pause,                        // 暂停
              carryOut: item.frameCount.done,                        // 完成
              failure: item.frameCount.fail,                         // 失败
              renderingTime: consum(item.useTime),                   // 渲染时长
              renderingCost: item.cost,                              // 渲染费用（金币）
              frameRange: item.frameRange,                           // 帧范围
              intervalFrame: item.frameInterval,                     // 间隔帧
              camera: item.camera,                                   // 相机
              layerName: item.layerName,                             // 层名
              downloadStatus,                                        // 下载情况
              renderingStartTime: createDateFun(new Date(item.startTime)),                    // 渲染开始时间
              renderingEndTime: createDateFun(new Date(item.endTime)),                        // 渲染结束时间
              founder: curr.account,                                 // 创建人
              creationTime: createDateFun(new Date(curr.createTime)),                         // 创建时间
              rowId: curr.taskNo + '-' + sonIndex,                   // 唯一值
              resolutionVal: item.width + '*' + item.height,         // 分辨率
              formatName: item.formatName,                           // 输出格式
              modeVal: curr.core + '核' + '-' + curr.memory + 'G' + '（' + curr.patternName + '）',   // 渲染模式
              softwareVal: curr.softName + ' ' + curr.softVer,                                // 软件+版本
              pluginVal: curr.pluginName + ' ' + curr.pluginVersion,                          // 插件+版本
              taskUuid: item.layerTaskUuid,                          // 子项目ID 查看详情用
              layerTaskUuid: item.layerTaskUuid,
              FatherId: curr.taskNo,
              FatherTaskUuId: curr.taskUuid,
              FatherIndex: fatherIndex,
              inFilePath: curr.inFilePath
            }
          }))
          if (downloadStatusS.every(item => item == '待下载')) downloadStatus = '待下载'
          if (downloadStatusS.every(item => item == '已下载')) downloadStatus = '已下载'
          usersList.add(curr['account'])
          return {
            taskUuid: curr.taskUuid,
            id: curr.taskNo,                                       // 任务ID
            sceneName: curr.isExpire == 1 ? '(过期)' + curr.fileName : curr.fileName,        // 场景名
            status: itemDownloadStatus(curr.renderStatus),         // 状态
            renderingProgress: curr.frameCount.done + '/' + curr.frameCount.total,          //渲染进度
            percent: curr.frameCount.total == null ? 0 : Math.floor(curr.frameCount.done / curr.frameCount.total * 100),
            viewProject: curr.projectName,                         // 所属项目
            rendering: curr.frameCount.running,                    // 渲染中
            wait: curr.frameCount.wait,                            // 等待
            timeOut: curr.frameCount.pause,                        // 暂停
            carryOut: curr.frameCount.done,                        // 完成
            failure: curr.frameCount.fail,                         // 失败
            renderingTime: consum(curr.useTime),                   // 渲染时长
            renderingCost: curr.cost,                              // 渲染费用（金币）
            frameRange: children.length == 1 ? children[0]['frameRange'] : '-',             // 帧范围
            intervalFrame: children.length == 1 ? children[0]['intervalFrame'] : '-',       // 间隔帧
            camera: children.length == 1 ? children[0]['camera'] : '-',                     // 相机
            layerName: children.length == 1 ? children[0]['layerName'] : '-',               // 层名
            downloadStatus,                                                                 // 下载情况
            renderingStartTime: createDateFun(new Date(curr.startTime)),                    // 渲染开始时间
            renderingEndTime: children.length == 1 ? children[0]['renderingEndTime'] : createDateFun(new Date(curr.endTime)),                        // 渲染结束时间
            founder: curr.account,                                 // 创建人
            creationTime: createDateFun(new Date(curr.createTime)),// 创建时间
            children: children.length == 1 ? null : children,
            rowId: curr.taskNo,                                    // 唯一值
            selfIndex: fatherIndex,
            isExpire: curr.isExpire,                               // 1过期 0未过期
            inFilePath: curr.inFilePath,
            secretChild: children.length == 1 ? children : null,   // 伪child列表
          }
        }) : data.data.data.map((curr, fatherIndex) => {
          // account: "gaoge1834"         // 任务创建人
          // allFrameCount: 1             // 所有帧
          // await: 0                     // 等待中任务数
          // camera: null
          // cost: 0                      // 已用金额
          // createBy: "1"                // 任务创建人编号
          // createTime:                  // 创建时间
          // designTaskDTOList: []        // 子任务组
          // downloadFrameCount: 0        // 下载情况
          // endTime: null                // 结束时间。可能为null
          // fileName: ""                 // 文件名称
          // layerNo: null                // 主任务作业号
          // layerTaskStatus: null
          // layerTaskUuid: null
          // lose: 0                      // 失败任务数
          // pageIndex: null
          // pageSize: null
          // projectName: ""              // 项目名称
          // renderStatus: 3              // 渲染各个阶段的状态。1，等待；2，渲染中，3，渲染完成；4，渲染暂停；5，待全部渲染； 6，渲染放弃
          // rendering: 0                 // 渲染中任务数
          // startTime: null              // 开始时间。可能为null
          // stopped: 0                   // 停止中任务数
          // taskNo: "SWT-413"
          // taskUuid: ""                 // 任务uuid
          // useTime: 37860               // 已用时间
          // win: 1                       // 成功任务数
          // zoneUuid: null
          let downloadStatus,
            framesTotal = curr.win + curr.lose + curr.rendering + curr.await + curr.stopped,   // 总帧数
            children = []
          if (curr.downloadFrameCount == 0) downloadStatus = '待下载'
          else if (curr.downloadFrameCount < framesTotal) downloadStatus = '部分下载'
          else if (curr.downloadFrameCount >= framesTotal) downloadStatus = '已下载'
          curr.designTaskDTOList.length && (children = curr.designTaskDTOList.map((item, sonIndex) => {
            let itemTotal = item.win + item.lose + item.rendering + item.await + item.stopped,
              status = itemDownloadStatus(item.layerTaskStatus)
            // if(status == '渲染暂停' && item.result == 5) status = '待全部渲染'
            return {
              id: item.layerNo,                                      // 任务ID
              FatherSceneName: curr.fileName,                        // 主任务场景名
              sceneName: item.fileName,                              // 场景名
              status,                                                // 状态
              renderingProgress: item.win + '/' + itemTotal,         //渲染进度
              percent: itemTotal == null ? 0 : Math.floor(item.win / itemTotal * 100),
              viewProject: curr.projectName,                         // 所属项目
              rendering: item.rendering,                             // 渲染中
              wait: item.await,                                      // 等待
              timeOut: item.stopped,                                 // 暂停
              carryOut: item.win,                                    // 完成
              failure: item.lose,                                    // 失败
              renderingTime: consum(item.useTime),                   // 渲染时长
              renderingCost: item.cost,                              // 渲染费用（金币）
              frameRange: 1,                                         // 帧范围
              intervalFrame: '-',                                    // 间隔帧
              camera: item.camera,                                   // 相机
              layerName: item.camera,                                // 层名
              downloadStatus,                                        // 下载情况
              renderingStartTime: createDateFun(new Date(item.startTime)),                    // 渲染开始时间
              renderingEndTime: createDateFun(new Date(item.endTime)),                        // 渲染结束时间
              founder: curr.account,                                 // 创建人
              creationTime: createDateFun(new Date(curr.createTime)),                         // 创建时间
              rowId: curr.taskNo + '-' + sonIndex,                   // 唯一值
              // resolutionVal: item.width + '*' + item.height,         // 分辨率
              // formatName: item.formatName,                           // 输出格式
              // modeVal: curr.core + '核' + '-' + curr.memory + 'G' + '（' + curr.patternName + '）',   // 渲染模式
              // softwareVal: curr.softName + ' ' + curr.softVer,                                // 软件+版本
              // pluginVal: curr.pluginName + ' ' + curr.pluginVersion,                          // 插件+版本
              taskUuid: item.layerTaskUuid,                          // 子项目ID 查看详情用
              layerTaskUuid: item.layerTaskUuid,
              FatherId: curr.taskNo,
              FatherTaskUuId: curr.taskUuid,
              FatherIndex: fatherIndex,
              inFilePath: curr.inFilePath
            }
          }))
          return {
            taskUuid: curr.taskUuid,
            id: curr.taskNo,                                       // 任务ID
            sceneName: curr.fileName,                              // 场景名
            status: itemDownloadStatus(curr.renderStatus),         // 状态
            renderingProgress: (curr.win + curr.lose) + '/' + framesTotal,          //渲染进度
            percent: curr.win + curr.lose == 0 ? 0 : Math.floor((curr.win + curr.lose) / framesTotal * 100),
            viewProject: curr.projectName,                         // 所属项目
            rendering: curr.rendering,                             // 渲染中
            wait: curr.await,                                      // 等待
            timeOut: curr.stopped,                                 // 暂停
            carryOut: curr.win,                                    // 完成
            failure: curr.lose,                                    // 失败
            renderingTime: consum(curr.useTime),                   // 渲染时长
            renderingCost: curr.cost,                              // 渲染费用（金币）
            frameRange: '-',                                       // 帧范围
            intervalFrame: '-',                                    // 间隔帧
            camera: '-',                                           // 相机
            layerName: '-',                                        // 层名
            downloadStatus,                                        // 下载情况
            renderingStartTime: createDateFun(new Date(curr.startTime)),                    // 渲染开始时间
            renderingEndTime: createDateFun(new Date(curr.endTime)),                        // 渲染结束时间
            founder: curr.account,                                 // 创建人
            creationTime: createDateFun(new Date(curr.createTime)),// 创建时间
            children: children.length == 1 ? null : children,
            rowId: curr.taskNo,                                    // 唯一值
            selfIndex: fatherIndex,
            isExpire: 0,                                           // 未过期
            inFilePath: curr.inFilePath,
            secretChild: children.length == 1 ? children : null,   // 伪child列表
          }
        })
        this.table.usersList = [...usersList].map(curr => {
          return {'text': curr, 'value': curr}
        })  // 创建人列表
        if (obj && obj.taskUuid) this.$nextTick(() => {
          this.$refs.renderTableImportant.toggleRowSelection(this.table.RenderDownloadData.find(item => item['taskUuid'] == obj['taskUuid']), true)
        })
        loading.close()
      },
      // 操作 - 【开始】前预判
      startFun() {
        // 判断余额是否充足
        updateBalance('开始')
          .then(data => {
            if (data) this.startFunReal()
          })
          .catch(() => createThrowInfo({
            type:'error',
            title:'获取余额情况失败',
            info:'在主任务【开始】操作前判断',
            site:'components/task/download-table:877'
          }))
      },
      // 操作 - 开始
      startFunReal() {
        if (!this.table.renderSelectionList.length) return false
        this.$confirm('选中项将开始渲染, 是否继续?', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            async () => {
              let dataList = []
              this.table.renderSelectionList.forEach(curr => {
                if (('selfIndex' in curr) && !curr['secretChild']) return false
                let dataListIndex = dataList.findIndex(item => item.taskUuid == curr.FatherTaskUuId)
                if (dataListIndex == -1) {
                  if (curr['secretChild']) {
                    dataList.push({
                      taskUuid: curr.secretChild[0]['FatherTaskUuId'],
                      layerUuidList: [curr.secretChild[0]['taskUuid']]
                    })
                  } else dataList.push({
                    taskUuid: curr.FatherTaskUuId,
                    layerUuidList: [curr.taskUuid]
                  })
                } else dataList[dataListIndex]['layerUuidList'].push(curr.taskUuid)
              })
              let data = await itemStart({
                "instructType": 1,
                "instructTaskList": dataList
              })
              if (data.data.code == 1001) messageFun('info', '您已欠费')
              else if (data.data.code == 200) messageFun('success', '操作成功')
            },
            () => messageFun('info', '已取消操作')
          )
          .catch(error => {
            createThrowInfo({
              type:'error',
              title:'报错，操作失败',
              info:`主任务【开始】操作请求报错, ${error}`,
              site:'components/task/download-table:877'
            })
          })
      },
      // 操作 - 归档
      archiveFun() {
        if (!this.table.renderSelectionList.length) return false
        this.$confirm('确认归档选中项目?', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            async () => {
              let taskUuidList = []
              this.table.renderSelectionList.forEach(curr => {
                if ('FatherIndex' in curr) return false
                taskUuidList.push(curr.taskUuid)
              })
              let data = await itemArchive({
                zoneUuid: this.zoneId,
                taskUuids: taskUuidList
              })
              if (data.data.code == 200) {
                this.getList();
                messageFun('success', '操作成功')
              }
            },
            () => messageFun('info', '已取消归档')
          )
          .catch(error => {
            createThrowInfo({
              type:'error',
              title:'报错，操作失败',
              info:`主任务【归档】操作请求报错, ${error}`,
              site:'components/task/download-table:919'})
          })
      },
      // 操作 - 【全部渲染】前预判
      renderAllFun() {
        // 判断余额是否充足
        updateBalance('全部渲染')
          .then(data => {
            if (data) this.renderAllFunReal()
          })
          .catch(() => createThrowInfo({
            type:'error',
            title:'获取余额情况失败',
            info:'在主任务【全部渲染】操作前判断',
            site:'components/task/download-table:951'
          }))
      },
      // 操作 - 全部渲染
      renderAllFunReal() {
        if (!this.table.renderSelectionList.length) return false
        this.$confirm('确认进行全部渲染吗？建议您在确认优先渲染的测试帧无误后再进行', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            async () => {
              let dataList = []
              this.table.renderSelectionList.forEach(curr => {
                if (('selfIndex' in curr) && !(curr['secretChild'])) return false
                let dataListIndex = dataList.findIndex(item => item.taskUuid == curr.FatherTaskUuId)
                if (dataListIndex == -1) {
                  if (curr['secretChild']) {
                    dataList.push({
                      taskUuid: curr.secretChild[0]['FatherTaskUuId'],
                      layerUuidList: [curr.secretChild[0]['taskUuid']]
                    })
                  } else dataList.push({
                    taskUuid: curr.FatherTaskUuId,
                    layerUuidList: [curr.taskUuid]
                  })
                } else dataList[dataListIndex]['layerUuidList'].push(curr.taskUuid)
              })
              let data = await itemStart({
                "instructType": 111,
                "instructTaskList": dataList
              })
              if (data.data.code == 200) messageFun('success', '操作成功')
            },
            () => messageFun('info', '已取消操作')
          )
          .catch(error => {
            createThrowInfo({
              type:'error',
              title:'报错，操作失败',
              info:`主任务【全部渲染】操作请求报错, ${error}`,
              site:'components/task/download-table:960'
            })
          })
      },
      // 操作 - 删除
      deleteFun() {
        if (!this.table.renderSelectionList.length) return false
        this.$confirm('将删除选中选, 是否继续?', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            async () => {
              let dataList = [],
                fat = []
              this.table.renderSelectionList.forEach(curr => {
                if (('selfIndex' in curr) && !curr['secretChild']) fat.push(curr['taskUuid'])
                else if (('selfIndex' in curr) && curr['secretChild']) {
                  fat.push(curr.secretChild[0]['FatherTaskUuId'])
                  dataList.push({
                    taskUuid: curr.secretChild[0]['FatherTaskUuId'],
                    layerUuidList: [curr.secretChild[0]['taskUuid']]
                  })
                } else {
                  let dataListIndex = dataList.findIndex(item => item.taskUuid == curr.FatherTaskUuId)
                  if (dataListIndex == -1) {
                    dataList.push({
                      taskUuid: curr.FatherTaskUuId,
                      layerUuidList: [curr.taskUuid]
                    })
                  } else dataList[dataListIndex]['layerUuidList'].push(curr.taskUuid)
                }
              })
              dataList.forEach(curr => {
                if (!fat.some(item => item == curr.taskUuid)) curr.taskUuid = ''
              })
              let data = await itemDelete({
                "instructType": 4,
                "instructTaskList": dataList
              })
              if (data.data.code == 204) {
                messageFun('success', '操作成功')
                this.getList()
              } else messageFun('error', '操作报错')
            },
            () => messageFun('info', '已取消删除')
          )
          .catch(error => {
            createThrowInfo({
              type:'error',
              title:'报错，操作失败',
              info:`主任务【删除】操作请求报错, ${error}`,
              site:'components/task/download-table:991'
            })
          })
      },
      // 操作 - 暂停
      pauseFun() {
        if (!this.table.renderSelectionList.length) return false
        this.$confirm('将暂停选中选, 是否继续?', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            async () => {
              let dataList = []
              this.table.renderSelectionList.forEach(curr => {
                if (('selfIndex' in curr) && !curr['secretChild']) return false
                let dataListIndex = dataList.findIndex(item => item.taskUuid == curr.FatherTaskUuId)
                if (dataListIndex == -1) {
                  if (curr.secretChild) {
                    dataList.push({
                      taskUuid: curr.secretChild[0]['FatherTaskUuId'],
                      layerUuidList: [curr.secretChild[0]['taskUuid']]
                    })
                  } else dataList.push({
                    taskUuid: curr.FatherTaskUuId,
                    layerUuidList: [curr.taskUuid]
                  })
                } else dataList[dataListIndex]['layerUuidList'].push(curr.taskUuid)
              })
              let data = await itemStart({
                "instructType": 2,
                "instructTaskList": dataList
              })
              if (data.data.code == 200) messageFun('success', '操作成功')
              else if (data.data.code == 1000) messageFun('info', '报错，操作失败')
            },
            () => messageFun('info', '已取消暂停')
          )
          .catch(error => {
            createThrowInfo({
              type:'error',
              title:'报错，操作失败',
              info:`主任务【暂停】操作请求报错, ${error}`,
              site:'components/task/download-table:1041'
            })
          })
      },
      // 操作 - 重新渲染
      renderAgainFun() {
        // 判断余额是否充足
        updateBalance('重新渲染')
          .then(data => {
            if (data) this.dialogTableVisible = true
          })
          .catch(() => createThrowInfo({
            type:'error',
            title:'获取余额情况失败',
            info:'在主任务【重新渲染】操作前判断，获取余额情况请求报错',
            site:'components/task/download-table:1082'
          }))
      },
      // 操作 - 【下载完成帧】前预判
      downloadFils() {
        if (!this.table.renderSelectionList.length) return false
        if (!this.socket_plugin) this.$store.dispatch('WEBSOCKET_PLUGIN_INIT', true).then(() => next())
        else next()

        function next() {
          // 判断余额是否充足
          updateBalance('下载完成帧')
            .then(data => {
              if (data) this.downloadingFile()
            })
            .catch(() => createThrowInfo({
              type:'error',
              title:'获取余额情况失败',
              info:'在主任务【下载完成帧】操作前判断',
              site:'components/task/download-table:1091'
            }))
        }
      },
      // 操作 - 下载完成帧
      async downloadingFile() {
        let list = this.computedResult()
        for (const taskItem of list) {
          if (taskItem.FatherId) {
            let val = `transferType=2&userID=${this.user.id}&isRender=1&parent=&taskUuid=${taskItem['FatherTaskUuId']}&layerTaskUuid=${taskItem['taskUuid']}&fileName=${taskItem['FatherSceneName']}`,
              data = await downloadCompleteFrame(val)
            this.$store.commit('WEBSOCKET_PLUGIN_SEND', data.data.data)
          } else {
            let val = `transferType=2&userID=${this.user.id}&isRender=1&parent=${taskItem['id'] + '-' + taskItem['sceneName']}&taskUuid=${taskItem['taskUuid']}&layerTaskUuid=&fileName=${taskItem['sceneName']}`,
              data = await downloadCompleteFrame(val)
            this.$store.commit('WEBSOCKET_PLUGIN_SEND', data.data.data)
          }
        }
      },
      // 操作 - 拷贝
      async copyFun() {
        let item = this.table.renderSelectionList.find((item, index) => item.children || item.secretChild)
        let data = await getCopySetData(item.taskUuid)
        this.drawerTaskData = item
        this.$refs.drawer.getItemList()
        this.$refs.drawer.setParameterNext(data.data)
        this.$refs.drawer.isCopy = true
        this.showDrawer = true
      },
      // 展开项目组
      unfoldFun(row) {
        let r = this.table.unfoldList.findIndex(curr => curr == row.rowId)
        if (r >= 0) {
          this.table.unfoldList.splice(r, 1)
          this.$refs.renderTableImportant.toggleRowExpansion(row, false)
        } else {
          this.table.unfoldList.push(row.rowId)
          this.$refs.renderTableImportant.toggleRowExpansion(row)
        }
      },
      // 操作 - 重新渲染 - 取消
      cancelBtn() {
        this.dialogTableVisible = false
        this.s = []
        messageFun('info', '已取消操作')
      },
      // 操作 - 重新渲染 - 确定
      async certainBtn() {
        this.dialogTableVisible = false
        if (!this.s.length) return false
        let dataList = []
        this.table.renderSelectionList.forEach(curr => {
          if (('selfIndex' in curr) && !curr['secretChild']) return false
          let dataListIndex = dataList.findIndex(item => item.taskUuid == curr.FatherTaskUuId)
          if (dataListIndex == -1) {
            if (curr.secretChild) {
              dataList.push({
                taskUuid: curr.secretChild[0]['FatherTaskUuId'],
                layerUuidList: [curr.secretChild[0]['taskUuid']]
              })
            } else dataList.push({
              taskUuid: curr.FatherTaskUuId,
              layerUuidList: [curr.taskUuid]
            })
          } else dataList[dataListIndex]['layerUuidList'].push(curr.taskUuid)
        })
        let data = await itemStart({
          "instructType": 3,
          "instructCode": this.s.map(curr => Number(curr)),
          "instructTaskList": dataList
        })
        this.s = []
        if (data.data.code == 1001) {
          messageFun('info', '您已欠费');
          return false
        }
        if (data.data.code == 200) messageFun('success', '操作成功')
      },
      // 获取选中的主任务和单独层任务
      computedResult() {
        let fatId = [],
          fatItem = [],
          sonItem = []
        // 因为指定主任务顺序肯定在其层任务前 所以无需先识别全部主任务
        this.table.renderSelectionList.forEach(curr => {
          if ('selfIndex' in curr) {
            fatId.push(curr['id'])
            fatItem.push(curr)
          } else if (!fatId.some(item => item == curr.FatherId)) sonItem.push(curr)
        })
        return [...fatItem, ...sonItem]
      }
    },
    components: {
      farmDrawer
    },
    mounted() {
      this.$nextTick(() => this.getTaskItemListFun())
    },
    computed: {
      ...mapState(['zoneId', 'zone', 'user', 'socket_plugin']),
    },
    watch: {
      'table.renderSelectionList': {
        handler: function (val) {
          let r = new Set(),       // 任务状态集合
            task = new Set(),      // 选中项所属任务的长度
            mainTask = new Set()   // 选中的主任务的长度
          val.forEach(curr => {
            task.add(curr.FatherId ? curr.FatherId : curr.id)
            if (curr['children'] || curr['secretChild']) mainTask.add(curr.id)
            if (curr['children']) curr['children'].forEach(item => r.add(item.status))
            r.add(curr.status)
          })
          this.$emit('j', {val: [...r], canBeCopy: task.size == 1 && mainTask.size == 1})
        },
        deep: true
      },
      'zoneId': function (val) {
        this.getList()
        this.closeDrawer()
      },
    },
  }
</script>

<style lang="less" scoped>
  .download-table {

    .progressL {
      display: inline-block;
      width: 110px;
      vertical-align: middle;
      padding-right: 8px;
    }

    .progressS {
      color: rgba(22, 29, 37, 0.6);
    }
  }

  .header {
    height: 36px;
    box-shadow: 0px 1px 6px 0px rgba(27, 83, 244, 0.3);
    border-radius: 8px 8px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 20px;

    span {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(22, 29, 37, 1);
    }

  }

  .b {
    padding: 20px;
  }

  /deep/ .el-dialog__body {
    padding: 0px;
  }

  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: rgba(22, 29, 37, 0.8);
  }

  .kk {
    font-size: 14px;
    display: block;
    margin: 10px 0px;
    color: rgba(22, 29, 37, 0.8);
  }

  .nn {
    width: 76px;
    height: 32px;
    border-radius: 8px;
    margin-left: 20px;
  }

  .nx {
    color: rgba(22, 29, 37, 0.59);
    background-color: transparent;
    border: 1px solid rgba(22, 29, 37, 0.4);
  }

  .nz {
    background-color: #3582fe;
    border: 1px solid rgba(53, 130, 254, 0.8);
  }

  .renderAgainBoxTit {
    color: rgba(22, 29, 37, 0.7);
    display: block;
    margin-bottom: 32px;
    font-size: 14px;
  }
</style>
