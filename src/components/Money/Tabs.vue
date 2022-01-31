<template>
  <div class="header-wrapper">
    <div></div>
    <div class="switches">
      <ul>
        <li v-for="(item,index) in tabs" :key="index"
            :class="{'selected': currentTab===item.value}"
            @click="selectedTab(item.value)"
        >{{
            item.name
          }}
        </li>
      </ul>
    </div>
    <div class="cancel" @click="cancel">
      <Icon name="cancel" class-prefix="tab"></Icon>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import Icon from '@/components/Icon.vue';
import {TabBar} from '@/custom';

@Component({
  components: {Icon}
})
export default class Tabs extends Vue {
  @Prop({required: true, type: String}) currentTab!: '-' | '+';
  @Prop({required: true, type: Array}) tabs!: TabBar[];

  selectedTab(tabValue: '-' | '+'): void {
    this.$emit('update:currentTab', tabValue);
  }

  cancel(): void {
    this.$router.replace('/bill');
  }

}
</script>

<style lang="scss" scoped>
.header-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);

  .switches {
    > ul {
      display: flex;
      border: 1px solid #ffa8f2;
      border-radius: 5px;

      li {
        font-size: 14px;
        color: pink;
        padding: 8px 15px;

        &.selected {
          color: #fff;
          background-color: pink;
        }
      }
    }
  }

  .cancel {
    display: flex;
    flex-direction: column-reverse;
    transform: translateX(-20px);
  }
}

</style>
