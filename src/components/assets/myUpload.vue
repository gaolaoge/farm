<template>
  <div class="outPut-wrapper">
    <div class="outPut-table"
         ref="outPutTable">
      <!--面包屑-->
      <div class="bread">
        <span class="h" @click="navClickF(null, navF)">{{ navF }}</span>
        <img src="@/icons/enter.png" alt="" class="img">
        <span v-for="(item,index) in nav"
              :key="index"
              @click="navClickF(index)"
              class="h">
          {{ item }}
          <img src="@/icons/enter.png" alt="" class="img">
        </span>
      </div>
      <!--table-->
      <el-table
        :data="table.tableData"
        @selection-change="handleSelectionChange"
        @filter-change="filterHandler"
        @row-click="enterFolder"
        :border=true
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
          label="文件名"
          sortable
          show-overflow-tooltip
          min-width="180">
          <template slot-scope="scope">
            <img src="@/icons/folder-a-icon.png" v-if="scope.row.fileType == '文件夹'" class="a-icon">
            <img src="@/icons/mp3-a-icon.png" v-else-if="scope.row.fileType == 'MP3'" class="a-icon">
            <img src="@/icons/mp4-a-icon.png" v-else-if="scope.row.fileType == 'MP4'" class="a-icon">
            <img src="@/icons/ppt-a-icon.png" v-else-if="scope.row.fileType == 'ppt'" class="a-icon">
            <img src="@/icons/word-a-icon.png" v-else-if="scope.row.fileType == 'word'" class="a-icon">
            <img src="@/icons/exe-a-icon.png" v-else-if="scope.row.fileType == 'exe'" class="a-icon">
            <img src="@/icons/txt-a-icon.png" v-else-if="scope.row.fileType == 'txt'" class="a-icon">
            <img src="@/icons/html-a-icon.png" v-else-if="scope.row.fileType == 'html'" class="a-icon">
            <img src="@/icons/file-a-icon.png" v-else class="a-icon">
            <div class="fileNameBox" :style="{'width': scope.row.fileName.length * 10 + 'px'}">
              <input type="text"
                     :ref="'renameInput-' + scope.row.index_"
                     v-model="scope.row.nameInput"
                     :class="['renameInputFromTab', {'rename': scope.row.rename}]"
                     @keyup.center="confirmToRename(scope.row)"
                     @blur="confirmToRename(scope.row)">
              <span :class="['name', {'rename': scope.row.rename}]">{{ scope.row.fileName }}</span>
            </div>
            <span v-show="scope.row.ing">.cloudtransfer.uploading</span>
          </template>
        </el-table-column>
        <!--文件大小-->
        <el-table-column
          prop="size"
          label="文件大小"
          sortable
          show-overflow-tooltip
          width="120"/>
        <!--文件类型-->
        <el-table-column
          prop="fileType"
          label="文件类型"
          show-overflow-tooltip
          width="140"/>
        <!--剩余有效期-->
        <el-table-column
          v-if="false"
          prop="validPeriod"
          label="剩余有效期（天）"
          sortable
          show-overflow-tooltip
          width="220"/>
        <!--更新时间-->
        <el-table-column
          prop="updateTime"
          label="更新时间"
          sortable
          show-overflow-tooltip
          width="280"/>

      </el-table>
      <!--暂无数据-->
      <div class="unData" v-show="table.tableData.length == 0">
        <img src="@/icons/tableDataNull.png">
        <span>暂无数据</span>
      </div>
    </div>
    <!--分页-->
    <div class="page">
      <el-pagination
        background
        :current-page.sync="table.pageIndex"
        @current-change="handleCurrentChange"
        :page-size="table.pageSize"
        layout="prev, pager, next, jumper"
        :total="table.total">
      </el-pagination>
      <div class="farm-primary-form-btn btn" @click="refreshF(false)">
        <span>{{ refresh }}</span>
      </div>
      <div class="gz" @click="openPlugin">
        <img src="@/icons/gz-black.png" class="d">
        <img src="@/icons/gz-blue.png" class="h">
        <span>{{ $t('transportBtn') }}</span>
      </div>
    </div>
    <el-dialog
      :show-close="false"
      :visible.sync="dialogVisible"
      width="50%">
      <header class="dl_header">
        <span class="title">{{ dl.title }}</span>
        <img src="@/icons/shutDialogIcon.png" class="closeIcon" @click="shutDialog">
      </header>
      <div class="dl-wrapper">
        <div class="tree">
          <el-tree
            node-key="id"
            lazy
            v-if="dialogVisible"
            :data="dl.treeData"
            :load="dlGetTreeData"
            :destroy-on-close="true"
            :props="dl.defaultProps">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <el-checkbox v-model="dl.checkPath" :true-label="data.position"/>
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
        <div class="btnGroup">
          <div class="btn confirm" @click="configF('move')" v-show="dl.dlType == 'move'"><span>{{ dl.btn[0] }}</span>
          </div>
          <div class="btn confirm" @click="configF('copy')" v-show="dl.dlType == 'copy'"><span>{{ dl.btn[0] }}</span>
          </div>
          <div class="btn cancel" @click="shutDialog"><span>{{ dl.btn[1] }}</span></div>
        </div>
      </div>
    </el-dialog>
    <!--新建文件夹dialog-->
    <div class="createProject" v-show="createBaseShow">
      <div class="createBase">
        <div class="tit">
          <span>{{ createProject.tit }}</span>
          <img src="@/icons/shutDialogIcon.png" @click="createCancelBtnFun">
        </div>
        <div class="con">
          <input type="text"
                 class="name"
                 :class="[{'err': newNameErr}]"
                 @focus="newNameErr = false"
                 @keyup.enter="createSaveBtnFun"
                 v-model="createProject.name"
                 :placeholder="createProject.placeholder">
          <div class="btn-group">
            <div class="farm-btn cancel" @click="createCancelBtnFun">
              <span>{{ btnCancel }}</span>
            </div>
            <div class="farm-btn save" :class="[{'cannotBeGo': verif}]" @click="createSaveBtnFun">
              <span>{{ btnSave }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    createDateFun,
    consum,
    messageFun,
    getFileSize,
  } from '@/assets/common.js'
  import {
    mapState,
    mapActions
  } from 'vuex'

  export default {
    name: 'outPut',
    data() {
      return {
        table: {
          tableData: [],
          total: 0,
          pageIndex: 1,
          selectionList: [],            // table选中项
          rowUuid: null,                // 选中行Uuid
          objectName: null,             // 项目名
          layerObj: {},                 // 层名
          frameObj: {}                  // 帧名
        },
        projectList: [],
        navF: '资产',
        nav: [],
        path: '/',               // 当前位置
        dialogVisible: false,    // 弹窗
        dl: {
          dlType: null,
          title: '选择路径',
          treeData: [],
          path: '/',
          btn: ['确定', '取消'],
          checkPath: '',        // 选中路径
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          resolve: null,         // 回调函数
        },
        refresh: '刷新',
        createBaseShow: false,
        createProject: {
          tit: '新建文件夹',
          name: '',
          placeholder: '请输入项目名称',
        },
        newNameErr: false,       // 新建文件夹
        btnCancel: '取消',
        btnSave: '确定',
      }
    },
    props: {
      searchInputVal: {
        type: String,
        default: ''
      },
      uploadType: {
        type: String,
      },
    },
    watch: {
      'socket_backS_msg': {
        handler: function (e) {
          let data = JSON.parse(e.data)
          if (data.code != 208) return false
          if (data.msg == '601' && !this.dialogVisible) {
            // completedTime: 1597815711001  // 完成时间  => 为0修改名字
            // fileName: "Makefile.Release"
            // fileType: "Release"
            // size: 351602
            // updateTime: 1597815708850     // 更新时间
            // validPeriod: 1727777014       // 有效期
            let nav = []
            data.other.split('/').forEach(item => {
              if (item) nav.push(item)
            })
            this.nav = nav
            this.path = data.other == '' ? '/' : data.other

            this.table.tableData = data.data.map((item, index_) => {
              return Object.assign(item, {
                'updateTime': createDateFun(new Date(item.updateTime)),
                'completedTime': item.completedTime,
                'validPeriod': consum(item.validPeriod),
                'fileName': item.fileType == '文件夹' ? item.fileName.slice(0, item.fileName.length - 1) : item.fileName,
                'nameInput': item.fileType == '文件夹' ? item.fileName.slice(0, item.fileName.length - 1) : item.fileName,
                'position': this.path + item.fileName,
                'ing': item.completedTime != 0 ? false : true,
                'size': item.fileType == '文件夹' ? '-' : getFileSize(item.size),
                'rename': false,
                index_
              })
            })
          } else if (data.msg == '601' && this.dialogVisible) {
            // 网盘tree
            let x = data.data.map(item => {
              return {
                id: Math.floor(Math.random() * 1000000000),
                label: item.fileName.slice(0, item.fileName.length - 1),
                position: data.other + item.fileName
              }
            })
            if (!this.dl.resolve) this.dl.treeData = x
            else {
              this.dl.resolve(x)
              this.dl.resolve = null
            }
          } else if (data.msg == '6031' || data.msg == '6041' || data.msg == '6071' || data.msg == '6081') {
            // 新建文件夹 创建成功 || 删除
            messageFun('success', '操作成功')
            this.getAssetsCatalog(this.path, this.searchInputVal)
            this.createCancelBtnFun()
          } else if (data.msg == '6042') {
            // 删除失败
            messageFun('info', data.data)
            this.getAssetsCatalog(this.path, this.searchInputVal)
          } else if (data.msg == '6051' || data.msg == '6061' || data.msg == '6081') {
            messageFun('success', '操作成功')
            this.shutDialog()
            this.getAssetsCatalog(this.path, this.searchInputVal)
          } else if (data.msg == '6072') {
            messageFun('error', '文件名重复，请重新输入')
            this.getAssetsCatalog(this.path, this.searchInputVal)
          } else if (data.msg == '6052' || data.msg == '6062' || data.msg == '6032') messageFun('info', '选定目标内已存在相同名称文件或文件夹，操作失败')
          else if (data.msg == '6081') messageFun('info', '解压失败')
          else if (data.msg == '6053' || data.msg == '6063' || data.msg == '6073' || data.msg == '6082') messageFun('error', '报错，操作失败')
          else if (data.msg == '6083') {
            this.sendPassword()
            messageFun('error', data.other)
          }
        },
      },
      'socket_plugin_msg': {
        handler: function (e) {
          let data = JSON.parse(e.data)
          if (data.code == 100 || data.code == 101) {
            if (data.result == 0) this.getAssetsCatalog(this.path, this.searchInputVal)
            else {
              messageFun('error', '操作失败，请刷新界面后重新点击')
              if (data.result == 1) console.log('---上传操作失败，向插件WS进行请求时userID为空---')
              if (data.result == 2) console.log('---上传操作失败，向插件WS进行请求时network为空---')
            }
          }
        }
      },
    },
    methods: {
      ...mapActions(['WEBSOCKET_PLUGIN_INIT']),
      // 打开【传输列表】
      openPlugin() {
        if (this.socket_plugin) this.$store.commit('WEBSOCKET_PLUGIN_SEND', 'open')
        else this.$store.dispatch('WEBSOCKET_PLUGIN_INIT', true).then(() => this.$store.commit('WEBSOCKET_PLUGIN_SEND', 'open'))
      },
      // 刷新
      refreshF(refresh) {
        if (!refresh) {
          this.$emit('clearInput', 'upload')
          this.getAssetsCatalog(this.path, '')
        } else this.getAssetsCatalog(this.path, this.searchInputVal)
      },
      // 解压 输入密码
      sendPassword() {
        this.$prompt('请输入密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(({value}) => this.unzip(value))
          .catch(() => messageFun('info', '操作已取消'))
      },
      // 关闭tree窗
      shutDialog() {
        this.dialogVisible = false
      },
      // 弹窗进一步获取结构
      dlGetTreeData(node, resolve) {
        if (!this.socket_backS_msg) return false
        if (node.label) this.dl.path += (node.label + '/')
        if (node.level == 0) {
          return resolve([{
            id: 0,
            label: '我的资产',
            position: '/'
          }])
        } else this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': 601,
          'customerUuid': this.user.id,
          'filePath': node.data.position || '/',
          'keyword': ''
        })  // 向后台获取网盘目录 工程路径
        this.dl.resolve = resolve
      },
      // 导航跳转
      navClickF(index, nav) {
        if (nav == '资产') {
          this.path = '/'
          this.searchInputVal = ''
          this.getAssetsCatalog(this.path, this.searchInputVal)
        } else {
          let path = '/'
          for (let i = 0; i < index; i++) {
            path += (this.nav[i] + '/')
          }
          this.getAssetsCatalog(path, this.searchInputVal)
        }
      },
      // 进入文件夹
      enterFolder(row, column, event) {
        if (row.fileType != '文件夹') return false
        this.table.tableData = []
        this.path += (row.fileName + '/')
        this.searchInputVal = ''
        this.getAssetsCatalog(this.path, this.searchInputVal)
      },
      // 翻页
      handleCurrentChange(val) {

      },
      // 多选
      handleSelectionChange(val) {
        this.table.selectionList = val
        this.$emit('uploadSelectionF', val)
      },
      // 筛选条件发生变化
      filterHandler(value, row, column) {
        console.log(value, row, column)
      },
      // 上传 - 预判
      uploadFun(type) {
        if (!this.socket_plugin) this.$store.dispatch('WEBSOCKET_PLUGIN_INIT', true).then(() => this.uploadingFun(type))
        else this.uploadingFun(type)
      },
      // 上传 - ing
      uploadingFun(type) {
        this.$store.commit('WEBSOCKET_PLUGIN_SEND', {
          transferType: type == 'file' ? 0 : 1,
          userID: this.user.id,
          networkPath: this.uploadType == 1 ? '' : this.path,
          freeSpace: this.user.trueHaveCapacity + ''
        })
      },
      // 新建文件夹 - 显示窗口
      createFolder() {
        this.createBaseShow = true
      },
      // 新建文件夹 - 保存
      async createSaveBtnFun() {
        if (!this.verif) this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': 603,
          'customerUuid': this.user.id,
          filePath: this.path,
          newFileName: this.createProject.name
        })
      },
      // 新建文件夹 - 取消
      createCancelBtnFun() {
        this.createProject.name = ''
        this.createBaseShow = false
      },
      // 下载 - 预判
      downloadFile() {
        if (this.table.selectionList.length == 0) return
        else if (this.table.selectionList.some(item => item['ing'])) messageFun('info', '一个或多个目标正在上传中，无法进行此操作')
        else {
          if (!this.socket_plugin) this.$store.dispatch('WEBSOCKET_PLUGIN_INIT', true).then(() => this.downloadingFile())
          else this.downloadingFile()
        }
      },
      // 下载 - ing
      downloadingFile() {
        this.$confirm('将下载选中选, 是否继续?', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            () => this.$store.commit('WEBSOCKET_PLUGIN_SEND', {
              transferType: 2,
              userID: this.user.id,
              isRender: 0,
              fileList: this.table.selectionList.map(item => item.position)
            }),
            () => messageFun('info', '已取消下载')
          )
      },
      // 移动到
      moveFile() {
        if (this.table.selectionList.some(item => item['ing'])) messageFun('info', '一个或多个目标正在上传中，无法进行此操作')
        else {
          this.dialogVisible = true
          this.dl.dlType = 'move'
        }
      },
      // 确认 - 移动/复制
      configF(type) {
        if (this.dl.checkPath) this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': type == 'move' ? 605 : 606,
          'customerUuid': this.user.id,
          'targetFolderPath': this.dl.checkPath,
          'filePathList': this.table.selectionList.map(item => item.position)
        })
      },
      // 复制到
      copyFile() {
        let result = this.table.selectionList.find(item => item['ing'])
        if (result) messageFun('info', '一个或多个目标正在上传中，无法进行此操作')
        else {
          this.dialogVisible = true
          this.dl.dlType = 'copy'
        }
      },
      // 开启重命名视图
      rename() {
        let {selectionList} = this.table
        if (selectionList.length != 1) return false
        else if (selectionList[0]['ing']) messageFun('info', '目标正在上传中，无法操作')
        else {
          selectionList[0]['rename'] = true
          this.$refs['renameInput-' + selectionList[0]['index_']].focus()
        }
      },
      // 重命名
      confirmToRename(row) {
        row.rename = false
        if (row.nameInput == row.fileName) return false
        else if (!/^(?!.*[\\\/:*?"'<>|].*).*[^\.]$/i.test(row.nameInput)) {
          messageFun('error', '名称内不可包含特殊字符\\\/:*?"<>|且不可以.结尾')
          row.nameInput = row.fileName
        } else this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': 607,
          'customerUuid': this.user.id,
          'renameFilePath': this.path + row['fileName'],   // 被重命名的文件路径
          'newFileName': row.nameInput                     // 新文件名
        })
      },
      // 解压
      unzip(password) {
        let type = ['zip', 'rar', 'tar', 'tar.gz', 'gz', 'tar.bz2', 'bz2', 'tar.Z', 'Z', '7z']
        if (this.table.selectionList.length != 1) messageFun('info', '压缩动作只能针对单一文件，操作失败')
        else if (this.table.selectionList[0]['ing']) messageFun('info', '目标正在上传中，无法操作')
        else if (!type.some(curr => curr == this.table.selectionList[0]['fileType'])) messageFun('info', '非压缩文件，无法操作')
        else this.unzipAction(this.table.selectionList[0]['position'], password)
      },
      unzipAction(unzipFilePath, password) {
        this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': 608,
          'customerUuid': this.user.id,
          unzipFilePath,
          'password': password || ''
        })
      },
      // 删除
      deleteFile() {
        this.$confirm('将删除选中选, 是否继续?', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(
            () => this.$store.commit('WEBSOCKET_BACKS_SEND', {
              'code': 604,
              'customerUuid': this.user.id,
              filePathList: this.table.selectionList.map(item => this.path + item.fileName)
            }),
            () => messageFun('info', '已取消删除')
          )

      },
      // 获取网盘各级目录
      getAssetsCatalog(filePath, keyword) {
        if (!this.socket_backS) setTimeout(() => this.getAssetsCatalog(filePath, keyword), 1000)
        else this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': 601,
          'customerUuid': this.user.id,
          keyword,
          filePath
        })
      },

    },
    mounted() {
      this.getAssetsCatalog('', this.searchInputVal)
    },
    computed: {
      ...mapState(['user', 'socket_backS', 'socket_plugin', 'socket_backS_msg', 'socket_plugin_msg']),
      verif() {
        return (Boolean(this.newNameErr) || !Boolean(this.createProject.name.trim()))
      },
    }
  }
