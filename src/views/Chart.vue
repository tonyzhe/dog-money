<template>
  <layout>
    <header>
      <tabs :tabs="[{name:'支出',value:'-'},{name:'收入',value:'+'}]" :current-tab.sync="type"></tabs>
      <tabs :current-tab.sync="interval" :tabs="intervalList" classPrefix="interval"></tabs>
    </header>
    <div class="chart">
      <div class="caption">
        <span v-if="this.interval==='week'">本周</span>
        <span v-else-if="interval==='month'">本月</span>
        <span v-else>今年</span>
      </div>
      <div class="statistics">
        <div class="total" v-if="this.type==='-'">总支出:¥{{ total }}</div>
        <div class="total" v-else-if="this.type==='+'">总收入:¥{{ total }}</div>
        <div class="average">平均值:¥{{ average }}</div>
      </div>
      <div id="diagram"></div>

    </div>
    <div class="ranking">
      <div class="caption">
        <span v-if="this.type==='-'">支出排行榜</span>
        <span v-else-if="this.type==='+'">收入排行榜</span>
      </div>
      <ul class="items">
        <li v-for="(item,index) in groupByTags()"
            :key="index"
        >
          <div class="item-info">
            <div class="icon">
              <Icon :name="item.tag.name"></Icon>
            </div>
            <span>{{ item.tag.value }}</span>
            <span>{{ item.percentage }}%</span>
          </div>
          <span>{{ item.amount }}</span>

        </li>
      </ul>
    </div>
  </layout>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Watch} from 'vue-property-decorator';
import Nav from '@/components/Nav.vue';
import Layout from '@/components/Layout.vue';
import Tabs from '@/components/Money/Tabs.vue';
import {RecordItem, TabBar, TagItem} from '@/custom';
import dayjs from 'dayjs';
import clone from '@/lib/clone';
import {twoDecimalPlaces} from '@/lib/decimal';
import * as echarts from 'echarts';
import Icon from '@/components/Icon.vue';

type TagGroup = {
  tag: TagItem;
  amount: number;
  percentage: number;
}
@Component({
  components: {Icon, Tabs, Layout, Nav}
})
export default class Chart extends Vue {
  typeList: TabBar[] = [
    {name: '支出', value: '-'},
    {name: '收入', value: '+'}
  ];
  type: '-' | '+' = '-';
  interval: 'week' | 'month' | 'year' = 'week';

  intervalList: TabBar[] = [
    {name: '周', value: 'week'},
    {name: '月', value: 'month'},
    {name: '年', value: 'year'},
  ];


  get currentRecords(): RecordItem[] {
    const now = dayjs();
    return clone<RecordItem[]>(this.$store.state.recordList).filter(item => item.type === this.type).filter(item => dayjs(item.createAt).isSame(now, this.interval));
  }

  get total(): number {
    const amounts = [...this.groupByInterval().values()];
    return amounts.reduce((sum, item) => sum + item, 0);

  }

  get average(): number {
    const now = dayjs();
    switch (this.interval) {
      case 'week':
        return twoDecimalPlaces(this.total / (now.day() + 1));
      case 'month':
        return twoDecimalPlaces(this.total / now.date());
      case 'year':
        return twoDecimalPlaces(this.total / (now.month() + 1));
      default:
        return 0;
    }
  }


