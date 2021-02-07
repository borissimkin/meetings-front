import authApi from "../api/auth.api";
import tokenService from "../services/token.service";
import { SET_CURRENT_USER, SET_TOKEN } from "./mutations.type";


const auth = {
  namespaced: true,

  state: {
    token: tokenService.getToken() || "",
    currentUser: null,
  },

  mutations: {
    [SET_TOKEN](state, token) {
      state.token = token;
    },

    [SET_CURRENT_USER](state, currentUser) {
      state.currentUser = currentUser;
    },

  },

  actions: {
    async signIn({commit}, payload) {
      const {password, email} = {...payload};
      const response = await authApi.signIn(email, password);
      tokenService.setToken(response.data.token);
      commit(SET_TOKEN, response.data.token);

    },

    async signUp(payload) {
      await authApi.signUp(payload)

    },

    logout({commit}) {
      commit(SET_TOKEN, "");
      tokenService.removeToken();
    }

  },

  getters: {
    isLoggedIn: state => !!state.token
  }

}
export default auth

