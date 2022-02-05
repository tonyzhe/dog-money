<template>
  <layout>
    <header class="header">
      <div class="logo">
        <img :src="logo" alt="小狗钱钱">
      </div>
      <div class="info">
        <div class="calendar">
          <select v-model="year" class="year">
            <option v-for="item in years" :key="item" :value="item">{{ item }}年</option>
          </select>
          <div class="month">
            <select v-model="month">
              <option v-for="item in 12" :key="item"
                      :value="item"
              >{{ beautifyMonth(item) }}
              </option>
            </select>
            <span>月</span>
          </div>

        </div>
        <div class="total">
          <div class="income">
            <span class="totalSpan">收入</span>
            <div class="value">
              <span>{{
                  totalIncome.toString().split('.')[0] || '0'
                }}</span>.{{ totalIncome.toString().split('.')[1] || '00' }}
            </div>
          </div>
          <div class="expense">
            <span class="totalSpan">支出</span>
            <div class="value">
                <span>{{
                    totalExpense.toString().split('.')[0] || '0'
                  }}</span>.{{ totalExpense.toString().split('.')[1] || '00' }}
            </div>
          </div>
          <div></div>

        </div>
      </div>
    </header>
    <ul v-if="groupList.length>0" class="groupListWrapper">
      <li v-for="item in groupList" :key="item.name" class="groupList">
        <h3 class="title">{{ getTitle(item) }} <span>{{ getTotal(item) }}</span></h3>

        <div class="items">
          <router-link v-for="record in item.items"
                       :to="`/record/edit/${record.id}`"
                       :key="record.id"
                       class="item"
          >
            <div class="icon">
              <icon :name="record.tag.name" class-prefix="bill"></icon>
              <span>{{ record.tag.value }}</span>
            </div>
            <span>{{ getAmount(record) }}</span>
          </router-link>
        </div>

      </li>
    </ul>
    <div v-else class="blank">
      <blank></blank>
    </div>
    <div>

    </div>
  </layout>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Watch} from 'vue-property-decorator';
import Layout from '@/components/Layout.vue';
import Nav from '@/components/Nav.vue';
import dayjs from 'dayjs';
import {RecordItem} from '@/custom';
import clone from '@/lib/clone';
import Blank from '@/components/Blank.vue';
import Icon from '@/components/Icon.vue';

const logo = require('@/assets/logo.png');

type Group = {
  name: string;
  items: RecordItem[]
}

@Component({
  components: {Icon, Blank, Nav, Layout}
})
export default class Bill extends Vue {
  logo: string = logo;
  year = window.sessionStorage.getItem('year') || dayjs().year().toString();
  month = window.sessionStorage.getItem('month') || (dayjs().month() + 1).toString();
  fuckMonth = dayjs().month().toString();

  get years(): number[] {
    const currentYear = dayjs().year();
    let y = 2020;
    const result: number[] = [];
    while (y <= currentYear) {
      result.push(y);
      y++;
    }
    return result;
  }

  get groupList(): Group[] {
    const result: Group[] = [];
    const names: string[] = [];
    //对记录排序
    const sortedRecordList = clone<RecordItem[]>(this.recordList).filter(item => (dayjs(item.createAt).year() === parseInt(this.year)) && (dayjs(item.createAt).month() + 1 === parseInt(this.month))).sort((b, a) => {
      return dayjs(a.createAt).valueOf() - dayjs(b.createAt).valueOf();
    });
    let record: RecordItem;
    for (record of sortedRecordList) {
      let date: string;
      if (this.year === dayjs().year().toString()) {
        //今年的数据按天分组
        date = dayjs(record.createAt).toISOString().split('T')[0];
      } else {
        date = dayjs(record.createAt).format('YYYY-MM');
      }
      const index = names.indexOf(date);
      if (index < 0) {
        names.push(date);
        result.push({name: date, items: [record]});
      } else {
        result[index].items.push(record);
      }
    }
    return result;

  }

  get totalIncome(): number {
    let total = 0;
    let group: Group;
    for (group of this.groupList) {
      let record: RecordItem;
      for (record of group.items) {
        if (record.type === '+') {
          total += record.amount;
        }
      }
    }
    return total;
  }

