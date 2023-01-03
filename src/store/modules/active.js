import appHelper from '@/helpers/AppHelper';
import { SET_LAST_ACTIVE_TIMESTAMP, SET_USER_ACTIVE } from '../mutation-types';

export const initActiveState = {
  timeout: 30 * 60 * 1000,
  lastActiveTimestamp: 0,
  userIsActive: false,
};

export default {
  state: {
    ...initActiveState,
  },
  mutations: {
    [SET_LAST_ACTIVE_TIMESTAMP](state, payload) {
      state.lastActiveTimestamp = payload;

      const active = appHelper.getCookie('active');

      if (active && atob(active) === 'true') {
        appHelper.setCookie('active', window.btoa('true'), { 'max-age': 60 * 30, SameSite: 'Strict' });
      }
    },
    [SET_USER_ACTIVE](state, payload) {
      state.userIsActive = payload;
    },
  },
  actions: {
    checkUserIsActive({ state, commit }) {
      return new Promise((resolve) => {
        if (state.userIsActive && new Date().getTime() - state.lastActiveTimestamp > state.timeout) {
          commit(SET_USER_ACTIVE, false);
          resolve(true);
        }
      });
    },
    setUserActive({ state, commit }) {
      commit(SET_LAST_ACTIVE_TIMESTAMP, new Date().getTime());
      if (!state.userIsActive) {
        commit(SET_USER_ACTIVE, true);
      }
    },
    startWatchUserActivity({ dispatch }) {
      window.addEventListener('mousemove', () => {
        dispatch('setUserActive');
      });
      window.addEventListener('keypress', () => {
        dispatch('setUserActive');
      });
      window.addEventListener('click', () => {
        dispatch('setUserActive');
      });
      dispatch('setUserActive');
    },
  },
};
