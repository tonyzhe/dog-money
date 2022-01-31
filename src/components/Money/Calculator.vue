<template>
  <div class="calculator"
       :class="classPrefix&&`${classPrefix}-calculator`"
  >
    <label class="note">
      <icon name="note"></icon>
      <span>备注:</span>
      <input type="text" placeholder="写点备注吧~" :value="note" @input="writeNote($event.target.value)">
    </label>
    <div class="output">{{ output }}</div>
    <div class="numberPad clear-fix">
      <button v-for="(item,index) in buttonList" :key="index"
              :class="item==='完成'&& 'ok'"
              @click="handle(item)"
      >{{ item }}
      </button>
      <button @click="remove">
        <icon name="delete"/>
      </button>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';
import Icon from '@/components/Icon.vue';

@Component({
  components: {Icon}
})
export default class Calculator extends Vue {
  @Prop({type: Number, default: 0}) amount!: number;
  @Prop({required: true, type: String})
  note!: string;
  @Prop(String) classPrefix?: string;

  buttonList: string[] = [
    '1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '完成', '.', '0'
  ];
  output = '0';
  dot = true;
  //有效数字最多为.前6为,点后两位
  validNumberBeforeDot = 6;
  validNumberAfterDot = 2;
  //记录运算
  beforeNumber = 0;
  beforeIndex = 0;
  operator = '';


  writeNote(note: string): void {
    this.$emit('update:note', note);
  }

  handle(name: string): void {
    if (name === '完成') {
      this.complete();
    } else {
      this.handleInput(name);
    }
  }

  complete(): void {
    const last = this.output.slice(-1);
    if ((this.output.indexOf('+') >= 0 || this.output.indexOf('-')) && '+-'.indexOf(last) < 0) {
      this.calculate();
      this.beforeNumber = this.handleError(this.beforeNumber);

    } else {
      this.beforeNumber = parseFloat(this.output);
    }
    this.$emit('update:amount', this.beforeNumber);
    this.output = '0';
    this.$emit('submit');
  }

  //处理误差
  handleError(value: number): number {
    const integer = value.toString().split('.')[0];
    let decimal = value.toString().split('.')[1];
    let wholeNumber: string;
    if (decimal) {
      // 有效位
      const index = decimal.indexOf('999999');
      if (index >= 0) {
        decimal = decimal.slice(0, index);
        const last = decimal.slice(-1);
        decimal = decimal.slice(0, -1) + (parseInt(last) + 1).toString();

      }
      if (decimal.length > 2) {
        decimal = decimal.slice(0, 2); // 只保留2位
      }
      wholeNumber = [integer, decimal].join('.');
    } else {
      wholeNumber = integer;
    }
    return parseFloat(wholeNumber);
  }

  handleInput(name: string): void {
    //最大不能超过21位
    if (this.output.length >= 21) {
      return;
    }
    //数字不能以0开头(除了小数)
    if (this.output === '0') {
      if ('0123456789'.indexOf(name) >= 0) {
        this.output = name;
        this.validNumberBeforeDot -= 1;
        return;
      } else if (name === '.') {
        this.output += name;
        this.dot = false;
        return;

      }
    }
    //处理输入的数字
    if ('0123456789'.indexOf(name) >= 0) {
      return this.handleNumber(name);
    }
    //处理别的情况下输入为.
    if (name === '.') {
      return this.handleDot();
    }
    //处理operator
    if ('+-'.indexOf(name) >= 0) {
      return this.handleOperator(name);
    }


  }

  handleOperator(operator: string): void {
    //获取output最后一个字符,识别不合法的输入
    const last = this.output.slice(-1);
    //不合法输入,因为连续两次输入
    if ('+-.'.indexOf(last) >= 0) {
      return;
    } else {
      if (this.operator === '') {
        //记录运算前的数
        this.beforeNumber = parseFloat(this.output);
        this.operator = operator;
        this.output += operator;
        this.beforeIndex = this.output.length;
        return;
      } else {
        //对上一个表达式进行运算
        this.calculate();
        this.operator = operator;
        this.reset();
        this.beforeNumber = this.handleError(this.beforeNumber);
        this.output = this.beforeNumber.toString() + operator;
        this.beforeIndex = this.output.length;
        return;

      }
    }
  }

