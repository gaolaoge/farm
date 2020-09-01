<template>
  <div class="task-wrapper">
    <!--操作-->
    <div class="btnGroup">
      <!--上传分析操作-->
      <div class="uploadBtnGroup"
           :class="[
            {'cannotDelete': !btnGroup.uploadTableBtnDelete},
            {'cannotAgain': !btnGroup.uploadTableBtnAgain}
           ]"
           v-show="table.navListActiveIndex == 0">
        <div class="farm-primary-form-btn"
             :class=item.class
             v-for="(item,index) in btnGroup.uploadBtnGroup"
             @click="uploadOperating(item['text'])"
             :key="index">
          <img :src="item.initialIcon" alt="" v-if="item.initialIcon" class="btnIcon default">
          <img :src="item.selectedIcon" alt="" v-if="item.selectedIcon" class="btnIcon hover">
          <span>
            {{ item['text'] }}
          </span>
        </div>
      </div>
      <div class="rightOPerate"
           v-show="table.navListActiveIndex == 0">
        <div class="searchItem">
          <input type="text"
                 class="farm-form-input"
                 v-model="btnGroup.searchInputUpload"
                 @keyup.enter="searchUploadInput"
                 placeholder="输入场景名、任务ID">
          <!--搜索按钮-->
          <img src="@/icons/global-search-icon.png"
               alt=""
               class="searchIcon"
               @click="searchUploadInput">
        </div>
      </div>
      <!--渲染下载操作-->
      <div class="renderBtnGroup"
           :class="[
            {'cannotState': !btnGroup.downloadTableBtnStart},
            {'cannotPause': !btnGroup.downloadTableBtnPause},
            {'cannotDelete': !btnGroup.downloadTableBtnDelete},
            {'cannotDownload': !btnGroup.downloadTableBtnDownload},
            {'cannotRenderAll': !btnGroup.downloadTableBtnRenderAll},
            {'cannotRenderAgain': !btnGroup.downloadTableBtnRenderAgain},
            {'cannotArchive': !btnGroup.downloadTableBtnArchive},
            {'cannotCopy': !btnGroup.downloadTableBtnCopy}
           ]"
           v-show="table.navListActiveIndex == 1">
        <div class="farm-primary-form-btn"
             :class="item.class"
             @click="renderOperating(item['text'])"
             v-for="(item,index) in btnGroup.renderBtnGroup"
             :key="index">
          <img :src="item.initialIcon" v-if="item.initialIcon" class="btnIcon default">
          <img :src="item.selectedIcon" v-if="item.selectedIcon" class="btnIcon hover">
          <span>
            {{ item['text'] }}
          </span>
        </div>
      </div>
      <div class="rightOPerate"
           v-show="table.navListActiveIndex == 1">
        <div class="farm-primary-form-btn" @click="dialogTable.status = true">
          {{ btnGroup.archiveRecords }}（{{ btnGroup.archiveRecordsNum }}）
        </div>
        <div class="searchItem">
          <input type="text"
                 class="farm-form-input"
                 v-model="btnGroup.searchInputDownload"
                 @keyup.enter="searchRenderInput"
                 placeholder="输入场景名、任务ID">
          <!--搜索按钮-->
          <img src="@/icons/global-search-icon.png"
               alt=""
               class="searchIcon"
               @click="searchRenderInput">
        </div>
      </div>
    </div>
    <!--table-->
    <div class="tableGroup">
      <div class="navList">
        <span class="navBtn"
              :class="[{'active': index == table.navListActiveIndex}]"
              @click="table.navListActiveIndex = index"
              v-for="(item,index) in table.navList"
              :key="index">
          {{ item.text }} ( {{ item.num }} )
        </span>
      </div>
      <div class="tableList"
           ref="UploadAnalysisTable">
        <!--上传分析-->
        <div ref="uploadTable"
             class="uploadTable"
             v-show="table.navListActiveIndex == 0">
          <!--上传分析 table-->
          <upload-table @uploadTbaleTotalItem="uploadTbaleTotalItem"
                        @upLoadSeletedList="upLoadSeletedList"
                        @toRenderTable="table.navListActiveIndex = 1"
                        ref="uploadMode"/>
        </div>
        <!--渲染下载-->
        <div ref="renderTable"
             class="renderTable"
             v-show="table.navListActiveIndex == 1">
          <!--渲染下载表格-->
          <download-table @renderTbaleTotalItem="renderTbaleTotalItem"
                          @j="j"
                          @archiveNum="getArchiveNum"
                          ref="renderMode"/>
        </div>
      </div>
    </div>
    <!--弹窗 归档记录-->
    <el-dialog :visible.sync="dialogTable.status"
               :show-close="false"
               top="5vh"
               width="80%">
      <!--关闭窗口-->
      <img src="@/icons/shutDialogIcon.png"
           alt=""
           @click="dialogTable.status = false"
           class="shutDialogIcon">
      <!--窗口主体-->
      <archive-records @refreshTaskBase="x" ref="archiveTable"/>
    </el-dialog>
  </div>
