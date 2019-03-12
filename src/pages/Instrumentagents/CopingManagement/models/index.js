import { queryRule } from '@/services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchquery({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'savequery',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savequery(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
