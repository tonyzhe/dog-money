<template>
  <layout class-prefix="money">
    <tabs :tabs="[{name:'支出',value:'-'},{name:'收入',value:'+'}]"
          :current-tab.sync="record.type"
          class-prefix="money"
    />
    <div class="tag-list">
      <tag-list v-if="record.type==='-'"
                :tag-list="tagList"
                :selectedTag.sync="record.tag"
                :dynamic=true
                icon-class="money"
                class-prefix="money"
      />
      <tag-list v-if="record.type==='+'"
                :selected-tag.sync="record.tag" :tag-list="incomeTags"
                icon-class="money"
                class-prefix="money"
      />
    </div>

    <Calculator :amount.sync="record.amount" :note.sync="record.note" class-prefix="money"
                @submit="saveRecord"
    />
    <div v-if="isQrcode&&shutdown" class="qrcode">
      <button @click="shutdown=!shutdown">关闭</button>
      <img :src="qrcode" alt="">
    </div>

  </layout>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Watch} from 'vue-property-decorator';
import Layout from '@/components/Layout.vue';
import Tabs from '@/components/Money/Tabs.vue';
import TagList from '@/components/Money/TagList.vue';
import {RecordItem, TagItem} from '@/custom';
import {defaultIncomeTags} from '@/constants/defaultTags';
import Calculator from '@/components/Money/Calculator.vue';

const qrcode = require('@/assets/qrcode.png');
@Component({
  components: {Calculator, TagList, Tabs, Layout}
})
export default class Money extends Vue {
  record: RecordItem = this.initRecord();
  incomeTags = defaultIncomeTags;
  qrcode = qrcode;
  shutdown = true;
  clientWidth = document.documentElement.clientWidth;

  mounted(): void {
    if (this.clientWidth > 500) {
      window.alert('已检测到您可能使用电脑浏览,推荐扫码手机浏览效果更佳哦~');
    }
  }

  get isQrcode(): boolean {
    return document.documentElement.clientWidth > 500;
  }

  get tagList(): TagItem[] {
    return this.$store.state.tagList;
  }

  get recordList(): RecordItem[] {
    return this.$store.state.recordList;
  }

  initRecord(): RecordItem {
    return {tag: {name: 'food', value: '餐饮'}, type: '-', note: '', amount: 0};
  }

  @Watch('record.type')
  onTypeChange(value: '-' | '+'): void {
    if (value === '+') {
      this.record.tag = {name: 'bonus', value: '奖金'};
    } else if (value === '-') {
      this.record.tag = {name: 'food', value: '餐饮'};
    }
  }

  saveRecord(): void {
    this.$store.commit('insertRecord', this.record);
    this.record = this.initRecord();
    this.$router.replace('/bill');
  }


}
</script>
<style>
</style>
<style lang="scss" scoped>
::v-deep {
  .money-icons {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .money-tags {
    flex-grow: 1;
  }

  .money-tabs {
    margin-bottom: 10px;
  }


  .tag-list {
    flex-grow: 1;
    overflow: auto;
    border-top: 1px solid #dddddd;
  }

  .qrcode {
    position: fixed;
    background: #fff;
    left: 50%;
    transform: translateX(-50%);
    top: 35%;

    > button {
      position: absolute;
      right: 6px;


    }

    > img {
      margin-top: 12px;
    }
  }
}
</style>
