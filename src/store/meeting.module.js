import {
  ADD_SPEAKING_USER_ID,
  REMOVE_SPEAKING_USER_ID,
  SET_ENABLED_MICRO,
  SET_ENABLED_VIDEO,
  SET_USER_STREAM,
  STOP_USER_STREAM,
} from '@/store/mutations.type'

//todo: здесь потом еще будет говорит он или нет
const meetings = {
  namespaced: true,
  state: {
    enabledMicro: true,
    enabledVideo: true,
    userStream: null,
    speakingUserIds: [],
  },

  mutations: {
    [SET_ENABLED_MICRO](state, value) {
      state.enabledMicro = value
      if (state.userStream) {
        for (let track of state.userStream.getAudioTracks()) {
          track.enabled = value
        }
      }
    },

    [SET_ENABLED_VIDEO](state, value) {
      state.enabledVideo = value
      if (state.userStream) {
        for (let track of state.userStream.getVideoTracks()) {
          track.enabled = value
        }
      }
    },

    [SET_USER_STREAM](state, stream) {
      state.userStream = stream
    },

    [STOP_USER_STREAM](state) {
      state.userStream.getTracks().forEach(function (track) {
        if (track.readyState === 'live') {
          track.stop()
        }
      })
    },

    [ADD_SPEAKING_USER_ID](state, userId) {
      state.speakingUserIds.push(userId)
    },

    [REMOVE_SPEAKING_USER_ID](state, userId) {
      const index = state.speakingUserIds.indexOf(userId)
      if (index > -1) {
        state.speakingUserIds.splice(index, 1)
      }
    },
  },
  actions: {
    setUserStream({ commit, state }, stream) {
      commit(SET_USER_STREAM, stream)
      commit(SET_ENABLED_MICRO, state.enabledMicro)
      commit(SET_ENABLED_VIDEO, state.enabledVideo)
    },
  },
}
export default meetings
