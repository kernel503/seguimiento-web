import Vue from 'vue';
import Vuex from 'vuex';
import user from './user';
import withPaginationAndTrashed from './withPaginationAndTrashed';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    withPaginationAndTrashed,
  },
});
