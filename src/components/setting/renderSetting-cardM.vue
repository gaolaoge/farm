<template>
  <div class="renderSetting">
    <!--分析后参数修改-->
    <div class="farm-item">
      <span class="label">{{ isEditLabel }}:</span>
      <div class="vv">
        <el-switch
          v-model="switchV"
          active-value="1"
          inactive-value="0"
          inactive-color="rgba(22, 29, 37, 0.3)"
          active-color="rgba(10, 98, 241, 1)"
          @change="editData"/>
      </div>
      <span class="desc">（{{ isEditDesc }}）</span>
    </div>
    <!--单帧超时提醒-->
    <div class="farm-item">
      <span class="label">{{ reminderLabel }}:</span>
      <div class="v">
        <input type="text" v-model="reminderVal" @change="veriRemind">
        <span class="unit">{{ unit[0] }}</span>
      </div>
      <span class="desc">（{{ reminderDesc }}）</span>
    </div>
    <!--单帧超时停止-->
    <div class="farm-item">
      <span class="label">{{ stopLabel }}:</span>
      <div class="v">
        <input type="text" v-model="stopVal" @change="veriStop">
        <span class="unit">{{ unit[0] }}</span>
      </div>
      <span class="desc">（{{ stopDesc }}）</span>
    </div>
    <!--单个任务预警-->
    <div class="farm-item">
      <span class="label">{{ warningLabel }}:</span>
      <div class="v">
        <input type="text" v-model="warningVal" @change="veriWarning">
        <span class="unit">{{ unit[1] }}</span>
      </div>
      <span class="desc">（{{ warningDesc }}）</span>
    </div>
  </div>
</template>

<script>
  import {
    getSetData,
    setSetData
  } from '@/api/setting-api'
  import {
    mapState
  } from 'vuex'
  import {messageFun} from "../../assets/common";

  export default {
    name: 'renderSetting',
    data() {
      return {
        isEditLabel: '分析后参数修改',
        isEditDesc: '如果您需要在分析后修改场景文件中默认参数，请启用此项；',
        isEditVal: '',
        reminderLabel: '单帧超时提醒',
        reminderDesc: '单帧渲染时长超过设定，系统发送提醒消息给联系人，具体通知方式可在“消息设置”中完成；',
        reminderVal: null,
        reminderShow: false,
        stopLabel: '单帧超时停止',
        stopDesc: '单帧渲染时长超过设定，系统停止当前帧的渲染并发送消息给联系人；',
        stopVal: null,
        stopShow: false,
        warningLabel: '单个任务预警',
        warningDesc: '单个任务渲染费用累计超过设定金币值时，系统发送提醒消息给联系人，具体方式可在“消息设置”中完成；',
        warningVal: null,
        warningShow: false,
        unit: ['小时', '金币'],
        switchV: '0',
        renderSettingUuid: null,
      }
    },
    methods: {
      // 获取数据
      async getData(){
        let data = await getSetData()
        this.switchV = String(data.data.data.endSetting)        // 分析后参数修改
        this.reminderVal = data.data.data.frameTimeoutWarn      // 单帧超时提醒
        this.stopVal = data.data.data.frameTimeoutStop          // 单帧超时停止
        this.warningVal = data.data.data.taskEarlyWarning       // 单个任务渲染费用累计超过设定金币值
        this.renderSettingUuid = data.data.data.renderSettingUuid
      },
      // 修改数据
      async editData(){
        let data = await setSetData({
          'renderSettingUuid': this.renderSettingUuid,
          'endSetting': Number(this.switchV),
          'frameTimeoutWarn': this.reminderVal,
          'frameTimeoutStop': this.stopVal,
          'taskEarlyWarning': this.warningVal
        })
        if(data.data.code == 201) {
          messageFun('success', '设置成功')
          this.$store.commit('changeTaskType', this.switchV == '1' ? 'profession' : 'easy')
        }
      },
      // 修改单帧超时提醒
      veriRemind(){
        let n = Number(this.reminderVal)
        if(!n) this.reminderVal = 12
        else if(n > 72) this.reminderVal = 12
        else if(n < 1) this.reminderVal = 1
        else this.reminderVal = n
        this.editData()
      },
      // 修改单帧超时停止
      veriStop(){
        let n = Number(this.stopVal)
        if(!n) this.stopVal = 24
        else if(n > 72) this.stopVal = 24
        else if(n < 1) this.stopVal = 1
        else this.stopVal = n
        this.editData()
      },
      // 修改单个任务预警
      veriWarning(){
        let n = Number(this.warningVal)
        if(!n) this.warningVal = 99999
        else if(n > 99999) this.warningVal = 99999
        else if(n < 1) this.warningVal = 1
        else this.warningVal = n
        this.editData()
      },
    },
    mounted(){
      this.getData()
      this.taskType == 'profession' ? this.switchV = '1' : this.switchV = '0'
    },
    computed: {
      ...mapState(['taskType'])
    }
  }
</script>

<style lang="less" scoped>
  .renderSetting {
    padding: 50px 30px;
    box-sizing: border-box;
    height: 100%;
    overflow-x: scroll;

    .farm-item {
      height: 36px;
      min-width: 1100px;
      display: flex;
      align-items: center;
      margin-bottom: 14px;

      .label {
        width: 112px;
        margin-right: 10px;
        font-size: 14px;
        color: rgba(22, 29, 37, 0.79);
      }

      .vv {
        display: flex;
        align-items: center;
        width: 180px;
        height: 34px;
        margin-right: 10px;
      }

      .v {
        position: relative;
        display: flex;
        justify-content: space-between;
        width: 180px;
        height: 34px;
        border-radius: 8px;
        padding: 0px 20px;
        box-sizing: border-box;
        margin-right: 10px;
        border: 1px solid rgba(22, 29, 37, 0.3);

        .unit {
          font-size: 14px;
          color: rgba(22, 29, 37, 1);
          line-height: 34px;
        }

        input {
          outline: none;
          background-color: transparent;
          border: 0px;
          width: 100px;
          font-size: 14px;
          color: rgba(22, 29, 37, 0.8);
          line-height: 34px;
          font-family: 'SourceHanSansCN', 'Arial Bold';
        }
      }

      .desc {
        font-size: 14px;
        color: rgba(22, 29, 37, 0.6);
      }
    }
  }
</style>
