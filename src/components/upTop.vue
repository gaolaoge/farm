<template>
  <div class="upTop" ref="upTopDom">
    <div class="tableGroup">
      <!--导航-->
      <div class="navList">
        <span class="navBtn"
              :class="[{'active': index == navListActiveIndex}]"
              @click="navListActiveIndex = index"
              v-for="(item,index) in form.navList"
              :key="index">
          {{ item.text }}
        </span>
      </div>
      <!--内容-->
      <div class="tableList">
        <!--充值-->
        <div class="farm-form"
             v-show="navListActiveIndex == 0">
          <!--金币余额-->
          <div class="farm-form-item">
            <div class="farm-form-item-label">
              {{ form.balanceLabel }}:
            </div>
            <div class="farm-form-item-val">
              <span class="text">
                {{ user.balance }}
              </span>
            </div>
          </div>
          <!--充值金额-->
          <div class="farm-form-item">
            <div class="farm-form-item-label">
              {{ form.upTopLabel }}:
            </div>
            <div class="farm-form-item-val">
              <div class="g">
                <div class="up-top-item"
                     :class="[{'active': form.ChineseYuan == item.ChineseYuan}]"
                     v-for="(item,index) in form.list"
                     :key="index"
                     @click="form.ChineseYuan = item.ChineseYuan">
                  <div class="gold">
                    <span class="unit">
                      ￥
                    </span>
                    <span class="num">
                      {{ item.ChineseYuan }}
                    </span>
                  </div>
                  <div class="t">
                    <span class="remark">
                      {{ item.remark }}
                    </span>
                  </div>
                  <div class="selected" :style="{backgroundImage: 'url(' + require('../icons/x.png') + ')'}">
                    <span>{{ item.ChineseYuan }}</span>
                    <img src="@/icons/check-circle.png" alt="">
                  </div>
                </div>
              </div>
              <input type="text" class="farm-form-item-input in" :placeholder="form.placeholder"
                     v-model="form.ChineseYuan">
            </div>
          </div>
          <!--充值到账金币-->
          <div class="farm-form-item">
            <div class="farm-form-item-label">
              {{ form.realLabel }}:
            </div>
            <div class="farm-form-item-val">
              <span class="text">
                {{ form.realVal }}
              </span>
            </div>
          </div>
          <!--充值方式-->
          <div class="farm-form-item">
            <div class="farm-form-item-label">
              {{ form.modeLabel }}:
            </div>
            <div class="farm-form-item-val">
              <div class="pay-base"
                   @click="payMethods = 'zfb'"
                   :class="[{'active': payMethods == 'zfb'}]">
                <img src="@/icons/no-select.png" alt="" v-show="payMethods != 'zfb'" class="s">
                <img src="@/icons/yes-select.png" alt="" v-show="payMethods == 'zfb'" class="s">
                <img src="@/icons/zhifubao-icon.png" alt="" v-show="payMethods != 'zfb'">
                <img src="@/icons/zhifubao-icon-a.png" alt="" v-show="payMethods == 'zfb'">
              </div>
              <div class="pay-base"
                   @click="payMethods = 'wx'"
                   :class="[{'active': payMethods == 'wx'}]">
                <img src="@/icons/no-select.png" alt="" v-show="payMethods != 'wx'" class="s">
                <img src="@/icons/yes-select.png" alt="" v-show="payMethods == 'wx'" class="s">
                <img src="@/icons/weixin-icon.png" alt="" v-show="payMethods != 'wx'">
                <img src="@/icons/weixin-icon-a.png" alt="" v-show="payMethods == 'wx'">
              </div>
            </div>
          </div>
          <!--btn-->
          <div class="farm-form-item">
            <div class="farm-form-item-label">
            </div>
            <div class="farm-form-item-val">
              <div class="btn" :class="[{'cannotBeGo': !canBeUpTop}]" @click="payFun">
                {{ btn.upTopNow }}
              </div>
            </div>
          </div>
        </div>
        <!--计费说明-->
        <div class="billingInstructions"
             v-show="navListActiveIndex == 1">
          <!--CPU-->
          <div class="t">
            <div class="card">{{ cpuCard }}</div>
            <div class="priceList cpuPriceList">
              <div class="item" v-for="(item,index) in form.cpuList" :key="index">
                <h6>{{ item.userLevel }}</h6>
                <p class="accumulative"> {{ item.total }} </p>
                <p class="price">{{ form.unit }}<span class="num">{{ item.price }}</span>{{ form.unitPrice }}</p>
                <p class="k">
                  <!--相当于16核32线程节点机-->
                  <span style="display: block">{{ item.dir1 }}</span>
                  <!--包含每小时收费3.04元-->
                  <span style="display: block">{{ form.dir4 }}<span class="v">{{ item.unitPrice }}</span>{{ form.dir2 }}</span>
                  <!--包含50G 存储空间-->
                  {{ form.f }}<span class="v">{{ item.RAM }}</span>{{ form.dir3 }}
                </p>
              </div>
            </div>
          </div>

          <!--GPU-->
          <div class="t">
            <div class="card">{{ gpuCrad }}</div>
            <div class="priceList gpuPriceList">
              <div class="item" v-for="(item,index) in form.gpuList" :key="index">
                <h6>{{ item.userLevel }}</h6>
                <p class="accumulative"> {{ item.total }} </p>
                <p class="price">{{ form.unit }}<span class="num">{{ item.price }}</span>{{ form.unitPrice2 }}</p>
                <p class="k">
                  <span style="display: block">{{ item.dir1 }}</span>
                  <span style="display: block">{{ form.dir4 }}<span
                    class="v">{{ item.price }}</span>{{ form.dir2 }}</span>
                  {{ form.f }}<span class="v">{{ item.RAM }}</span>{{ form.dir3 }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--充值说明-->
      <div class="tableList"
           v-show="navListActiveIndex == 0">
        <div class="farm-form">
          <div class="farm-form-item">
            <div class="farm-form-item-label">
              {{ form.directions }}:
            </div>
            <div class="farm-form-item-val">
              <ol class="ll">
                <li v-for="(item,index) in form.directionsList" :key="index" class="l">
                  {{ item.r }}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--充值-->
    <el-dialog :visible.sync="rechargeIframe">
      <div ref="dom"></div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    ALiPay,
    computeGold,
    upTopDefault
  } from '@/api/api'
  import {
    mapState
  } from 'vuex'

  export default {
    name: 'upTop',
    data() {
      return {
        canBeUpTop: true,
        navListActiveIndex: 0,
        form: {
          navList: [
            {
              text: '充值'
            },
            {
              text: '计费说明'
            }
          ],
          balanceLabel: '金币余额',
          balanceVal: '0.000',
          upTopLabel: '充值金额',
          upTopVal: '',
          realLabel: '充值到账金币',
          realVal: '200.000',
          modeLabel: '充值方式',
          modeVal: '',
          listActive: 0,
          list: [
            {
              ChineseYuan: '100',
              remark: '充值100元送100金币 实际到账200金币',
              gold: 200
            },
            {
              ChineseYuan: '200',
              remark: '充值200元送200金币 实际到账400金币',
              gold: 400
            },
            {
              ChineseYuan: '500',
              remark: '充值500元送500金币 实际到账1000金币',
              gold: 1000
            }
          ],
          placeholder: '输入其他金额',
          directions: '充值说明',
          directionsList: [
            {
              r: '充值金额将以金币的形式发送到充值账户，只能按照实际充值金额开具发票，赠送金币不开具发票'
            },
            {
              r: '充值后不支持退款。'
            },
            {
              r: '充值其他问题，请联系客服：13176527028'
            }
          ],
          ChineseYuan: 100,
          unit: '￥',
          unitPrice: '/核时',
          unitPrice2: '/机时',
          dir2: '元',
          dir3: '存储空间',
          dir4: '每小时收费',
          f: '包含',
          cpuList: [
            {
              userLevel: '普通用户',
              total: '累计充值0元',
              price: '0.190',
              unitPrice: '3.04',
              RAM: '50G',
              dir1: '相当于16核32线程节点机'
            },
            {
              userLevel: '璀璨白银',
              total: '累计充值2000元',
              price: '0.175',
              unitPrice: '2.80',
              RAM: '500G',
              dir1: '相当于16核32线程节点机'
            },
            {
              userLevel: '荣耀黄金',
              total: '累计充值12000元',
              price: '0.150',
              unitPrice: '2.40',
              RAM: '1T',
              dir1: '相当于16核32线程节点机'
            },
            {
              userLevel: '尊贵铂金',
              total: '累计充值30000元',
              price: '0.125',
              unitPrice: '2',
              RAM: '2T',
              dir1: '相当于16核32线程节点机'
            },
            {
              userLevel: '永恒钻石',
              total: '累计充值60000元',
              price: '0.100',
              unitPrice: '1.60',
              RAM: '5T',
              dir1: '相当于16核32线程节点机',
              dir4: '包含每小时收费'
            }
          ],
          gpuList: [
            {
              userLevel: '普通用户',
              total: '累计充值0元',
              price: '9',
              dir1: '相当于2张M10卡',
              RAM: '50G'
            },
            {
              userLevel: '璀璨白银',
              total: '累计充值2000元',
              price: '7',
              dir1: '相当于2张M10卡',
              RAM: '500G'
            },
            {
              userLevel: '荣耀黄金',
              total: '累计充值12000元',
              price: '6',
              dir1: '相当于2张M10卡',
              RAM: '1T'
            },
            {
              userLevel: '尊贵铂金',
              total: '累计充值30000元',
              price: '5',
              dir1: '相当于2张M10卡',
              RAM: '2T'
            },
            {
              userLevel: '永恒钻石',
              total: '累计充值60000元',
              price: '4',
              dir1: '相当于2张M10卡',
              RAM: '5T'
            }
          ]
        },
        payMethods: 'zfb',
        btn: {
          upTopNow: '立即充值'
        },
        rechargeIframe: false,
        cpuCard: 'CPU',
        gpuCrad: 'GPU'
      }
    },
    watch: {
      'form.ChineseYuan': function (val) {
        this.canBeUpTop = true
        if (val == 100) {
          this.form.realVal = '200.000'
          return false
        }
        if (val == 200) {
          this.form.realVal = '400.000'
          return false
        }
        if (val == 500) {
          this.form.realVal = '1000.000'
          return false
        }
        this.computeFun()
      },
      '$route': function (val) {
        // console.log(val)
      }
    },
    methods: {
      // 计算金币
      async computeFun() {
        if (!this.form.ChineseYuan) {
          this.form.realVal = '0.000'
          this.canBeUpTop = false
          return false
        }
        let data = await computeGold(this.form.ChineseYuan)
        this.form.realVal = data.data.data.toFixed(3)
      },
      // 立即充值
      payFun() {
        if(!this.canBeUpTop) return false
        if (this.payMethods == 'zfb') this.aLiPayFun()
        if (this.payMethods == 'wx') this.wxPayFun()
      },
      // 支付宝充值
      async aLiPayFun() {
        let data = await ALiPay(this.form.ChineseYuan)
        sessionStorage.setItem('aliPay', data.data.data)
        let routerData = this.$router.resolve({name: 'rechargePage'})
        window.open(routerData.href, '_blank')
      },
      // 微信充值
      wxPayFun() {

      }
    },
    computed: {
      ...mapState(['user'])
    },
    mounted() {
      if (/\?/.test(this.$route.fullPath))
        upTopDefault(this.$route.fullPath.split('?')[1])
    }
  }
