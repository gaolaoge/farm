<template>
  <div class="home-charts-wrapper">
    <div ref="ec" class="ec"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'home-charts',
    data() {
      return {
        ec: null
      }
    },
    computed: {
      ...mapState(['user']),
    },
    methods: {
      init() {
        this.ec = this.$echarts.init(this.$refs.ec)
        this.ec.setOption({
          title: {
            text: Number(this.user.totalCapacity).toFixed(1),
            textStyle: {
              color: 'rgba(22, 29, 37, 1)',
              fontSize: 22
            },
            subtext: '资产总容量',
            subtextStyle: {
              color: 'rgba(22, 29, 37, 0.59)',
              fontSize: 10
            },
            itemGap: 2, // 主副标题距离
            left: 'center',
            top: 'center'
          },
          angleAxis: {
            max: this.user.totalCapacity, // 满分
            clockwise: true, // 逆时针
            // 隐藏刻度线
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          radiusAxis: {
            type: 'category',
            // 隐藏刻度线
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          polar: {
            center: ['50%', '50%'],
            radius: '100%' //图形大小
          },
          series: [
            {
              type: 'bar',
              data: [{
                value: this.user.usedCapacity,
                itemStyle: {
                  normal: {
                    color: new this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
                      {
                        offset: 0,
                        color: 'rgba(162, 203, 255, 1)'
                      },
                      {
                        offset: 0.5,
                        color: 'rgba(72, 144, 255, 1)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(0, 75, 206, 1)'
                      }
                    ])
                  }
                },
              }],
              coordinateSystem: 'polar',
              roundCap: true,
              barWidth: 13,
              barGap: '-100%', // 两环重叠
              z: 2,
            },
            { // 灰色环
              type: 'bar',
              data: [{
                value: this.user.totalCapacity,
                itemStyle: {
                  color: '#e2e2e2'
                }
              }],
              coordinateSystem: 'polar',
              roundCap: true,
              barWidth: 10,
              barGap: '-100%', // 两环重叠
              z: 1
            },
            {
              type: 'pie',
              radius: '50%',
              center: ['50%', '50%'],
              label: {
                formatter: '{per|{d}}{abg|}\n{hr|}\n  {a|{b}} ',
                rich: {
                  a: {
                    color: 'rgba(22, 29, 37, 0.49)',
                    lineHeight: 22,
                    fontSize: 12,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '5',
                    borderWidth: 0.5,
                    height: 0
                  },
                  per: {
                    color: 'rgba(22, 29, 37, 0.79)',
                    padding: [2, 4],
                    lineHeight: 22,
                    align: 'center',
                    fontSize: 13,
                    fontWeight: 500
                  }
                }
              },
              labelLine: {
                normal: {
                  length: 14,  // 改变标示线的长度
                  lineStyle: {
                    color: "rgba(22, 29, 37, 0.6)"  // 改变标示线的颜色
                  }
                },
              },
              data: [
                {
                  value: this.user.usedCapacity,
                  name: '已用',
                  itemStyle: {
                    color: 'rgba(255,255,255,0)'
                  },
                },
                {
                  value: this.user.haveCapacity,
                  name: '剩余',
                  itemStyle: {
                    color: 'rgba(255,255,255,0)'
                  },
                },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 40,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              z: 4
            }
          ]
        })
      }
    },
    watch: {
      'user': {
        handler: function(val){
          this.init()
        },
        deep: true
      },
    }
  }
</script>

<style lang="less" scoped>
  .home-charts-wrapper {
    width: 100%;
    height: 100%;

    .ec {
      width: 266px;
      height: 228px;
    }
  }
</style>
