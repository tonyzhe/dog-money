import Vue from 'vue';
import Vuex from 'vuex';
import {defaultExpenseTags} from '@/constants/defaultTags';
import {TagItem} from '@/custom';

Vue.use(Vuex);
type storeState = {
  tagList: TagItem[];
  tagError: '' | 'duplicate'
}
const store = new Vuex.Store({
  state: {
    tagList: JSON.parse(window.localStorage.getItem('tag-list') || '0') || defaultExpenseTags,
    tagError: ''
  } as storeState,
  mutations: {
    insertTag(state, tag: TagItem) {
      state.tagError = '';
      const names = state.tagList.map(item => item.name);
      if (names.indexOf(tag.name) >= 0) {
        state.tagError = 'duplicate';
        return;
      } else {
        state.tagList.push(tag);
        store.commit('saveTag');
      }
    },
    saveTag(state) {
      window.localStorage.setItem('tag-list', JSON.stringify(state.tagList));
    }
  },
  actions: {},
  modules: {}
});

export default store;
