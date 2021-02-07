import Vue from "vue";
import Vuex from "vuex";
import meeting from "./meeting.module"
import auth from "./auth.module"

Vue.use(Vuex);

let store = new Vuex.Store({
  modules: {
    meeting,
    auth
  }

});

export default store;
