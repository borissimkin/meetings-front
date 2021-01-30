import {
  SET_MY_AUDIO,
  SET_MY_VIDEO,
} from "@/store/mutations.type";

//todo: здесь потом еще будет говорит он или нет
const state = {
  myAudio: false,
  myVideo: false,
};

const getters = {

};

const actions = {
  //todo: передавать ли всем остальныи что он выключил?

};

const mutations = {
  [SET_MY_VIDEO](state, value) {
    state.myVideo = value;
  },

  [SET_MY_AUDIO](state, value) {
    state.myAudio = value;
  },

};

export default {
  state,
  getters,
  actions,
  mutations
}