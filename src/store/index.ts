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
  currentRecord: RecordItem | undefined
}
const store = new Vuex.Store({
  state: {
    tagList: JSON.parse(window.localStorage.getItem('tag-list') || '0') || defaultExpenseTags,
    tagError: '',
    recordList: JSON.parse(window.localStorage.getItem('record-list') || '[]'),
    currentRecord: undefined
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
    findRecord(state, id: number) {
      const record = state.recordList.filter(item => item.id === id)[0];
      if (record) {
        state.currentRecord = record;
      }
    },
    updateRecord(state, payload: { id: number, record: RecordItem }) {
      const {id, record} = payload;
      // console.log(record);

      for (let i = 0; i < state.recordList.length; i++) {

        if (state.recordList[i].id === id) {
          state.recordList[i] = record;
          break;
        }
      }
      store.commit('saveRecord');
    },
  },
  actions: {},
  modules: {}
});

export default store;
