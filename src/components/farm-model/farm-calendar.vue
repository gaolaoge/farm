<template>
  <div class="calendar" v-operating>
    <input type="text" v-model="u" class="filter-item-i filter-item-time inputDate">
    <div class="operateDate" v-show="operating">
      <!--操作日历-->
      <div class="operater">
        <div class="ti">
          {{ t }}
        </div>
        <div class="date-item" @click="selectDate = 'start'">
          <div class="label">
            {{ startLabel }}
          </div>
          <div class="input" :class="[{'active': this.selectDate == 'start' }]">
            <span>
              {{ startDate }}
            </span>
            <img src="@/icons/calendarIcon.png" alt="">
          </div>
        </div>
        <div class="date-item" @click="selectDate = 'end'">
          <div class="label">
            {{ endLabel }}
          </div>
          <div class="input" :class="[{'active': this.selectDate == 'end' }]">
            <span>
              {{ endDate }}
            </span>
            <img src="@/icons/calendarIcon.png" alt="">
          </div>
        </div>
        <div class="btn-item">
          <!--确定-->
          <div class="btn-correct btn" @click="s">
            {{ correct }}
          </div>
          <!--取消-->
          <div class="btn-cancel btn">
            {{ cancel }}
          </div>
        </div>
      </div>
      <!--日历-->
      <div class="calendarTab">
        <div class="adjust">
          <span class="yearAdjust">
            <img src="@/icons/enter2.png" alt="" @click="changeYear('previous')">
            <span class="o">
              {{ yearNow }}年
            </span>
            <img src="@/icons/enter2.png" alt="" @click="changeYear('next')">
          </span>
          <span class="monthAdjust">
            <img src="@/icons/enter2.png" alt="" @click="changeMonth('previous')">
            <span class="o">
              {{ monthNow }}月
            </span>
            <img src="@/icons/enter2.png" alt="" @click="changeMonth('next')">
          </span>
        </div>
        <div class="dayList">
          <span v-for="(item,index) in visibeDays"
                :key="index" class="day"
                @click="!isFuture(item) ? selectSpanDate(item) : false"
                :class="[
                  {'n': !isCurrentMonth(item)},
                  {'t': isToday(item)},
                  {'f': isFuture(item)}
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

  export default {
    name: 'modelCalendar',
    data() {
      return {
        t: '自定义时间',
        operating: false,
        // 日历选中月份
        checkTimesTamp: new Date(new Date().toDateString()),
        todayTimesTamp: new Date(new Date().toDateString()),
        selectDate: 'start',
        startDate: null,
        endDate: null,
        startLabel: '起始',
        endLabel: '结束',
        correct: '确定',
        cancel: '取消',
        // 起始、结束时间时间戳
        startTimestamp: null,
        endTimestamp: null,
        u: null
      }
    },
    props: {},
    directives: {
      operating: {
        bind(el, bindings, vnode) {
          let handler = e => {
            if (el.contains(e.target)) {
              if (!vnode.context.operating) {
                vnode.context.focus()
              }
              if (e.target.innerText == '确定') {
                vnode.context.blur()
                vnode.context.selectDate = 'start'
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
        unbind(el, bindings, vnode) {
          document.removeEventListener('click', el.handler)
        }
      }
    },
    computed: {
      // 今日
      formatDate() {
        let {year, month, day} = createCalendar(this.checkTimesTamp)
        return this.formatFun(year, month, day)
      },
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
          firDay = getDate(year, month, 1),    // 当月1号时间戳
          firDayWeek = firDay.getDay(),        // 当月1号星期
          p = 60 * 60 * 1000 * 24,
          startDay = firDay - firDayWeek * p,  // 当组日历的第一天
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
        let t = this.formatFun(year, month, day)
        switch (this.selectDate) {
          case 'start':
            this.startTimestamp = date
            this.startDate = t
            break
          case 'end':
            this.endTimestamp = date
            this.endDate = t
            break
        }
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
      // 判断item是否在选中月份内
      isCurrentMonth(date) {
        return this.checkTimesTamp.getMonth() == date.getMonth() && this.checkTimesTamp.getFullYear() == date.getFullYear()
      },
      // 判断item是否为当天
      isToday(date) {
        return this.todayTimesTamp.getMonth() == date.getMonth() && this.todayTimesTamp.getFullYear() == date.getFullYear() && this.todayTimesTamp.getDate() == date.getDate()
      },
      // 判断是否是未来日期
      isFuture(date) {
        return this.todayTimesTamp.getTime() < date.getTime()
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
      // 日期确定选择
      s() {
        this.$emit('changeSelect')
        this.correctDateVal()
      },
      correctDateVal() {
        let s, e
        if (this.startTimestamp <= this.endTimestamp) {
          s = this.startDate
          e = this.endDate
        } else {
          s = this.endDate
          e = this.startDate
        }
        this.u = s + ' ~ ' + e
        this.$emit('changeSelectDate', [s, e])
      },
      // 设置日期区间
      setDateInterval(dateInterval) {
        let num = 1000 * 60 * 60 * 24,
          todayNum = new Date().getTime()
        // 设置开始日期
        switch (dateInterval) {
          case 'nearlySevenDays':
            this.selectSpanDate(new Date(todayNum - 6 * num))
            this.startTimestamp = createCalendar(new Date(todayNum - 6 * num))
            break
          case 'nearlyThirtyDays':
            this.selectSpanDate(new Date(todayNum - 29 * num))
            this.startTimestamp = createCalendar(new Date(todayNum - 29 * num))
            break
          case 'customize':  // 无需操作
            this.startTimestamp = createCalendar(new Date(0))
            break
        }
        // 设置结束结束日期 当日
        this.selectDate = 'end'
        this.selectSpanDate(this.todayTimesTamp)  // new Date()
        this.endTimestamp = createCalendar(new Date())

        this.selectDate = 'start'
        this.correctDateVal()     // 选定
      },
      // 设为空 值为0-today
      setNull(){
        this.u = '-'
        this.startTimestamp = createCalendar(new Date(0))
        this.endTimestamp = createCalendar(new Date())
      }
    },
    mounted() {
      this.startDate = this.formatDate
      this.endDate = this.formatDate
      this.u = this.startDate + ' ~ ' + this.endDate
    }
  }
</script>

<style lang="less" scoped>
  .calendar {
    position: relative;

    .inputDate {
      color: rgba(22, 29, 37, 1);
    }

    .operateDate {
      position: absolute;
      top: 35px;
      z-index: 14;
      width: 476px;
      height: 219px;
      height: 239px;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 12px 0px rgba(27, 83, 244, 0.12);
      border: 1px solid rgba(0, 97, 255, 0.1);
      display: flex;

      .operater {
        width: 224px;
        height: 219px;
        padding: 0px 30px;
        box-sizing: border-box;

        .ti {
          font-size: 14px;
          font-weight: 400;
          color: rgba(22, 29, 37, 0.8);
          text-align: center;
          padding: 15px 0px;
          user-select: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.29);
        }

        .date-item {
          cursor: pointer;
          margin-top: 15px;

          .label {
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.6);
            margin-right: 7px;
            vertical-align: middle;
          }

          .input {
            display: inline-block;
            width: 123px;
            height: 31px;
            border-radius: 2px;
            border: 1px solid rgba(128, 128, 128, 0.2);

            span {
              color: rgba(22, 29, 37, 0.6);
              font-size: 14px;
              line-height: 31px;
              vertical-align: middle;
              padding-left: 8px;
            }

            img {
              float: right;
              width: 14px;
              margin: 8px;
            }

            &.active {
              border: 1px solid rgba(128, 128, 128, 1);

              span {
                color: rgba(22, 29, 37, 0.8);
              }
            }
          }
        }

        .btn-item {
          margin-top: 30px;
          display: flex;
          justify-content: center;

          .btn {
            font-size: 13px;
            font-weight: 400;
            line-height: 18px;
            cursor: pointer;

            &.btn-correct {
              color: rgba(0, 97, 255, 1);
            }

            &.btn-cancel {
              color: rgba(22, 29, 37, 0.6);
            }

            &:nth-of-type(1) {
              margin-right: 33px;
            }
          }
        }
      }

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
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 62px;

            img {
              cursor: pointer;
              width: 4px;
              margin: 0px 3px;

              &:nth-of-type(1) {
                transform: rotate(180deg);
              }
            }

            .o {
              user-select: none;
              font-size: 12px;
              color: rgba(22, 29, 37, 0.59);
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

              &:hover {
                color: rgba(22, 29, 37, 0.3) !important;
              }
            }

            &.t,
            &:hover {
              background-image: linear-gradient(225deg, rgba(142, 192, 255, 1) 0%, rgba(27, 83, 244, 1) 100%);
              border-radius: 50%;
              color: rgba(255, 255, 255, 1);
            }

            &.f {
              cursor: no-drop;

              &:hover {
                background-image: none;
                color: rgba(22, 29, 37, 1);
              }
            }
          }
        }
      }
    }
  }
</style>
