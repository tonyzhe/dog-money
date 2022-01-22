<template>
  <layout>
    <p>我是Chart组件</p>
  </layout>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Nav from '@/components/Nav.vue';
import Layout from '@/components/Layout.vue';

@Component({
  components: {Layout, Nav}
})
export default class Chart extends Vue {

}
</script>

<style lang="scss" scoped>

</style>
