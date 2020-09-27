<template>
  <div class="Pinfo-wrapper">
    <div class="tableGroup">
      <div class="navList">
        <span class="navBtn"
              :class="[{'active': index == table.navListActiveIndex}]"
              @click="table.navListActiveIndex = index"
              v-for="(item,index) in table.navList"
              :key="index">
          {{ item.text }}
        </span>
      </div>
      <div class="tableList">
        <!--个人资料-->
        <div ref="infoTable"
             class="infoTable"
             v-show="table.navListActiveIndex == 0">
          <person-info />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import personInfo from '@/components/Pinfo/personInfo'
  export default {
    name: 'Pinfo',
    data(){
      return {
        table: {
          navListActiveIndex: 0,
          navList: [
            {
              text: '个人资料'
            }
          ]
        }
      }
    },
    components: {
      personInfo
    }
  }
</script>

<style lang="less" scoped>
  .Pinfo-wrapper {
    overflow: hidden;
    width: 100%;
  }
</style>
