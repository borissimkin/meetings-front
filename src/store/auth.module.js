import authApi from "../api/auth.api";
import profileApi from "../api/profile.api"
import tokenService from "../services/token.service";
import { SET_CURRENT_USER, SET_TOKEN, SET_ERROR, SET_LOADING } from "./mutations.type";


const auth = {
  namespaced: true,

  state: {
    token: tokenService.getToken() || "",
    currentUser: {},
    loading: false,
    error: false
  },

  mutations: {
    [SET_TOKEN](state, token) {
      state.token = token;
    },

    [SET_CURRENT_USER](state, currentUser) {
      state.currentUser = currentUser;
    },

    [SET_ERROR](state, value) {
      state.error = value;
    },

    [SET_LOADING](state, value) {
      state.loading = value;
    }

  },

  actions: {
    async signIn({commit}, payload) {
      const {password, email} = {...payload};
      const response = await authApi.signIn(email, password);
      tokenService.setToken(response.data.token);
      commit(SET_TOKEN, response.data.token);
    },

    async fetchCurrentUser({commit}) {
      //todo: а зачем мне эти флаги?
      commit(SET_LOADING, true)
      commit(SET_ERROR, false)
      try {
        const response = await profileApi.getCurrentUser();
        commit(SET_CURRENT_USER, response.data)
      } catch (error) {
        commit(SET_ERROR, true)
      } finally {
        commit(SET_LOADING, false)
      }

    },

    logout({commit}) {
      commit(SET_TOKEN, "");
      commit(SET_CURRENT_USER, {})
      tokenService.removeToken();
    }

  },

  getters: {
    isLoggedIn: state => !!state.token
  }

}
export default auth

