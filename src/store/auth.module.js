import authApi from "../api/auth.api";
import tokenService from "../services/token.service";
import { SET_CURRENT_USER, SET_ERROR, SET_LOADING, SET_TOKEN } from "./mutations.type";


const auth = {
  namespaced: true,

  state: {
    loading: false,
    error: "",
    token: tokenService || "",
    currentUser: null,
  },

  mutations: {
    [SET_LOADING](state, value) {
      state.loading = value;
    },

    [SET_TOKEN](state, token) {
      state.token = token;
    },

    [SET_CURRENT_USER](state, currentUser) {
      state.currentUser = currentUser;
    },

    [SET_ERROR](state, error) {
      state.error = error;
    },

  },

  actions: {
    async signIn({commit}, payload) {
      commit(SET_LOADING, true);
      commit(SET_ERROR, '');
      const {password, email} = {...payload};
      try {
        const response = await authApi.signIn(email, password);
        tokenService.setToken(response.data.token);
      } catch (error) {
        //todo: проверить ошибку чтобы записать текст
        console.log({error})

      } finally {
        commit(SET_LOADING, false)
      }
    },

    async signUp({commit}, payload) {
      commit(SET_LOADING, true);
      commit(SET_ERROR, '');
      try {
        await authApi.signUp(payload)
      } catch (error) {
        //todo: проверить ошибку чтобы записать текст
        console.log({error})
        commit(SET_ERROR, error)
      } finally {
        commit(SET_LOADING, false);
      }
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

