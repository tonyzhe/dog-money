<template>
  <layout>
    <tabs></tabs>
  </layout>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Layout from '@/components/Layout.vue';
import Tabs from '@/views/Money/Tabs.vue';

@Component({
  components: {Tabs, Layout}
})
export default class Money extends Vue {

}
</script>

<style lang="scss" scoped>

</style>
