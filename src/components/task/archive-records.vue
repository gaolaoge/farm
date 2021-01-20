<template>
  <div class="archive-records">
    <div class="tableBox" v-show="!showDetailsDOM">
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
            :row-class-name="tableRowStyle"
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
              width="172"/>
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
            <!--所属项目-->
            <el-table-column
              prop="viewProject"
              label="所属项目"
              show-overflow-tooltip
              width="180"/>
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
            <!--操作-->
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <span class="s" v-show="!scope.row.children" @click="seeDetails(scope.row)">查看详情</span>
                <span v-show="scope.row.children">-</span>
              </template>
            </el-table-column>

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
    <div class="taskDetails" v-show="showDetailsDOM">
      <resultCardM @backToTable="showDetailsDOM = false"
                   :taskData="resultData"/>
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
    itemDelete,
    seeBalance
  } from '@/api/api'
  import {
    downloadCompleteFrame
  } from '@/api/task-api'
  import {
    mapState
  } from 'vuex'
  import resultCardM from '@/components/task/drawer/result-cardM'

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
            },
            {
              text: '删除'
            }
          ],
          tableData: [],
          dialogTableSelection: [],
          searchInputVal: ''
        },
        attribution: 'drawer',
        showDetailsDOM: false,
        resultData: null,           // 详情Task初始数据
        unfoldList: [],
      }
    },
    computed: {
      ...mapState(['zoneId', 'socket_plugin', 'user'])
    },
    methods: {
      // table 行样式
      tableRowStyle({row, rowIndex}) {
        let y = []
        if ('fatherIndex' in row) y.push('son-row')
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
      // 查看详情
      seeDetails(row) {
        console.log(row)
        this.resultData = row.secretChild ? row.secretChild[0] : row
        this.showDetailsDOM = true
      },
      // 获取选中的主任务和单独层任务
      computedResult() {
        let fatId = [],
          fatItem = [],
          sonItem = []
        // 因为指定主任务顺序肯定在其层任务前 所以无需先识别全部主任务
        this.dialogTable.dialogTableSelection.forEach(curr => {
          if ('selfIndex' in curr) {
            fatId.push(curr['id'])
            fatItem.push(curr)
          } else if (!fatId.some(item => item == curr.FatherId)) sonItem.push(curr)
        })
        return [...fatItem, ...sonItem]
      },
      // 操作
      operatFun(val) {
        if (!this.dialogTable.dialogTableSelection.length) return false
        switch (val) {
          case '下载完成帧':
            this.downloadLayerFun()
            break
          case '还原到渲染下载':
            this.reductionFUn()
            break
          case '删除':
            this.deleteFun()
        }
      },
      // 操作 - 删除
      deleteFun() {
        this.$confirm('将删除选中选, 是否继续?', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            async () => {
              let dataList = [],
                fat = []
              this.dialogTable.dialogTableSelection.forEach(curr => {
                if (('selfIndex' in curr) && !curr['secretChild']) fat.push(curr['taskUuid'])
                else if (curr['secretChild']) {
                  console.log(curr)
                  fat.push(curr.secretChild[0]['FatherTaskUuId'])
                  dataList.push({
                    taskUuid: curr.secretChild[0]['FatherTaskUuId'],
                    layerUuidList: [curr.secretChild[0]['layerTaskUuid']]
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
            messageFun('error', '报错，操作失败')
            console.log('---------【归档记录-删除】报错-----------')
            console.log(error)
          })
      },
      // 操作 - 下载完成帧 - 前期预判
      async downloadLayerFun() {
        if (!this.dialogTable.dialogTableSelection.length) return false
        else if (!this.socket_plugin) this.$store.dispatch('WEBSOCKET_PLUGIN_INIT', true).then(() => this.downloadingLayerFun())
          // let r = await seeBalance()
          // if (r.data.code == 1001) {
          //   messageFun('info', `当前账户余额为${r.data.data}，请先进行充值！`);
          //   return false
        // }
        else this.downloadingLayerFun()
      },
      // 操作 - 下载完成帧 - ing
      async downloadingLayerFun() {
        let list = this.computedResult()
        for (const taskItem of list) {
          if (taskItem.FatherTaskUuId) {
            let val = `transferType=2&userID=${this.user.id}&isRender=1&parent=&taskUuid=${taskItem['FatherTaskUuId']}&layerTaskUuid=${taskItem['layerTaskUuid']}&fileName=${taskItem['FatherSceneName']}`,
              data = await downloadCompleteFrame(val)
            this.$store.commit('WEBSOCKET_PLUGIN_SEND', data.data.data)
          } else {
            let val = `transferType=2&userID=${this.user.id}&isRender=1&parent=${taskItem['id'] + '-' + taskItem['sceneName']}&taskUuid=${taskItem['taskUuid']}&layerTaskUuid=&fileName=${taskItem['sceneName']}`,
              data = await downloadCompleteFrame(val)
            this.$store.commit('WEBSOCKET_PLUGIN_SEND', data.data.data)
          }
        }
      },
      // 操作 - 还原到渲染下载
      reductionFUn() {
        this.$confirm('将选中项还原到渲染下载列表, 是否继续?', '提示信息', {
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
      // 打开组
      showDetails(row, column, event) {
        // 若事件承受者为项目组
        if (row.children) this.unfoldFun(row)   // 展开项目组
      },
      // 展开项目组
      unfoldFun(row) {
        let r = this.unfoldList.findIndex(curr => curr == row.rowId)
        if (r >= 0) {
          this.unfoldList.splice(r, 1)
          this.$refs.archiveTable.toggleRowExpansion(row, false)
        } else {
          this.unfoldList.push(row.rowId)
          this.$refs.archiveTable.toggleRowExpansion(row)
        }
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
      // 【非业务逻辑】全选
      selectAll(selection) {
        if (!('children' in selection[0])) {
          this.dialogTable.dialogTableSelection = []
          this.dialogTable.tableData.forEach(curr => curr.children && curr.children.forEach(item => this.$refs.archiveTable.toggleRowSelection(item, false)))
        } else {
          let data = []
          this.dialogTable.tableData.forEach(curr => {
            data.push(curr)
            curr.children && curr.children.forEach(item => {
              data.push(item)
              this.$refs.archiveTable.toggleRowSelection(item, true)
            })
          })
          this.dialogTable.dialogTableSelection = data
        }
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
          let children = curr.historyLayerTaskDTOList ? curr.historyLayerTaskDTOList.map(item => {
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
              id: item.layerNo,
              sceneName: curr.fileName + '-' + item.layerName,
              status: itemDownloadStatus(item.layerTaskStatus),
              viewProject: item.projectName,
              renderingTime: consum(item.useTime),
              renderingCost: item.cost,
              frameRange: item.frameStart + '-' + item.frameEnd,
              intervalFrame: item.frameInterval,
              rowId: item.taskUuid + '-' + item.layerTaskUuid,
              layerName: item.layerName,
              downloadStatus,
              renderDateStart: createDateFun(new Date(item.startTime)),
              renderDateEnd: createDateFun(new Date(item.endTime)),
              person: item.createByAccount,
              createDate: createDateFun(new Date(item.createTime)),
              layerTaskUuid: item.layerTaskUuid,
              FatherTaskUuId: curr.taskUuid,
              FatherSceneName: curr.taskName,
              fatherIndex
            }
          }) : []
          return {
            id: curr.taskNo,
            sceneName: curr.fileName,
            status: itemDownloadStatus(curr.renderStatus),
            viewProject: curr.projectName,
            renderingTime: consum(curr.useTime),
            renderingCost: curr.cost,
            frameRange: '-',
            intervalFrame: '-',
            children: children.length > 1 ? children : null,
            secretChild: children.length == 1 ? children : null,
            rowId: curr.taskUuid,
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
    },
    components: {
      resultCardM
    }
  }
</script>

<style lang="less" scoped>
  .archive-records {
    .tableBox {
      height: 87vh;
      padding-bottom: 20px;

      .btn {
        position: relative;
        font-size: 16px;
        color: rgba(27, 83, 244, 1);
        font-family: 'PingFangSCRegular';
        padding: 10px 30px;
        /*width: 116px;*/
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 6px 1px rgba(27, 83, 244, 0.3);
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
            bottom: 4px;
          }
        }
      }
    }
  }

  .s {
    font-size: 14px;
    cursor: pointer;
    color: rgba(0, 97, 255, 1);
    text-decoration: underline;
  }

  .taskDetails {
    position: relative;
    height: 87vh;
  }
</style>
