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
      <button>
        <icon name="delete"/>
      </button>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import Icon from '@/components/Icon.vue';

@Component({
  components: {Icon}
})
export default class Calculator extends Vue {
  @Prop({type: Number, default: 0}) output!: number;
  @Prop({required: true, type: String})
  note!: string;
  @Prop(String) classPrefix?: string;

  buttonList: string[] = [
    '1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '完成', '.', '0'
  ];

  writeNote(note: string): void {
    this.$emit('update:note', note);
  }
  handle(name:string):void{
    if(name==='完成'){
      this.$emit('submit')
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