  get totalExpense(): number {
    let total = 0;
    let group: Group;
    for (group of this.groupList) {
      let record: RecordItem;
      for (record of group.items) {
        if (record.type === '-') {
          total += record.amount;
        }
      }
    }
    return total;
  }

  beautifyMonth(m: number): string {
    return m < 10 ? '0' + m.toString() : m.toString();
  }

  get recordList(): RecordItem[] {
    return this.$store.state.recordList;
  }

  getTotal(group: Group): string {
    const expenseArr = group.items.filter(item => item.type === '-');
    const incomeArr = group.items.filter(item => item.type === '+');
    let expenseArrTotal = expenseArr.reduce((sum, item) => {
      return sum -= item.amount;
    }, 0);
    let incomeArrTotal = incomeArr.reduce((sum, item) => {
      return sum += item.amount;
    }, 0);
    const total = expenseArrTotal + incomeArrTotal;
    if (total < 0) {
      return `支出:${Math.abs(total)}`;
    } else {
      return `收入:${Math.abs(total)}`;
    }

  }

  getAmount(record: RecordItem): number {
    if (record.type === '-') {
      return -record.amount;
    } else {
      return record.amount;
    }
  }

  getTitle(group: Group): string {
    const day = dayjs(group.name);
    const now = dayjs();
    if (day.isSame(now, 'day')) {
      return `今天  ${this.toWeekday(day.day())}`;
    } else if (day.isSame(now.subtract(1, 'day'), 'day')) {
      return `昨天  ${this.toWeekday(day.day())}`;
    } else if (day.isSame(now.subtract(2, 'day'), 'day')) {
      return `前天  ${this.toWeekday(day.day())}`;
    } else if (day.isSame(now, 'year')) {
      return `${day.format('M月D日')}  ${this.toWeekday(day.day())}`;
    } else {
      return day.format('YYYY年M月');
    }
  }

  toWeekday(value: number): string {
    return [
      '星期天',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六'
    ][value];

  }

  @Watch('year')
  saveYear(year: string): void {
    window.sessionStorage.setItem('year', year);
  }

  @Watch('month')
  saveMonth(month: string): void {
    window.sessionStorage.setItem('month', month);
  }
}
</script>

<style lang="scss" scoped>
.header {
  background: #FFC0D4;


  .logo {
    text-align: center;

    img {
      height: 30px;
      vertical-align: top;
      margin: auto;
    }
  }

  .info {
    display: flex;
    align-items: center;
    padding: 4px 0;


    .calendar {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 0 16px;
      align-items: center;

      &::after {

        content: '';
        display: block;
        position: absolute;
        right: 0;
        height: 40px;
        background: #ccfffe;
        width: 1px;
      }

      .year {
        font-size: 12px;
        margin-bottom: 5px;
        padding: 0 3px;
        color: black;
      }

      .month {
        display: flex;
        align-items: center;
        justify-content: center;

        select {
          font-size: 20px;
        }

        span {
          font-size: 12px;
        }

      }


    }


    .total {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      padding: 4px 16px;

      .totalSpan {
        display: block;
        margin-bottom: 3px;
        font-size: 12px;
        color: #ccfffe;
      }

      .value {
        font-size: 12px;

        span {
          font-size: 20px;
        }
      }

      .income {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .expense {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }

}

.groupListWrapper {
  .groupList {
    .title {
      display: flex;
      justify-content: space-between;
      padding: 4px 20px;
      font-size: 14px;
      color: #999999;
      border-bottom: 1px solid #ddd;
    }

    .items {
      padding: 0 16px;

      .item {
        display: flex;
        align-items: center;
        padding: 8px 4px;
        font-size: 16px;
        justify-content: space-between;
        box-shadow: inset 0 -0.5px 0.5px -0.5px rgb(0 0 0 / 20%);

        .icon {
          display: flex;
          align-items: center;
          margin-right: 16px;

          ::v-deep {
            .bill-icons {
              height: 30px;
              width: 30px;
              background: lightpink;
              border-radius: 50%;
              padding: 4px;

            }
          }
        }


      }
    }
  }
}

.blank {
  margin: auto;

  ::v-deep {
    .record {
      height: 100px;
      width: 100px;
    }
  }
}
</style>
