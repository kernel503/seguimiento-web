export default {
  namespaced: true,

  state: () => ({
    data: null,
    isAuthenticated: false,
  }),

  mutations: {
    setAuthenticationState(state, payload) {
      state.isAuthenticated = !!payload;
    },

    setData(state, payload) {
      state.data = payload;
    },
  },

  actions: {
    userIsAuthenticated({ commit }, state) {
      commit('setAuthenticationState', state);
    },

    userData({ commit }, data) {
      commit('setData', data);
    },

  },
  getters: { },
};
