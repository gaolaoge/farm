<template>
  <div class="newTask">
    <header class="header">
      <span class="title">
        {{ title }}
      </span>
      <img src="@/icons/shutDialogIcon.png"
           alt=""
           @click="closeDialogFun"
           class="closeBtn">
    </header>
    <section class="stepGroup">
      <!--面包屑-->
      <div class="navL">
        <ul :class="[{'professionC': taskType == 'profession'}]">
          <li class="li" :class="[{'active': index + 1 == stepBtnActive}]" v-for="(item,index) in navL" :key="index">
            <svg width="406.75" height="37" class="f svg" v-show="index == 0 && taskType == 'profession'">
              <path d="M 0 0 H 389.25 L 406.75 18.5 L 389.25 37 H 0 Z" fill="rgba(27, 83, 244, 1)"/>
            </svg>
            <svg width="277" height="37" class="f svg" v-show="index == 0 && taskType != 'profession'">
              <path d="M 0 0 H 259.5 L 277 18.5 L 259.5 37 H 0 Z" fill="rgba(27, 83, 244, 1)"/>
            </svg>
            <svg width="406.75" height="37" class="st svg" v-show="index != 0 && taskType == 'profession'">
              <path d="M 0 0 H 389.25 L 406.75 18.5 L 389.25 37 H 0 L 18.5 18.5 Z" fill="rgba(27, 83, 244, 1)"/>
            </svg>
            <svg width="277" height="37" class="st svg" v-show="index != 0 && taskType != 'profession'">
              <path d="M 0 0 H 259.5 L 277 18.5 L 259.5 37 H 0 L 18.5 18.5 Z" fill="rgba(27, 83, 244, 1)"/>
            </svg>
            <span class="i">{{ index + 1 }}</span>
            <span class="s">{{ item }}</span>
          </li>
        </ul>
      </div>
      <!--主体-->
      <div class="stepBody">
        <!--选择渲染文件-->
        <div class="stepBody-item selectFile"
             v-show="stepBtnActive == 1">
          <!--左侧导航-->
          <div class="sele">
            <ul>
              <li class="li" :class="[{'active': stepOneBase.index == index}]"
                  v-for="(item,index) in stepOneBase.btnList" :key="index" @click="changeFileSelection(index)">
                <img class="img" :src="item.imgUrl" alt="">
                <span class="span">{{ item.span }}</span>
              </li>
            </ul>
          </div>
          <div class="sec">
            <!--我的网盘-->
            <div class="netdist" v-show="stepOneBase.index == 0">
              <div class="farm-form">
                <!--工程路径-->
                <div class="farm-form-item">
                  <div class="farm-form-item-label">{{ stepOneBase.netdisc.pathLabel }}：</div>
                  <div class="farm-form-item-input p" @click="expandDiskDirectory">
                    <span class="sp">
                      {{ stepOneBase.netdisc.pathV }}
                    </span>
                    <img src="@/icons/more-btn.png"
                         class="im"
                         :class="[{'active': stepOneBase.showMe}]">
                  </div>
                  <div class="netCatalogue" :class="[{'active': stepOneBase.showMe}]">
                    <el-tree
                      :data="stepOneBase.netdisc.catalogData"
                      node-key="id"
                      :load="catalogDataGetChildNode"
                      lazy
                      :props="stepOneBase.netdisc.defaultProps">
                      <span class="custom-tree-node" slot-scope="{ node, data }">
                        <img src="@/icons/folder.png" alt="">
                        <span>{{ node.label }}</span>
                      </span>
                    </el-tree>
                  </div>
                </div>
                <!--场景文件-->
                <div class="farm-form-item">
                  <div class="farm-form-item-label">{{ stepOneBase.netdisc.fileLabel }}：</div>
                  <div class="farm-form-item-input b"
                       :class="[{'null': !stepOneBase.netdisc.treeData.length}]">
                    <!--面包屑-->
                    <div class="pathList">
                      <span class="base"
                            @click="jumpThroughNav(null, 'base')">{{ stepOneBase.netdisc.myAssets }}：</span>
                      <span class="filePathLi" v-for="(item,index) in stepOneBase.netdisc.sceneFilePath" :key="index">
                        <span class="s" @click="jumpThroughNav(item)">{{ item }}</span>
                        <img src="@/icons/enter.png" alt="" class="im">
                      </span>
                    </div>
                    <!--场景文件tree-->
                    <div class="tree" v-show="stepOneBase.netdisc.treeData.length">
                      <el-tree
                        :data="stepOneBase.netdisc.treeData"
                        node-key="id"
                        :props="stepOneBase.netdisc.defaultProps">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                          <!--文件-->
                          <el-checkbox v-model="stepOneBase.netdisc.sceneFileSelection" :label="data.id"
                                       v-show="data.type == 'file'">
                            <img src="@/icons/maya-icon.png" v-if="node.format == 'ma' || data.format == 'mb'">
                            <span>{{ node.label }}</span>
                          </el-checkbox>
                          <!--文件夹-->
                          <span v-show="data.type == 'folder'" @click="scenesTreeNodeClick(data.label)">
                            <img src="@/icons/folder-icon.png" alt="">
                            <span>{{ node.label }}{{ stepOneBase.netdisc.folderText }}</span>
                          </span>
                       </span>
                      </el-tree>
                    </div>
                    <!--请先选择工程路径-->
                    <div class="null" v-show="!stepOneBase.netdisc.treeData.length">
                      <img src="@/icons/warningIcon_.png" alt="">
                      <span class="span">{{ stepOneBase.netdisc.warnSpan }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--我的电脑-->
            <div class="local" v-show="stepOneBase.index == 1">
              <div class="operate">
                <div class="farm-primary-form-btn"
                     @click="operateBtnFun(item['text'])"
                     v-for="(item,index) in stepOneBase.local.operateBtnGroup"
                     :key="index">
                  <img :src="item.initialIcon" alt="" v-if="item.initialIcon" class="btnIcon default">
                  <img :src="item.selectedIcon" alt="" v-if="item.selectedIcon" class="btnIcon hover">
                  <span>{{ item['text'] }}</span>
                </div>
              </div>
              <!--场景文件table-->
              <div class="table">
                <el-table
                  :data="stepOneBase.local.filelist"
                  class="o"
                  @selection-change="handleSelectionChange"
                  style="width: 100%">

                  <el-table-column
                    type="selection"
                    align="center"
                    width="55"/>
                  <!--场景文件-->
                  <el-table-column
                    prop="sceneFile"
                    label="场景名"
                    show-overflow-tooltip
                    width="220"/>
                  <!--工程路径-->
                  <el-table-column
                    prop="address"
                    :render-header="renderHeader"
                    label="工程路径">
                    <template slot-scope="scope">
                      <div class="f"
                           @click="$store.commit('WEBSOCKET_PLUGIN_SEND', {
                          transferType: 4,              // 传输类型
                          sceneFile: scope.$index
                        })">
                        <span>{{ scope.row.address }}</span>
                        <img src="@/icons/more-btn.png">
                      </div>
                    </template>
                  </el-table-column>

                </el-table>
              </div>
            </div>
          </div>
        </div>
        <!--设置渲染模板-->
        <div class="stepBody-item"
             v-show="stepBtnActive == 2">
          <div class="set-renderTemplate">
            <!--添加模板-->
            <div class="set-renderTemplate-item addMore"
                 @click="addTemplate('addMore','')">
              <img src="@/icons/addIcon.png"
                   alt=""
                   class="addMoreIcon">
              <span class="addMoreText">
                {{ stepTwoBase.addMoreText }}
              </span>
            </div>
            <!--已存在模板-->
            <div class="set-renderTemplate-item ed"
                 :class="[{'active': stepTwoBase.renderListActive == index}]"
                 @click="stepTwoBase.renderListActive = index"
                 v-for="(item,index) in stepTwoBase.renderList"
                 :key="index">
              <div class="headerB">
                <span class="headerText" :title="item.renderTemplate.templateName">
                  {{ item.renderTemplate.templateName }}
                </span>
                <span class="opacityBtnGroup">
                  <span v-show="stepTwoBase.renderListActive == index">
                    <!--编辑-->
                    <img src="@/icons/set-renderTemplate-item-edit.png"
                         alt=""
                         @click.stop="addTemplate('editOne',index)"
                         class="item-icon">
                    <!--删除-->
                    <img src="@/icons/set-renderTemplate-item-delete.png"
                         alt=""
                         @click="deleteTemplate(index)"
                         class="item-icon">
                  </span>
                  <span v-show="stepTwoBase.renderListActive != index">
                    <!--编辑-->
                    <img src="@/icons/set-renderTemplate-item-edit-b.png"
                         alt=""
                         @click.stop="addTemplate('editOne',index)"
                         class="item-icon">
                    <!--删除-->
                    <img src="@/icons/set-renderTemplate-item-delete-b.png"
                         alt=""
                         @click="deleteTemplate(index)"
                         class="item-icon">
                  </span>
                </span>
              </div>
              <div class="bodyB">
                <span class="software">
                  {{ item.renderTemplate.softName }}
                </span>
                <span class="plugin">
                  {{ item.renderTemplate.softVer }}
                </span>
                <img src="@/icons/item-selected.png" alt="" class="item-selected">
              </div>
            </div>
          </div>
        </div>
        <!--设置渲染参数-->
        <div class="stepBody-item">
          <div class="farm-drawer-body">
            <!--优先渲染-->
            <div class="farm-drawer-body-item" v-if="zone == '1'">
              <!--标题-->
              <div class="farm-drawer-body-item-header">
                <span class="farm-drawer-body-item-header-main">{{ stepThreeBase.priority.title }}</span>
              </div>
              <!--开关-->
              <div class="farm-drawer-body-item-d addPadding">
                <div class="item-label">
                  {{ stepThreeBase.priority.label }}：
                </div>
                <!--首帧-->
                <div class="item-switch">
                  <el-switch
                    v-model="stepThreeBase.priority.topVal"
                    @change="val => {if(val == 1) stepThreeBase.priority.selfVal = 0}"
                    inactive-color="RGBA(200, 202, 203, 1)"
                    active-color="rgba(10, 98, 241, 1)"
                    active-value='1'
                    inactive-value='0'/>
                  <span class="item-switch-label" :class="[{'active': stepThreeBase.priority.topVal}]">
                {{ stepThreeBase.priority.topLabel }}
              </span>
                </div>
                <!--中间帧-->
                <div class="item-switch">
                  <el-switch
                    v-model="stepThreeBase.priority.middleVal"
                    @change="val => {if(val == 1) stepThreeBase.priority.selfVal = 0}"
                    inactive-color="RGBA(200, 202, 203, 1)"
                    active-color="rgba(10, 98, 241, 1)"
                    active-value='1'
                    inactive-value='0'/>
                  <span class="item-switch-label" :class="[{'active': stepThreeBase.priority.middleVal}]">
                {{ stepThreeBase.priority.middleLabel }}
              </span>
                </div>
                <!--末帧-->
                <div class="item-switch">
                  <el-switch
                    v-model="stepThreeBase.priority.bottomVal"
                    @change="val => {if(val == 1) stepThreeBase.priority.selfVal = 0}"
                    inactive-color="RGBA(200, 202, 203, 1)"
                    active-color="rgba(10, 98, 241, 1)"
                    active-value='1'
                    inactive-value='0'/>
                  <span class="item-switch-label" :class="[{'active': stepThreeBase.priority.bottomVal}]">
                {{ stepThreeBase.priority.bottomLabel }}
              </span>
                </div>
              </div>
              <!--提示-->
              <span class="info">
                <img src="@/icons/warningIcon.png" alt="">
                {{ stepThreeBase.priority.info }}
              </span>
            </div>
            <!--渲染模式-->
            <div class="farm-drawer-body-item ">
              <!--标题-->
              <div class="farm-drawer-body-item-header">
                <span class="farm-drawer-body-item-header-main">{{ stepThreeBase.mode.title }}</span>
                <span class="farm-drawer-body-item-header-assist">
                  {{ stepThreeBase.mode.miniTitO }}
                  <span class="rule">{{ stepThreeBase.mode.rule }}</span>
                  {{ stepThreeBase.mode.miniTitT }}
                </span>
              </div>
              <div class="farm-drawer-body-item-d">
                <el-radio-group v-model="stepThreeBase.mode.mode">
                  <el-radio :label="item.val"
                            v-for="(item,index) in stepThreeBase.mode.modeList"
                            :key="index">
                    <span>{{ item.label }}</span>
                    <span class="supplement">{{ item.supplement }}</span>
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
            <!--其他设置-->
            <div class="farm-drawer-body-item set">
              <!--标题-->
              <div class="farm-drawer-body-item-header">
                <span class="farm-drawer-body-item-header-main">{{ stepThreeBase.other.title }}</span>
              </div>
              <div class="farm-drawer-body">
                <!--所属项目-->
                <div class="farm-drawer-item">
                  <span class="farm-drawer-item-label star">{{ stepThreeBase.other.viewLabel }}</span>
                  <el-select v-model="stepThreeBase.other.view"
                             placeholder="选择已有项目名称"
                             class="workBench-optionBase haveBorder">
                    <el-option
                      v-for="(item,index) in stepThreeBase.other.viewList"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <!--新建项目-->
                  <span class="createBtn" @click="createItem">
                    <img src="@/icons/createIcon.png" class="createIcon">
                    {{ stepThreeBase.other.btn }}
                  </span>
                </div>
                <!--分层渲染-->
                <div class="farm-drawer-item" v-if="zone == '1'">
                  <span class="farm-drawer-item-label">{{ stepThreeBase.other.stratifyLabel }}</span>
                  <el-switch
                    v-model="stepThreeBase.other.stratifyVal"
                    inactive-color="RGBA(200, 202, 203, 1)"
                    active-color="rgba(10, 98, 241, 1)"
                    active-value="1"
                    inactive-value="0"/>
                </div>
                <!--分相机-->
                <div class="farm-drawer-item" v-if="zone == '2'">
                  <span class="farm-drawer-item-label">{{ stepThreeBase.other.bCLabel }}</span>
                  <el-switch
                    v-model="stepThreeBase.other.bCVal"
                    inactive-color="RGBA(200, 202, 203, 1)"
                    active-color="rgba(10, 98, 241, 1)"
                    active-value="1"
                    inactive-value="0"/>
                </div>
                <!--颜色通道图-->
                <!--                <div class="farm-drawer-item" v-if="zone == '2'">-->
                <!--                  <span class="farm-drawer-item-label">{{ stepThreeBase.other.cCLabel }}</span>-->
                <!--                  <el-switch-->
                <!--                    v-model="stepThreeBase.other.cCVal"-->
                <!--                    inactive-color="RGBA(200, 202, 203, 1)"-->
                <!--                    active-color="rgba(10, 98, 241, 1)"-->
                <!--                    active-value="1"-->
                <!--                    inactive-value="0"/>-->
                <!--                </div>-->
                <!--超时提醒-->
                <div class="farm-drawer-item">
                  <span class="farm-drawer-item-label">
                    {{ stepThreeBase.other.remindLabel }}
                    <el-tooltip class="item"
                                popper-class="t mini"
                                effect="dark"
                                content="单帧渲染时长超过设定，系统发送提醒消息给联系人，具体通知方式可在“消息设置”中完成"
                                placement="right">
                      <img src="@/icons/question-mark-icon.png" alt="" class="mark">
                    </el-tooltip>
                  </span>
                  <el-slider v-model="stepThreeBase.other.remindVal"
                             class="slider"
                             :min="1"
                             :max="72"/>
                  <input type="text"
                         class="sliderVal"
                         @blur="changeSliderVal"
                         v-model="stepThreeBase.other.remindVal">
                  <span class="unit">{{ stepThreeBase.other.unit }}</span>
                </div>
                <!--超时提醒-->
                <div class="farm-drawer-item">
                  <span class="farm-drawer-item-label">
                    {{ stepThreeBase.other.stopLabel }}
                    <el-tooltip class="item"
                                popper-class="t mini"
                                effect="dark"
                                content="单帧渲染时长超过设定，系统停止当前帧的渲染并发送消息给联系人"
                                placement="right">
                    <img src="@/icons/question-mark-icon.png" alt="" class="mark">
                  </el-tooltip>
                  </span>
                  <el-slider v-model="stepThreeBase.other.stopVal"
                             class="slider"
                             :min="1"
                             :max="72"/>
                  <input type="text"
                         class="sliderVal"
                         @blur="changeStopVal"
                         v-model="stepThreeBase.other.stopVal">
                  <span class="unit">{{ stepThreeBase.other.unit }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="checked">
      <span class="base">
        {{ checkedSpan[0] }}
        <span class="num">{{ stepOneBase.index == 0 ? stepOneBase.netdisc.sceneFileSelection.length : stepOneBase.local.filelist.length }}</span>
        {{ checkedSpan[1] }}
      </span>
    </div>
    <!--前进或后退按钮-->
    <div class="btnGroup">
      <!--选择渲染文件-->
      <div v-show="stepBtnActive == 1">
        <!--下一步-->
        <div class="btnGroup-btn confirm"
             :class="[
               {'cannotTrigger': stepOneBase.index == 1 ? stepOneBase.local.filelist.length == 0 : stepOneBase.netdisc.sceneFileSelection.length == 0}
              ]"
             @click="goToMode('next')">
          <span class="nextStep">{{ btn.next }}</span>
        </div>
      </div>
      <!--设置渲染模板-->
      <div v-show="stepBtnActive == 2">
        <!--上一步-->
        <div class="btnGroup-btn previous" @click="stepBtnActive = 1">
          <span>{{ btn.previous }}</span>
        </div>
        <!--下一步-->
        <div class="btnGroup-btn confirm" @click="stepBtnActive = 3" v-show="taskType != 'profession'">
          <span>{{ btn.next }}</span>
        </div>
        <!--确定-->
        <div class="btnGroup-btn confirm" @click.once="confirmFun" v-show="taskType == 'profession'">
          <span>{{ btn.confirm }}</span>
        </div>
      </div>
      <!--设置渲染参数-->
      <div v-show="stepBtnActive == 3">
        <!--上一步-->
        <div class="btnGroup-btn previous" @click="goToMode('previous')">
          <span>{{ btn.previous }}</span>
        </div>
        <!--确定-->
        <div class="btnGroup-btn confirm" @click.once="confirmFun">
          <span>{{ btn.confirm }}</span>
        </div>
      </div>

    </div>
    <!--添加模板-->
    <el-dialog
      width="641px"
      :show-close=false
      :visible.sync="innerVisible"
      @close="closeAddTemplateDialog"
      append-to-body>
      <div class="wrapper">
        <header class="header">
          <span class="title">
            {{ dialogAdd.title }}
          </span>
          <img src="@/icons/shutDialogIcon.png"
               alt=""
               @click="innerVisible = false"
               class="closeBtn">
        </header>
        <div class="farm-form">
          <!--模板名称-->
          <div class="farm-form-item">
            <label for="templateName" class="farm-form-item-label">
              {{ dialogAdd.form.labelName }}：
            </label>
            <input type="text"
                   id="templateName"
                   class="farm-form-item-input"
                   :class="[{'inputError': dialogAdd.form.formatName == false}]"
                   :placeholder="dialogAdd.namePlaceholder"
                   @blur="nameVerif"
                   @focus="dialogAdd.form.formatName = null"
                   v-model="dialogAdd.form.valName">
          </div>
          <!--渲染软件-->
          <div class="farm-form-item">
            <label class="farm-form-item-label">
              {{ dialogAdd.form.labelSoftware }}：
            </label>
            <el-cascader
              v-model="dialogAdd.form.valSoftware"
              :options="dialogAdd.softwareList"
              @change="changeSoftware"/>

          </div>
          <!--渲染插件-->
          <div class="farm-form-item">
            <label class="farm-form-item-label">
              {{ dialogAdd.form.labelPlugin }}：
            </label>
            <el-select v-model="dialogAdd.form.valPlugin"
                       class="i"
                       @change="changePlugin">
              <el-option
                v-for="(item,index) in dialogAdd.pluginList"
                :key="index"
                :label="item.label"
                :value="item.val">
              </el-option>
            </el-select>
          </div>
          <!--选择插件-->
          <div class="transferBase">
            <!--选择插件版本-->
            <div class="o">
              <div class="label">
                {{ dialogAdd.o }}
              </div>
              <div class="list">
                <div v-for="(item,index) in dialogAdd.oList"
                     :key="index"
                     @click="changeOIndex(index,item)"
                     class="li"
                     :class="[{'active': item.status == true}]">
                  <span class="name">
                    {{ item.pluginName }} - {{ item.version }}
                  </span>
                  <span class="choiceIcon">
                    <img src="@/icons/choiceIcon.png"
                         alt=""
                         v-show="item.status == true"
                         class="icon">
                  </span>
                </div>
              </div>
            </div>
            <div class="ig"/>
            <!--已选插件版本-->
            <div class="n">
              <div class="label">
                {{ dialogAdd.n }}
              </div>
              <div class="list">
                {{ dialogAdd.nList }}
                <div v-for="(item,index) in dialogAdd.nList"
                     :key="index"
                     class="li">
                  <span class="name">
                    {{ item.pluginName }} - {{ item.version }}
                  </span>
                  <span class="deleteNIcon" @click='deleteSeletedOption(item,index)'>
                    <img src="@/icons/deleteLiIcon.png"
                         alt=""
                         class="icon">
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!--按钮-->
          <div class="btnGroup">
            <div class="btnGroup-btn save" @click="taskDefine" :class="[{'disable-self': !disableSelf}]">
              <span>
                {{ dialogAdd.save }}
              </span>
            </div>
            <div class="btnGroup-btn cancel" @click="innerVisible = false">
              <span>
                {{ dialogAdd.cancel }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--操作指南-->
    <operation-guide v-show="infoMessageShow" @shutMe="infoMessageShow = false" v-operating/>
  </div>
</template>

<script>
  import {
    createTaskSet,
    createTaskSetSoftware,
    createTaskSetPlugin,
    createTaskSetDeletePlugin,
    createTaskSetNewPlugin,
    createTaskSetEditPlugin,
    addNewItem,
    getConsumptionSelectList,
    pushTask,
    upTopCJ,
    upTopGC,
    oneMorePath
  } from '@/api/api'
  import {
    getFileType,
    savePath,
    newTaskProfession
  } from '@/api/newTask-api'
  import {
    mapState
  } from 'vuex'
  import {
    messageFun,
    IEVersion
  } from '@/assets/common.js'
  import operationGuide from '@/components/home/operation-guide'

  export default {
    name: 'new-task',
    data() {
      return {
        title: '新建任务',
        navL: [
          '选择渲染文件',
          '设置渲染模板',
          '设置渲染参数'
        ],
        stepBtnActive: 1,           // 当前所在步骤 1.选择渲染文件 2.设置渲染模板 3.设置渲染参数
        btn: {
          next: '下一步',
          previous: '上一步',
          confirm: '确认'
        },    // 按钮集合
        checkedSpan: ['已选择', '个场景文件'],
        stepOneBase: {              // 选择渲染文件
          showMe: false,            // 我的资产 - 工程路径 - 展开网盘目录
          index: 0,                 // 0.我的资产 1.我的电脑
          btnList: [
            {
              span: '我的资产',
              imgUrl: require('@/icons/fileIcon.png')
            },
            {
              span: '我的电脑',
              imgUrl: require('@/icons/computerIcon.png')
            }
          ],
          netdisc: {     // 我的资产
            firstOpenCatalogTree: true,
            myAssets: '资产',
            pathLabel: '工程路径',
            pathV: '选择工程路径',
            fileLabel: '场景文件',
            folderText: '文件夹',
            warnSpan: '请先选择工程路径',
            defaultProps: {
              children: 'children',
              label: 'label'
            },
            sceneFilePath: [],      // 场景文件 - 面包屑
            sceneFileSelection: [], // 场景文件 - 选中项
            treeData: [],           // 场景文件 - 树状图
            catalogData: [],        // 工程路径 - 树状图
            cDataGetChildNodeCB: null,   // 工程路径获取子节点回调
          },
          local: {   // 我的电脑
            operateBtnGroup: [
              {
                text: '添加',
                initialIcon: require('@/icons/addIcon-Blue.png'),
                selectedIcon: require('@/icons/addIcon-Whit.png')
              },
              {
                text: '删除',
                initialIcon: require('@/icons/deleteIcon-blue.png'),
                selectedIcon: require('@/icons/deleteIcon-white.png')
              },
            ],
            filelist: [
              // {
              //   sceneFile: '',      // 场景名
              //   address: '',        // 工程路径
              //   absolutePath: '',   // 绝对路径
              //   id: ''
              // }，
            ],      // 渲染文件
            selectionR: [],       // 多选渲染文件值
          },
        },
        stepTwoBase: {
          addMoreText: '添加模板',
          renderList: [
            // 设置渲染模板 - 已存在模板列表
            //   {
            //     renderTemplate: {                       //模板
            //       id: 16
            //       createTime: 1586308643471
            //       createBy: "user42cd-82bb-44e7-9bc4-d6d046b5dff2"
            //       updateTime: 1586397047167
            //       updateBy: "user42cd-82bb-44e7-9bc4-d6d046b5dff2"
            //       templateUuid: "84168a1b-b32e-490c-854b-1590f756c28b"
            //       dataStatus: 1
            //       updateParamAfterAnalyse: null
            //       templateName: "用户4测试模板3"          //模板名称
            //       isDefault: 0                          //默认选中 0为非
            //       softName: "3dmax"                     //软件名
            //       softVer: "2021"                       //版本
            //       softNameVer: "3dmax2021"              //
            //       softUuid: "127"                       //软件编号
            //       customerUuid: "user42cd-82bb-44e7-9bc4-d6d046b5dff2"
            //     },
            //     xxlPlugins: [           模板插件
            //       {
            //         id: 1
            //         pluginName: "V-ray"              //插件名
            //         version: "1.233"                 //插件版本
            //         publisher: "2K"                  //插件发行商
            //         pluginUuid: "456"                //编号 唯一标识
            //         createTime: "2020-03-31"
            //         createBy: "1"
            //         updateTime: "2020-03-31"
            //         updateBy: "1"
            //         dataStatus: 1
            //       }
            //     ]
            //   }
          ],
          renderListActive: 0     //选中索引
        },
        stepThreeBase: {
          t: '设置参数',
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
            info: '测试帧渲染完成后，任务处于“待全部渲染”状态，请点击【全部渲染】',
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
                label: '16核32G',
                supplement: '【标准模式1】',
                id: '224'
              },
              {
                val: '32核64G【标准模式2】',
                label: '32核64G',
                supplement: '【标准模式2】',
                id: null
              }
              // {
              //   val: '32核128G【标准模式3】',
              //   label: '32核128G【标准模式3】'
              // }
            ]
          },
          // 其它设置
          other: {
            cCLabel: '颜色通道图',
            bCLabel: '分相机',
            cCVal: '1',
            bCVal: '1',
            title: '其他设置',
            btn: '新建项目',
            viewLabel: '所属项目',
            viewList: [
              // {
              //   value: '选项1',
              //   label: '黄金糕'
              // }
            ],
            view: null,
            unit: '(h)',
            remindLabel: '单帧超时提醒',
            remindVal: 12,
            stopLabel: '单帧超时停止',
            stopVal: 24,
            stratifyLabel: '分层渲染',
            stratifyVal: "1"
          },
          btn: {
            returnBtn: '返回',
            startBtn: '开始渲染'
          }
        },
        innerVisible: false,        //添加模板
        // 添加模板窗口
        dialogAdd: {
          title: '添加模板',
          namePlaceholder: '输入模版名称',
          form: {
            labelName: '模板名称',
            valName: '',
            formatName: null,
            labelSoftware: '渲染软件',
            valSoftware: '',
            labelPlugin: '渲染插件',
            valPlugin: ''
          },
          // 渲染软件
          softwareList: [
            // {
            //   softName: 'Maya 2020',
            //   softList: []
            // }
          ],
          // 渲染插件下拉框
          pluginList: [
            // {
            //   label: 'mloa',
            //   val: 'mloa'
            // }
          ],
          o: '选择插件版本',
          n: '已选插件版本',
          // 插件版本
          oList: [
            // {
            //    id: 2
            //    pluginName: "Arnold"
            //    version: "2.233"
            //    publisher: "4K"
            //    pluginUuid: "457"
            //    createTime: "2020-03-31"
            //    createBy: "1"
            //    updateTime: "2020-03-31"
            //    updateBy: "1"
            //    dataStatus: 1
            //    status: false
            // }
          ],
          // 已选结果
          nList: [
            // {
            //   pluginUuid: '10011',
            //   pluginName: 'mloa',
            //   version: 'mloa 4.0.2',
            //   status: false
            // }
          ],
          cancel: '取消',
          save: '保存',
          // 【确定】标记编辑or新建
          editOrAdd: '',
          index: null      //编辑已存在模板时模板的索引
        },
        infoMessageShow: false,     // 选择渲染文件 - 我的电脑 - 工程路径 - 问号
        renderFileTypeList: [],     // 可用的场景文件格式
      }
    },
    props: {},
    components: {operationGuide},
    computed: {
      ...mapState(['zone', 'zoneId', 'user', 'socket_backS', 'socket_backS_msg', 'socket_plugin', 'socket_plugin_msg', 'taskType']),
      // 验证表格是否填写完整
      disableSelf() {
        let a = this.dialogAdd
        if (a.form.valName && a.nList.length && a.form.formatName) return true
        else return false
      }
    },
    watch: {
      'socket_backS_msg': {
        handler: function (e) {
          let data = JSON.parse(e.data)
          if (data.code != 208) return false
          if (data.msg == '6022') {
            // 场景文件列表
            this.stepOneBase.netdisc.treeData = data.data.map((item, index) => {
              let type = item.charAt(item.length - 1) == '/' ? 'folder' : 'file'
              return {
                id: index,
                label: type == 'file' ? item : item.slice(0, item.length - 1),
                // label: '',
                // icon: 'el-icon-success',
                size: item.size ? item.size : null,
                updateTime: item.updateTime ? item.updateTime : null,
                format: type == 'file' ? item.split('.')[1] : null,
                type
              }
            })
          } else if (data.msg == '6021') {
            // scenePath 场景文件导航Path / resourcePath 工程路径Path
            let path_ = data.data.scenePath.split('/')
            path_.pop()   // 删除最后一位空元素
            this.stepOneBase.netdisc.sceneFilePath = path_
            this.stepOneBase.netdisc.pathV = data.data.resourcePath
          } else if (data.msg == '612') {
            // 工程路径的tree
            let list = data.data.map((item, index) => {
              let list = item.split('/')
              return {
                id: index,
                label: list[list.length - 2],
                position: item,
                size: item.size ? item.size : null,
                updateTime: item.updateTime ? item.updateTime : null,
              }
            })
            if (this.cDataGetChildNodeCB) {
              this.cDataGetChildNodeCB(list)
              this.cDataGetChildNodeCB = null
            } else this.stepOneBase.netdisc.catalogData = list
          }
        },
        immediate: true
      },
      'socket_plugin_msg': {
        handler: function (e) {
          if (!e) return false
          let data = JSON.parse(e.data)
          if (data.code == 102) data.fileList.forEach(curr => this.pluginFilterFile(curr))  // 场景文件
          else if (data.code == 103) this.pluginEditProjectPath(data)  // 工程路径
          else if (data.code == 104 && data.result == 0) this.createSuc()
        },
        immediate: true
      }
    },
    methods: {
      // 1.选择渲染文件 - 我的资产 - 工程文件 - 树状图 - 进入文件夹
      catalogDataGetChildNode(node, resolve) {
        this.stepOneBase.netdisc.pathV = node.data.position
        this.projectJump(node.data.position)
        this.cDataGetChildNodeCB = resolve
      },
      // 1.选择渲染文件 - 我的资产 - 场景文件 - 树状图 - 选择文件
      scenesTreeNodeCheck(data, bool) {
        let list = this.stepOneBase.netdisc.sceneFileSelection
        if (bool) list.push(data.id)
        else {
          let index = list.findIndex(item => item == data.id)
          list.splice(index, 1)
        }
      },
      // 1.选择渲染文件 - 我的资产 - 场景文件 - 树状图 - 进入文件夹
      scenesTreeNodeClick(label) {
        let path = '',
          list = this.stepOneBase.netdisc.sceneFilePath
        for (let i = 0; i < list.length; i++) {
          if (list[i]) path = path + list[i] + '/'
        }
        path += label
        path += '/'
        this.scenesJump(path)
        this.stepOneBase.netdisc.sceneFilePath = path.split('/')
      },
      // 1.选择渲染文件 - 我的资产 跳转【场景文件】目录
      jumpThroughNav(nav, base) {
        if (base) {
          this.scenesJump('/')
          this.stepOneBase.netdisc.sceneFilePath = []
          return false
        }
        let path = '',
          list = this.stepOneBase.netdisc.sceneFilePath
        for (let i = 0; i < list.length; i++) {
          path = path + list[i] + '/'
          if (list[i] == nav) break
        }
        this.scenesJump(path)
        this.stepOneBase.netdisc.sceneFilePath = path.split('/')
      },
      // 1.选择渲染文件 - 我的资产 【场景文件】跳转目录 - 执行
      scenesJump(path) {
        this.stepOneBase.netdisc.sceneFileSelection = []
        this.stepOneBase.netdisc.treeData = []
        this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': 602,
          'customerUuid': this.user.id,
          path
        })  // 向后台获取网盘目录 工程路径
      },
      // 1.选择渲染文件 - 我的资产 【工程路径】跳转目录 - 执行
      projectJump(path) {
        this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': 612,
          'customerUuid': this.user.id,
          path
        })  // 向后台获取网盘目录 工程路径
      },
      // 1.选择渲染文件 - 我的电脑 插件 修改场景文件对应的【工程路径】
      pluginEditProjectPath(data) {
        this.stepOneBase.local.filelist[data.sceneFile].address = data.path
      },
      // 1.选择渲染文件 - 我的电脑 插件 操作接收的【场景文件列表】
      pluginFilterFile(file) {
        let index = file.lastIndexOf('/') + 1
        this.stepOneBase.local.filelist.push({
          address: file.substr(0, index),      // 场景名
          sceneFile: file.substr(index),            // 工程路径
          absolutePath: file,                       // 绝对路径
          id: Math.floor(Math.random() * Math.pow(10, 16))
        })
      },
      // 0.获取可用场景文件格式
      async getRenderFileType() {
        let data = await getFileType(),
          t = []
        data.data.data.split(',').forEach(item => {
          t = t.concat(item.match(/\w+/g))
        })
        this.renderFileTypeList = t
      },
      // 1.选择渲染文件 - 切换选择场景文件方式
      changeFileSelection(index) {
        this.stepOneBase.index = index
      },
      // 1.选择渲染文件 - 我的电脑 = 工程路径 问号提示
      renderHeader(h, {column}) {
        return h('span', {}, [
          h('span', {}, column.label),
          h('img', {
            attrs: {
              class: 'ix',
              src: require('@/icons/problemIcon.png'),
              style: 'vertical-align: text-bottom;margin-left: 8px;cursor: pointer;',
            },
            on: {click: () => this.infoMessageShow = true}
          })
        ])
      },
      // 2.设置渲染模板 - 添加模板 - 检验模板名格式
      nameVerif() {
        if (!this.dialogAdd.form.valName) {
          this.dialogAdd.form.formatName = null
          return false
        } else if (this.dialogAdd.form.valName.length > 50) {
          messageFun('error', '最多输入50个字符')
          this.dialogAdd.form.formatName = false
          return false
        } else this.dialogAdd.form.formatName = true
      },
      // 4.关闭窗口
      closeDialogFun() {
        this.$emit('closeDialogFun', '')
        this.dataReset()
      },
      // 2.设置渲染模板 - 选择插件版本
      changeOIndex(index) {
        //插件版本左侧窗口切换选中状态
        this.dialogAdd.oList.forEach((curr, ind) => {
          // curr = {
          //   id: 2
          //   pluginName: "Arnold"
          //   version: "2.233"
          //   publisher: "4K"
          //   pluginUuid: "457"
          //   createTime: "2020-03-31"
          //   createBy: "1"
          //   updateTime: "2020-03-31"
          //   updateBy: "1"
          //   dataStatus: 1
          //   status: true
          // }
          // 当前选中项
          if (index == ind) {
            //当前插件是否有其它版本已被选中
            // 当前插件curr.pluginName
            // 当前版本curr.version
            let r = this.dialogAdd.nList.findIndex(c => {
              return c.pluginName == curr.pluginName
            })
            if (r != -1) {
              this.dialogAdd.nList.splice(r, 1)
            }
            // 若还未选中
            if (!curr.status) {
              // 判断此项是否已在选中项中
              let d = this.dialogAdd.nList.findIndex(c => {
                return c.pluginUuid == curr.pluginUuid
              })
              if (d == -1) {
                this.dialogAdd.nList.push(curr)
              }
              curr.status = true
            } else {
              curr.status = false
            }
          } else {
            // 其它项
            curr.status = false
          }
        })
      },
      // 2.设置渲染模板 - 删除已选择插件结果
      deleteSeletedOption(item, index) {
        this.dialogAdd.oList.findIndex(curr => {
          if (item.pluginUuid == curr.pluginUuid)
            curr.status = false
          return item.pluginUuid == curr.pluginUuid
        })
        this.dialogAdd.nList.splice(index, 1)
      },
      // 2.设置渲染模板 - 获取渲染模板列表
      async getList() {
        let data = await createTaskSet()
        this.stepTwoBase.renderList = data.data.data
        this.stepTwoBase.renderListActive = data.data.data.findIndex(curr => curr.renderTemplate.isDefault == 1)
        // [
        //   {
        //     renderTemplate: {                       //模板
        //       id: 16
        //       createTime: 1586308643471
        //       createBy: "user42cd-82bb-44e7-9bc4-d6d046b5dff2"
        //       updateTime: 1586397047167
        //       updateBy: "user42cd-82bb-44e7-9bc4-d6d046b5dff2"
        //       templateUuid: "84168a1b-b32e-490c-854b-1590f756c28b"
        //       dataStatus: 1
        //       updateParamAfterAnalyse: null
        //       templateName: "用户4测试模板3"          //模板名称
        //       isDefault: 0                          //默认选中 0为非
        //       softName: "3dmax"                     //软件名
        //       softVer: "2021"                       //版本
        //       softNameVer: "3dmax2021"              //
        //       softUuid: "127"                       //软件编号
        //       customerUuid: "user42cd-82bb-44e7-9bc4-d6d046b5dff2"
        //     },
        //     xxlPlugins: [           模板插件
        //       {
        //         id: 1
        //         pluginName: "V-ray"              //插件名
        //         version: "1.233"                 //插件版本
        //         publisher: "2K"                  //插件发行商
        //         pluginUuid: "456"                //编号 唯一标识
        //         createTime: "2020-03-31"
        //         createBy: "1"
        //         updateTime: "2020-03-31"
        //         updateBy: "1"
        //         dataStatus: 1
        //       }
        //     ]
        //   }
        // ]
      },
      // 2.设置渲染模板 - 打开【新建模板】
      async addTemplate(s, index) {
        // 获取软件列表
        let data = await createTaskSetSoftware()
        this.dialogAdd.softwareList = data.data.data.map(curr => {   //options
          return {
            value: curr.softName,      //软件名
            label: curr.softName,
            children: curr.softList.map(curr_ => {
              return {
                label: curr_.softName + '-' + curr_.version,
                value: curr_.softUuid
              }
            })
            // children: [
            //   {
            //     value: 'shejiyuanze',
            //     label: '设计原则',
            //     children: [
            //       {
            //         value: 'yizhi',
            //         label: '一致'
            //       }
            //     ]
            //   }
            // ]       //软件版本
          }
        })
        // 打开弹窗
        this.innerVisible = true
        this.dialogAdd.editOrAdd = s
        if (s == 'addOne') null // 新建模板
        else if (s == 'editOne') {
          // 编辑模板
          this.dialogAdd.index = index
          let t = this.stepTwoBase.renderList[index],   // 选中渲染模板data
            v = this.dialogAdd,
            f = v.softwareList.find(curr => curr.label == t.renderTemplate.softName)  // 软件选中记录
          let b = f['children'].find(curr => curr.label == t.renderTemplate.softName + '-' + t.renderTemplate.softVer)   // 插件

          v.nList = t.xxlPlugins                             // 导入已选中插件记录
          this.$data.dialogAdd.nList = t.xxlPlugins
          v.form.valName = t['renderTemplate']['templateName']              //编辑窗口内模板名
          if (!b) return false
          v.form.valSoftware = [t['renderTemplate']['softName'], b.value]   //编辑窗口内渲染软件
          this.changeSoftware([t['renderTemplate']['softName'], b.value])   //获取对应插件下拉框List
        }
      },
      // 2.设置渲染模板 - 删除模板
      deleteTemplate(index) {
        this.$confirm('删除后将无法找回，确认删除当前模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false
        })
          .then(() => {
            createTaskSetDeletePlugin(this.stepTwoBase.renderList[index]['renderTemplate']['templateUuid'])
              .then(data => {
                this.getList()
                messageFun('success', '删除成功')
              })
          })
          .catch(() => messageFun('info', '已取消删除'))
      },
      // 2.设置渲染模板 - 软件下拉框选中
      async changeSoftware(val) {
        let data = await createTaskSetPlugin(val[1])
        this.dialogAdd.pluginList = data.data.data.map(curr => {
          return {
            label: curr.pluginName,
            val: curr.pluginName,
            list: curr.pluginList
          }
        })
        this.dialogAdd.oList = []
      },
      // 2.设置渲染模板 - 插件下拉框选中
      changePlugin(val) {
        //匹配项
        let t = this.dialogAdd.pluginList.find(curr => curr.val == val)
        this.dialogAdd.oList = t.list.map(curr => {
          let r = this.dialogAdd.nList.findIndex(c => c.pluginName == curr.pluginName && c.version == curr.version)
          return {
            ...curr,
            status: r == -1 ? false : true
          }
        })
        // {
        //   id: '0001',
        //   software: 'mloa',
        //   plugin: 'mloa 4.0.2',
        //   status: false
        // }
        // t.list.map(curr => {
        // id: 2
        // pluginName: "Arnold"
        // version: "2.233"
        // publisher: "4K"
        // pluginUuid: "457"
        // createTime: "2020-03-31"
        // createBy: "1"
        // updateTime: "2020-03-31"
        // updateBy: "1"
        // dataStatus: 1
        // })
      },
      // 2.设置渲染模板 - 关闭【新建/编辑渲染模板窗口】
      closeAddTemplateDialog() {
        // 窗口数据初始化
        this.dialogAdd.form.valName = ''
        this.dialogAdd.form.valSoftware = ''
        this.dialogAdd.form.softwareList = []
        this.dialogAdd.form.valPlugin = ''
        this.dialogAdd.pluginList = []
        this.dialogAdd.oList = []
        this.dialogAdd.nList = []
      },
      // 2.设置渲染模板 - 添加or修改
      async taskDefine() {
        let val
        // 若表格未填写完整 返回
        if (!this.disableSelf) return false
        switch (this.dialogAdd.editOrAdd) {
          // 新建模板
          case 'addMore':
            let data = await createTaskSetNewPlugin({
              templateName: this.dialogAdd.form.valName,        //模板名称
              softUuid: this.dialogAdd.form.valSoftware[1],     //软件uuid
              pluginUuids: this.dialogAdd.nList.map(curr => {
                return curr.pluginUuid
              })
            })
            if (data.data.code == 201) {
              messageFun('success', '创建模板成功')
              this.innerVisible = false
              this.getList()
            } else if(data.data.code == 101) messageFun('info', '模板名已存在，创建失败')
            //创建失败
            break
          // 编辑模板
          case 'editOne':
            let obj = this.stepTwoBase['renderList'][this.dialogAdd.index],
              data2 = await createTaskSetEditPlugin({
              templateUuid: obj['renderTemplate']['templateUuid'],                 // 模板uuid
              templateName: this.dialogAdd.form.valName,                           // 模板名称
              softUuid: this.dialogAdd.form.valSoftware[1],                        // 软件uuid
              isDefault: obj['renderTemplate']['isDefault'],                       // 是否默认
              pluginUuids: this.dialogAdd.nList.map(curr => curr.pluginUuid)       // 插件
            })
            if (data2.data.code == 200) {
              messageFun('success', '编辑成功')
              this.innerVisible = false
              this.getList()
            } else if(data2.data.code == 101) messageFun('info', '模板名已存在，编辑失败')
            break
        }
      },
      // 1.选择渲染文件 - 我的电脑 - table多选
      handleSelectionChange(val) {
        this.stepOneBase.local.selectionR = val
      },
      // 1.选择渲染文件 - 我的电脑 - 操作按钮
      operateBtnFun(action) {
        switch (action) {
          case '添加':
            this.operateBtnAddMore()
            break
          case '删除':
            this.operateBtnDelete()
            break
        }
      },
      // 1.选择渲染文件 - 我的资产 - 展开网盘目录
      expandDiskDirectory() {
        this.stepOneBase.showMe = !this.stepOneBase.showMe
        if (!this.stepOneBase.netdisc.firstOpenCatalogTree) return false
        this.stepOneBase.netdisc.firstOpenCatalogTree = false
        this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': 612,
          'customerUuid': this.user.id,
          'path': ''
        })  // 向后台获取网盘目录 tree
      },
      // 1.选择渲染文件 - 我的电脑 -【添加】新场景文件
      operateBtnAddMore() {
        if (this.stepOneBase.local.filelist.length == 20) {
          messageFun('info', '操作失败，不能选择超过20个场景文件！')
          return false
        }
        if (!this.socket_backS) {
          messageFun('error', '插件连接失败，无法选择文件')
          return false
        }
        if (this.socket_backS === 'err') {
          messageFun('error', '插件连接中，请稍后重试')
          return false
        }
        // 通知插件选择本地文件
        this.$store.commit('WEBSOCKET_PLUGIN_SEND', {
          transferType: 3,                  // 传输类型
          suffix: this.renderFileTypeList   // 文件后缀
        })
      },
      // 1.选择渲染文件 - 我的电脑 -【删除】新场景文件
      operateBtnDelete() {
        let r = this.stepOneBase.local.selectionR
        if (!r.length) messageFun('error', '没有选中项')
        else this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            r.forEach(curr => {
              let index = this.stepOneBase.local.filelist.findIndex((c, index) => c.id == curr.id)
              this.stepOneBase.local.filelist.splice(index, 1)
            })
            messageFun('success', '删除成功')
          })
          .catch(() => messageFun('info', '已取消删除'))
      },
      // 4.提交
      async confirmFun() {
        let fir = this.stepOneBase,
          sec = this.stepTwoBase,
          thi = this.stepThreeBase
        let data = await newTaskProfession({
          zoneUuid: this.zoneId,                             // 分区uuid
          templateUuid: sec.renderList[sec.renderListActive]['renderTemplate']['templateUuid'],    //选中模板uuid
          taskCount: fir.index == 0 ? this.stepOneBase.netdisc.sceneFileSelection.length : fir.local.filelist.length,                            // 要创建任务的数量
          pattern: this.taskType == 'easy' ? 1 : 2,          // 渲染模式
          patternNorm: fir.index == 0 ? 2 : 1,               // 提交模式
          source: 1,                                         // 任务来源
          filePathList: fir.index == 1 ? null : this.stepOneBase.netdisc.sceneFileSelection.map(item => {
            let task = this.stepOneBase.netdisc.treeData.find(curr => curr.id == item)
            return {
              filePath: {
                pathResource: fir.netdisc.pathV,                          // 工程路径
                pathScene: fir.netdisc.sceneFilePath.join('/') + '/',     // 场景文件路径
                fileName: task.label,                                     // 场景文件名
              }
            }
          }),
          commitTaskDTO: this.taskType == 'profession' ? null : {
            layer: this.zone == '1' ? Number(thi.other.stratifyVal) : Number(thi.other.bCVal),          // 是否开启分层渲染。1开启，0关闭 : 开启分相机
            renderPattern: thi.mode.modeList.find(curr => curr.val == thi.mode.mode).id,                // 渲染模式编号
            taskType: this.zone,                         // 任务类型 看分区
            otherSettings: {                             // 其它设置
              projectName: thi.other.viewList.find(curr => curr.value == thi.other.view).label,
              projectUuid: thi.other.viewList.find(curr => curr.value == thi.other.view).id,
              frameTimeoutWarn: thi.other.remindVal,
              frameTimeoutStop: thi.other.stopVal
            },
            testRender: this.zone == '1' ? {
              testRendering: thi.priority.topVal == '1' || thi.priority.middleVal == '1' || thi.priority.bottomVal == '1' ? 1 : 0,              // 是否开启测试渲染
              frameFirst: Number(thi.priority.topVal),                // 首帧
              frameMiddle: Number(thi.priority.middleVal),            // 末帧
              frameFinally: Number(thi.priority.bottomVal)            // 中间帧
            } : null, // 优先渲染
            aoChannel: 0,
            // colorChannel: this.zone == '1' ? null : thi.other.cCVal,                                   // 颜色通道
            colorChannel: 0,
          }
        })
        if (data.data.code == 200) {
          if (fir.index == 0) this.createSuc()
          else this.$store.commit('WEBSOCKET_PLUGIN_SEND', {
            'transferType': 5,
            'userID': this.user.id,
            'taskList': fir.local.filelist.map((curr, index) => {
              return {
                'sceneFile': curr.absolutePath,            // 场景文件
                'path': curr.address,                      // 工程路径
                'taskID': data.data.data[index]
              }
            })
          })
        }
      },
      // 4.创建成功
      createSuc() {
        messageFun('success', '创建成功')
        this.closeDialogFun()
        this.$router.push('/task')

      },
      // 0.选择渲染文件 - 我的资产 - 创建网盘目录
      createCatalog(data) {
        data.forEach(item => {
          function g(item_) {
            let children = []
            for (let t in item_) {
              if (item_[t] == '-') children.push({'label': t})
              else children.push({'label': t, children: g(item_[t])})
            }
            return children
          }

          this.stepOneBase.netdisc.catalogData = this.stepOneBase.netdisc.catalogData.concat(g(JSON.parse(item)))
        })
      },
      // 4.复位
      dataReset() {
        this.stepBtnActive = 1    // 步骤退回到第一步
        this.stepOneBase.index = 0
        Object.assign(this.stepOneBase.netdisc, {
          sceneFileSelection: [], // 选中场景文件
          catalogData: [],        // 工程路径 - 树状图
          treeData: [],           // 渲染文件 - 树状图
          sceneFilePath: [],      // 场景文件 - 面包屑
        })
        Object.assign(this.stepOneBase.local, {
          filelist: [],           // 渲染文件
          selectionR: [],         // 多选渲染文件值
        })
        Object.assign(this.stepThreeBase.priority, {
          topVal: '1',            // 首帧
          middleVal: '1',         // 中间帧
          bottomVal: '1',         // 末帧
        })
        Object.assign(this.stepThreeBase.other, {
          view: null,             // 选中项目
          remindVal: 12,          // 单帧超时提醒
          stopVal: 24,            // 单帧超时停止
          stratifyVal: '1',       // 分层渲染
        })
      },
      // 3.设置渲染参数 设置参数 - 其他设置 - 新建项目
      createItem() {
        let newItemName = ''
        this.$prompt('', '新建项目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入项目名称'
        })
          .then(
            value => {
              newItemName = value.value
              return addNewItem({
                projectName: value.value,
                isDefault: 1
              })
            },
            () => {
              messageFun('info', '取消输入')
              return Promise.reject()
            }
          )
          .then(
            data => {
              if (data.data.code == '201') {
                messageFun('success', '创建项目成功')
                this.getItemList(newItemName)
              } else if (data.data.code == '101') messageFun('error', '创建失败，项目名已存在')
            }
          )
          .catch(() => null)
      },
      // 3.设置渲染参数 - 其它设置 - 项目列表
      async getItemList(name) {
        let data = await getConsumptionSelectList()
        this.stepThreeBase.other.viewList = data.data.data.map(curr => {
          return {
            value: curr.taskProjectUuid + '-/-' + curr.projectName,
            label: curr.projectName,
            id: curr.taskProjectUuid
          }
        })
        if (!name) this.stepThreeBase.other.view = this.stepThreeBase.other.viewList[0]['value']
        else {
          let obj = this.stepThreeBase.other.viewList.find(curr => curr.label == name)
          this.setting.other.view = obj['value']
        }
      },
      // 3.设置渲染参数 - 其它设置 - 超时提醒改变
      changeSliderVal(e) {
        let n = Number(e.target.value)
        if (n >= 1 && 72 >= n) this.stepThreeBase.other.remindVal = n
        else this.stepThreeBase.other.remindVal = 12
      },
      // 3.设置渲染参数 - 其它设置 - 超时停止改变
      changeStopVal(e) {
        let n = Number(e.target.value)
        if (n >= 1 && 72 >= n) this.stepThreeBase.other.stopVal = n
        else this.stepThreeBase.other.stopVal = 24
      },
      // 1.设置渲染文件 - 下一步
      goToMode(dire) {
        if (dire == 'previous') this.stepBtnActive = 2
        else {
          if (this.stepOneBase.index == 0 && this.stepOneBase.netdisc.sceneFileSelection.length == 0) {
            // 我的资产
            messageFun('error', '尚未选择场景文件')
            return false
          } else if (this.stepOneBase.index == 1 && this.stepOneBase.local.filelist.length == 0) {
            // 我的电脑
            messageFun('error', '尚未选择场景文件')
            return false
          }
          this.stepBtnActive = 2
        }
      },
      // 0.预备事件
      readyToWork() {
        if (this.socket_backS) this.$store.commit('WEBSOCKET_BACKS_SEND', {
          'code': 602,
          'customerUuid': this.user.id,
          'path': ''
        })  // 向后台获取网盘目录 场景路径
      }
    },
    mounted() {
      this.getRenderFileType()   // 获取可用的场景文件格式
      this.getList()             // 获取渲染模板列表
      this.getItemList()         // 获取项目列表
    },
    directives: {
      operating: {
        bind(el, bindings, vnode) {
          let handler = e => {
            if (!el.contains(e.target)) {
              if ([...e.target.classList].includes('ix')) return false
              if (vnode.context.infoMessageShow) vnode.context.infoMessageShow = false
            }
          }
          el.handler = handler
          document.addEventListener('click', handler)
        },
        unbind(el) {
          document.removeEventListener('click', el.handler)
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .newTask {
    user-select: none;
    height: 80vh;
    position: relative;

    .header {
      background-color: rgba(241, 244, 249, 1);
      box-shadow: 0px 1px 6px 0px rgba(27, 83, 244, 0.3);
      height: 35px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 30px;

      .title {
        font-size: 14px;
        font-weight: 600;
        color: rgba(22, 29, 37, 1);
        line-height: 25px;
      }

      .closeBtn {
        width: 12px;
        cursor: pointer;
        opacity: 0.8;
      }
    }

    .stepGroup {
      height: calc(100% - 35px - 20px - 72px);
      padding: 20px 30px 0px;

      .navL {
        ul {
          display: flex;
          flex-direction: row;

          &.professionC {
            li {
              width: 406.75px;

              &:nth-of-type(3) {
                display: none;
              }
            }
          }
        }

        .li {
          position: relative;
          width: 277px;
          height: 37px;
          display: flex;
          align-items: center;
          padding-left: 45px;
          box-sizing: border-box;
          margin-right: -12px;
          opacity: 0.3;

          .svg {
            position: absolute;
            left: 0px;
          }

          .i {
            position: relative;
            width: 19px;
            height: 19px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 1);
            box-shadow: 0px 0px 0px 3px rgba(255, 255, 255, 0.3);
            font-size: 14px;
            font-weight: 500;
            color: rgba(27, 83, 244, 1);
            text-align: center;
            margin-right: 8px;
          }

          .s {
            position: relative;
            font-size: 14px;
            font-family: SourceHanSansCN-Medium, SourceHanSansCN;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }

          &:nth-of-type(1) {
            padding-left: 20px;
          }

          &.active {
            opacity: 1;
          }
        }
      }

      .stepBody {
        margin-top: 20px;
        position: relative;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 0px 6px 6px 6px;
        height: calc(100% - 57px);
        overflow: hidden;

        .stepBody-item {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: row;

          /*选择场景文件*/

          .sele {
            flex-shrink: 0;
            width: 143px;
            border-radius: 4px;
            border: 1px solid rgba(22, 29, 37, 0.15);
            padding-top: 26px;
            box-sizing: border-box;

            .li {
              height: 28px;
              background-color: rgba(246, 246, 246, 1);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 16px;
              opacity: 0.6;
              cursor: pointer;

              .img {
                margin-right: 10px;
              }

              .span {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(22, 29, 37, 1);
              }

              &.active {
                opacity: 1;
              }
            }
          }

          .sec {
            flex-grow: 1;
            width: 1px;
            border-radius: 4px;
            border: 1px solid rgba(22, 29, 37, 0.15);
            margin-left: 10px;

            /*我的网盘*/

            .netdist {
              padding: 20px;
              box-sizing: border-box;

              .farm-form-item {
                display: flex;
                position: relative;

                .farm-form-item-label {
                  width: 85px;
                }

                .farm-form-item-input {
                  flex-grow: 1;
                  border: 1px solid rgba(22, 29, 37, 0.2);

                  &.b {
                    position: relative;
                    height: 422px;
                    padding: 0px 20px;

                    /*选择渲染文件 - 我的资产 - 场景文件 - nav*/

                    .base {
                      color: rgba(22, 29, 37, 0.6);
                      font-size: 14px;
                      cursor: pointer;
                      font-family: PingFangSC-Regular, PingFang SC;

                      &:hover {
                        color: rgba(22, 29, 37, 0.8);
                      }
                    }

                    .pathList {
                      position: absolute;
                      top: 0px;
                      height: 34px;
                      width: calc(100% - 40px);
                      border-bottom: 1px solid rgba(22, 29, 37, 0.29);
                      display: flex;
                      align-items: center;

                      .filePathLi {
                        display: flex;
                        align-items: center;

                        &:nth-last-of-type(1) {
                          .im {
                            display: none;
                          }
                        }

                        .s {
                          color: rgba(22, 29, 37, 0.6);
                          font-size: 14px;
                          cursor: pointer;
                          font-family: PingFangSC-Regular, PingFang SC;

                          &:hover {
                            color: rgba(22, 29, 37, 0.8);
                          }
                        }
                      }
                    }

                    .tree {
                      margin-top: 36px;
                    }

                    .null {
                      display: flex;
                      flex-direction: column;
                      align-items: center;

                      .span {
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: rgba(22, 29, 37, 0.29);
                      }
                    }

                    &.null {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    }
                  }

                  &.p {
                    position: relative;
                    padding: 0px 20px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .sp {
                      font-size: 14px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      color: rgba(22, 29, 37, 0.4);
                    }

                    .im {
                      transform: rotate(0deg);
                      transition: all 0.2s;
                      cursor: pointer;

                      &.active {
                        transform: rotate(180deg);
                      }
                    }

                  }
                }

                .netCatalogue {
                  position: absolute;
                  z-index: 2;
                  top: 44px;
                  right: 1px;
                  width: 510px;
                  height: 0px;
                  border-radius: 6px;
                  box-shadow: 0px 0px 0px 1px rgba(22, 29, 37, 0);
                  background-color: rgba(255, 255, 255, 1);
                  transition: all 0.2s;
                  overflow: hidden;

                  &.active {
                    height: 320px;
                    box-shadow: 0px 0px 0px 1px rgba(22, 29, 37, 0.2);
                  }
                }

              }
            }

            /*我的电脑*/

            .local {
              height: 100%;

              .operate {
                margin: 10px;
                text-align: right;
              }

              .table {
                padding: 0px 20px;
                height: calc(100% - 46px);

                /deep/ .el-table {
                  height: 100%;

                  .el-table__body-wrapper {
                    height: calc(100% - 47px);
                  }
                }

                .addressNameBase {
                  position: relative;

                  .addressNameText {
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 97, 255, 1);
                    line-height: 26px;
                  }

                  .addressNameInput {
                    position: absolute;
                    left: 0px;
                    height: 26px;
                    opacity: 0;
                  }
                }

                .f {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;

                  span {
                    font-size: 14px;
                  }

                }

                .se {
                  position: absolute;
                  right: 24px;
                  top: 18px;
                  width: 13px;
                  opacity: 0.6;
                  cursor: pointer;
                }
              }
            }
          }

          /*设置渲染模板*/

          .set-renderTemplate {
            height: 100%;
            padding: 0px 20px;
            box-sizing: border-box;
            display: flex;
            align-content: flex-start;
            justify-content: flex-start;
            flex-wrap: wrap;
            overflow-y: scroll;

            .set-renderTemplate-item {
              width: 230px;
              height: 150px;
              border-radius: 8px;
              overflow: hidden;
              margin: 0px 18px 30px 0px;
              cursor: pointer;

              &.addMore {
                width: 226px;
                height: 146px;
                border: 2px dashed rgba(22, 29, 37, 0.29);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .addMoreIcon {
                  width: 30px;
                  margin-bottom: 12px;
                }

                .addMoreText {
                  font-size: 12px;
                  font-weight: 400;
                  color: rgba(22, 29, 37, 0.3);
                }
              }

              &.ed {
                background-color: rgba(240, 240, 240, 1);

                .headerB {
                  height: 36px;
                  background-color: rgba(240, 240, 240, 1);
                  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
                  padding: 0px 20px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;

                  .headerText {
                    font-size: 13px;
                    line-height: 36px;
                    color: rgba(22, 29, 37, 0.8);
                    display: inline-block;
                    width: 94px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }

                  .opacityBtnGroup {
                    .item-icon {
                      margin-left: 13px;
                      width: 13px;
                      cursor: pointer;
                    }
                  }

                }

                .bodyB {
                  position: relative;
                  height: 114px;
                  padding: 17px;
                  box-sizing: border-box;

                  .hardware,
                  .plugin,
                  .software {
                    display: block;
                    font-size: 14px;
                    color: rgba(22, 29, 37, 0.6);
                    line-height: 20px;
                    margin-bottom: 3px;
                  }

                  .software,
                  .plugin {
                    font-weight: 400;
                  }

                  .hardware {
                    font-weight: 600;
                  }

                  .item-selected {
                    display: none;
                    position: absolute;
                    bottom: 17px;
                    right: 17px;
                    width: 26px;
                  }
                }

                &:hover {
                  box-shadow: 0px 0px 2px 2px rgba(27, 83, 244, 0.5);
                }

                &.active {
                  .headerB {
                    background-color: rgba(5, 81, 206, 1);
                    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.21);

                    .headerText {
                      color: rgba(255, 255, 255, 0.8);
                    }
                  }

                  .bodyB {
                    background-color: rgba(10, 98, 241, 0.59);

                    .hardware,
                    .plugin,
                    .software {
                      color: rgba(255, 255, 255, 1);
                    }

                    .item-selected {
                      display: inline-block;
                    }
                  }
                }
              }
            }
          }

          &.selectFile {
            display: flex;
          }
        }
      }
    }

    .checked {
      float: left;
      margin-left: 30px;
      height: 72px;
      display: flex;
      align-items: center;

      .base {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: rgba(22, 29, 37, 0.6);

        .num {
          font-size: 20px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(27, 83, 244, 1);
        }
      }
    }

    .btnGroup {
      height: 72px;
      display: flex;
      align-items: center;
      flex-direction: row-reverse;

      .btnGroup-btn {
        margin-right: 30px;
        display: inline-block;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.79);
        text-align: center;
        cursor: pointer;

        &.confirm {
          background-color: rgba(10, 98, 241, 1);
          border: 1px solid rgba(10, 98, 241, 1);
          width: 76px;
          line-height: 32px;

          span {
            color: rgba(255, 255, 255, 0.8);
          }
        }

        &.previous {
          border: 1px solid rgba(22, 29, 37, 0.2);
          width: 74px;
          line-height: 30px;

          span {
            color: rgba(22, 29, 37, 0.79);
          }
        }

        &.cannotTrigger {
          cursor: no-drop;
          border: 1px solid rgba(22, 29, 37, 0.19);
          background-color: rgba(255, 255, 255, 1);
          width: 74px;
          line-height: 30px;

          span {
            color: rgba(22, 29, 37, 0.19);
          }
        }
      }
    }
  }

  .wrapper {
    .header {
      height: 36px;
      background-color: rgba(241, 244, 249, 1);
      box-shadow: 0px 1px 6px 0px rgba(27, 83, 244, 0.3);
      border-radius: 8px 8px 0px 0px;
      padding: 8px 20px 8px 30px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 14px;
        font-weight: 600;
        color: rgba(22, 29, 37, 1);
        letter-spacing: 4px;
      }

      .closeBtn {
        width: 12px;
        cursor: pointer;
        opacity: 0.6;
      }
    }

    #templateName {
      color: rgba(22, 29, 37, 0.8);
    }

    .farm-form {
      padding: 30px;
    }

    .transferBase {
      margin-left: 109px;
      margin-bottom: 65px;
      width: 472px;
      vertical-align: top;
      display: flex;
      justify-content: space-between;

      .o,
      .n {
        width: 220px;
        height: 250px;
        border-radius: 4px;
        border: 1px solid rgba(22, 29, 37, 0.2);

        .label {
          font-size: 14px;
          line-height: 1em;
          color: rgba(22, 29, 37, 0.6);
          padding: 20px;
        }

        .list {
          overflow-y: scroll;
          height: 190px;

          .li {
            min-height: 24px;
            padding: 0px 20px;
            cursor: pointer;
            margin-bottom: 8px;

            .name {
              padding-top: 2px;
              font-size: 14px;
              line-height: 20px;
              font-weight: 400;
              color: rgba(22, 29, 37, 0.39);
              width: 134px;
              display: inline-block;
            }

            .choiceIcon,
            .deleteNIcon {
              float: right;
              margin-top: 5px;
              border: 1px solid rgba(22, 29, 37, 0.59);
              border-radius: 50%;
              width: 12px;
              height: 12px;
              font-size: 0px;

              .icon {
                margin-left: -1px;
                margin-top: -1px;
                width: 14px;
              }
            }

            .deleteNIcon {
              border: 0px;
              width: 14px;
              height: 14px;
              opacity: 0.6;
              transition: opacity 0.2s;

              &:hover {
                opacity: 1;
              }
            }

            &.active,
            &:hover {
              background-color: rgba(22, 29, 37, 0.04);

              .name {
                color: rgba(22, 29, 37, 0.59);
              }
            }
          }

          &::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
          }

          &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(102, 89, 89, 0.2);
            background: #9e9797;
          }

          &::-webkit-scrollbar-track {
            /*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(138, 129, 129, 0.2);
            border-radius: 2px;
            background: rgba(226, 221, 221, 0.4);
          }
        }
      }

      .ig {
        position: relative;

        &::before {
          content: '';
          width: 10px;
          height: 10px;
          display: inline-block;
          border-width: 3px;
          border-color: rgba(255, 255, 255, 0.29);
          border-top-style: solid;
          border-right-style: solid;
          transform: rotate(45deg);
          position: absolute;
          left: -8px;
          top: 110px;
        }
      }
    }

    .btnGroup {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;

      .btnGroup-btn {
        margin-right: 21px;
        display: inline-block;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.79);
        cursor: pointer;

        span {
          display: inline-block;
          line-height: 1em;
        }

        &.cancel {
          border: 1px solid rgba(22, 29, 37, 0.4);
          padding: 5px 23px;
          color: rgba(22, 29, 37, 0.4);
          transition: all 0.2s;

          &:hover {
            color: rgba(22, 29, 37, 0.6);
            border-color: rgba(22, 29, 37, 0.6);
          }
        }

        &.save {
          padding: 6px 24px;
          background-color: rgba(10, 98, 241, 1);
        }

        &.disable-self {
          background-color: rgba(166, 166, 166, 0.6);
          color: rgba(255, 255, 255, 0.4);
          cursor: default;
        }
      }
    }
  }

  .farm-form-item-input {
    border-radius: 4px !important;
    border: 1px solid rgba(22, 29, 37, 0.2) !important;
  }

  /deep/ .el-dialog__body {
    padding: 0px;
  }

  /deep/ .el-select .el-input__inner,
  /deep/ .el-cascader .el-input__inner {
    border: 1px solid rgba(22, 29, 37, 0.2);
  }

  .inputError {
    color: #f40 !important;
  }

  .farm-drawer-body-item-d {
    padding-top: 15px;

    .el-radio {
      &:nth-of-type(1) .supplement {
        color: rgba(70, 203, 93, 1);
      }

      &:nth-of-type(2) .supplement {
        color: rgba(70, 203, 93, 0.5);
      }

      &:nth-of-type(3) .supplement {
        color: rgba(255, 62, 77, 0.5);
      }
    }

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

  .farm-drawer-body-item {
    border: 1px solid rgba(22, 29, 37, 0.15);
  }

  .info {
    margin-left: 122px;
    font-size: 12px;
    color: rgba(255, 191, 0, 1);
    display: flex;
    align-items: center;

    img {
      width: 13px;
      margin-right: 2px;
    }
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

  .slider {
    display: inline-block;
    width: 240px;
    vertical-align: middle;
  }

  .farm-drawer-body {
    padding: 1px;
  }

  .farm-drawer-item {
    display: flex;
    align-items: center;
  }

  .farm-drawer-item-label {
    width: 110px !important;
    margin-right: 28px;
    color: rgba(22, 29, 37, 0.6) !important;
  }

  .unit {
    color: rgba(22, 29, 37, 0.6);
    margin-left: 6px;
  }

  .mark {
    vertical-align: middle;
    cursor: pointer;
  }

  .createBtn {
    display: inline-block;
    margin-left: 4px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(10, 98, 241, 1);
    cursor: pointer;

    .createIcon {
      width: 18px;
      vertical-align: middle;
      margin-left: 20px;
    }
  }

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

  .custom-tree-node {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: rgba(22, 29, 37, 0.8);
  }

  /deep/ .custom-tree-node {
    display: flex;
    align-items: center;
    font-size: 14px;

    & > span {
      display: flex;
      align-items: center;
    }

    img {
      margin-left: 23px;
      margin-right: 4px;
    }

    .el-checkbox {
      display: flex;
      align-items: center;

      .el-checkbox__label {
        display: flex;
        align-items: center;
      }

      img {
        margin-left: 0px;
        margin-right: 4px;
      }
    }
  }

</style>
