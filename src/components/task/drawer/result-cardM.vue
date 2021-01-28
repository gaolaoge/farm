<template>
  <div class="result-cardM farm-drawer t"
       v-loading="loading"
       element-loading-background="rgba(0, 0, 0, 0.49)"
       element-loading-spinner="el-icon-loading"
       element-loading-text="拼命加载中...">
    <!--表头-->
    <div class="farm-drawer-title">
      <!--关闭icon-->
      <div class="closeIcon">
        <img src="@/icons/back_icon-black.png" title="后退" @click="backF">
      </div>
      <!--参数-->
      <div class="dataList">
        <div class="li cost">
            <span class="label">
              {{ result.dataO.costLabel }}：
            </span>
          <span class="val">
              {{ result.dataO.costVal }}
            </span>
        </div>
        <div class="li total">
            <span class="label">
              {{ result.dataO.totalLabel }}：
            </span>
          <span class="val">
              {{ result.dataO.totalVal }}
            </span>
        </div>
        <div class="li average">
            <span class="label">
              {{ result.dataO.averageLabel }}：
            </span>
          <span class="val">
              {{ result.dataO.averageVal }}
            </span>
        </div>
      </div>
    </div>
    <!--表体-->
    <div class="farm-drawer-body">
      <!--任务描述-->
      <div class="info">
        <div class="thumbnail">
            <span class="status"
                  :class="[
                  {'wait': result.statusData == '等待' || result.statusData == '暂停'},
                  {'ing': result.statusData == '渲染中'},
                  {'done': result.statusData == '渲染成功'},
                  {'pause': result.statusData == '暂无'},
                  {'giveUp': result.statusData == '渲染放弃' || result.statusData == '暂停（欠费）'||  result.statusData == '暂停（超时）'}
                  ]">
              {{ result.statusData }}
            </span>
          <img v-show="result.miniImgHref"
               :src="result.miniImgHref"
               class="img"
               @click="$store.commit('setShowThumb', true)">
          <img src="@/assets/no_thumb.png" v-show="!result.miniImgHref">
        </div>
        <div class="dataList">

          <!--任务ID-->
          <div class="item">
              <span class="label">
                {{ result.statusList.taskIdLabel }}：
              </span>
            <span class="val">
                {{ result.statusList.taskIdVal }}
              </span>
          </div>

          <!--场景名-->
          <div class="item">
              <span class="label">
                {{ result.statusList.scenesNameLabel }}：
              </span>
            <span class="val">
                {{ result.statusList.scenesNameVal }}
              </span>
          </div>

          <!--所属项目-->
          <div class="item">
              <span class="label">
                {{ result.statusList.projectLabel }}：
              </span>
            <span class="val">
                {{ result.statusList.projectVal }}
              </span>
          </div>

          <!--渲染软件-->
          <div class="item">
              <span class="label">
                {{ result.statusList.softwareLabel }}：
              </span>
            <span class="val">
                {{ result.statusList.softwareVal }}
              </span>
          </div>

          <!--渲染插件-->
          <div class="item">
              <span class="label">
                {{ result.statusList.pluginLabel }}：
              </span>
            <span class="val">
                {{ result.statusList.pluginVal }}
              </span>
          </div>

          <!--层名-->
          <div class="item">
              <span class="label">
                {{ result.statusList.layerLabel }}：
              </span>
            <span class="val">
                {{ result.statusList.layerVal }}
              </span>
          </div>

          <!--分辨率-->
          <div class="item">
              <span class="label">
                {{ result.statusList.resolutionLabel }}：
              </span>
            <span class="val">
                {{ result.statusList.resolutionVal }}
              </span>
          </div>

          <!--输出格式-->
          <div class="item">
              <span class="label">
                {{ result.statusList.formatLabel }}：
              </span>
            <span class="val">
                {{ result.statusList.formatVal }}
              </span>
          </div>

          <!--相机-->
          <div class="item">
              <span class="label">
                {{ result.statusList.cameraLabel }}：
              </span>
            <span class="val">
                {{ result.statusList.cameraVal }}
              </span>
          </div>

          <!--渲染模式-->
          <div class="item">
              <span class="label">
                {{ result.statusList.modeLabel }}：
              </span>
            <span class="val" :title="result.statusList.modeVal">
                {{ result.statusList.modeVal }}
              </span>
          </div>

          <!--创建人-->
          <div class="item">
              <span class="label">
                {{ result.statusList.founderLabel }}：
              </span>
            <span class="val" :title="result.statusList.founderVal">
                {{ result.statusList.founderVal }}
              </span>
          </div>

          <!--创建时间-->
          <div class="item">
              <span class="label">
                {{ result.statusList.creationTimeLabel }}：
              </span>

            <el-tooltip class="item"
                        effect="dark"
                        :content="result.statusList.creationTimeVal"
                        placement="right-end">
                <span class="val" :title="result.statusList.creationTimeVal">
                {{ result.statusList.creationTimeVal }}
              </span>
            </el-tooltip>
          </div>

        </div>
      </div>
      <!--任务table-->
      <div class="list">
        <div class="table">
          <!--主-操作-->
          <div class="operateBtnBase" v-show="!result.showDetails">
            <div class="operateBtn"
                 :class="[{'cannotTrigger': item.classState}]"
                 @click="operateFun(item.text)"
                 v-for="(item,index) in result.operateBtnList"
                 :key="index">
              <img :src="item.imgUrlR" v-if="item.imgUrlR" class="r">
              <img :src="item.imgUrlH" v-if="item.imgUrlH" class="h">
              <span class="text">{{ item.text }}</span>
            </div>
            <div class="searchBase">
              <img src="@/icons/global-search-icon.png" class="i" @click="getRenderItemMoreTableF">
              <input type="text"
                     v-model="result.searchInpVal"
                     class="search"
                     placeholder="搜索帧"
                     @keyup.enter="getRenderItemMoreTableF">
            </div>
          </div>
          <!--详情-操作-->
          <div class="operateBtnBase more" v-show="result.showDetails">
            <div class="operateBtn"
                 @click="moreOperateFun(item.text)"
                 v-for="(item,index) in result.operateMoreBtnList"
                 :key="index">
              <img :src="item.imgUrl" v-if="item.imgUrl">
              <span class="text">{{ item.text }}</span>
            </div>
            <div class="searchBase">
              <img src="@/icons/global-search-icon.png"
                   class="i"
                   @click="">
              <input type="text"
                     class="search"
                     placeholder="搜索帧"
                     @keyup.enter="">
            </div>
          </div>
          <!--主-table-->
          <div class="tableBase task-table-seeMore" v-show="!result.showDetails">
            <!--v-el-table-infinite-scroll="mainTableAddMoreItem" 无限滚动 -->
            <el-table
              :data="result.tableData"
              :border=true
              @selection-change="handleSelectionChange"
              @filter-change="filterHandler"
              @row-click="showMiniImg"
              ref="mainTable"
              class="vv"
              height="auto"
              style="width: 100%">

              <el-table-column
                type="selection"
                align="right"
                show-overflow-tooltip
                min-width="58"
                width="58"/>
              <!--帧数-->
              <el-table-column
                label="帧数"
                sortable
                show-overflow-tooltip
                width="120">
                <template slot-scope="scope">
                  {{ scope.row.num }}
                </template>
              </el-table-column>
              <!--帧状态-->
              <el-table-column
                label="帧状态"
                show-overflow-tooltip
                min-width="120">
                <template slot-scope="scope">
                    <span :class="[
                        {'wait': scope.row.status == '等待中'},
                        {'ing': scope.row.status == '渲染中'},
                        {'suc': scope.row.status == '渲染成功'},
                        {'fail': scope.row.status == '渲染失败' || scope.row.status == '暂停（超时）' || scope.row.status == '暂停（欠费）'},
                        {'pause': scope.row.status == '暂停'},
                      ]">
                      {{ scope.row.status }}
                    </span>
                </template>
              </el-table-column>
              <!--渲染费用（金币）-->
              <el-table-column
                prop="prices"
                label="渲染费用（金币）"
                show-overflow-tooltip
                width="142"/>
              <!--渲染时长-->
              <el-table-column
                prop="direction"
                label="渲染时长"
                show-overflow-tooltip
                width="150"/>
              <!--渲染开始时间-->
              <el-table-column
                prop="startDate"
                label="渲染开始时间"
                sortable
                show-overflow-tooltip
                width="180"/>
              <!--渲染完成时间-->
              <el-table-column
                prop="endDate"
                label="渲染完成时间"
                sortable
                show-overflow-tooltip
                width="180"/>
              <!--CPU利用率-->
              <!--<el-table-column-->
              <!--prop="percent"-->
              <!--label="CPU利用率"-->
              <!--show-overflow-tooltip-->
              <!--width="110" />-->
              <!--内存峰值-->
              <!--<el-table-column-->
              <!--prop="RAM"-->
              <!--label="内存峰值"-->
              <!--sortable-->
              <!--show-overflow-tooltip-->
              <!--width="120" />-->
              <!--下载次数-->
              <el-table-column
                prop="times"
                label="下载次数"
                sortable
                show-overflow-tooltip
                width="140"/>
              <!--日志-->
              <el-table-column
                prop="log"
                label="日志"
                sortable
                show-overflow-tooltip
                width="80">
                <template slot-scope="scope">
                  <span class="seeMore" @click="showMore(scope.row)">
                    查看
                  </span>
                </template>
              </el-table-column>

            </el-table>
          </div>
          <!--详情-table-->
          <div class="tableBase task-table-seeMore-details" v-show="result.showDetails">
            <!--table-->
            <el-table
              :data="result.detailsTableData"
              @selection-change="handleDetailsSelectionChange"
              class="g"
              :class="[{'null': !result.detailsTableData.length}]"
              :border=true
              style="width: 100%">

              <!--<el-table-column-->
              <!--type="selection"-->
              <!--align="right"-->
              <!--show-overflow-tooltip-->
              <!--min-width="58"-->
              <!--width="58" />-->
              <!--帧数-->
              <el-table-column
                prop="num"
                label="帧数"
                sortable
                show-overflow-tooltip
                width="120"/>
              <!--帧状态-->
              <el-table-column
                prop="status"
                label="帧状态"
                show-overflow-tooltip
                min-width="120"/>
              <!--渲染费用（金币）-->
              <el-table-column
                prop="prices"
                label="渲染费用（金币）"
                show-overflow-tooltip
                width="172"/>
              <!--渲染时长-->
              <el-table-column
                prop="direction"
                label="渲染时长"
                show-overflow-tooltip
                width="160"/>
              <!--渲染开始时间-->
              <el-table-column
                prop="startDate"
                label="渲染开始时间"
                sortable
                show-overflow-tooltip
                width="180"/>
              <!--渲染完成时间-->
              <el-table-column
                prop="endDate"
                label="渲染完成时间"
                sortable
                show-overflow-tooltip
                width="180"/>
              <!--CPU利用率-->
              <!--<el-table-column-->
              <!--prop="percent"-->
              <!--label="CPU利用率"-->
              <!--show-overflow-tooltip-->
              <!--width="110" />-->
              <!--内存峰值-->
              <!--<el-table-column-->
              <!--prop="peak"-->
              <!--label="内存峰值"-->
              <!--sortable-->
              <!--show-overflow-tooltip-->
              <!--width="120" />-->
              <!--下载次数-->
              <el-table-column
                prop="times"
                label="下载次数"
                sortable
                show-overflow-tooltip
                width="140"/>

            </el-table>
            <!--table 为空-->
            <div class="log" v-show="!result.detailsTableData.length">
              <div class="tableDataNull">
                <img src="@/icons/tableDataNull.png"
                     alt=""
                     class="tableDataNullImg">
                <div class="tableDataNullText">
                  {{ result.x }}
                </div>
              </div>
            </div>
            <!--日志详情-->
            <div class="c setScollBarStyle">
              <div v-html="demo"/>
            </div>
          </div>
        </div>
        <div class="happen">
          <div class="happen-item" v-for="(item,index) in result.happen" :key="index">
              <span class="label">
                {{ item.text }}：
              </span>
            <span class="val">
                {{ item.num }}
              </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {
    getRenderTSeeMore,
    getFrameHistoryTable
  } from '@/api/api'
  import {
    getThumbnail,
  } from '@/api/task-api'
  import {} from '@/api/newTask-api'
  import {
    consum,
    createDateFun,
    itemDownloadStatus,
    updateBalance,
    createThrowInfo
  } from '@/assets/common'
  import {mapState} from 'vuex'

  export default {
    name: 'result-cardM',
    data() {
      return {
        result: {
          dataO: {
            costLabel: '费用(金币)',
            costVal: '-',
            totalLabel: '总渲染时长',
            totalVal: '-',
            averageLabel: '平均渲染时长',
            averageVal: '-'
          },
          statusData: '',
          statusList: {
            taskIdLabel: '任务ID',
            taskIdVal: '',
            scenesNameLabel: '场景名',
            scenesNameVal: '',
            projectLabel: '所属项目',
            projectVal: '',
            softwareLabel: '渲染软件',
            softwareVal: '',
            pluginLabel: '渲染插件',
            pluginVal: '',
            layerLabel: '层名',
            layerVal: '',
            resolutionLabel: '分辨率',
            resolutionVal: '',
            formatLabel: '输出格式',
            formatVal: '',
            cameraLabel: '相机',
            cameraVal: '',
            modeLabel: '渲染模式',
            modeVal: '',
            founderLabel: '创建人',
            founderVal: '',
            creationTimeLabel: '创建时间',
            creationTimeVal: ''
          },
          // 主 table 操作
          operateBtnList: [
            {
              imgUrlR: require('@/icons/playIcon-black.png'),
              imgUrlH: require('@/icons/playIcon-white.png'),
              text: '开始',
              classState: true
            },
            {
              imgUrlR: require('@/icons/pauseIcon-black.png'),
              imgUrlH: require('@/icons/pauseIcon-white.png'),
              text: '暂停',
              classState: true
            },
            {
              text: '下载完成帧',
              classState: true
            },
            {
              text: '重新渲染',
              classState: true
            },
          ],
          // 详情 table 操作
          operateMoreBtnList: [
            {
              imgUrl: require('@/icons/back_icon.png'),
              text: '返回'
            },
            {
              imgUrl: require('@/icons/download_icon.png'),
              text: '下载日志'
            }
          ],
          // 主 table 数据
          tableData: [
            // {
            //   num: null,      // 帧数
            //   status: '',     // 帧状态
            //   prices: null,   // 渲染费用（金币）
            //   direction: '',  // 渲染时长
            //   startDate: '',  // 渲染开始时间
            //   endDate: '',    // 渲染完成时间
            //   percent: '',    // CPU利用率
            //   RAM: '',        // 内存峰值
            //   times: null,    // 已下载次数
            //   log: ''         // 日志
            // },
          ],
          // 详情 table 数据
          detailsTableData: [
            // {
            // num: null,      // 帧数
            // cost: null,     // 渲染费用
            // duration: '',   // 渲染时长
            // startDate: '',  // 渲染开始时间
            // endDate: '',    // 渲染完成时间
            // price: '',      // 单价
            // percent: '',    // CPU利用率
            // peak: ''        // 内存峰值
            // time: null       // 下载次数
            // },
          ],
          // 主 table 多选结果
          selectionResult: [],
          // 详情 table 多选结果
          detailsSelectionResult: [],
          // 主 table 页码
          mainTableIndex: 0,
          // 主 渲染状态
          happen: [
            {
              text: '渲染中',
              num: 0
            },
            {
              text: '等待',
              num: 0
            },
            {
              text: '暂停',
              num: 0
            },
            {
              text: '完成',
              num: 0
            },
            {
              text: '失败',
              num: 0
            }
          ],
          x: '暂无数据',
          showDetails: false,
          searchInpVal: '',            // 渲染结果 - 主table 操作 关键帧查询
          miniImgHref: null,           // 渲染结果 - 缩略图
          lock: true,                  // 渲染提交事件锁
        },
        demo: ``,
        loading: false
      }
    },
    props: {
      taskData: {
        type: Object
      }
    },
    watch: {
      taskData: function (val) {
        this.getData()
      },
      'socket_plugin_msg': {
        handler: function (e) {
          let data = JSON.parse(e.data)
          if (data.code != 852 || this.typeInfo != 'result' || this.result.showDetails) return false
          let {taskUuid, layerUuid} = data
          if (this.taskData.FatherTaskUuId == taskUuid && this.taskData.taskUuid == layerUuid) this.getRenderItemMoreTableF()
        }
      },
      'socket_backS_msg': {
        handler: function (e) {
          let data = JSON.parse(e.data)
          if (data.code == 853) this.getRenderItemMoreTableF()           // 渲染列表
          else return false
        },
      },
    },
    methods: {
      // 后退
      backF() {
        this.$emit('backToTable')
      },
      // 主table多选事件
      handleSelectionChange(val) {
        this.result.selectionResult = val
        let t = val.map(curr => curr.status)
        let s = this.result.operateBtnList[0], // 开始
          p = this.result.operateBtnList[1],   // 暂停
          d = this.result.operateBtnList[2],   // 下载完成帧
          a = this.result.operateBtnList[3]    // 重新渲染

        if (t.length > 0 && t.every(item => ['暂停', '暂停（超时）', '暂停（欠费）'].includes(item))) {
          s['classState'] = false
        } else s['classState'] = true

        if (t.length > 0 && t.every(item => ['渲染成功', '渲染中', '渲染失败'].includes(item))) {
          a['classState'] = false
        } else a['classState'] = true

        if (t.length > 0 && t.every(item => ['渲染中', '等待中'].includes(item))) {
          p['classState'] = false
        } else p['classState'] = true

        if (t.length > 0 && t.every(item => '渲染成功' == item)) {
          d['classState'] = false
        } else d['classState'] = true

      },
      // 详情table多选事件
      handleDetailsSelectionChange(val) {
        this.result.detailsSelectionResult = val
      },
      // 主table筛选条件改变
      filterHandler() {

      },
      // 进入 - 获取详情
      getData() {
        // this.loading = true
        this.getRenderItemMoreTableF()
      },
      // 渲染下载 - 详情 - 缩略图
      async showMiniImg(row, column, event) {
        try {
          this.result.statusData = row['status']
          let t = `frameTaskUuid=${row.frameTaskUuid}&layerTaskUuid=${row.layerTaskUuid}&size=240`,
            data = await getThumbnail(t)
          if (data.data.code == 1000) this.result.miniImgHref = null
          else if (data.data.code == 200) {
            this.result.miniImgHref = data.data.data
            let a = await getThumbnail(`frameTaskUuid=${row.frameTaskUuid}&layerTaskUuid=${row.layerTaskUuid}&size=900`)
            this.$store.commit('setThumbURL', a.data.data)
          }
        } catch (err) {
        }
      },
      // 渲染下载 - 详情 - 主table 获取列表
      async getRenderItemMoreTableF() {
        // {
        //   TaskUuid: '',
        //   layerTaskUuid: '',
        //   keyword: '',
        //   pageIndex: '',
        //   pageSize: ''
        // }
        this.result.miniImgHref = null
        let t = this.taskData,
          parameter = `taskUuid=${t.FatherTaskUuId}&layerTaskUuid=${t.layerTaskUuid}&keyword=${this.result.searchInpVal}&pageIndex=1&pageSize=999`

        let data = await getRenderTSeeMore(parameter),
          data_ = data.data.data
        this.result.tableData = data_.frameList.map(curr => {
          let s = null
          switch (curr.frameTaskStatus) {
            case 1:
              s = '等待中'
              break
            case 2:
            case 9:
              s = '渲染中'
              break
            case 3:
              s = '渲染成功'
              break
            case 4:
              s = '渲染失败'
              break
            case 5:
              if (curr.result == 7) s = '暂停（欠费）'
              else if (curr.result == 6) s = '暂停（超时）'
              else s = '暂停'
              break
          }
          return {
            num: curr.isTest == 1 ? curr.frameNo + '（优先）' : curr.frameNo,      // 帧数
            status: s,                                            // 帧状态
            prices: curr.cost,                                    // 渲染费用（金币）
            direction: consum(curr.useTime),                      // 渲染时长
            startDate: createDateFun(new Date(curr.startTime)),   // 渲染开始时间
            endDate: createDateFun(new Date(curr.endTime)),       // 渲染完成时间
            percent: '-',                                         // CPU利用率
            RAM: '-',                                             // 内存峰值
            times: curr.downloadCount,                            // 已下载次数
            layerTaskUuid: curr.layerTaskUuid,                    // 层uuid
            frameTaskUuid: curr.frameTaskUuid,                    // 帧uuid
            taskTaskUuid: curr.taskUuid,                          // 主uuid
            inFilePath: curr.inFilePath,
            outFilePath: curr.outFilePath,
            layerName: data_.taskInfo.layerName,
            fileName: curr.fileName,
            taskID: data_.taskInfo.taskNo,
            sceneName: data_.taskInfo.fileName
          }
        })
        this.result.happen[0]['num'] = data_.frameCount['running']
        this.result.happen[1]['num'] = data_.frameCount['wait']
        this.result.happen[2]['num'] = data_.frameCount['pause']
        this.result.happen[3]['num'] = data_.frameCount['done']
        this.result.happen[4]['num'] = data_.frameCount['fail']
        Object.assign(this.result.dataO, {
          costVal: data_.topInfo['allCost'].toFixed(3),
          totalVal: consum(data_.topInfo['allTime']),
          averageVal: consum(data_.topInfo['useTime'])
        })

        Object.assign(this.result.statusList, {
          taskIdVal: data_.taskInfo.taskNo,                                            // 任务ID
          scenesNameVal: data_.taskInfo.fileName,                                      // 场景名
          projectVal: data_.taskInfo.projectName,                                      // 所属项目
          softwareVal: data_.taskInfo.softName + ' ' + data_.taskInfo.softVer,         // 渲染软件
          pluginVal: data_.taskInfo.pluginName + ' ' + data_.taskInfo.pluginVersion,   // 渲染插件
          layerVal: data_.taskInfo.layerName,                                          // 层名
          resolutionVal: data_.taskInfo.width + '*' + data_.taskInfo.height,           // 分辨率
          formatVal: data_.taskInfo.formatName,                                        // 输出格式
          cameraVal: data_.taskInfo.camera,                                            // 相机
          modeVal: data_.taskInfo.patternName,                                         // 渲染模式
          founderVal: data_.taskInfo.account,                                          // 创建人
          creationTimeVal: createDateFun(new Date(data_.taskInfo.createTime))          // 创建时间
        })
        this.showMiniImg(this.result.tableData[0])
        this.loading = false
      },
      //关闭详情 复位

      // 渲染结果 - 主 - 操作
      operateFun(action) {
        switch (action) {
          case '开始':
            this.operateStart()
            break
          case '暂停':
            this.operatePause()
            break
          case '下载完成帧':
            this.operateDownloadFrame()
            break
          case '重新渲染':
            this.operateRenderAgain()
            break
        }
      },
      // 渲染结果 - 详情 - 操作
      moreOperateFun(action) {
        switch (action) {
          case '返回':
            this.moreOperateBack()
            break
          case '下载日志':
            this.moreOperateDownload()
            break
        }
      },
      // 渲染结果 - 主 - 操作 - 【开始】前预判
      async operateStart() {
        if (this.result.operateBtnList[0]['classState']) return false
        // 判断余额是否充足
        updateBalance('开始')
          .then(data => {
            if (data) this.operateStartReal()
          })
          .catch(() => createThrowInfo({
            type:'error',
            title:'获取余额情况失败',
            info:'在层任务【开始】操作前判断',
            site:'components/task/drawer/result-cardM:822'
          }))
      },
      // 渲染结果 - 主 - 操作 - 开始
      async operateStartReal() {
        let data = await itemStart({
          "instructType": 11,
          "frameUuidList": this.result.selectionResult.map(curr => curr.frameTaskUuid)
        })
        if (data.data.code == 200) {
          messageFun('success', '操作成功');
          this.getRenderItemMoreTableF()
        } else if (data.data.code == 1001) messageFun('info', '余额不足')
        else messageFun('error', '报错，操作失败')
      },
      // 渲染结果 - 主 - 操作 - 暂停
      async operatePause() {
        if (this.result.operateBtnList[1]['classState']) return false
        let data = await itemStart({
          "instructType": 22,
          "frameUuidList": this.result.selectionResult.map(curr => curr.frameTaskUuid)
        })
        if (data.data.code == 200) {
          messageFun('success', '操作成功');
          this.getRenderItemMoreTableF()
        } else messageFun('error', '报错，操作失败')
      },
      // 渲染结果 - 主 - 操作 - 【下载完成帧】前预判
      operateDownloadFrame() {
        if (this.result.operateBtnList[2]['classState']) return false
        if (!this.result.selectionResult.length) return false
        if (!this.socket_plugin) this.$store.dispatch('WEBSOCKET_PLUGIN_INIT', true).then(() => this.next())
        else this.next()
        this.next = function () {
          // 判断余额是否充足
          updateBalance('下载完成帧')
            .then(data => {
              if (data) this.operateDownloadFrameReal()
            })
            .catch(() => createThrowInfo({
              type:'error',
              title:'获取余额情况失败',
              info:'在层任务【下载完成帧】操作前判断',
              site:'components/task/drawer/result-cardM:847'
            }))
        }
      },
      // 渲染结果 - 主 - 操作 - 下载完成帧
      async operateDownloadFrameReal() {
        let fileList = this.result.selectionResult.map(item => {
          let index = item['outFilePath'].indexOf(item.taskTaskUuid)
          return {
            path: '\\' + item['outFilePath'].slice(index) + item['fileName'],
            taskID: this.taskData['id'],             // 任务ID
            fileName: this.taskData['sceneName']     // 场景名
          }
        })
        this.$store.commit('WEBSOCKET_PLUGIN_SEND', {
          'transferType': 2,
          'userID': this.user.id,
          isRender: 1,
          parent: '',
          fileList
        })
      },
      // 渲染结果 - 主 - 操作 - 【重新渲染】前预判
      operateRenderAgain() {
        if (this.result.operateBtnList[3]['classState']) return false
        // 判断余额是否充足
        updateBalance('重新渲染')
          .then(data => {
            if (data) this.operateRenderAgainReal()
          })
          .catch(() => createThrowInfo({
            type:'error',
            title:'获取余额情况失败',
            info:'在层任务【重新渲染】操作前判断',
            site:'components/task/drawer/result-cardM:899'
          }))
      },
      // 渲染结果 - 主 - 操作 - 重新渲染
      operateRenderAgainReal() {
        this.$confirm('此操作将重新渲染选中项, 是否继续?', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(
            async () => {
              let dataList = []
              this.result.selectionResult.forEach(curr => dataList.push(curr.frameTaskUuid))
              let data = await itemStart({
                "instructType": 33,
                "instructTaskList": [{
                  "taskUuid": this.result.selectionResult[0]['taskTaskUuid']
                }],
                "frameUuidList": dataList
              })
              if (data.data.code == 200) messageFun('success', '操作成功')
            },
            () => messageFun('info', '已取消操作')
          )
          .catch(error => {
            messageFun('error', '报错，操作失败')
            console.log(error)
          })
      },
      // 渲染结果 - 详情 - 操作 - 返回
      moreOperateBack() {
        this.result.showDetails = false
        this.demo = null
      },
      // 渲染结果 - 详情 - 操作 - 下载日志
      async moreOperateDownload() {
        let data = await downloadLog(`layerTaskUuid=${this.result.detailsTableData[0]['layerTaskUuid']}&frameTaskUuid=${this.result.detailsTableData[0]['frameTaskUuid']}`)
        // exportDownloadFun(data, data.headers.file, 'text')  事件交接给C
      },
      // 查看详情
      async showMore(row) {
        this.result.showDetails = true
        let data = await getFrameHistoryTable(`layerTaskUuid=${row.layerTaskUuid}&frameTaskUuid=${row.frameTaskUuid}`)
        this.result.detailsTableData = data.data.data.frameTaskList.map(item => {
          return {
            num: item.frameNo,                   // 帧数
            status: itemDownloadStatus(item.frameTaskStatus),                  // 帧状态
            prices: item.cost,                   // 渲染费用
            direction: consum(item.useTime),     // 渲染时长
            startDate: createDateFun(new Date(item.startTime)),   // 渲染开始时间
            endDate: createDateFun(new Date(item.endTime)),       // 渲染完成时间
            price: item.unitPrice,               // 单价
            percent: item.cpuRate,               // CPU利用率
            peak: item.memoryPeak,               // 内存峰值
            times: item.downloadCount,           // 下载次数
            layerTaskUuid: item.layerTaskUuid,
            frameTaskUuid: item.frameTaskUuid
          }
        })
        this.demo = data.data.data.log.length != 0 ? data.data.data.log.reduce((total, curr) => {
          return total + `<p class="p">${curr}</p>`
        }, '') : `<p class="p">没有日志，获取日志失败</p>`
      },
    },
    computed: {
      ...mapState(['zone', 'user', 'socket_plugin_msg', 'socket_backS_msg', 'zoneId', 'socket_plugin'])
    }
  }
</script>

<style lang="less" scoped>
  .rule {
    color: rgba(27, 83, 244, 1);
    opacity: 0.8;
    cursor: pointer;
    text-decoration: underline;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }

  /*渲染层数开关*/
  .switchLayered {
    float: right;

    .switchLayeredText {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      vertical-align: middle;
      display: inline-block;
      margin-left: 4px;

      &.active {
        color: rgba(22, 29, 37, 0.6);
      }
    }

    .mark {
      vertical-align: middle;
      margin-left: 2px;
      cursor: pointer;
    }
  }

  .farm-drawer-body-item-d {
    padding-top: 15px;

    .item-label {
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      color: rgba(22, 29, 37, 0.6);
      margin-right: 10px;
    }

    .item-switch {
      display: inline-block;
      vertical-align: top;
      margin-right: 30px;

      .item-switch-label {
        margin-left: 5px;
        display: inline-block;
        font-size: 14px;
        font-weight: 400;
        color: rgba(22, 29, 37, 1);
        vertical-align: middle;
        opacity: 0.6;
        transition: opacity 0.2s;

        &.active {
          opacity: 1;
        }
      }
    }

    &.addPadding {
      padding-bottom: 15px;
    }
  }

  .s {
    .farm-drawer-body-item {
      margin-bottom: 10px;
    }

    .info {
      margin-left: 122px;
      font-size: 12px;
      color: rgba(255, 191, 0, 1);

      img {
        width: 13px;
        opacity: 0.59;
        vertical-align: middle;
        margin-right: 2px;
      }
    }

    .set {
      .farm-drawer-body {
        padding: 0px 9px;

        .farm-drawer-item {
          .farm-drawer-item-label {
            width: 110px;
            margin-right: 28px;
          }

          .mark {
            vertical-align: middle;
            cursor: pointer;
          }

          .slider {
            display: inline-block;
            width: 240px;
            vertical-align: middle;
          }

          .createBtn {
            display: inline-block;
            margin-left: 4px;
            font-size: 14px;
            color: rgba(10, 98, 241, 1);
            cursor: pointer;

            .createIcon {
              width: 18px;
              vertical-align: middle;
              margin-left: 20px;
            }
          }

          &:nth-of-type(1) {
            margin-top: 15px;
          }
        }
      }
    }

    .b {
      display: flex;
      justify-content: flex-end;
      height: 32px;
      box-sizing: border-box;
      position: absolute;
      bottom: 60px;
      width: calc(100% - 40px);

      .btn {
        border-radius: 6px;
        font-size: 14px;
        text-align: center;
        cursor: pointer;

        &:nth-of-type(1) {
          width: 102px;
          height: 30px;
          line-height: 30px;
          background-color: rgba(248, 248, 248, 1);
          border: 1px solid rgba(22, 29, 37, 0.2);
          margin-right: 20px;
        }

        &:nth-of-type(2) {
          width: 104px;
          height: 32px;
          background-color: rgba(10, 98, 241, 1);
          color: rgba(255, 255, 255, 1);
          line-height: 32px;
        }
      }
    }

    .farm-drawer-item {
      &:nth-last-of-type(1) {
        padding-bottom: 0px;
      }
    }
  }

  .farm-table-td-span {
    opacity: 0;

    &.show {
      opacity: 1;
    }

    &.err {
      color: tomato;
    }
  }

  .farm-table-td-input {
    position: absolute;
    top: 6px;
    left: 0px;
    width: calc(100% - 10px);
    padding-left: 10px;
    height: 23px;
    line-height: 23px;
    opacity: 0;
    background-color: transparent;
    outline: none;
    border: 0px;
    color: rgba(22, 29, 37, 0.79);
    font-size: 14px;
    font-family: 'SourceHanSansCN', 'Arial Bold';

    &.show {
      opacity: 1;
    }
  }

  .seeMore {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 97, 255, 1);
    text-decoration: underline;
    cursor: pointer;
  }

  /deep/ .el-table__empty-block {
    display: none;
    width: 100px;
  }

  /deep/ .customizeInput {
    display: inline-block;
    width: 100px;

    input.el-input__inner {
      border: 0px;
      border-bottom: 1px solid rgba(22, 29, 37, 0.29);
      border-radius: 0px;
      background-color: transparent;
      outline: none;
      height: 18px;
      padding-left: 0px;
      margin-left: 10px;
      width: 100px;
      color: rgba(22, 29, 37, 0.8);

      &::-webkit-input-placeholder {
        color: rgba(22, 29, 37, 0.4);
      }
    }

    &.customizeInputError {
      input.el-input__inner {
        color: rgba(255, 62, 77, 1);
      }
    }
  }

  .wait {
    color: rgba(229, 199, 138, 1);
  }

  .ing {
    color: rgba(9, 245, 150, 1);
  }

  .suc {
    color: rgba(0, 227, 255, 1);
  }

  .pause {
    color: rgba(229, 199, 138, 1);
  }

  .fail {
    color: rgba(249, 0, 35, 1);
  }

  .null {
    height: 120px;
  }

  .set {
    .haveBorder {
      border: 1px solid rgba(22, 29, 37, 0.3);
      border-radius: 6px;

      /deep/ .el-input__inner {
        width: 317px;
      }
    }
  }

  /deep/ .cell {
    height: 23px;

    .el-input.el-input--suffix {
      height: 23px;

      .el-input__inner,
      .el-input__icon {
        height: 23px;
        line-height: 23px;
      }
    }
  }

  .farm-drawer.t {
    position: relative;
    display: flex;
    right: 0px;
    top: 0px;
    width: 100%;
    height: 100%;

    .farm-drawer-title {
      box-sizing: border-box;
      padding: 12px 20px;

      .closeIcon {
        margin-top: 0px;
      }

      .dataList {
        margin-left: 0px;
        margin-right: 60px;
      }
    }

    .farm-drawer-body {
      position: relative;
      display: flex;
      width: 100%;
      box-sizing: border-box;

      .info {
        display: flex;
        flex-direction: column;
        width: 260px;
        height: calc(100% - 12px);
        margin-right: 20px;
        padding-bottom: 16px;
        box-sizing: border-box;

        .thumbnail {
          flex-grow: 0;
          height: 220px;
          padding: 10px;
          box-sizing: border-box;
          border-radius: 4px;
          margin-bottom: 23px;
          box-shadow: 0px 0px 1px 1px rgba(22, 29, 37, 0.15);

          .img {
            width: 240px;
            box-shadow: 0px 0px 1px 1px rgba(22, 29, 37, 0.1);
          }

          .status {
            position: relative;
            left: 21px;
            display: inline-block;
            margin-top: 15px;
            font-size: 14px;

            &::before {
              content: '';
              position: absolute;
              left: -13px;
              top: 8px;
              width: 6px;
              height: 6px;
              border-radius: 50%;
            }

            &.wait {
              color: rgba(229, 199, 138, 1);

              &::before {
                background-color: rgba(229, 199, 138, 1);
              }
            }

            &.ing {
              color: rgba(9, 245, 150, 1);

              &::before {
                background-color: rgba(9, 245, 150, 1);
              }
            }

            &.done {
              color: rgba(0, 227, 255, 1);

              &::before {
                background-color: rgba(0, 227, 255, 1);
              }
            }

            &.pause {
              color: rgba(229, 199, 138, 1);

              &::before {
                background-color: rgba(229, 199, 138, 1);
              }
            }

            &.giveUp {
              color: rgba(249, 0, 35, 1);

              &::before {
                background-color: rgba(249, 0, 35, 1);
              }
            }
          }
        }

        .dataList {
          flex-grow: 1;
          padding: 20px;
          box-sizing: border-box;
          border-radius: 4px;
          box-shadow: 0px 0px 1px 1px rgba(22, 29, 37, 0.15);
          overflow: hidden;

          .item {
            margin-bottom: 15px;

            .label {
              display: inline-block;
              width: 70px;
              height: 20px;
              font-size: 14px;
              color: rgba(22, 29, 37, 0.8);
              margin-right: 19px;
            }

            .val {
              vertical-align: top;
              display: inline-block;
              width: 130px;
              font-size: 14px;
              font-weight: 400;
              color: rgba(22, 29, 37, 0.6);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }

      .list {
        width: calc(100% - 260px - 20px);

        .table {
          padding: 10px;
          box-sizing: border-box;
          border-radius: 4px;
          height: calc(100vh - 234px);
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          box-shadow: 0px 0px 1px 1px rgba(22, 29, 37, 0.15);

          .operateBtnBase {
            .operateBtn {
              display: inline-flex;
              align-items: center;
              background-color: rgba(248, 248, 248, 1);
              border: 1px solid rgba(22, 29, 37, 0.1);
              border-radius: 5px;
              cursor: pointer;
              margin-right: 10px;
              padding: 1px 10px;

              .text {
                font-size: 13px;
                color: rgba(22, 29, 37, 0.79);
              }

              img {
                width: 8px;
                margin-right: 4px;

                &.h {
                  display: none;
                }
              }

              &.cannotTrigger {
                cursor: no-drop;

                span {
                  color: rgba(22, 29, 37, 0.39);
                }

                img {
                  opacity: 0.39;
                }
              }

              &:not(.cannotTrigger):hover {
                background-color: rgba(27, 83, 244, 1);
                border: 1px solid rgba(27, 83, 244, 1);

                .text {
                  color: rgba(255, 255, 255, 1);
                }

                img {
                  &.h {
                    display: inline-block;
                  }

                  &.r {
                    display: none;
                  }
                }
              }
            }

            .searchBase {
              position: relative;
              float: right;

              .search {
                width: 150px;
                height: 28px;
                border-radius: 4px;
                border: 1px solid rgba(0, 97, 255, 0.5);
                background-color: transparent;
                color: rgba(22, 29, 37, 0.6);
                outline: none;
                padding-left: 24px;
                box-sizing: border-box;
              }

              .i {
                position: absolute;
                width: 12px;
                top: 8px;
                left: 8px;
                cursor: pointer;
              }
            }

            &.more {
              .operateBtn {
                img {
                  width: 12px;
                }

              }
            }
          }

          .tableBase {
            width: 100%;
            height: calc(100vh - 290px);
            display: flex;
            flex-direction: column;
            /*日志详情*/

            .log {
              display: flex;
              justify-content: center;
              margin-top: -316px;

              .tableDataNull {
                .tableDataNullText {
                  font-size: 14px;
                  font-weight: 400;
                  color: rgba(255, 255, 255, 0.29);
                  text-align: center;
                }
              }
            }

            /*日志*/

            .c {
              flex-shrink: 1;
              flex-grow: 1;
              border-radius: 4px;
              border: 1px solid rgba(22, 29, 37, 0.1);
              margin-top: 30px;
              padding: 20px 15px;
              box-sizing: border-box;
              overflow-y: auto;

              /deep/ .p {
                font-size: 13px;
                font-weight: 400;
                color: rgba(22, 29, 37, 0.59);
                line-height: 18px;
              }

              /*&::-webkit-scrollbar {*/
              /*!*滚动条整体样式*!*/
              /*width: 8px; !*高宽分别对应横竖滚动条的尺寸*!*/
              /*height: 8px;*/
              /*}*/
              /*&::-webkit-scrollbar-thumb {*/
              /*!*滚动条里面小方块*!*/
              /*border-radius: 10px;*/
              /*-webkit-box-shadow: inset 0 0 5px rgba(102, 89, 89, 0.2);*/
              /*background: #9e9797;*/
              /*}*/
              /*&::-webkit-scrollbar-track {*/
              /*!*滚动条里面轨道*!*/
              /*-webkit-box-shadow: inset 0 0 5px rgba(138, 129, 129, 0.2);*/
              /*border-radius: 10px;*/
              /*background: rgb(226, 221, 221);*/
              /*}*/
            }
          }
        }

        .happen {
          margin-top: 20px;
          padding: 10px;
          box-sizing: border-box;
          border-radius: 4px;
          background-color: rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-around;
          border-radius: 4px;
          box-shadow: 0px 0px 1px 1px rgba(22, 29, 37, 0.15);

          .happen-item {
            .label,
            .val {
              font-size: 14px;
              color: rgba(27, 83, 244, 1);
            }
          }
        }

      }
    }
  }

</style>
