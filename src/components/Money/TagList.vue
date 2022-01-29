<template>
  <ul class="tags"
      :class="{[classPrefix+'-tags']:classPrefix}"
  >
    <li v-for="(item,index) in tagList"
        class="tags-item"
        :key="index">
      <div class="tags-item-icon" :class="{'selected':item.name===selectedTag.name}"
           @click="changeSelectedTag(item)"
      >
        <Icon :name="item.name"
              :class-prefix="iconClass"/>

      </div>
      <span>{{ item.value }}</span>

    </li>
    <li v-if="dynamic" class="tags-item">
      <div class="tags-item-icon"
           @click="add"
      >
        <icon name="add"></icon>
      </div>
      <span>添加</span>

    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import Icon from '@/components/Icon.vue';
import {TagItem} from '@/custom';

@Component({
  components: {Icon}
})
export default class TagList extends Vue {
  @Prop({required: true, type: Object}) selectedTag?: TagItem;
  @Prop({required: true}) tagList!: TagItem[];
  @Prop({type: Boolean, default: false}) dynamic!: boolean;
  @Prop(String) iconClass?: string;
  @Prop(String) classPrefix?: string;

  changeSelectedTag(currentTag: TagItem): void {
    this.$emit('update:selectedTag', currentTag);
  }

  add(): void {
    this.$router.replace('/tags');
  }
}
</script>

<style lang="scss" scoped>
.tags {
  padding: 0 16px;
  display: flex;
  //flex-direction: row;
  flex-wrap: wrap;
  //align-content: flex-start;
  overflow: auto;

  &-item {
    width: 25%;
    padding: 12px 0;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &-icon {
      width: 48px;
      height: 48px;
      padding: 4px;
      border-radius: 50%;
      margin-bottom: 4px;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        width: 34px;
        height: 34px;
      }

      &.selected {
        border: 2px solid pink;


      }


    }
  }
}
</style>
