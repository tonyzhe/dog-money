<template>
  <div class="nav-wrapper">
    <div class="layout-content">
      <slot/>
    </div>

    <Nav></Nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Nav from '@/components/Nav.vue';

@Component({
  components: {Nav}
})
export default class Layout extends Vue {

}
</script>

<style lang="scss" scoped>
.nav-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .layout-content {
    flex-grow: 1;

  }


}
</style>