  reset(): void {
    this.dot = true;
    this.validNumberBeforeDot = 6;
    this.validNumberAfterDot = 2;
  }

  handleNumber(name: string): void {
    if (this.dot && this.validNumberBeforeDot > 0) {
      this.output += name;
      this.validNumberBeforeDot -= 1;
    } else if (!this.dot && this.validNumberAfterDot > 0) {
      this.output += name;
      this.validNumberAfterDot -= 1;
    }
  }

  handleDot(): void {
    if (this.dot) {
      this.output += '.';
      this.dot = false;
    }
  }

  calculate(): void {
    const afterNumber = parseFloat(this.output.slice(this.beforeIndex));
    if (this.operator === '+') {
      this.beforeNumber = this.beforeNumber + afterNumber;
    } else if (this.operator === '-') {
      this.beforeNumber = this.beforeNumber - afterNumber;
    }

  }

  remove(): void {
    if (this.output.length > 1) {
      const last = this.output.slice(-1);
      if (last === '.') {
        this.dot = true;
      } else if ('+-'.indexOf(last) >= 0) {
        this.operator = '';
      } else if ('0123456789'.indexOf(last) >= 0) {
        if (this.dot) {
          this.validNumberBeforeDot += 1;
        } else {
          this.validNumberAfterDot += 1;
        }

      }
      this.output = this.output.slice(0, -1);

    } else {
      this.output = '0';
      this.reset();
    }
  }

  @Watch('operator')
  onOperatorChange(val: string): void {
    //操作符被删除
    if (val === '') {
      //重置dot以及validNumber状态
      if (this.beforeNumber.toString().indexOf('.')) {
        this.dot = false;
        const integer = this.beforeNumber.toString().split('.')[0];
        const decimal = this.beforeNumber.toString().split('.')[1];
        this.validNumberBeforeDot = 6 - integer.length;
        this.validNumberAfterDot = 2 - decimal.length;
      } else {
        this.dot = true;
        this.validNumberBeforeDot = 6 - this.beforeNumber.toString().length;
        this.validNumberAfterDot = 2;
      }
    } else {
      this.reset();
    }
  }


}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/style.scss";

.calculator {
  .note {
    display: flex;
    padding: 4px 8px;
    box-shadow: -2px -1px 1px -1px rgba(0, 0, 0, 0.3);
    font-size: 14px;
    align-items: center;

    input {
      flex-grow: 1;
      margin-left: 8px;
      height: 32px;

    }
  }

  .output {
    text-align: end;
    padding: 6px 18px;
    font-size: 24px;
    color: #fff;
    background-image: -moz-linear-gradient(135deg, rgb(255, 229, 168), rgb(253, 199, 255));

    background-image: -webkit-linear-gradient(135deg, rgb(255, 229, 168), rgb(253, 199, 255));

    background-image: linear-gradient(135deg, rgb(255, 229, 168), rgb(253, 199, 255));
  }

  .numberPad {
    @extend %clear-fix;

    button {
      $bg: #ffc7c8;

      float: left;
      $h: 56px;
      width: 25%;
      height: $h;
      font-size: 16px;
      color: #f5f5f5;

      &.ok {
        float: right;
        height: $h*2;
        background: darken($bg, 3*6%);

      }


      &:nth-child(1) {
        background: $bg;
      }

      &:nth-child(2), &:nth-child(5) {
        background: darken($bg, 3%);
      }

      &:nth-child(3), &:nth-child(6), &:nth-child(9) {
        background: darken($bg, 3*2%);
      }

      &:nth-child(4), &:nth-child(7), &:nth-child(10), &:nth-child(13) {
        background: darken($bg, 3*3%);
      }

      &:nth-child(8), &:nth-child(11), &:nth-child(14) {
        background: darken($bg, 3*4%);
      }

      &:nth-child(15) {
        background: darken($bg, 3*5%);

      }
    }
  }
}
</style>
