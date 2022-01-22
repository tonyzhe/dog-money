<template>
  <nav>
    <router-link to="/bill" class="nav-item" active-class="selected">
      <Icon name="bill" class-prefix="navs"/>
      <span>账单</span>
    </router-link>
    <router-link to="/money" class="nav-item" active-class="selected">
      <Icon name="money" class-prefix="navs"/>
      <span>记一笔</span>
    </router-link>
    <router-link to="/chart" class="nav-item" active-class="selected">
      <Icon name="chart" class-prefix="navs"/>
      <span>图表</span>
    </router-link>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Icon from '@/components/Icon.vue';

@Component({
  components: {Icon}
})
export default class Nav extends Vue {

}
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  height: 8%;
  justify-content: space-between;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);

  .nav-item {

    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    padding: 3px;

    &.selected {
      background-color: pink;
    }


  }
}
</style>
