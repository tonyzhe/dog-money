<template>
  <div class="nav-wrapper">
    <div class="layout-content"
         :class="classPrefix&&`${classPrefix}-layout`"
    >
      <slot/>
    </div>

    <Nav></Nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import Nav from '@/components/Nav.vue';

@Component({
  components: {Nav}
})
export default class Layout extends Vue {
  @Prop(String) classPrefix?: string;
}
</script>

<style lang="scss" scoped>
.nav-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .layout-content {
    display: flex;
    height: 0;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;

  }


}
</style>
