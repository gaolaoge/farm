<template>
  <div class="farm-drawer-wrapper">
    <!--分析结果-->
    <div class="farm-drawer" :class="[{'active': showDrawer}]" v-show="typeInfo == 'upload-table'">
      <div class="farm-drawer-title">
        <div class="drawer-t">
          <span class="drawer-text">
            {{ details.t }}
          </span>
        </div>
        <div class="closeIcon">
          <img src="@/icons/icon_ close1.png" alt="" @click="closeDrawer">
        </div>
      </div>
      <div class="farm-drawer-body e">
        <div class="farm-drawer-body-item one">
          <div class="farm-drawer-item">
            <span class="farm-drawer-item-label">
              {{ details.labelId }}：
            </span>
            <span class="farm-drawer-item-val">
              {{ details.valId }}
            </span>
          </div>
          <div class="farm-drawer-item">
            <span class="farm-drawer-item-label">
              {{ details.labelName }}：
            </span>
            <span class="farm-drawer-item-val">
              {{ details.valName }}
            </span>
          </div>
          <div class="farm-drawer-item">
            <span class="farm-drawer-item-label">
              {{ details.labelCreateTime }}：
            </span>
            <span class="farm-drawer-item-val">
              {{ details.valCreateTime }}
            </span>
          </div>
          <div class="farm-drawer-item">
            <span class="farm-drawer-item-label">
              {{ details.labelState }}：
            </span>
            <span class="farm-drawer-item-val">
              {{ details.valState }}
            </span>
          </div>
        </div>
        <div class="farm-drawer-body-item two">
          <!--分析进度-->
          <!--<div class="farm-drawer-item">-->
          <!--<span class="farm-drawer-item-label">-->
          <!--{{ details.labelProgress }}：-->
          <!--</span>-->
          <!--<span class="farm-drawer-item-val">-->
          <!--{{ details.valProgress }}-->
          <!--</span>-->
          <!--</div>-->
          <!--分析日志-->
          <!--<div class="farm-drawer-item">-->
          <!--<span class="farm-drawer-item-label">-->
          <!--{{ details.labelLog }}：-->
          <!--</span>-->
          <!--<span class="farm-drawer-item-val">-->
          <!--{{ details.valLog }}-->
          <!--</span>-->
          <!--</div>-->
          <div class="errorList" v-show="details.errorList[0]">
            <div class="farm-drawer-list-item" v-for="(item,index) in details.errorList">
              <div class="icon">
                <img src="@/icons/errorIcon.png" alt="">
              </div>
              <div class="text">
                <span class="t">
                  {{ item.title }}
                </span>
                <span class="c">
                  {{ item.content }}
                </span>
              </div>
            </div>
          </div>
          <div class="warningList" v-show="details.warningList[0]">
            <div class="farm-drawer-list-item" v-for="(item,index) in details.warningList">
              <div class="icon">
                <img src="@/icons/warningIcon.png" alt="">
              </div>
              <div class="text">
                <span class="t">
                  {{ item.title }}
                </span>
                <span class="c">
                  {{ item.content }}
                </span>
              </div>
            </div>
          </div>
          <!--重新分析-->
          <div class="farm-drawer-btn farm-drawer-again-btn"
               @click="renderAgainBtnFun"
               v-show="details.status == 5 || details.status == 6">
            {{ details.btnGroup.again }}
          </div>
          <!--忽略，设置参数-->
          <div class="farm-drawer-btn farm-drawer-ignoreAndSetting-btn"
               v-show="details.status == 4"
               @click="setParameter">
            {{ details.btnGroup.ignoreAndSetting }}
          </div>
          <!--设置参数-->
          <div class="farm-drawer-btn farm-drawer-setting-btn"
               v-show="details.status == 3"
               @click="setParameter">
            {{ details.btnGroup.setting }}
          </div>
        </div>
      </div>
    </div>
    <!--设置参数-->
    <div class="farm-drawer s" :class="[{'active': showDrawer}]" v-show="typeInfo == 'setting'">
      <div class="farm-drawer-title">
        <div class="drawer-t">
          <span class="drawer-text">
            {{ setting.t }}
          </span>
        </div>
        <div class="closeIcon">
          <img src="@/icons/icon_ close1.png" alt="" @click="closeDrawer">
        </div>
      </div>
      <div class="farm-drawer-body e">
        <!--渲染层数-->
        <div class="farm-drawer-body-item three">
          <!--标题-->
          <div class="farm-drawer-body-item-header">
            <span class="farm-drawer-body-item-header-main">
              {{ setting.num.title }}
            </span>
            <span class="farm-drawer-body-item-header-assist">
              {{ setting.num.miniTitO }}{{ setting.num.selected.length }}{{ setting.num.miniTitT }}
            </span>
            <!--启动分层渲染-->
            <div class="switchLayered">
              <el-switch
                v-model="setting.num.singleChoiceVal"
                @change="h"
                inactive-color="RGBA(200, 202, 203, 1)"
                active-color="rgba(10, 98, 241, 1)"
                active-value=1
                inactive-value=0>
              </el-switch>
              <span class="switchLayeredText" :class="[{'active': setting.num.singleChoice}]">
                {{ setting.num.singleChoice }}
              </span>
              <el-tooltip class="item"
                          popper-class="t"
                          effect="dark"
                          content="如果您需要将场景文件的毎一层都可以作为一个子任务单独进行渲染，请启用此项。"
                          placement="bottom-end">
                <img src="@/icons/question-mark-icon.png" alt="" class="mark">
              </el-tooltip>
            </div>
          </div>
          <!--table-->
          <el-table
            :data="setting.num.tableData"
            class="mini-table"
            :row-class-name="tableRowClassName"
            @selection-change="settingTableItemChange"
            ref="renderTable"
            style="width: calc(42vw - 34px);min-width: 766px;margin-left: -30px;">

            <el-table-column
              type="selection"
              align="right"
              width="55"/>

            <el-table-column
              prop="name"
              :label="zone == 1 ? '层名' : '图像名称'"
              width="180"/>
            <!--帧范围-->
            <el-table-column
              label="帧范围"
              v-if="zone == 1"
              width="80">
              <template slot-scope="scope">
                <span :class="[
                  {'show': scope.row.rangeEdit == false},
                  {'err': scope.row.rangeErr}
                 ]"
                      class="farm-table-td-span">
                  {{ scope.row.range }}
                </span>
                <input type="text"
                       v-model="scope.row.range"
                       :class="[{'show': scope.row.rangeEdit == true}]"
                       @focus="scope.row.rangeEdit = true"
                       @blur="rangeChange($event,scope.$index,scope.row.range,scope.row)"
                       class="farm-table-td-input">
              </template>
            </el-table-column>
            <!--间隔帧数-->
            <el-table-column
              width="80"
              v-if="zone == 1"
              label="间隔帧数">
              <template slot-scope="scope">
                <span :class="[
                  {'show': scope.row.numEdit == false},
                  {'err': scope.row.numErr}
                ]"
                      class="farm-table-td-span">
                  {{ scope.row.num }}
                </span>
                <input type="text"
                       v-model="scope.row.num"
                       :class="[{'show': scope.row.numEdit == true}]"
                       @focus="scope.row.numEdit = true"
                       @blur="numChange($event,scope.$index,scope.row)"
                       class="farm-table-td-input">
              </template>
            </el-table-column>
            <!--图像比例-->
            <el-table-column
              prop="ratio"
              label="图像比例"
              v-if="zone == 2"
              width="100"/>
            <!--图像宽度-->
            <el-table-column
              label="图像宽度"
              width="80">
              <template slot-scope="scope">
                <span :class="[{'show': scope.row.wEdit == false}]"
                      class="farm-table-td-span">
                  {{ scope.row.w }}
                </span>
                <input type="text"
                       v-model="scope.row.w"
                       :class="[{'show': scope.row.wEdit == true}]"
                       @focus="scope.row.wEdit = true"
                       @blur="wChange($event,scope.$index)"
                       class="farm-table-td-input">
              </template>
            </el-table-column>
            <!--图像高度-->
            <el-table-column
              label="图像高度">
              <template slot-scope="scope">
                <span :class="[{'show': scope.row.hEdit == false}]"
                      class="farm-table-td-span">
                  {{ scope.row.h }}
                </span>
                <input type="text"
                       v-model="scope.row.h"
                       :class="[{'show': scope.row.hEdit == true}]"
                       @focus="scope.row.hEdit = true"
                       @blur="hChange($event,scope.$index)"
                       class="farm-table-td-input">
              </template>
            </el-table-column>
            <!--输出格式-->
            <el-table-column
              label="输出格式"
              width="160">
              <template slot-scope="scope">
                <el-select v-model="scope.row.format">
                  <el-option
                    v-for="(item,index) in scope.row.formatList"
                    :key="index"
                    :label="item.label"
                    :value="item.val">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <!--相机-->
            <el-table-column
              label="相机"
              width="180">
              <template slot-scope="scope">
                <el-select v-model="scope.row.camera">
                  <el-option
                    v-for="(item,index) in scope.row.cameraList"
                    :key="index"
                    :label="item.label"
                    :value="item.val">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <!--优先渲染-->
        <div class="farm-drawer-body-item" v-show="zone == 1">
          <!--标题-->
          <div class="farm-drawer-body-item-header">
            <span class="farm-drawer-body-item-header-main">
              {{ setting.priority.title }}
            </span>
          </div>
          <!--开关-->
          <div class="farm-drawer-body-item-d addPadding">
            <div class="item-label">
              {{ setting.priority.label }}：
            </div>
            <!--首帧-->
            <div class="item-switch">
              <el-switch
                v-model="setting.priority.topVal"
                @change="val => {if(val == 1) setting.priority.selfVal = 0}"
                inactive-color="RGBA(200, 202, 203, 1)"
                active-color="rgba(10, 98, 241, 1)"
                active-value='1'
                inactive-value='0'/>
              <span class="item-switch-label" :class="[{'active': setting.priority.topVal}]">
                {{ setting.priority.topLabel }}
              </span>
            </div>
            <!--中间帧-->
            <div class="item-switch">
              <el-switch
                v-model="setting.priority.middleVal"
                @change="val => {if(val == 1) setting.priority.selfVal = 0}"
                inactive-color="RGBA(200, 202, 203, 1)"
                active-color="rgba(10, 98, 241, 1)"
                active-value='1'
                inactive-value='0'/>
              <span class="item-switch-label" :class="[{'active': setting.priority.middleVal}]">
                {{ setting.priority.middleLabel }}
              </span>
            </div>
            <!--末帧-->
            <div class="item-switch">
              <el-switch
                v-model="setting.priority.bottomVal"
                @change="val => {if(val == 1) setting.priority.selfVal = 0}"
                inactive-color="RGBA(200, 202, 203, 1)"
                active-color="rgba(10, 98, 241, 1)"
                active-value='1'
                inactive-value='0'/>
              <span class="item-switch-label" :class="[{'active': setting.priority.bottomVal}]">
                {{ setting.priority.bottomLabel }}
              </span>
            </div>
            <!--自定义-->
            <div class="item-switch" v-show="setting.num.singleChoiceVal != '1'">
              <el-switch
                style="vertical-align: inherit"
                v-model="setting.priority.selfVal"
                @change="val => {if(val == 0) setting.priority.customize = ''}"
                inactive-color="RGBA(200, 202, 203, 1)"
                active-color="rgba(10, 98, 241, 1)"
                active-value='1'
                inactive-value='0'/>
              <span class="item-switch-label"
                    :class="[{'active': setting.priority.selfVal}]"
                    style="vertical-align: inherit">
                {{ setting.priority.selfLabel }}
              </span>
              <el-input class='customizeInput'
                        :class="[{customizeInputError: setting.priority.customizeInputError}]"
                        v-show="setting.priority.selfVal == 1"
                        v-model="setting.priority.customize"
                        @blur="verifFormat"
                        @focus="setting.priority.customizeInputError = false"
                        :placeholder="setting.priority.inputPlaceholder"/>
            </div>
          </div>
          <!--提示-->
          <span class="info">
            <img src="@/icons/warningIcon.png" alt="">
            {{ setting.priority.info }}
          </span>
        </div>
        <!--渲染模式-->
        <div class="farm-drawer-body-item ">
          <!--标题-->
          <div class="farm-drawer-body-item-header">
            <span class="farm-drawer-body-item-header-main">
              {{ setting.mode.title }}
            </span>
            <span class="farm-drawer-body-item-header-assist">
              {{ setting.mode.miniTitO }}<span class="rule">{{ setting.mode.rule }}</span>{{ setting.mode.miniTitT }}
            </span>
          </div>
          <div class="farm-drawer-body-item-d">
            <el-radio-group v-model="setting.mode.mode">
              <el-radio :label="item.val" v-for="(item,index) in setting.mode.modeList" :key="index">{{ item.label }}
              </el-radio>
            </el-radio-group>
          </div>

        </div>
        <!--其他设置-->
        <div class="farm-drawer-body-item set">
          <!--标题-->
          <div class="farm-drawer-body-item-header">
            <span class="farm-drawer-body-item-header-main">
              {{ setting.other.title }}
            </span>
          </div>
          <div class="farm-drawer-body">
            <!--所属项目-->
            <div class="farm-drawer-item">
              <span class="farm-drawer-item-label star">
                {{ setting.other.viewLabel }}
              </span>
              <el-select v-model="setting.other.view"
                         placeholder="选择已有项目名称"
                         class="workBench-optionBase haveBorder">
                <el-option
                  v-for="(item,index) in setting.other.viewList"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!--新建项目-->
              <span class="createBtn" @click="createItem">
                <img src="@/icons/createIcon.png"
                     alt=""
                     class="createIcon">
                {{ setting.other.btn }}
              </span>
            </div>
            <!--超时提醒-->
            <div class="farm-drawer-item">
              <span class="farm-drawer-item-label">
                {{ setting.other.remindLabel }}
              </span>
              <el-slider v-model="setting.other.remindVal"
                         class="slider"
                         :min="1"
                         :max="72"/>
              <input type="text"
                     class="sliderVal"
                     @blur="changeSliderVal"
                     v-model="setting.other.remindVal">
              <el-tooltip class="item"
                          popper-class="t mini"
                          effect="dark"
                          content="单帧渲染时长超过设定，系统发送提醒消息给联系人，具体通知方式可在“消息设置”中完成"
                          placement="right">
                <img src="@/icons/question-mark-icon.png" alt="" class="mark">
              </el-tooltip>
            </div>
            <!--超时提醒-->
            <div class="farm-drawer-item">
              <span class="farm-drawer-item-label">
                {{ setting.other.stopLabel }}
              </span>
              <el-slider v-model="setting.other.stopVal"
                         class="slider"
                         :min="1"
                         :max="72"/>
              <input type="text"
                     class="sliderVal"
                     @blur="changeStopVal"
                     v-model="setting.other.stopVal">
              <el-tooltip class="item"
                          popper-class="t mini"
                          effect="dark"
                          content="单帧渲染时长超过设定，系统停止当前帧的渲染并发送消息给联系人"
                          placement="right">
                <img src="@/icons/question-mark-icon.png" alt="" class="mark">
              </el-tooltip>
            </div>
          </div>
        </div>
        <!--按钮-->
        <div class="b">
          <!--返回-->
          <div class="btn" @click="settingBack">
            {{ setting.btn.returnBtn }}
          </div>
          <!--开始渲染-->
          <div class="btn" @click="startRenderFun">
            {{ setting.btn.startBtn }}
          </div>
        </div>
      </div>
    </div>
    <!--渲染结果-->
    <div class="farm-drawer r" :class="[{'active': showDrawer}]" v-show="typeInfo == 'result'">
      <!--表头-->
      <div class="farm-drawer-title">
        <div class="drawer-t">
          <span class="drawer-text">
            {{ result.t }}
          </span>
        </div>
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
        <div class="closeIcon">
          <img src="@/icons/icon_ close1.png" alt="" @click="closeDrawer">
        </div>
      </div>
      <!--表体-->
      <div class="farm-drawer-body r">
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
            <img src="@/assets/no_thumb.png" v-show="!result.miniImgHref" >
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
                <img :src="item.imgUrlR" alt="" v-if="item.imgUrlR" class="r">
                <img :src="item.imgUrlH" alt="" v-if="item.imgUrlH" class="h">
                <span class="text">
                {{ item.text }}
              </span>
              </div>
              <div class="searchBase">
                <img src="@/icons/global-search-icon.png" alt="" class="i" @click="getRenderItemMoreTableF">
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
                <img :src="item.imgUrl" alt="" v-if="item.imgUrl">
                <span class="text">
                {{ item.text }}
              </span>
              </div>
              <div class="searchBase">
                <img src="@/icons/global-search-icon.png"
                     alt=""
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
                @selection-change="handleSelectionChange"
                @filter-change="filterHandler"
                @row-click="showMiniImg"
                ref="mainTable"
                class="vv"
                :border=true
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
                <!--渲染结束时间-->
                <el-table-column
                  prop="endDate"
                  label="渲染结束时间"
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
                <!--渲染结束时间-->
                <el-table-column
                  prop="endDate"
                  label="渲染结束时间"
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
  </div>
