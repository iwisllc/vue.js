import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import createMutationsSharer from 'vuex-shared-mutations';

import user, { initUserState } from './modules/user';
import pagin, { initPaginState } from './modules/pagin';
import active, { initActiveState } from './modules/active';

import {
 CLEAR_ALL,
 SET_STATE,
 CLEAR_PAGIN,
 SET_USER_ACTIVE,
 CLEAR_SALARY,
 SET_LAST_ACTIVE_TIMESTAMP,
 SET_MODULE_STATE,
 UPDATE_STATE,
} from './mutation-types';

Vue.use(Vuex);

let menuInit = initMenu;

if (location.hostname.includes('prod')) {
 menuInit = initMenuShort;
}

export default new Vuex.Store({
 plugins: [
  createPersistedState(),
  createMutationsSharer({
   predicate: [SET_LAST_ACTIVE_TIMESTAMP, SET_USER_ACTIVE, CLEAR_ALL],
  }),
 ],
 mutations: {
  [CLEAR_ALL](state) {
   state.user = new initUserState();
   state.pagin = { ...initPaginState };
   state.active = { ...initActiveState };
   localStorage.clear();
  },
  [SET_STATE](state, payload) {
   state[payload.module][payload.state] = payload.data;
  },
  [UPDATE_STATE](state, payload) {
   let data = { ...state[payload.module][payload.state], ...payload.data };
   state[payload.module][payload.state] = data;
  },
  [SET_MODULE_STATE](state, { module, data }) {
   state[module] = { ...state[module], ...data };
  },
  [CLEAR_PAGIN](state) {
   state.pagin = { ...initPaginState };
  },
 },
 modules: {
  user,
  pagin,
  active,
 },
});
