import Vue from 'vue';
import Vuex from 'vuex';
import {defaultExpenseTags} from '@/constants/defaultTags';
import {RecordItem, TagItem} from '@/custom';
import idCreator from '@/lib/idCreator';

Vue.use(Vuex);
type storeState = {
  tagList: TagItem[];
  tagError: '' | 'duplicate';
  recordList: RecordItem[]
}
const store = new Vuex.Store({
  state: {
    tagList: JSON.parse(window.localStorage.getItem('tag-list') || '0') || defaultExpenseTags,
    tagError: '',
    recordList: JSON.parse(window.localStorage.getItem('record-list') || '[]')
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
    },

    insertRecord(state, record: RecordItem) {
      record.id = idCreator();
      record.createAt = new Date();
      state.recordList.push(record);
      store.commit('saveRecord');
    },
    saveRecord(state) {
      window.localStorage.setItem('record-list', JSON.stringify(state.recordList));
    },
    fetchRecordList(state) {
      return state.recordList;
    },
  },
  actions: {},
  modules: {}
});

export default store;
