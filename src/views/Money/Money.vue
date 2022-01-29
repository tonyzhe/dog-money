<template>
  <layout>
    <tabs :tabs="[{name:'支出',value:'-'},{name:'收入',value:'+'}]"
          :current-tab.sync="record.type"/>
    <tag-list v-if="record.type==='-'"
              :tag-list="tagList"
              :selectedTag.sync="record.tag"
              :dynamic=true
              icon-class="money"
    />
    <tag-list v-if="record.type==='+'"
              :selected-tag.sync="record.tag" :tag-list="incomeTags"
              icon-class="money"
    />
  </layout>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Watch} from 'vue-property-decorator';
import Layout from '@/components/Layout.vue';
import Tabs from '@/views/Money/Tabs.vue';
import TagList from '@/components/Money/TagList.vue';
import {RecordItem, TagItem} from '@/custom';
import {defaultIncomeTags} from '@/constants/defaultTags';

@Component({
  components: {TagList, Tabs, Layout}
})
export default class Money extends Vue {
  record: RecordItem = this.initRecord();
  incomeTags = defaultIncomeTags;

  get tagList(): TagItem[] {
    return this.$store.state.tagList;
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


}
</script>

<style lang="scss" scoped>
::v-deep .money-icons {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