</template>

<script>
  import {
    upTopTableSet,
    upTopTableSeeMore,
    getConsumptionSelectList,
    addNewItem,
    startRender,
    getRenderTSeeMore,
    downloadFrame,
    seeBalance,
    itemStart,
    getFrameHistoryTable,
    downloadLog,
    analyseAgain,
  } from '@/api/api'
  import {
    getThumbnail,
    setCopySetData
  } from '@/api/task-api'
  import {
    createDateFun,
    consum,
    renderingRange,
    exportDownloadFun,
    messageFun,
    itemDownloadStatus
  } from '@/assets/common.js'
  import elTableInfiniteScroll from 'el-table-infinite-scroll'
  import {mapState} from 'vuex'

  export default {
    name: 'farm-drawer',
    directives: {
      'el-table-infinite-scroll': elTableInfiniteScroll
    },
    data() {
      return {
        isCopy: false,      // 是否为拷贝任务
        details: {
          t: '分析结果',
          labelId: '任务ID',
          valId: '',
          labelName: '场景名',
          valName: '',
          labelCreateTime: '创建时间',
          valCreateTime: '',
          labelState: '当前状态',
          valState: '',
          labelProgress: '分析进度',
          valProgress: '正在分析文件贴图',
          labelLog: '分析日志',
          valLog: '正在全力加速分析中，请您稍等片刻～',
          errorList: [
            // {
            //   title: '无法切换渲染层，请检查修改优化maya文件！',
            //   content: '建议：在脚本编辑器中的MEL窗口执行以下语句“fixRenderLayerQutAdjustErrors”，然后保存场景点击下方【添加任务】再次添加即可。'
            // }
          ],
          warningList: [
            // {
            //   title: '警告1：当前输出图片命名可能会导致无法正常查看图片！',
            //   content: '建议：建议修改成：\'name.#.ext\'、\'name#.ext\'、\'name_#.ext’。'
            // }
          ],
          btnGroup: {
            again: '重新分析',
            ignoreAndSetting: '忽略，设置参数',
            setting: '设置参数'
          },
          status: ''
        },
        setting: {
          t: '设置参数',
          // 渲染层数
          num: {
            title: '渲染层数',
            miniTitO: '（已选择',
            miniTitT: '个层）',
            val: '2',
            singleChoice: '启动分层渲染',
            // 分层渲染
            singleChoiceVal: '0',
            tableData: [
              {
                // id: '1',
                // name: '默认层',
                // range: '1-24',
                // num: '1',
                // w: '231',
                // h: '231',
                // format: 'cin',
                // camera: '相机二',
                // rangeEdit: false,         //帧范围
                // numEdit: false,           //间隔帧数
                // wEdit: false,             //图像宽度
                // hEdit: false,             //图像高度
                // formatList: [
                //   {
                //     label: 'AVI(avi)',
                //     val: 'avi'
                //   }
                // ],
                // cameraList: [
                //   {
                //     label: '相机一',
                //     val: '相机一'
                //   }
                // ]
              },
            ],
            tableDataAll: [],
            selected: [],
            randerError: false,
            numError: false
          },
          // 优先渲染
          priority: {
            title: '优先渲染',
            label: '优先渲染测试帧',
            topLabel: '首帧',
            topVal: '1',
            middleLabel: '中间帧',
            middleVal: '1',
            bottomLabel: '末帧',
            bottomVal: '1',
            selfLabel: '自定义',
            selfVal: '0',
            info: '测试帧渲染完成后，任务处于“待全部渲染”状态，请点击【全部渲染】',
            customize: '',
            inputPlaceholder: '例如1,2,5',
            customizeInputError: false
          },
          // 渲染模式
          mode: {
            title: '渲染模式',
            miniTitO: '（',
            miniTitT: '）',
            rule: '计费规则说明',
            mode: '2002',
            modeList: [
              {
                val: '2002',
                label: '16核32G【标准模式1】',
                id: '224',
              },
              {
                val: '32核64G【标准模式2】',
                label: '32核64G【标准模式2】',
                id: ''
              }
              // {
              //   val: '32核128G【标准模式3】',
              //   label: '32核128G【标准模式3】'
              // }
            ]
          },
          // 其它设置
          other: {
            title: '其他设置',
            btn: '新建项目',
            viewLabel: '所属项目',
            viewList: [
              // {
              //   value: '选项1',
              //   label: '黄金糕'
              // }
            ],
            view: '',
            remindLabel: '单帧超时提醒 (h)',
            remindVal: 12,
            stopLabel: '单帧超时停止 (h)',
            stopVal: 24
          },
          btn: {
            returnBtn: '返回',
            startBtn: '开始渲染'
          }
        },
        result: {
          t: '渲染结果',
          dataO: {
            costLabel: '费用(金币)',
            costVal: '.0000',
            totalLabel: '总渲染时长',
            totalVal: '22分0秒',
            averageLabel: '平均渲染时长',
            averageVal: '1分0秒'
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
            //   endDate: '',    // 渲染结束时间
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
            // endDate: '',    // 渲染结束时间
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
        },
        demo: ``,
        loading: null
      }
    },
    props: {
      showDrawer: {
        type: Boolean,
        required: true
      },
      // 展示table
      typeInfo: {
        type: String
      },
      taskData: {
        type: Object,
        default: function () {
          return {
            taskUuid: null
          }
        }
      }
      // attribution: String,
      // required: true
    },
    watch: {
      taskData: function (val) {
        if (val.rowId != null || this.typeInfo == 'upload-table') this.getData()
      },
      'setting.priority.selfVal': function (val) {
        // 选中【单选】时取消【首帧】【中间帧】【末帧】，反之复原
        if (val == 1) Object.assign(this.setting.priority, {
          topVal: 0,
          middleVal: 0,
          bottomVal: 0
        })
      }
    },
    methods: {
      // 上传分析 - 重新分析BTN
      async renderAgainBtnFun() {
        let data = await analyseAgain([this.taskData.taskUuid])
        if (data.data.code == 200) {
          messageFun('success', '操作成功');
          this.$emit('getListAgain');
          this.closeDrawer()
        }
      },
      // 进入 - 获取详情
      getData() {
        this.loading = this.$loading({
          lock: true,
          text: '拼命加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if (this.typeInfo == 'upload-table') {
          this.getUpTopItemMore()
        } else {
          this.getRenderItemMoreF()
        }
      },
      // 上传分析 -  获取详情
      async getUpTopItemMore() {
        Object.assign(this.details, {
          valId: this.taskData.id,
          valName: this.taskData.scenesName,
          valCreateTime: this.taskData.creationTime,
          valState: this.taskData.status
        })
        let data = await upTopTableSeeMore(`taskUuid=${this.taskData.taskUuid}`)
        this.loading.close()
        this.details.status = data.data.data.status
        this.getItemList()
        if (data.data.data.warningMessage) {
          this.details.warningList = data.data.data.warningMessage.map(curr => {
            return {
              title: curr,
              content: ''
            }
          })
        } else {
          this.details.warningList = []
        }
        if (data.data.data.errorMessage) {
          this.details.errorList = data.data.data.errorMessage.map(curr => {
            return {
              title: curr,
              content: ''
            }
          })
        } else {
          this.details.errorList = []
        }
      },
      // 渲染下载 - 获取详情 - 渲染结果
      getRenderItemMoreF() {
        this.loading.close()
        this.getRenderItemMoreTableF()
      },
      // 渲染下载 - 详情 mainTable more
      mainTableAddMoreItem() {
        this.getRenderItemMoreTableF()
      },
      // 渲染下载 - 详情 - 缩略图
      async showMiniImg(row, column, event) {
        try {
          this.result.statusData = row['status']
          let t = `frameTaskUuid=${row.frameTaskUuid}&layerTaskUuid=${row.layerTaskUuid}&size=240`,
            data = await getThumbnail(t)
          if(data.data.code == 1000) this.result.miniImgHref = null
          else if(data.data.code == 200){
            this.result.miniImgHref = data.data.data == ''
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
        let parameter = `taskUuid=${this.taskData.FatherTaskUuId}&layerTaskUuid=${this.taskData.taskUuid}&keyword=${this.result.searchInpVal}&pageIndex=1&pageSize=999`,
          data = await getRenderTSeeMore(parameter),
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
            endDate: createDateFun(new Date(curr.endTime)),       // 渲染结束时间
            percent: '-',                                         // CPU利用率
            RAM: '-',                                             // 内存峰值
            times: curr.downloadCount,                                           // 已下载次数
            layerTaskUuid: curr.layerTaskUuid,                    // 层uuid
            frameTaskUuid: curr.frameTaskUuid,                    // 帧uuid
            taskTaskUuid: curr.taskUuid,                          // 主uuid
            inFilePath: curr.inFilePath
          }
        })
        this.result.happen[0]['num'] = data_.frameCount['running']
        this.result.happen[1]['num'] = data_.frameCount['wait']
        this.result.happen[2]['num'] = data_.frameCount['pause']
        this.result.happen[3]['num'] = data_.frameCount['done']
        this.result.happen[4]['num'] = data_.frameCount['fail']
        Object.assign(this.result.dataO, {
          costVal: data_.taskInfo['cost'].toFixed(3),
          totalVal: consum(data_.taskInfo['useTime']),
          averageVal: data_.frameCount['done'] ? consum(data_.taskInfo['useTime'] / data_.frameCount['done']) : '-'
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
          modeVal: data_.taskInfo.core + '核' + '-' + data_.taskInfo.memory + 'G' + '（' + data_.taskInfo.patternName + '）', // 渲染模式
          founderVal: data_.taskInfo.account,                                          // 创建人
          creationTimeVal: createDateFun(new Date(data_.taskInfo.createTime))          // 创建时间
        })
        this.showMiniImg(this.result.tableData[0])
      },
      //关闭抽屉
      closeDrawer() {
        this.settingBack()
        Object.assign(this.setting.priority, {  // 优先渲染初始化
          topVal: '1',
          middleVal: '1',
          bottomVal: '1',
          selfVal: '0',
          customize: ''
        })
        this.setting.mode.mode = '2002'        // 渲染模式初始化
        Object.assign(this.setting.other, {     // 其它设置初始化
          remindVal: 12,
          stopVal: 24,
          view: ''
        })
        this.result.mainTableIndex = 0
        this.result.showDetails = false
        this.$emit('closeDrawer')
      },
      // 超时提醒改变
      changeSliderVal(e) {
        let n = Number(e.target.value)
        if (n >= 1 && 72 >= n) {
          this.setting.other.remindVal = n
        } else {
          this.setting.other.remindVal = 12
        }
      },
      // 超时停止改变
      changeStopVal(e) {
        let n = Number(e.target.value)
        if (n >= 1 && 72 >= n) {
          this.setting.other.stopVal = n
        } else {
          this.setting.other.stopVal = 24
        }
      },
      // 样式 勿改动
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 1) {
          return 'warning-row';
        } else if (rowIndex % 2 == 0) {
          return 'success-row';
        }
        return '';
      },
      // 帧范围修改
      rangeChange(e, index, val, row) {
        row['rangeEdit'] = false
        row['range'] = val
        if (!val) {
          this.rangeChangeErr('empty', index);
          return false
        }
        // if (!val.includes('-')) {
        //   this.rangeChangeErr('err', index);
        //   return false
        // }
        // let h = Number(val.split('-')[0]),
        //   f = Number(val.split('-')[1])
        // if (!/^[0-9]+$/.test(h) || !/^[0-9]+$/.test(f)) {
        //   this.rangeChangeErr('err', index);
        //   return false
        // }
        // if (h >= 999 || f > 999) {
        //   this.rangeChangeErr('max', index);
        //   return false
        // }
        // if (h >= f) {
        //   this.rangeChangeErr('err', index);
        //   return false
        // }

        row['rangeErr'] = false
        if (this.setting.num.tableData.every(curr => !curr.rangeErr)) this.setting.num.randerError = false
        // 检查当前行【间隔帧】
        this.numChange(null, index, row)
      },
      // 帧范围修改报错
      rangeChangeErr(type, index) {
        switch (type) {
          case 'empty':
            messageFun('error', '请输入,例:1-10')
            break
          case 'max':
            messageFun('error', '输入格式错误，帧范围为1-999')
            break
          case 'err':
            messageFun('error', '输入格式错误，请输入,例:1-10')
        }
        this.setting.num.tableData[index]['rangeErr'] = true
        this.setting.num.randerError = true
      },
      // 间隔帧数修改
      numChange(e, index, row) {
        // debugger
        row['numEdit'] = false
        if (e) row['num'] = e.target.value
        if (!row.num) row.num = 1
        if (!/^[0-9]+$/.test(row.num)) {
          this.numChangeErr(row, 'format');
          return false
        }
        if (!row.rangeErr) {
          let fa = row.range.split('-'),
            h = Number(fa[0]),
            f = Number(fa[1])
          if (f - h < Number(row.num)) {
            this.numChangeErr(row, 'range');
            return false
          }
        }
        row.numErr = false
        if (this.setting.num.tableData.every(curr => !curr.numErr)) this.setting.num.numError = false
      },
      // 帧间隔修改报错
      numChangeErr(row, type) {
        switch (type) {
          case 'format':
            messageFun('error', '输入格式错误，请输入数字')
            break
          case 'range':
            messageFun('error', '帧间隔要小于最小帧和最大帧之差，以确保至少存在两个有效帧')
        }
        row.numErr = true
        this.setting.num.numError = true
      },
      // 图像宽度修改
      wChange(e, index) {
        this.setting.num.tableData[index]['wEdit'] = false
        this.setting.num.tableData[index]['w'] = e.target.value
        if (this.zone == 2) this.rChange(index)
      },
      // 图像高度修改
      hChange(e, index) {
        this.setting.num.tableData[index]['hEdit'] = false
        this.setting.num.tableData[index]['h'] = e.target.value
        if (this.zone == 2) this.rChange(index)
      },
      // 图像宽高比变动
      rChange(index) {
        let t = this.setting.num.tableData[index]
        t['ratio'] = (t['w'] / t['h']).toFixed(3)
      },
      // 主table多选事件
      handleSelectionChange(val) {
        this.result.selectionResult = val
        let t = val.map(curr => curr.status)
        let s = this.result.operateBtnList[0],   // 开始
          p = this.result.operateBtnList[1],   // 暂停
          d = this.result.operateBtnList[2],   // 下载完成帧
          a = this.result.operateBtnList[3]    // 重新渲染

        if (t.length > 0 && t.every(item => ['暂停', '暂停（超时）', '暂停（欠费）'].includes(item))) {
          s['classState'] = false
        } else s['classState'] = true

        if (t.length > 0 && t.every(item => ['渲染成功', '渲染失败'].includes(item))) {
          a['classState'] = false
        } else a['classState'] = true

        if (t.length > 0 && t.every(item => ['渲染中', '等待中'].includes(item))) {
          p['classState'] = false
        } else p['classState'] = true

        if (t.length > 0) {
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
            endDate: createDateFun(new Date(item.endTime)),       // 渲染结束时间
            price: item.unitPrice,               // 单价
            percent: item.cpuRate,               // CPU利用率
            peak: item.memoryPeak,               // 内存峰值
            times: item.downloadCount,           // 下载次数
            layerTaskUuid: item.layerTaskUuid,
            frameTaskUuid: item.frameTaskUuid
          }
        })
        this.demo = data.data.data.log.reduce((total, curr) => {
          return total + `<p class="p">${curr}</p>`
        }, '')
      },
      // 设置参数 - 其他设置 - 新建项目
      createItem() {
        let newItemName = ''
        this.$prompt('', '新建项目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入项目名称'
        })
          .then(
            ({value}) => {
              if(!value) messageFun('info', '项目名为必填项')
              else {
                newItemName = value.value
                return addNewItem({
                  projectName: value.value,
                  isDefault: 1
                })
              }
            },
            () => {
              messageFun('info', '取消创建')
              return Promise.reject()
            }
          )
          .then(data => {
              if (data.data.code == '201') {
                messageFun('success', '创建项目成功')
                this.getItemList(newItemName)   // 刷新并选中新创建的项目
              } else if (data.data.code == '101') messageFun('error', '创建失败，项目名已存在')
            }
          )
          .catch(() => null)
      },
      // 设置参数 - table - 多选
      settingTableItemChange(val) {
        this.setting.num.selected = val
      },
      // 设置参数 - 开始渲染
      async startRenderFun() {
        let tt = this.setting
        if (this.zone == 1 && tt.priority.customizeInputError) {
          messageFun('error', '自定义帧错误')
          return false
          // }else if (this.zone == 1 && tt.num.randerError) {
          //   messageFun('error', '帧范围设定存在错误')
          //   return false
        } else if (this.zone == 1 && tt.num.numError) {
          messageFun('error', '帧间隔设定存在错误')
          return false
        }

        if(!tt.num.selected.length) {
          messageFun('info', '未选中层')
          return false
        }

        let layerSettingsList = tt.num.selected.map(curr => {
          // id: '1',
          // name: '默认层',
          // range: '1-24',
          // num: '1',
          // w: '231',
          // h: '231',
          // format: 'cin',
          // camera: '相机二',
          return {
            layerName: this.zone == 1 ? curr.name : '',           // 层名
            imageName: this.zone == 1 ? '' : curr.name,           // 图像名称
            // layerUuid: curr.id,                                // 层ID
            // frameStart: Number(curr.range.split('-')[0]),      // 帧范围起始帧
            // frameEnd: Number(curr.range.split('-')[1]),        // 帧范围结束帧
            frameRange: this.zone == 1 ? curr.range : '',         // 帧范围
            frameIterval: this.zone == 1 ? Number(curr.num) : '', // 间隔帧数
            camera: curr.camera,                                  // 相机
            width: curr.w,                                        // 图像宽度
            height: curr.h,                                       // 图像高度
            formatName: curr.format.split('-')[1],                // 输出格式Val
            // codeUuid: curr.format.split('-')[2],               // 输出格式Uuid
            ratio: this.zone == 1 ? 0 : curr.ratio                // 宽高比
          }
        })
        let v = {
          taskUuid: this.taskData.taskUuid,                       // 项目Uuid
          layer: Number(tt.num.singleChoiceVal),                  // 启动分层渲染
          frameCustomNo: tt.priority.customize.match(/\d/g) || [],// 自定义帧
          layerSettingsList,
          isGpu: this.isGup,                                       // 是否为gpu，分区信息对象可找到
          taskType: this.zone,                                     // 任务类型 1，影视版；2，效果图.
          taskSource: 1,                                           // 任务来源 ，网页端 1
          frameCustom: Number(tt.priority.selfVal),                // 是否开启自定义帧1是，0否
          colorChannel: this.zone == 1 ? 0 : 0,                 // 颜色通道。影视版固定值0
          aoChannel: this.zone == 1 ? 0 : 0,                    // AO通道。影视版固定值0
          renderPattern: tt.mode.modeList.find(curr => curr.val == tt.mode.mode).id,   // 选中的配置编号 渲染模式
          testRender: this.zone == 1 ? {                                            // 测试帧对象
            testRendering: tt.priority.topVal == '1' || tt.priority.middleVal == '1' || tt.priority.bottomVal == '1' ? '1' : '0',        // 是否开启测试帧（优先渲染）1是0否
            frameFirst: tt.priority.topVal,                        // 首帧 1是 0否
            frameMiddle: tt.priority.middleVal,                    // 中间帧
            frameFinally: tt.priority.bottomVal                    // 末帧
          } : null,
          otherSettings: {                                         // 其他设置
            projectName: tt.other.view.split('-/-')[1],            // 项目名称
            projectUuid: tt.other.view.split('-/-')[0],            // 项目uuid
            frameTimeoutWarn: tt.other.remindVal,                  // 超时警告
            frameTimeoutStop: tt.other.stopVal                     // 超时停止
          }
        }
        let data = this.isCopy ? await setCopySetData(v) : await startRender(v)
        if (data.data.code == 200) {
          this.closeDrawer()
          this.$emit('toRenderTable')
          this.$emit('getListAgain')
        }
      },
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
      // 渲染结果 - 主 - 操作 - 开始
      async operateStart() {
        if (this.result.operateBtnList[0]['classState']) return false
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
        } else {
          messageFun('error', '报错，操作失败')
        }
      },
      // 渲染结果 - 主 - 操作 - 下载完成帧
      async operateDownloadFrame() {
        if (this.result.operateBtnList[2]['classState']) return false
        if (!this.result.selectionResult.length) return false
        let data = await seeBalance()
        if (data.data.code == 1001) {
          messageFun('error', `当前账户余额为${data.data.data}，请先进行充值！`);
          return false
        }
        let fileList = this.result.selectionResult.map(item => item['taskUuid'] + '/' + item['layerName'] + '/' + item['outputFilePath'])
        this.$store.commit('WEBSOCKET_PLUGIN_SEND', {
          'transferType': 2,
          'userID': this.user.id,
          isRender: 1,
          fileList
        })

      },
      // 渲染结果 - 主 - 操作 - 重新渲染
      operateRenderAgain() {
        if (this.result.operateBtnList[3]['classState']) return false
        this.$confirm('此操作将重新渲染选中项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(
            async () => {
              let dataList = []
              this.result.selectionResult.forEach(curr => {
                if ('selfIndex' in curr) return false
                let dataListIndex = dataList.findIndex(item => item.taskUuid == curr.FatherTaskUuId)
                if (dataListIndex == -1) {
                  dataList.push(curr.frameTaskUuid)
                } else {
                  dataList[dataListIndex]['layerUuidList'].push(curr.taskUuid)
                }
              })
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
          .catch(() => messageFun('error', '报错，操作失败'))
      },
      // 渲染结果 - 详情 - 操作 - 返回
      moreOperateBack() {
        this.result.showDetails = false
      },
      // 渲染结果 - 详情 - 操作 - 下载日志
      async moreOperateDownload() {
        let data = await downloadLog(`layerTaskUuid=${this.result.detailsTableData[0]['layerTaskUuid']}&frameTaskUuid=${this.result.detailsTableData[0]['frameTaskUuid']}`)
        // exportDownloadFun(data, data.headers.file, 'text')  事件交接给C
      },
      // 分析结果 - 进入设置参数 - 获取预设信息
      async setParameter() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let data_ = await upTopTableSet(this.taskData.taskUuid)
        loading.close()
        let data = data_.data
        if (data.code != 200) {
          messageFun('error', '报错，数据请求失败')
          return false
        }
        this.setParameterNext(data)
      },
      // 翻到指定页 【分析结果-details】【设置参数-setting】【渲染结果-result】
      turnPage(path) {
        this.$emit('changeTypeInfo', path)
      },
      // 分析结果 - 进入设置参数 - 配置预设信息
      setParameterNext(data) {
        // 翻到【设置参数】
        this.turnPage('setting')
        // 【设置参数】-【渲染层数】- 启动分层渲染时的table
        // this.zone  1影视区 2效果图区
        this.setting.num.tableDataAll = data.data.layerSettingList.map(curr => {
          let formatList = [],
            cameraList = []
          if (curr.format) {
            formatList = curr.format.map(item => {
              return {
                label: item.name,
                val: item.value + '-' + item.name + '-' + item.codeUuid
              }
            })
          }
          if (curr.camera) {
            cameraList = curr.camera.map(item => {
              return {
                label: item,
                val: item
              }
            })
          }
          return {
            id: curr.layerUuid,
            name: this.zone == 1 ? curr.layerName : curr.imageName,
            // range: curr.frameStart + '-' + curr.frameEnd,
            range: this.zone == 1 ? curr.frameRange : null,
            num: this.zone == 1 ? '1' : null,
            w: curr.width,
            h: curr.height,
            format: formatList.length ? formatList[0]['val'] : null,
            camera: cameraList.length ? cameraList[0]['val'] : null,
            rangeEdit: this.zone == 1 ? false : null,    // 帧范围 - 状态切换 勿动
            rangeErr: this.zone == 1 ? false : null,     // 帧范围 - 报错切换 勿动
            numEdit: this.zone == 1 ? false : null,      // 间隔帧数 - 状态切换 勿动
            numErr: this.zone == 1 ? false : null,       // 间隔帧数 - 报错切换 勿动
            wEdit: false,                                // 图像宽度 - 状态切换 勿动
            hEdit: false,                                // 图像高度 - 状态切换 勿动
            formatList: formatList,
            cameraList: cameraList,
            ratio: this.zone == 1 ? null : curr.ratio,
          }
        })
        // 【设置参数】-【渲染层数】- 未启动分层渲染时的table
        this.setting.num.tableData = [this.setting.num.tableDataAll[0]]
        // 渲染层数默认选中索引1
        setTimeout(() => this.$refs.renderTable.toggleRowSelection(this.setting.num.tableData[0], true), 0)
      },
      // 设置参数 - 返回分析结果
      settingBack() {
        this.$emit('changeTypeInfo', 'upload-table')
      },
      // 设置参数 项目列表
      getItemList(name) {
        getConsumptionSelectList()
          .then(data => {
            this.setting.other.viewList = data.data.data.map(curr => {
              return {
                value: curr.taskProjectUuid + '-/-' + curr.projectName,
                label: curr.projectName,
                id: curr.taskProjectUuid
              }
            })
            if (!name) {
              this.setting.other.view = this.setting.other.viewList[0]['value']
            } else {
              let obj = this.setting.other.viewList.find(curr => {
                return curr.label == name
              })
              this.setting.other.view = obj['value']
            }

          })
      },
      // 设置参数 启动分层渲染按钮 改变
      h() {
        let s = this.setting.num
        this.$refs.renderTable.clearSelection()
        s.selected = []
        s.singleChoiceVal == 1 ? s.tableData = s.tableDataAll : s.tableData = [s.tableDataAll[0]]
      },
      // 验证 自定义帧格式
      verifFormat() {
        let val = this.setting.priority.customize
        if (!val) {
          this.setting.priority.customizeInputError = false;
          return false
        }

        let valList = val.replace(/，/g, ',').split(',').filter(curr => curr != '')          // 输入帧

        if (valList.length > 3) {
          this.errFun('最多优先测试3帧');
          return false
        }
        if (!valList.every(curr => /^[0-9]+$/.test(Number(curr)))) {
          this.errFun('输入格式不正确，请重新输入');
          return false
        }

        let range = this.setting.num.tableData[0].range,         // 帧范围
          rangeH = Number(range.split('-')[0]),                  // 首帧
          rangeF = Number(range.split('-')[1]),                  // 尾帧
          interval = Number(this.setting.num.tableData[0].num),  // 帧间隔
          result = renderingRange(rangeH, rangeF, interval),     // 遍历帧范围
          r = valList.every(curr => result.includes(Number(curr)))        // 【帧范围】是否完全包含【输入帧】

        if (!r) {
          this.errFun('优先帧超出帧范围，请重新输入');
          return false
        }
        if (r) this.setting.priority.customizeInputError = false
      },
      // 验证报错
      errFun(text) {
        messageFun('error', text)
        this.setting.priority.customizeInputError = true
      }
    },
    computed: {
      ...mapState(['zone', 'isGup'])
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

  .r {
    display: flex;

    .info {
      display: flex;
      flex-direction: column;
      width: 260px;
      height: calc(100% - 20px);
      margin-right: 20px;

      .thumbnail {
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
      width: 841px;
      height: calc(100% - 20px);

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
</style>
