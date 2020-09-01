<template>
  <div class="calendar" v-operating>
    <input type="text" v-model="dateVal" class="filter-item-i filter-item-time inputDate">
    <img src="@/icons/calendarIcon.png" alt="" class="calendarIcon">
    <div class="operateDate" v-show="operating">
      <!--日历-->
      <div class="calendarTab">
        <div class="adjust">
          <span class="yearAdjust">
            <img src="@/icons/enter.png" alt="" @click="changeYear('previous')">
            <span class="o">
              {{ yearNow }}年
            </span>
            <img src="@/icons/enter.png" alt="" @click="changeYear('next')">
          </span>
          <span class="monthAdjust">
            <img src="@/icons/enter.png" alt="" @click="changeMonth('previous')">
            <span class="o">
              {{ monthNow }}月
            </span>
            <img src="@/icons/enter.png" alt="" @click="changeMonth('next')">
          </span>
        </div>
        <div class="dayList">
          <span v-for="item,index in visibeDays"
                :key="index" class="day"
                @click="selectSpanDate(item)"
                :class="[
                  {'n': !isCurrentMonth(item)},
                  {'t': isToday(item)}
                ]">
            {{ item.getDate() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import {
    createCalendar,
    getDate
  } from '@/assets/common.js'
  import {mapState} from "vuex";

  export default {
    name: 'modelCalendar',
    data() {
      return {
        operating: false,
        // 日历选中月份
        checkTimesTamp: new Date(),
        selectDate: 'start',
        dateVal: null,
      }
    },
    props: {
      birthdayVal: {
        type: Number,
      }
    },
    directives: {
      operating: {
        bind(el, bindings, vnode) {
          let handler = e => {
            if (el.contains(e.target)) {
              // 触发在模块内
              if (!vnode.context.operating) {
                vnode.context.focus()
              }
              if (e.target.innerText == '确定') {
                vnode.context.blur()
              }
            } else {
              if (vnode.context.operating) {
                vnode.context.blur()
              }
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
    computed: {
      ...mapState(['user']),
      // 当前年份
      yearNow() {
        let {year} = createCalendar(this.checkTimesTamp)
        return year
      },
      // 当前月份
      monthNow() {
        let {month} = createCalendar(this.checkTimesTamp)
        return month
      },
      // 生成日历
      visibeDays() {
        let {year, month} = createCalendar(this.checkTimesTamp),
          firDay = getDate(year, month, 1),    //当月1号时间戳
          firDayWeek = firDay.getDay(),      //当月1号星期
          p = 60 * 60 * 1000 * 24,
          startDay = firDay - firDayWeek * p,//当组日历的第一天
          arr = []
        // 每组日历显示42天
        for (let i = 0; i < 42; i++) {
          arr.push(new Date(startDay + i * p))
        }
        return arr
      }
    },
    methods: {
      // 日历内选中日期
      selectSpanDate(date) {
        let {year, month, day} = createCalendar(date)
        this.dateVal = this.formatFun(year, month, day)
        this.$emit('changeSelectDate', date.getTime())
      },
      // 日期格式
      formatFun(year, month, day) {
        return `${year}-${month}-${day}`
      },
      // 显示面板
      focus() {
        this.operating = true
      },
      // 隐藏面板
      blur() {
        this.operating = false
      },
      // 判断是否为当月日期
      isCurrentMonth(date) {
        return this.checkTimesTamp.getMonth() == date.getMonth() && this.checkTimesTamp.getFullYear() == date.getFullYear()
      },
      // 判断是否时当天日期
      isToday(date) {
        return this.checkTimesTamp.getMonth() == date.getMonth() && this.checkTimesTamp.getFullYear() == date.getFullYear() && this.checkTimesTamp.getDate() == date.getDate()
      },
      // 修改日历年份
      changeYear(dir) {
        switch (dir) {
          case 'previous':
            this.checkTimesTamp = getDate(this.yearNow - 1, this.monthNow, 1)
            break
          case 'next':
            this.checkTimesTamp = getDate(this.yearNow + 1, this.monthNow, 1)
            break
        }
      },
      // 修改日历月份
      changeMonth(dir) {
        switch (dir) {
          case 'previous':
            if (this.monthNow == 1) {
              this.checkTimesTamp = getDate(this.yearNow - 1, 12, 1)
            } else {
              this.checkTimesTamp = getDate(this.yearNow, this.monthNow - 1, 1)
            }
            break
          case 'next':
            if (this.monthNow == 12) {
              this.checkTimesTamp = getDate(this.yearNow + 1, 1, 1)
            } else {
              this.checkTimesTamp = getDate(this.yearNow, Number(this.monthNow) + 1, 1)
            }
            break
        }
      },
    },
    mounted() {
      let {year, month, day} = createCalendar(new Date(this.user.birthday))
      this.dateVal = this.formatFun(year, month, day)
    }
  }
</script>

<style lang="less" scoped>
  .calendar {
    position: relative;
    /*height: 20px;*/
    width: 180px;

    .inputDate {
      position: absolute;
      top: -20px;
      width: 180px;
      height: 30px;
      border-radius: 4px;
      color: rgba(0, 0, 0, 0.8);
      background-color: transparent;
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding-left: 20px;
      box-sizing: border-box;
      outline: none;
    }

    .calendarIcon {
      position: absolute;
      top: -13px;
      right: 6px;
      width: 16px;
      cursor: pointer;
    }

    .operateDate {
      position: absolute;
      top: 20px;
      z-index: 14;
      width: 250px;
      height: 219px;
      height: 239px;
      /*background-color: rgba(28, 36, 45, 1);*/
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 10px 0px rgba(0, 97, 255, 0.15);
      border: 1px solid rgba(0, 97, 255, 0.1);
      display: flex;

      .calendarTab {
        width: 250px;
        height: 100%;
        padding: 0px 18px;
        box-sizing: border-box;
        border-width: 0px 0px 0px 1px;
        border-style: solid;
        border-color: rgba(256, 256, 256, 0.1);

        .adjust {
          display: flex;
          justify-content: space-between;
          margin: 15px 0px 6px;

          .yearAdjust,
          .monthAdjust {
            img {
              vertical-align: top;
              cursor: pointer;

              &:nth-of-type(1) {
                transform: rotate(180deg);
              }
            }

            .o {
              user-select: none;
              font-size: 12px;
              font-weight: 400;
              color: rgba(22, 29, 37, 0.59);
              display: inline-block;
              line-height: 17px;
            }
          }
        }

        .dayList {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;

          .day {
            cursor: pointer;
            user-select: none;
            font-size: 12px;
            width: 28px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            font-weight: 400;
            margin: 1px;
            color: rgba(22, 29, 37, 1);

            &.n {
              color: rgba(22, 29, 37, 0.3);
            }

            &.t,
            &:hover {
              background-image: linear-gradient(225deg, rgba(142, 192, 255, 1) 0%, rgba(27, 83, 244, 1) 100%);
              border-radius: 50%;
              color: rgba(255, 255, 255, 1)
            }
          }
        }
      }
    }
  }
</style>