</template>

<script>
  import '@/assets/fonticon/iconfont.css'
  import uploadTable from '@/components/task/upLoad-table'
  import downloadTable from '@/components/task/download-table'
  import archiveRecords from '@/components/task/archive-records'
  import newTask from '@/components/home/new-task'
  import {
    createTableIconList
  } from '@/assets/common.js'
  import {
    mapState
  } from 'vuex'

  export default {
    name: 'task',
    data() {
      return {
        table: {
          navList: [
            {
              text: this.$t('task.tableNavList')[0],
              num: 0
            },
            {
              text: this.$t('task.tableNavList')[1],
              num: 0
            }
          ],
          navListActiveIndex: 0,
        },
        btnGroup: {
          uploadBtnGroup: [
            {
              text: this.$t('task.uploadBtnGroup')[1],
              class: 'deleteBtn',
              initialIcon: require('@/icons/deleteIcon-black.png'),
              selectedIcon: require('@/icons/deleteIcon-white.png')
            },
            {
              text: this.$t('task.uploadBtnGroup')[2],
              class: 'againBtn'
            },
            {
              text: this.$t('task.uploadBtnGroup')[3],
              class: 'refresh'
            }
          ],
          renderBtnGroup: [
            {
              text: this.$t('task.renderBtnGroup')[1],
              class: 'startBtn',
              initialIcon: require('@/icons/playIcon-black.png'),
              selectedIcon: require('@/icons/playIcon-white.png')
            },
            {
              text: this.$t('task.renderBtnGroup')[2],
              class: 'pauseBtn',
              initialIcon: require('@/icons/pauseIcon-black.png'),
              selectedIcon: require('@/icons/pauseIcon-white.png')
            },
            {
              text: this.$t('task.renderBtnGroup')[3],
              class: 'deleteBtn',
              initialIcon: require('@/icons/deleteIcon-black.png'),
              selectedIcon: require('@/icons/deleteIcon-white.png')
            },
            {
              text: this.$t('task.renderBtnGroup')[4],
              class: 'downloadBtn',
            },
            {
              text: this.$t('task.renderBtnGroup')[5],
              class: 'renderAllBtn',
            },
            {
              text: this.$t('task.renderBtnGroup')[6],
              class: 'renderAgainBtn',
            },
            {
              text: this.$t('task.renderBtnGroup')[7],
              class: 'archiveBtn',
            },
            {
              text: this.$t('task.renderBtnGroup')[8],
              class: 'copyBtn'
            },
            {
              text: this.$t('task.renderBtnGroup')[9],
              class: 'refresh'
            }
          ],
          archiveRecords: this.$t('task.archiveRecords'),
          archiveRecordsNum: 0,
          searchInputUpload: '',                   // 上传分析 关键字检索
          searchInputDownload: '',                 // 渲染下载 关键字检索
          uploadTableBtnDelete: false,             // 上传分析 - 删除按钮 - 可用状态
          uploadTableBtnAgain: false,              // 上传分析 - 重新分析按钮 - 可用状态
          downloadTableBtnStart: false,            // 渲染下载 - 开始 - 可用状态
          downloadTableBtnPause: false,            // 渲染下载 - 暂停 - 可用状态
          downloadTableBtnDelete: false,           // 渲染下载 - 删除 - 可用状态
          downloadTableBtnDownload: false,         // 渲染下载 - 下载完成帧 - 可用状态
          downloadTableBtnRenderAll: false,        // 渲染下载 - 全部渲染 - 可用状态
          downloadTableBtnRenderAgain: false,      // 渲染下载 - 重新渲染 - 可用状态
          downloadTableBtnArchive: false,          // 渲染下载 - 归档 - 可用状态
          downloadTableBtnCopy: false,             // 渲染下载 - 拷贝 - 可用状态
        },
        dialogTable: {
          status: false,
        },
        fileList: []
      }
    },
    components: {
      uploadTable,
      downloadTable,
      archiveRecords,
      newTask
    },
    methods: {
      // 上传分析 多选结果
      upLoadSeletedList(val) {
        let t = this.btnGroup
        t.uploadTableBtnDelete = true       // 上传分析 - 删除
        t.uploadTableBtnAgain = true        // 上传分析 - 重新分析
        if (val.includes(this.$t('task.status.upload_ing'))) {
          t.uploadTableBtnDelete = false
          t.uploadTableBtnAgain = false
        }
        if (val.includes(this.$t('task.status.analysis_ing'))) {
          t.uploadTableBtnDelete = false
          t.uploadTableBtnAgain = false
        }
        if (val.includes(this.$t('task.status.upload_timeOut'))) t.uploadTableBtnAgain = false
        if (val.includes(this.$t('task.status.upload_err'))) t.uploadTableBtnAgain = false
        if (val.includes(this.$t('task.status.canceled'))) t.uploadTableBtnAgain = false
        if (val.includes(this.$t('task.status.giveUp'))) t.uploadTableBtnAgain = false
        // if(val.includes('分析警告')) ''
        // if(val.includes('待设置参数')) ''
        // if(val.includes('分析失败')) ''
        if (!val.length) {
          t.uploadTableBtnDelete = false     // 上传分析 - 删除
          t.uploadTableBtnAgain = false      // 上传分析 - 重新分析
        }
      },
      // 渲染下载 多选结果
      j(val) {
        let t = this.btnGroup
        if (!val.length) {
          t.downloadTableBtnStart = false        // 渲染下载 - 开始
          t.downloadTableBtnPause = false        // 渲染下载 - 暂停
          t.downloadTableBtnDelete = false       // 渲染下载 - 删除
          t.downloadTableBtnDownload = false     // 渲染下载 - 下载完成帧
          t.downloadTableBtnRenderAll = false    // 渲染下载 - 全部渲染
          t.downloadTableBtnRenderAgain = false  // 渲染下载 - 重新渲染
          t.downloadTableBtnArchive = false      // 渲染下载 - 归档
          return false
        }
        t.downloadTableBtnStart = false      // 渲染下载 - 开始
        t.downloadTableBtnPause = true       // 渲染下载 - 暂停
        t.downloadTableBtnDelete = true      // 渲染下载 - 删除
        t.downloadTableBtnDownload = true    // 渲染下载 - 下载完成帧
        t.downloadTableBtnRenderAll = true   // 渲染下载 - 全部渲染
        t.downloadTableBtnRenderAgain = true// 渲染下载 - 重新渲染
        t.downloadTableBtnArchive = true     // 渲染下载 - 归档
        if (val.includes(this.$t('task.status.render_ing'))) {                    // 渲染中
          t.downloadTableBtnDelete = false
          t.downloadTableBtnStart = false
          t.downloadTableBtnDownload = false
          t.downloadTableBtnArchive = false
        } else if (val.includes(this.$t('task.status.render_timeOut'))) {        // 渲染暂停
          t.downloadTableBtnStart = true
          t.downloadTableBtnPause = false
          t.downloadTableBtnRenderAll = false
          t.downloadTableBtnArchive = false
          t.downloadTableBtnDownload = false
        } else if (val.includes(this.$t('task.status.render_all'))) {            // 待全部渲染
          t.downloadTableBtnStart = false
          t.downloadTableBtnPause = false
          t.downloadTableBtnArchive = false
          t.downloadTableBtnDownload = false
        } else if (val.includes(this.$t('task.status.render_done'))) {           // 渲染完成
          t.downloadTableBtnStart = false
          t.downloadTableBtnPause = false
          t.downloadTableBtnRenderAll = false
          t.downloadTableBtnDownload = false
        } else if (val.includes(this.$t('task.status.wait'))) {                  // 等待
          t.downloadTableBtnDownload = false
        }
        if (val.length == 1) t.downloadTableBtnCopy = true     // 渲染下载 - 拷贝
        else t.downloadTableBtnCopy = false
      },
      // 【归档记录】触发重新获取数据
      x() {
        this.$refs.renderMode.getList()
      },
      // 获取归档记录长度
      getArchiveNum(val) {
        this.btnGroup.archiveRecordsNum = val
        this.$refs.archiveTable.getList()
      },
      uploadTbaleTotalItem(val) {
        this.table.navList[0]['num'] = val
      },
      renderTbaleTotalItem(val) {
        this.table.navList[1]['num'] = val
      },
      // 上传分析 - 操作台
      uploadOperating(ing) {
        switch (ing) {
          case this.$t('task.uploadBtnGroup')[1]: // 删除
            if (!this.btnGroup.uploadTableBtnDelete) return false
            this.$refs.uploadMode.deleteItem()
            break
          case this.$t('task.uploadBtnGroup')[2]: // 重新分析
            if (!this.btnGroup.uploadTableBtnAgain) return false
            this.$refs.uploadMode.analyseAgainFun()
            break
          case this.$t('task.uploadBtnGroup')[3]: // 刷新
            this.$refs.uploadMode.getList()
            break
        }
      },
      // 渲染下载 - 操作台
      renderOperating(ing) {
        switch (ing) {
          case this.$t('task.renderBtnGroup')[1]: // 开始
            if (!this.btnGroup.downloadTableBtnStart) return false
            this.$refs.renderMode.startFun()
            break
          case this.$t('task.renderBtnGroup')[2]: // 暂停
            if (!this.btnGroup.downloadTableBtnPause) return false
            this.$refs.renderMode.pauseFun()
            break
          case this.$t('task.renderBtnGroup')[3]: // 删除
            if (!this.btnGroup.downloadTableBtnDelete) return false
            this.$refs.renderMode.deleteFun()
            break
          case this.$t('task.renderBtnGroup')[4]: // 下载完成帧
            if (!this.btnGroup.downloadTableBtnDownload) return false
            this.$refs.renderMode.downloadFils()
            break
          case this.$t('task.renderBtnGroup')[5]: // 全部渲染
            if (!this.btnGroup.downloadTableBtnRenderAll) return false
            this.$refs.renderMode.renderAllFun()
            break
          case this.$t('task.renderBtnGroup')[6]: // 重新渲染
            if (!this.btnGroup.downloadTableBtnRenderAgain) return false
            this.$refs.renderMode.renderAgainFun()
            break
          case this.$t('task.renderBtnGroup')[7]: // 归档
            if (!this.btnGroup.downloadTableBtnArchive) return false
            this.$refs.renderMode.archiveFun()
            break
          case this.$t('task.renderBtnGroup')[8]: // 拷贝
            if (!this.btnGroup.downloadTableBtnCopy) return false
            this.$refs.renderMode.copyFun()
            break
          case this.$t('task.renderBtnGroup')[9]: // 刷新
            this.$refs.renderMode.getList()
            break
        }
      },
      // 上传分析 - 关键字检索
      searchUploadInput() {
        this.$refs.uploadMode.searchFun(this.btnGroup.searchInputUpload)
      },
      // 渲染下载 - 关键字检索
      searchRenderInput() {
        this.$refs.renderMode.searchFun(this.btnGroup.searchInputDownload)
      },
    },
    watch: {
      'table.navListActiveIndex': {
        handler: function (val) {
          sessionStorage.setItem('taskListActive', val)
        },
      },
      'socket_backS_msg': {
        handler: function(e){
          let data = JSON.parse(e.data)
          if (data.code != 852) this.$refs.renderMode.getList()           // 渲染列表
          else if(data.code != 854) this.$refs.uploadMode.getList()       // 分析列表
          else return false
        },
        immediate: true,
        deep: true
      }
    },
    mounted() {
      // 选择上次关闭时选中的Table
      if (sessionStorage.getItem('taskListActive') == '1') this.table.navListActiveIndex = 1
      createTableIconList()  // 图标
      // Table 筛选条件
      let name = this.$route.params.name ? this.$route.params.name : null
      if (!name) return false
      switch (name) {
        case this.$t('task.status.toBeSet'):          // 待设置参数
          sessionStorage.setItem('taskListActive', '0')
          this.table.navListActiveIndex = 0
          this.$refs.uploadMode.getList(true)
          break
        case this.$t('task.status.render_ing'):       // 渲染中
          sessionStorage.setItem('taskListActive', '1')
          this.table.navListActiveIndex = 1
          this.$refs.renderMode.getList(2)
          break
        case this.$t('task.status.render_all'):       // 待全部渲染
          sessionStorage.setItem('taskListActive', '1')
          this.table.navListActiveIndex = 1
          this.$refs.renderMode.getList(5)
          break
        case this.$t('task.status.render_timeOut'):   // 渲染暂停
          sessionStorage.setItem('taskListActive', '1')
          this.table.navListActiveIndex = 1
          this.$refs.renderMode.getList(4)
          break
        case this.$t('task.status.render_done'):      // 渲染完成
          sessionStorage.setItem('taskListActive', '1')
          this.table.navListActiveIndex = 1
          this.$refs.renderMode.getList(3)
          break
      }
    },
    computed: {
      ...mapState['socket_backS_msg']
    }
  }