  get days(): number {
    const [year, month] = [dayjs().year(), dayjs().month()];
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
      if (month === 2) {
        return monthDays[month];
      } else {
        return monthDays[month];
      }
    } else {
      return monthDays[month];
    }
  }

  groupByTags(): TagGroup[] {
    const tags: string[] = [];
    let result: TagGroup[] = [];
    let record: RecordItem;
    for (record of this.currentRecords) {
      const index = tags.indexOf(record.tag.name);
      if (index < 0) {
        tags.push(record.tag.name);
        result.push({tag: record.tag, amount: record.amount, percentage: 0});
      } else {
        result[index].amount += record.amount;
      }
    }
    for (let i = 0; i < result.length; i++) {
      result[i].percentage = twoDecimalPlaces(result[i].amount * 100 / this.total);
    }
    return result;
  }

  groupByInterval(): Map<string, number> {
    let result = new Map<string, number>();
    switch (this.interval) {
      case 'week':
        result = this.groupByWeek(this.currentRecords);
        break;
      case 'month':
        result = this.groupByMonth(this.currentRecords);
        break;
      case 'year':
        result = this.groupByYear(this.currentRecords);
        break;
    }
    return result;
  }

  groupByYear(currentRecords: RecordItem[]): Map<string, number> {
    const keys: string[] = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const result = new Map<string, number>();
    //初始化result的key
    for (let i = 0; i < keys.length; i++) {
      result.set(keys[i], 0);
    }
    let record: RecordItem;
    for (record of currentRecords) {
      const key = keys[dayjs(record.createAt).month()];
      const amount = result.get(key) as number;
      result.set(key, amount + record.amount);
    }
    return result;
  }

  groupByMonth(currentRecords: RecordItem[]): Map<string, number> {
    const result = new Map<string, number>();
    //初始化keys
    const keys: string[] = [];
    for (let i = 0; i < this.days; i++) {
      keys.push((i + 1).toString());
    }
    for (let i = 0; i < keys.length; i++) {
      result.set(keys[i], 0);
    }
    let record: RecordItem;
    for (record of currentRecords) {
      const key = dayjs(record.createAt).date().toString();
      const amount = result.get(key) as number;
      result.set(key, amount + record.amount);
    }
    return result;
  }

  groupByWeek(currentRecords: RecordItem[]): Map<string, number> {
    const keys = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const result = new Map<string, number>();
    //给map初始话,将周几添加其中
    for (let i = 0; i < keys.length; i++) {
      result.set(keys[i], 0);
    }
    let recordItem: RecordItem;
    for (recordItem of currentRecords) {
      const key = keys[dayjs(recordItem.createAt).day()];
      const amount = result.get(key) as number;
      if (this.type === recordItem.type) {
        result.set(key, amount + recordItem.amount);
      }
    }
    return result;
  }

  draw(data: Map<string, number>): void {
    const x = [...data.keys()];
    const y = [...data.values()];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    echarts.dispose(document.getElementById('diagram')!);
    const figure = echarts.init(document.getElementById('diagram') as HTMLDivElement);
    figure.setOption({
      grid: {
        top: '5%',
        bottom: '10%'
      },
      xAxis: {
        data: x,
        axisTick: {
          interval: 0,
          lineStyle: {
            opacity: 0
          }
        },
        axisLabel: {
          interval: 0,
          fontSize: 8,
          color: '#999999'
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            opacity: 0
          }
        },
        splitLine: {
          lineStyle: {
            opacity: 0
          }
        },
        axisLabel: undefined,
        axisTick: undefined,
      },
      series: [{
        type: 'line',
        data: y,
      }, {
        name: '平均线',
        type: 'line',
        data: this.toArray(this.average, x.length),
        symbol: 'none',
        lineStyle: {
          type: 'dashed',
          color: '#999999',
          width: 1,
          opacity: 0.5
        }
      }, {
        name: '最大值',
        type: 'line',
        data: this.toArray(Math.max(...y), x.length),
        symbol: 'none',
        lineStyle: {
          color: '#999999',
          width: 1,
          opacity: 0.5
        }
      }]
    });
  }

  toArray(value: number, length: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < length; i++) {
      result.push(value);
    }
    return result;
  }

  mounted(): void {
    this.draw(this.groupByInterval());
  }

  @Watch('type')
  onTypeChange(): void {
    this.draw(this.groupByInterval());
  }

  @Watch('interval')
  onIntervalChange(): void {
    this.draw(this.groupByInterval());
  }


}
</script>

<style lang="scss" scoped>
header {
  box-shadow: -1px 0 1px 0 rgba(0, 0, 0, .6);
  padding-bottom: 16px;


  ::v-deep {
    .interval-tabs {

      display: flex;

      > ul {
        .interval-tabs-item {
          padding: 4px 44px;
          text-align: center;
        }
      }


    }
  }
}

.chart {
  padding: 6px 0;
  box-shadow: 0 0.3px .5px .3px rgba(0, 0, 0, .2);

  .caption {
    > span {
      display: block;
      padding: 8px 16px;
      font-size: 14px;
    }
  }

  .statistics {
    padding: 0 16px;
    color: #999999;

    .total {
      font-size: 14px;
    }

    .average {
      font-size: 12px;
      padding: 6px 0;
    }
  }


  #diagram {
    width: 100%;
    height: 150px;
  }
}

.ranking {
  display: flex;
  flex-direction: column;
  overflow: auto;

  .caption {
    padding: 8px 16px;
    font-size: 14px;
  }

  .items {
    flex-grow: 1;
    padding: 0 14px;
    display: flex;
    flex-direction: column;
    overflow: auto;

    > li {
      padding: 12px 0;
      display: flex;
      justify-content: space-between;

      > .item-info {
        display: flex;

        .icon {
          margin-right: 4px;
        }

        > span {
          &:last-child {
            margin-left: 24px;
          }
        }
      }
    }
  }
}
</style>
