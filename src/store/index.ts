import Vue from 'vue';
import Vuex from 'vuex';
import {defaultExpenseTags} from '@/constants/defaultTags';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tagList: JSON.parse(window.localStorage.getItem('tag-list') || '0') || defaultExpenseTags,
  },
  mutations: {},
  actions: {},
  modules: {}
});
