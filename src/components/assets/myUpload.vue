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
    </div>
    <el-dialog
      :show-close="false"
      :visible.sync="dialogVisible"
      width="50%">
      <header class="dl_header">
        <span>{{ dl.title }}</span>
        <img src="@/icons/shutDialogIcon.png" alt="" class="closeIcon" @click="shutDialog">
      </header>
      <div class="dl-wrapper">
        <div class="tree">
          <el-tree
            :data="dl.treeData"
            node-key="id"
            :load="dlGetTreeData"
            lazy
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
  </div>
</template>

<script>
  import {
    createDateFun,
    consum,
    messageFun,
    getFileSize
  } from '@/assets/common.js'
  import {
    mapState
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
      }
    },
    props: {
      searchInputVal: {
        type: String,
        default: ''
      },
      uploadtype: {
        type: Number,
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

            this.table.tableData = data.data.map(item => {
              return Object.assign(item, {
                'updateTime': createDateFun(new Date(item.updateTime)),
                'completedTime': item.completedTime,
                'validPeriod': consum(item.validPeriod),
                'fileName': item.fileType == '文件夹' ? item.fileName.slice(0, item.fileName.length - 1) : (item.completedTime != 0 ? item.fileName : item.fileName + '.cloudtransfer.uploading'),
                'position': this.path + item.fileName,
                'ing': item.completedTime != 0 ? false : true,
                'size': getFileSize(item.size)
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
          } else if (data.msg == '6042') {
            // 删除失败
            messageFun('info', data.data)
            this.getAssetsCatalog(this.path, this.searchInputVal)
          } else if (data.msg == '6051' || data.msg == '6061' || data.msg == '6081') {
            messageFun('success', '操作成功')
            this.shutDialog()
            this.getAssetsCatalog(this.path, this.searchInputVal)
          } else if (data.msg == '6052' || data.msg == '6062' || data.msg == '6032' || data.msg == '6072') messageFun('info', '选定目标内已存在相同名称文件或文件夹，操作失败')
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
          if (data.code == 100 || data.code == 101) this.getAssetsCatalog(this.path, this.searchInputVal)
        }
      }
      // 'dialogVisible': function(val){
      //   if(val) this.dlGetTreeData()
      // }
    },
    methods: {
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
        // Object.assign(this.dl, {
        //   treeData: [],
        //   // path: '/',
        //   // checkPath: '',
        //   resolve: null,
        //   dlType: null,
        // })
      },
      // 弹窗进一步获取结构
      dlGetTreeData(node, resolve) {
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

      // 上传
      uploadFun(type) {
        this.$store.commit('WEBSOCKET_PLUGIN_SEND', {
          transferType: type == 'file' ? 0 : 1,
          userID: this.user.id,
          networkPath: this.uploadType == 1 ? '' : this.path
        })
      },
      // 新建文件夹
      createFolder() {
        this.$prompt('请输入新文件夹名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(({value}) => {
            this.$store.commit('WEBSOCKET_BACKS_SEND', {
              'code': 603,
              'customerUuid': this.user.id,
              filePath: this.path,
              newFileName: value
            })
          })
          .catch(() => null)
      },
      // 下载
      downloadFile() {
        if (!this.table.selectionList.length) return false
        let result = this.table.selectionList.find(item => item['ing'])
        if (result) {
          messageFun('info', '一个或多个目标正在上传中，无法进行此操作')
          return false
        }
        this.$store.commit('WEBSOCKET_PLUGIN_SEND', {
          transferType: 2,
          userID: this.user.id,
          isRender: 0,
          fileList: this.table.selectionList.map(item => item.position)
        })
      },
      // 移动到
      moveFile() {
        let result = this.table.selectionList.find(item => item['ing'])
        if (result) {
          messageFun('info', '一个或多个目标正在上传中，无法进行此操作')
          return false
        }
        this.dialogVisible = true
        this.dl.dlType = 'move'
      },
      // 确认 - 移动/复制
      configF(type) {
        if (!this.dl.checkPath) return
        this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': type == 'move' ? 605 : 606,
          'customerUuid': this.user.id,
          'targetFolderPath': this.dl.checkPath,
          'filePathList': this.table.selectionList.map(item => item.position)
          // 'filePathList': this.table.selectionList.map(item => {
          //   let p = item.position,
          //     r = p.slice(p.length - 1) == '/'
          //   if (r) return p.slice(0, p.length - 1)
          //   else return p
          // })
        })
      },
      // 复制到
      copyFile() {
        let result = this.table.selectionList.find(item => item['ing'])
        if(result) {
          messageFun('info', '一个或多个目标正在上传中，无法进行此操作')
          return false
        }
        this.dialogVisible = true
        this.dl.dlType = 'copy'
      },
      // 重命名
      rename() {
        if (this.table.selectionList[0]['ing']) {
          messageFun('info', '目标正在上传中，无法操作')
          return false
        }
        this.$prompt('请输入新名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(({value}) => {
            this.$store.commit('WEBSOCKET_BACKS_SEND', {
              'code': 607,
              'customerUuid': this.user.id,
              'renameFilePath': this.path + this.table.selectionList[0]['fileName'],   // 被重命名的文件路径
              'newFileName': value                                                     // 新文件名
            })
          })
          .catch(() => messageFun('info', '操作取消'))
      },
      // 解压
      unzip(password) {
        if (this.table.selectionList.length != 1) {
          messageFun('info', '压缩动作只能针对单一文件，操作失败')
          return false
        }
        if (this.table.selectionList[0]['ing']) {
          messageFun('info', '目标正在上传中，无法操作')
          return false
        }
        let type = ['zip', 'rar', 'tar', 'tar.gz', 'tar.bz2', 'tar.Z']
        if (type.find(curr => curr == this.table.selectionList[0]['type']) == -1) {
          messageFun('info', '非压缩文件，无法操作')
          return false
        }
        this.unzipAction(this.table.selectionList[0]['position'], password)
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
        let result = this.table.selectionList.find(item => item['ing'])
        if (!result) {
          messageFun('info', '一个或多个目标正在上传中，无法进行此操作')
          return false
        }
        this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': 604,
          'customerUuid': this.user.id,
          filePathList: this.table.selectionList.map(item => this.path + item.fileName)
        })
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
      }
    },
    mounted() {
      this.getAssetsCatalog('', this.searchInputVal)
    },
    computed: {
      ...mapState(['user', 'socket_backS', 'socket_backS_msg', 'socket_plugin_msg'])
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-table__body-wrapper {
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

  .bread {
    display: flex;
    align-items: center;
  }

  /deep/ .el-dialog__body {
    padding: 0px;
  }

  .dl_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    background-color: rgba(241, 244, 249, 1);
    box-shadow: 0px 1px 6px 0px rgba(27, 83, 244, 0.3);
    border-radius: 8px 8px 0px 0px;
    padding: 0px 20px 0px 30px;

    span {
      user-select: none;
    }

    .closeIcon {
      cursor: pointer;
    }
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
    position: relative;
    padding: 8px;
    height: 540px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 0px 0px 8px 8px;

    .unzipItem {
      /*display: flex;*/
      /*justify-content: center;*/
      /*align-items: center;*/

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

  @media screen and (orientation: portrait) {
    /deep/ .el-table__body-wrapper {
      height: calc(100vw - 395px);
    }
  }
</style>