</script>

<style lang="less" scoped>
  .fileNameBox {
    position: relative;
    display: inline-block;
    height: 20px;
    vertical-align: middle;

    .renameInputFromTab {
      position: absolute;
      left: 1px;
      width: 210px;
      background-color: transparent;
      border: 0px;
      border-bottom: 1px solid rgba(27, 83, 244, 1);
      color: rgba(22, 29, 37, 0.79);
      font-size: 14px;
      line-height: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      opacity: 0;
      z-index: 1;
      outline: none;

      &.rename {
        opacity: 1;
      }
    }

    span {
      position: absolute;
      left: 1px;
      color: rgba(22, 29, 37, 0.79);
      /*color: tomato;*/
      font-size: 14px;
      line-height: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      opacity: 1;

      &.rename {
        opacity: 0;
      }
    }
  }

  .a-icon {
    vertical-align: middle;
  }

  .unData {
    position: absolute;
    top: calc(47px + 42px);
    width: 100%;
    height: calc(100% - 47px - 42px - 52px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;

    span {
      font-size: 14px;
    }
  }

  .bread {
    display: flex;
    align-items: center;
  }

  /deep/ .el-dialog__body {
    padding: 0px;
  }

  .custom-tree-node {
    display: flex;
    align-items: center;

    span {
      display: inline-block;
      margin-left: 8px;
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      color: rgba(22, 29, 37, 0.6);
    }
  }

  .dl-wrapper {
    height: 540px;

    .unzipItem {
      .name {
        display: inline-block;
        width: 160px;
        font-size: 14px;
        color: rgba(22, 29, 37, 0.6);
        text-align: right;
        margin-right: 12px;
      }

      .ps {
        width: 320px;
        height: 36px;
        border-radius: 6px;
        opacity: 0.2;
        border: 1px solid rgba(22, 29, 37, 1);
        padding-left: 12px;
      }
    }

    .tree {
      height: 100%;
    }

    .btnGroup {
      position: absolute;
      bottom: 12px;
      width: 100%;
      display: flex;
      justify-content: flex-end;

      .btn {
        width: 76px;
        height: 32px;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;

        span {
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          font-size: 14px;
        }

        &.confirm {
          background-color: rgba(27, 83, 244, 1);
          border: 1px solid rgba(27, 83, 244, 1);

          span {
            color: rgba(255, 255, 255, 1);
          }
        }

        &.cancel {
          background-color: rgba(248, 248, 248, 1);
          border: 1px solid rgba(22, 29, 37, 0.2);

          span {
            color: rgba(22, 29, 37, 0.79);
          }
        }
      }
    }
  }

  .createProject {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    user-select: none;

    .createBase {
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 6px 0px rgba(27, 83, 244, 0.15);
      border-radius: 8px;
      overflow: hidden;

      .tit {
        height: 36px;
        text-align: center;
        background-color: rgba(241, 244, 249, 1);
        box-shadow: 0px 1px 6px 0px rgba(27, 83, 244, 0.3);
        padding: 0px 30px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          font-size: 14px;
          font-weight: 600;
          color: rgba(22, 29, 37, 1);
        }

        img {
          cursor: pointer;
        }
      }

      .con {
        padding: 0px 30px;

        .name {
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(22, 29, 37, 0.4);
          background-color: transparent;
          outline: none;
          margin: 20px 0px;
          padding-left: 16px;
          box-sizing: border-box;
          color: rgba(22, 29, 37, 1);
        }

        .btn-group {
          margin-top: 30px;
          text-align: right;
          width: 100%;
        }
      }
    }

    .createBase {
      width: 500px;
      height: 220px;

      .con {
        .name {
          width: 100%;

          &.err {
            color: rgba(255, 62, 77, 1);
          }
        }
      }
    }
  }
</style>
