<template>
  <div :class="classPrefix&&`${classPrefix}-datePicker`">
    <select v-model=" year
  ">
      <option v-for="year in years" :key="year" :value="year">{{ year }}年</option>
    </select>
    <select v-model="month">
      <option v-for="m in 12" :key="m" :value="m">{{ beautifyMonth(m) }}月</option>
    </select>
    <select v-model="day">
      <option v-for="d in days" :key="d" :value="d">{{ beautifyMonth(d) }}日</option>
    </select>


  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';
import dayjs from 'dayjs';
import {mixins} from 'vue-class-component';
import Bill from '@/views/Bill/Bill.vue';

@Component
export default class DatePicker extends mixins<Vue>(Bill) {
  @Prop({required: true}) readonly initialDate!: Date;
  @Prop(String) classPrefix?: string;
  year = dayjs(this.initialDate).year();
  month = dayjs(this.initialDate).month() + 1;
  day = dayjs(this.initialDate).date();

  get days(): number {
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (this.year % 400 === 0 || (this.year % 4 === 0 && this.year % 100 !== 0)) {
      if (this.month === 2) {
        return monthDays[this.month] + 1;
      } else {
        return monthDays[this.month - 1];
      }
    } else {
      return monthDays[this.month - 1];
    }
  }

  @Watch('year')
  onYearChange(value: number): void {
    const newDate = dayjs(this.initialDate).year(value).toDate();
    this.$emit('update:initialDate', newDate);
  }

  @Watch('month')
  onMonthChange(value: number): void {
    const newDate = dayjs(this.initialDate).month(value - 1).toDate();

    this.$emit('update:initialDate', newDate);
  }

  @Watch('day')
  onDayChange(value: number): void {
    const newDate = dayjs(this.initialDate).date(value).toDate();

    this.$emit('update:initialDate', newDate);
  }


}
</script>

<style lang="scss" scoped>

</style>
