<template>
  <div class="assets-wrapper">
    <!--操作-->
    <div class="btnGroup">
      <!--我的上传操作-->
      <div class="myUploadBtnGroup" v-show="table.navListActiveIndex == 0">
        <!--上传-->
        <div class="more-btn" v-operating2>
          <span>{{ btnGroup.uploadText }}</span>
          <img :src="btnGroup.uploadInitialIcon" alt="">
        </div>
        <!--上传list-->
        <div class="uploadBtnList" v-show="btnGroup.showUploadBtnList">
          <ul class="moreBtnUl">
            <li v-for="(item,index) in btnGroup.uploadBtnList"
                :key="index"
                class="uploadBtnItem"
                @click="operating('upload', item)">
              <span class="moreBtnItemSpan">{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="farm-primary-form-btn"
             :class="[{'cannotToBe': !item.action}]"
             v-for="(item,index) in btnGroup.myUploadBtnGroup"
             :key="index"
             @click="operating('upload', item['text'])">
          <img :src="item.initialIcon" alt="" v-if="item.initialIcon" class="btnIcon default"
               :style="{'transform': item.css }">
          <img :src="item.selectedIcon" alt="" v-if="item.selectedIcon" class="btnIcon hover"
               :style="{'transform': item.css }">
          <span>
            {{ item['text'] }}
          </span>
        </div>
        <!--更多按钮-->
        <div class="more-btn" v-operating>
          <span>{{ btnGroup.moreBtnText }}</span>
          <img :src="btnGroup.moreBtnIcon" alt="">
        </div>
        <!--更多List-->
        <div class="moreBtnList" v-show="btnGroup.showMoreBtnList">
          <ul class="moreBtnUl">
            <li v-for="(item,index) in btnGroup.moreBtnList" :key="index" class="moreBtnItem">
              <span class="moreBtnItemSpan" @click="operating('upload', item)">{{ item }}</span>
            </li>
          </ul>
        </div>
        <!--滑块-创建资产目录-->
        <div class="howToCreate">
          <div class="bgi"
               :class="[
                 {'l': btnGroup.howToCreateIindex == '0'},
                 {'r': btnGroup.howToCreateIindex == '1'}
               ]"/>
          <span :class="[{'showAll': btnGroup.howToCreateIindex == '0'}]" @click="btnGroup.howToCreateIindex = '0'">{{ btnGroup.howToCreateBtn[0] }}</span>
          <span :class="[{'showAll': btnGroup.howToCreateIindex == '1'}]" @click="btnGroup.howToCreateIindex = '1'">{{ btnGroup.howToCreateBtn[1] }}</span>
        </div>
      </div>
      <!--渲染输出操作-->
      <div class="outPutBtnGroup" v-show="table.navListActiveIndex == 1">
        <div class="farm-primary-form-btn"
             :class="[{'cannotToBe': !item.action}]"
             v-for="(item,index) in btnGroup.outPutBtnGroup"
             :key="index"
             @click="operating('render', item['text'])">
          <span>{{ item['text'] }}</span>
          <img :src="item.initialIcon" v-if="item.initialIcon" class="btnIcon default"
               :style="{'transform': item.css }">
          <img :src="item.selectedIcon" v-if="item.selectedIcon" class="btnIcon hover"
               :style="{'transform': item.css }">
        </div>
      </div>
      <div class="rightOPerate">
        <div class="searchItem" v-show="table.navListActiveIndex == 0">
          <input type="text"
                 class="farm-form-input"
                 v-model="renderSearchInputVal"
                 @keyup.enter="searchFun('upload')"
                 placeholder="文件名">
          <img src="@/icons/global-search-icon.png"
               alt=""
               class="searchIcon"
               @click="searchFun('upload')">
        </div>
        <div class="searchItem" v-show="table.navListActiveIndex == 1">
          <input type="text"
                 class="farm-form-input"
                 v-model="uploadSearchInputVal"
                 @keyup.enter="searchFun('render')"
                 placeholder="文件名">
          <img src="@/icons/global-search-icon.png"
               alt=""
               class="searchIcon"
               @click="searchFun('render')">
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
          {{ item }}
        </span>
        <div class="info">
          <span v-show="table.navListActiveIndex == '0'">{{ info[0] }}</span>
          <span v-show="table.navListActiveIndex == '1'">{{ info[1] }}</span>
        </div>
      </div>
      <div class="tableList">
        <!--我的上传-->
        <div class="myUploadTable" v-show="table.navListActiveIndex == 0">
          <my-upload ref="myUploadTable"
                     @uploadSelectionF="uploadSelectionF"
                     :uploadType="btnGroup.howToCreateIindex"
                     :searchInputVal="uploadSearchInputVal"/>
        </div>
        <!--渲染输出-->
        <div class="outPutTable" v-show="table.navListActiveIndex == 1">
          <out-put-render ref="outPutTable"
                          @renderSelectionF="renderSelectionF"
                          @clearInput="clearInput"
                          :searchInputVal="renderSearchInputVal"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import outPutRender from '@/components/assets/outPutRender'
  import myUpload from '@/components/assets/myUpload'
  import {createTableIconList} from '@/assets/common.js'

  export default {
    name: 'assets',
    data() {
      return {
        btnGroup: {
          // selectedIcon: require('@/icons/u-white.png'),
          uploadText: this.$t('assets.myUploadBtnGroup')[0],  // 上传
          uploadInitialIcon: require('@/icons/u-black.png'),
          uploadBtnList: ['文件', '文件夹'],                    // ['文件', '文件夹']
          showUploadBtnList: false,
          myUploadBtnGroup: [
            {
              initialIcon: require('@/icons/addIcon-black.png'),
              selectedIcon: require('@/icons/addIcon-white.png'),
              text: this.$t('assets.myUploadBtnGroup')[1], // 新建文件夹
              action: true
            },
            {
              initialIcon: require('@/icons/u-black.png'),
              selectedIcon: require('@/icons/u-white.png'),
              text: this.$t('assets.myUploadBtnGroup')[2], // 下载
              css: 'rotate(180deg)',
              action: false
            }
          ],
          outPutBtnGroup: [
            {
              initialIcon: require('@/icons/u-black.png'),
              selectedIcon: require('@/icons/u-white.png'),
              text: this.$t('assets.outPutBtnGroup')[0], // 下载
              css: 'rotate(180deg)',
              action: false
            },
            {
              initialIcon: require('@/icons/deleteIcon-black.png'),
              selectedIcon: require('@/icons/deleteIcon-white.png'),
              text: this.$t('assets.outPutBtnGroup')[1], // 删除
              action: false
            }
          ],
          moreBtnText: this.$t('assets.moreBtnText'),
          moreBtnIcon: require('@/icons/more-btn.png'),
          moreBtnList: this.$t('assets.moreBtnList'),    // ['移动到', '复制到', '重命名', '解压', '删除']
          showMoreBtnList: false,
          howToCreateBtn: this.$t('assets.howToCreateBtn'),  // ['手动创建资产目录', '自动创建资产目录']
          howToCreateIindex: 0
        },
        info: this.$t('assets.info'),
        table: {
          navListActiveIndex: 0,
          navList: this.$t('assets.navList'),            // ['我的上传', '渲染输出']
        },
        renderSearchInputVal: '',
        uploadSearchInputVal: '',
      }
    },
    directives: {
      operating: {
        bind(el, bindings, vnode) {
          let handler = e => {
            if (el.contains(e.target)) {
              if (!vnode.context.btnGroup.showMoreBtnList) vnode.context.btnGroup.showMoreBtnList = true
              else vnode.context.btnGroup.showMoreBtnList = false
            } else {
              if (e.target.classList.contains('moreBtnItemSpan')) return false
              if (e.target.classList.contains('moreBtnItem')) return false
              if (e.target.classList.contains('moreBtnUl')) return false
              if (vnode.context.btnGroup.showMoreBtnList) vnode.context.btnGroup.showMoreBtnList = false
            }
          }

          el.handler = handler
          document.addEventListener('click', handler)
        },
        unbind(el) {
          document.removeEventListener('click', el.handler)
        }
      },
      operating2: {
        bind(el, bindings, vnode) {
          let handler = e => {
            if (el.contains(e.target)) {
              if (!vnode.context.btnGroup.showUploadBtnList) vnode.context.btnGroup.showUploadBtnList = true
              else vnode.context.btnGroup.showUploadBtnList = false
            } else {
              if (e.target.classList.contains('moreBtnItemSpan')) return false
              if (e.target.classList.contains('moreBtnItem')) return false
              if (e.target.classList.contains('moreBtnUl')) return false
              if (vnode.context.btnGroup.showUploadBtnList) vnode.context.btnGroup.showUploadBtnList = false
            }
          }

          el.handler = handler
          document.addEventListener('click', handler)
        },
        unbind(el) {
          document.removeEventListener('click', el.handler)
        }
      },
    },
    components: {
      outPutRender,
      myUpload
    },
    mounted() {
      createTableIconList()
    },
    methods: {
      uploadSelectionF(list) {
        if(!list.length) {
          this.btnGroup.myUploadBtnGroup[1]['action'] = false
          return false
        }
        if(list.some(item => item['ing'])) this.btnGroup.myUploadBtnGroup[1]['action'] = false
        else this.btnGroup.myUploadBtnGroup[1]['action'] = true
      },
      renderSelectionF(list) {
        if (!list.length) this.btnGroup.outPutBtnGroup.forEach(item => item.action = false)
        else this.btnGroup.outPutBtnGroup.forEach(item => item.action = true)
      },
      searchFun(type) {
        if (type == 'render') this.$refs.outPutTable.getList()
        else this.$refs.myUploadTable.getList()
      },
      clearInput() {
        this.searchInputVal = ''
      },
      // 操作
      operating(type, active) {
        if (type == 'render') {
          switch (active) {
            case this.$t('assets.outPutBtnGroup')[0]:  // 下载
              if(!this.btnGroup.myUploadBtnGroup[0]['action'] || !this.btnGroup.myUploadBtnGroup[1]['action']) return false
              this.$refs.outPutTable.downloadFun()
              break
            case this.$t('assets.outPutBtnGroup')[1]:  // 删除
              if(!this.btnGroup.myUploadBtnGroup[0]['action'] || !this.btnGroup.myUploadBtnGroup[1]['action']) return false
              this.$refs.outPutTable.deleteFun()
              break
          }
        } else if (type == 'upload') {
          switch (active) {
            case '文件':                                // 文件
              this.$refs.myUploadTable.uploadFun('file')
              break
            case '文件夹':                              // 文件夹
              this.$refs.myUploadTable.uploadFun('folder')
              break
            case '新建文件夹':                           // 新建文件夹
              this.$refs.myUploadTable.createFolder()
              break
            case '下载':
              if(!this.btnGroup.myUploadBtnGroup[1]['action']) return false
              this.$refs.myUploadTable.downloadFile()  // 下载
              break
            case '移动到':                              // 移动到
              if(!this.btnGroup.myUploadBtnGroup[1]['action']) return false
              this.$refs.myUploadTable.moveFile()
              break
            case '复制到':                              // 复制到
              if(!this.btnGroup.myUploadBtnGroup[1]['action']) return false
              this.$refs.myUploadTable.copyFile()
              break
            case '重命名':                              // 重命名
              if(!this.btnGroup.myUploadBtnGroup[1]['action']) return false
              this.$refs.myUploadTable.rename()
              break
            case '解压':                                // 解压
              if(!this.btnGroup.myUploadBtnGroup[1]['action']) return false
              this.$refs.myUploadTable.unzip()
              break
            case '删除':                                // 删除
              this.$refs.myUploadTable.deleteFile()
              break
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .assets-wrapper {
    overflow: hidden;
    width: 100%;

    .btnGroup {
      display: flex;
      justify-content: space-between;
      height: 52px;
      margin: 20px 20px 20px 50px;
      padding: 0px 30px;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 8px;
      user-select: none;

      .myUploadBtnGroup,
      .outPutBtnGroup,
      .rightOPerate {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
      }
    }

    .info {
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 12px;
      line-height: 41px;
      font-weight: 400;
      color: rgba(229, 199, 138, 0.6);
      user-select: none;
    }

    .tableList {
      /*min-height: 700px;*/
      /*height: calc(100vh - 80px - 72px - 42px - 40px);*/
      /*渲染下载*/

      .outPutTable {
        position: relative;
        /*min-height: 663px;*/
        /*height: 100%;*/
      }
    }

    .more-btn {
      width: 69px;
      height: 22px;
      margin-right: 10px;
      background-color: rgba(248, 248, 248, 1);
      border: 1px solid rgba(22, 29, 37, 0.1);
      border-radius: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-size: 13px;
        color: rgba(22, 29, 37, 0.79);
      }

      img {
        margin-left: 4px;
        width: 10px;
      }

      &:hover {
        border: 1px solid rgba(0, 97, 255, 0.4);
      }
    }

    .moreBtnList,
    .uploadBtnList {
      position: absolute;
      z-index: 2;
      top: 40px;
      width: 70px;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 8px 0px rgba(0, 97, 255, 0.2);
      border-radius: 4px;
      border: 1px solid rgba(22, 29, 37, 0.1);

      ul {
        padding: 6px 0px;
        box-sizing: border-box;
        cursor: pointer;

        .moreBtnItem,
        .uploadBtnItem {
          height: 25px;
          padding: 4px 14px;
          box-sizing: border-box;
          margin-bottom: 2px;

          span {
            display: inline-block;
            font-size: 12px;
            color: rgba(28, 36, 47, 0.6);
            line-height: 17px;
            user-select: none;
          }

          &:hover {
            background-color: rgba(22, 29, 37, 0.1);
          }
        }
      }
    }

    .moreBtnList {
      left: 290px;
      height: 145px;
    }

    .uploadBtnList {
      left: 0px;
      height: 62px;
    }

    .howToCreate {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 10px;
      box-sizing: border-box;
      width: 162px;
      height: 24px;
      background-color: rgba(248, 248, 248, 1);
      border-radius: 5px;
      border: 1px solid rgba(22, 29, 37, 0.1);

      .bgi {
        position: absolute;
        top: 1px;
        width: 116px;
        height: 20px;
        background-color: rgba(39, 95, 239, 1);
        border-radius: 4px;

        &.l {
          left: 2px;
        }

        &.r {
          right: 2px;
        }
      }

      span {
        position: relative;
        font-size: 12px;
        color: rgba(22, 29, 37, 0.79);
        line-height: 17px;
        white-space: nowrap;
        overflow: hidden;
        width: 25px;
        cursor: pointer;
        user-select: none;

        &.showAll {
          width: 96px;
          color: rgba(255, 255, 255, 1);
        }
      }

      &:hover {
        border: 1px solid rgba(39, 95, 239, 0.4);
      }
    }
  }

  .farm-primary-form-btn.cannotToBe {
    cursor: no-drop;
    color: rgba(22, 29, 37, 0.29);

    img {
      opacity: 0.29;
    }

    &:hover {
      color: rgba(22, 29, 37, 0.29);
      background-color: #f8f8f8;

      .btnIcon.default {
        display: inline-block;
      }

      .btnIcon.hover {
        display: none;
      }
    }
  }
</style>

<style lang="less">
  .outPut-table {
    overflow: hidden;

    .bread {
      height: 27px;
      border-radius: 4px;
      margin: 20px 10px 0px;
      width: calc(100% - 20px);
      padding: 0px 20px;
      box-sizing: border-box;
      border-bottom: 1px solid rgba(22, 29, 37, 0.09);

      .h {
        display: inline-block;
        font-size: 12px;
        line-height: 27px;
        font-weight: 400;
        color: rgba(22, 29, 37, 0.6);
        margin-right: 2px;
        cursor: pointer;

        .img {
          vertical-align: middle;
          margin-left: 2px;
        }

        &:nth-last-of-type(1) {
          color: rgba(22, 29, 37, 1);

          .img {
            display: none;
          }
        }
      }
    }
  }
</style>