</script>

<style lang="less" scoped>
  .task-wrapper {
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;

    .btnGroup {
      display: flex;
      justify-content: space-between;
      height: 52px;
      margin: 20px 20px 20px 50px;
      padding: 0px 30px;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 8px;

      .uploadBtnGroup,
      .renderBtnGroup,
      .rightOPerate {
        height: 100%;
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .rightOPerate {
        flex-shrink: 1;
        flex-grow: 1;
        max-width: 400px;
        .farm-primary-form-btn {
          flex-shrink: 0;
        }
        .searchItem {
          flex-grow: 1;
          .farm-form-input {
            width: 100%;
          }
        }
      }

      .uploadBtnGroup {
        &.cannotDelete .deleteBtn,
        &.cannotAgain .againBtn {
          cursor: no-drop;
          color: rgba(22, 29, 37, 0.29);
          background-color: rgba(255, 255, 255, 1);

          .default {
            display: inline-block;
            opacity: 0.29;
          }

          .hover {
            display: none;
          }
        }
      }

      .renderBtnGroup {
        &.cannotState .startBtn,
        &.cannotPause .pauseBtn,
        &.cannotDelete .deleteBtn,
        &.cannotDownload .downloadBtn,
        &.cannotRenderAll .renderAllBtn,
        &.cannotRenderAgain .renderAgainBtn,
        &.cannotArchive .archiveBtn,
        &.cannotCopy .copyBtn {
          cursor: no-drop;
          color: rgba(22, 29, 37, 0.29);
          background-color: rgba(255, 255, 255, 1);

          .default {
            display: inline-block;
            opacity: 0.29;
          }

          .hover {
            display: none;
          }
        }
      }
    }

    .tableGroup {
      flex-grow: 1;
      margin: 0px 20px 20px 50px;
      display: flex;
      flex-direction: column;
    }

    .tableList {
      flex-grow: 1;
      /*渲染下载*/

      .progressBar {
        vertical-align: middle;
        margin-right: 10px;
        display: inline-block;
        position: relative;
        width: 110px;
        height: 6px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 3px;

        &::after {
          content: '';
          position: absolute;
          width: 40px;
          height: 6px;
          background: RGBA(0, 100, 252, 1);
          border-radius: 3px;
        }
      }

      .uploadTable,
      .renderTable {
        position: relative;
        height: 100%;
      }
    }

    /deep/ .el-dialog {
      background-color: rgba(238, 242, 249, 1);
    }
  }

  @media screen and (orientation: portrait) {
    .task-wrapper .tableGroup .tableList {
      min-height: 0px;
      height: calc(100vw - 80px - 73px - 42px - 40px);
    }
  }
</style>
