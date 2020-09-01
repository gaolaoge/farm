<template>
  <div class="home-charts-wrapper">
    <div ref="ec" class="ec"></div>
  </div>
</template>

<script>
  export default {
    name: 'home-charts',
    data() {
      return {
        ec: null
      }
    },
    props: {
      // cData: {
      //   type: Array
      // },
      // cDate: {
      //   type: Array
      // }
    },
    computed: {
      maxNum() {
        let m = Math.max.apply(null, this.cData)
        if (m == 0) {
          return 2
        } else {
          return m % 2 == 1 ? m + 1 : m
        }
      }
    },
    methods: {
      init() {
        this.ec = this.$echarts.init(this.$refs.ec)
        this.ec.setOption({
          title: {
            text: '75.0',
            textStyle: {
              color: "rgba(22, 29, 37, 1)",
              fontSize: 22
            },
            subtext: '资产总容量',
            subtextStyle: {
              color: 'rgba(22, 29, 37, 0.59)',
            },
            itemGap: 10, // 主副标题距离
            left: 'center',
            top: '90'
          },
          // legend: {
          //   orient: 'vertical',
          // },
          grid: {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0
          },
          angleAxis: {
            max: 100, // 满分
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
            // 灰色环
            {
              type: 'bar',
              data: [
                {
                  value: 100,
                  itemStyle: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  }
                }
              ],
              coordinateSystem: 'polar',
              roundCap: true,
              barWidth: 10,
              barGap: '0', // 两环重叠
              zlevel: 1
            },
            // 内环
            {
              type: 'bar',
              data: [
                {
                  value: 70,
                  name: 'gaoge',
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
                }
              ],
              coordinateSystem: 'polar',
              roundCap: true,
              barWidth: 14,
              barGap: '0', // 两环重叠
              zlevel: 1
            },
            // 内环
            {
              type: 'bar',
              data: [
                {
                  value: 30,
                  itemStyle: {
                    normal: {
                      color: 'pink'
                    }
                  },
                }
              ],
              coordinateSystem: 'polar',
              roundCap: true,
              barWidth: 14,
              barGap: '-2', // 两环重叠
              zlevel: 1
            },
            // 外环
            // {
            //   type: 'bar',
            //   data: [
            //     {
            //       value: 70,
            //       itemStyle: {
            //         normal: {
            //           color: new this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
            //             {
            //               offset: 0,
            //               color: 'rgba(162, 203, 255, 0)'
            //             },
            //             {
            //               offset: 0.5,
            //               color: 'rgba(72, 144, 255, 0)'
            //             },
            //             {
            //               offset: 1,
            //               color: '#f40'
            //             }
            //           ]),
            //           shadowColor: '#f40',
            //           shadowBlur: 6,
            //           opacity: 0.2,
            //         }
            //       },
            //     }
            //   ],
            //   coordinateSystem: 'polar',
            //   roundCap: true,
            //   barWidth: 14,
            //   barGap: '0', // 两环重叠
            //   zlevel: 0
            // },
          ]
        })
      }
    },
    watch: {
      cData(val) {
        this.init()
      },
      cDate(val) {
        this.init()
        window.addEventListener("resize", this.ec.resize)
      },
      '$route.path': {
        handler: function(val){
          if(val != '/') return false
          setTimeout(() => {
            this.init()
          }, 800)
        },
        immediate: true
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-charts-wrapper {
    width: 100%;
    height: 100%;

    .ec {
      width: 100%;
      height: 100%;
    }
  }
</style>
