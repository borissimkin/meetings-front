import Vue from "vue";
import Vuex from "vuex";
import meeting from "./meeting.module"

Vue.use(Vuex);

let store = new Vuex.Store({
  modules: {
    meeting
  }

});

export default store;