</script>

<style lang="less" scoped>
  .upTop {
    width: 100%;
    overflow: hidden;

    .tableGroup {
      height: 100%;
    }

    .tableList {
      padding: 30px;
      margin-bottom: 20px;
      box-sizing: border-box;
      min-width: 1440px;

      .g {
        display: flex;

        .up-top-item {
          position: relative;
          width: 260px;
          height: 174px;
          background-color: rgba(27, 83, 244, 0.05);
          border: 1px solid rgba(27, 83, 244, 1);
          border-radius: 8px;
          margin-right: 30px;
          overflow: hidden;
          user-select: none;
          cursor: pointer;

          .gold {
            width: 260px;
            height: 100px;
            border-bottom: 1px solid rgba(27, 83, 244, 1);

            .unit {
              display: inline-block;
              font-size: 16px;
              font-weight: 600;
              color: rgba(255, 187, 0, 1);
              margin-left: 20px;
              margin-right: 5px;
            }

            .num {
              display: inline-block;
              margin-top: 11px;
              font-size: 60px;
              font-weight: 600;
              line-height: 84px;
              color: rgba(255, 187, 0, 1);
            }
          }

          .t {
            .remark {
              display: inline-block;
              padding: 15px 20px;
              width: 136px;
              font-size: 13px;
              font-weight: 400;
              color: rgba(27, 83, 244, 0.6);
              line-height: 22px;
            }
          }

          &.active {
            border: 1px solid rgba(0, 0, 0, 0);

            .selected {
              position: absolute;
              top: 0px;
              left: 0px;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;

              span {
                font-size: 60px;
                font-family: MontserratAlternates-BlackItalic, MontserratAlternates;
                font-weight: normal;
                color: rgba(255, 255, 255, 1);
                line-height: 73px;
                margin: 18px 0px 15px;
              }
            }
          }
        }
      }

      .in {
        width: 460px;
        margin-top: 30px;
      }

      .pay-base {
        position: relative;
        border-radius: 4px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-right: 60px;
        cursor: pointer;

        .s {
          margin-right: 10px;
        }

        &.active {

        }
      }

      .btn {
        margin-top: 10px;
        cursor: pointer;
        display: inline-block;
        background-color: rgba(0, 97, 255, 1);
        box-shadow: 0px 1px 10px 0px rgba(22, 29, 37, 0.2);
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        padding: 6px 30px;
        line-height: 20px;

        &:hover {
          background-color: rgba(53, 130, 254, 1);
        }
      }

      .ll {
        padding-left: 16px;

        .l {
          font-size: 14px;
          font-weight: 400;
          color: rgba(22, 29, 37, 0.8);
          line-height: 24px;
        }
      }

      &:nth-last-of-type(1) {
        margin-bottom: 0px;
        border-radius: 8px;
        height: 198px;
      }
    }

    .billingInstructions {
      padding-left: 60px;

      .priceList {
        position: relative;
        /*z-index: ;*/
        width: 1316px;
        height: 313px;
        background-color: rgba(27, 83, 244, 0.05);
        border-radius: 0px 10px 10px 10px;
        border: 1px solid rgba(27, 83, 244, 0.1);
        margin-bottom: 30px;
        display: flex;
        justify-content: space-around;

        .item {
          position: relative;
          text-align: center;
          padding: 50px;

          &::after {
            position: absolute;
            right: 0px;
            top: 66px;
            content: '';
            width: 1px;
            height: 190px;
            background-color: rgba(255, 255, 255, 0.2);
          }

          &:nth-last-of-type(1) {
            &::after {
              display: none;
            }
          }

          h6 {
            font-size: 18px;
            font-weight: 600;
            color: rgba(22, 29, 37, 1);
            margin-bottom: 10px;
          }

          .price,
          .accumulative,
          .k {
            font-size: 14px;
            font-weight: 500;
            color: rgba(22, 29, 37, 0.6);
            line-height: 22px;
          }

          .price {
            margin: 30px 0px 20px;
            line-height: 42px;

            .num {
              font-size: 30px;
              font-weight: 900;
              color: rgba(39, 95, 239, 1);
              font-family: Arial-Black, Arial;
            }
          }

          .k {
            width: 158px;

            .v {
              color: rgba(22, 29, 37, 0.6);
              font-weight: 600;
            }
          }
        }
      }

      .t {
        position: relative;
      }

      .card {
        position: absolute;
        z-index: 0;
        left: -60px;
        content: 'CPU';
        width: 60px;
        height: 38px;
        background-color: rgba(243, 119, 109, 1);
        border-radius: 100px 0px 0px 100px;
        box-sizing: border-box;
        font-size: 16px;
        line-height: 38px;
        padding-left: 15px;
        color: rgba(255, 255, 255, 1);
      }

      .gpuPriceList {

      }
    }

    .btn.cannotBeGo {
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 1);
      opacity: 0.19;
      border: 1px solid rgba(22, 29, 37, 1);
      color: rgba(22, 29, 37, 1);
      cursor: no-drop;
      &:hover {
        background-color: rgba(255, 255, 255, 1);
      }
    }
  }
</style>
