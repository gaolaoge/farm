<template>
  <div class="settingM">
    <div class="tableGroup">
      <div class="navList">
        <span class="navBtn"
              :class="[{'active': index == table.navListActiveIndex}]"
              @click="table.navListActiveIndex = index"
              v-for="item,index in table.navList"
              :key="index">
          {{ item }}
        </span>
      </div>
      <div class="tableList">
        <!--渲染设置-->
        <div class="renderM" v-show="table.navListActiveIndex == 0">
          <render-m ref="renderM" />
        </div>
        <!--消息设置-->
        <div class="messageM" v-show="table.navListActiveIndex == 1">
          <message-m ref="messageM" />
        </div>
        <!--项目设置-->
        <div class="projectM" v-show="table.navListActiveIndex == 2">
          <project-m ref="projectM" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import renderM from '@/components/setting/renderSetting-cardM'
  import projectM from '@/components/setting/projectSetting-cardM'
  import messageM from '@/components/setting/messageSetting-cardM'
  export default {
    name: 'settingM',
    data(){
      return {
        table: {
          navListActiveIndex: 0,
          navList: ['渲染设置', '消息设置', '项目设置']
        },
      }
    },
    components: {
      renderM,
      projectM,
      messageM
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  .settingM {
    width: 100%;
  }
  .tableGroup {
    height: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    .tableList {
      flex-grow: 1;
      .renderM {
        height: 100%;
      }
    }
  }
</style>
