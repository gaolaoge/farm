<template>
  <div class="home-charts-wrapper">
    <div ref="ec" class="ec" />
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
      cData: {
        type: Array,
      },
      cDate: {
        type: Array,
      }
    },
    mounted() {
      this.init()
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
          "tooltip": {
            show: true,
            backgroundColor: 'rgba(27, 83, 244, 1)',
            borderColor: 'rgba(27, 83, 244, 0.4)',
            borderWidth: 1,
            formatter: '{c}',
            extraCssText: 'box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.2)'
          },
          "grid": {
            "top": 20,
            "bottom": 20,
            "left": 10,
            "right": 10
          },
          "xAxis": {
            "type": 'category',
            "data": this.cDate,
            "axisLabel": {
              "show": true,
              "interval": 0,
              "textStyle": {
                "color": 'rgba(0, 0, 0,0.49)',
                "fontSize": 12,
              },
            },
            "axisLine": {
              // show: false
              lineStyle: {        // 属性lineStyle控制线条样式
                color: 'rgba(22, 29, 37, 0.3)',
                width: 2,
                type: 'solid'
              }
            },
            "axisTick": {
              "show": false
            },
            "axisPointer": {
              "handle": {
                "show": true,
                "color": 'rgba(22, 29, 37, 0.1)'
              }
            },
            // "splitLine": {
            //   'show': true
            // }
          },
          "yAxis": {
            "type": 'value',
            "min": 0,
            "max": this.maxNum,
            "interval": Math.ceil(this.maxNum / 2),
            "axisLine": {
              // "show": false
              lineStyle: {        // 属性lineStyle控制线条样式
                color: 'rgba(22, 29, 37, 0.3)',
                width: 2,
                type: 'solid'
              }
            },
            "axisLabel": {
              "show": false,
            },
            "axisTick": {
              "show": false
            },
            "splitLine": {
              "show": false,
            },
          },
          "series": [
            {
              "data": this.cData,
              "type": 'line',
              "smooth": true,
              "lineWidth": 1,
              "itemStyle": {
                // "color": 'rgba(27, 83, 244, 1)',
                normal: {
                  color: 'rgba(27, 83, 244, 1)',
                  opacity: 0.2
                }
              },
              "areaStyle": {
                "normal": {
                  "color": new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      "offset": 0,
                      "color": 'rgba(27, 83, 244, 0.6)'
                    },
                    {
                      "offset": .5,
                      "color": 'rgba(27, 83, 244, 0.3)'
                    },
                    {
                      "offset": 1,
                      "color": 'rgba(38,197,254,0.00)'
                    }
                  ])

                }
              },
            }
          ],
        })
      }
    },
    watch: {
      cData(val) {
        this.init()
      },
      cDate(val) {
        this.init()
        window.addEventListener("resize", this.ec.resize);
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-charts-wrapper {
    .ec {
      width: 100%;
      height: 100%;
    }
  }
</style>
