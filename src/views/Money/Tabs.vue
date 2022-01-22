<template>
  <div class="header-wrapper">
    <div></div>
    <div class="switches">
      <ul>
        <li>支出</li>
        <li>收入</li>
      </ul>
    </div>
    <div class="cancel">
      <Icon name="cancel" class-prefix="tab"></Icon>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Icon from '@/components/Icon.vue';

@Component({
  components: {Icon}
})
export default class Tabs extends Vue {

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
