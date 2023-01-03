import { UPDATE_SORT } from '../mutation-types';

export const initPaginState = {
  size: 50,
  filter: {},
  sortBy: '',
  sortDirect: 'desc',
  page: 0,
  online: '',
  searched: '',
};

export default {
  state: {
    ...initPaginState,
  },
  mutations: {
    [UPDATE_SORT](state, payload) {
      state.sortBy = payload.sortBy;
      state.sortDirect = payload.sortDirect;
    },
  },
};
