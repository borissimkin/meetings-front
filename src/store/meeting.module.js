import {
  ADD_PARTICIPANT,
  ADD_RAISED_HAND_USER_ID,
  ADD_SPEAKING_USER_ID,
  REMOVE_PARTICIPANT,
  REMOVE_RAISED_HAND_USER_ID,
  REMOVE_SPEAKING_USER_ID,
  RESET_STATE,
  SET_CALL_TO_PARTICIPANT,
  SET_ENABLED_MICRO,
  SET_ENABLED_VIDEO,
  SET_MEETING_INFO,
  SET_PARTICIPANTS,
  SET_RAISED_HAND_USER_IDS,
  SET_STREAM_TO_PARTICIPANT,
  SET_USER_STREAM,
  STOP_USER_STREAM,
} from '@/store/mutations.type'
import meetingApi from '@/api/meeting.api'

const getDefaultState = () => {
  return {
    enabledMicro: true,
    enabledVideo: true,
    userStream: null,
    speakingUserIds: [],
    raisedHandUserIds: [],
    participants: [],
    meetingInfo: {
      id: 0,
      creatorId: 0,
      createdAt: '',
      endTime: '',
      hashId: '',
      isCheckListeners: false,
      isExam: false,
      name: '',
      roomId: 0,
      startDate: '',
      startTime: '',
    },
  }
}

const meetings = {
  namespaced: true,
  state: getDefaultState(),

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

    [SET_RAISED_HAND_USER_IDS](state, userIds) {
      state.raisedHandUserIds = userIds
    },

    [ADD_RAISED_HAND_USER_ID](state, userId) {
      state.raisedHandUserIds.push(userId)
    },

    [REMOVE_RAISED_HAND_USER_ID](state, userId) {
      const index = state.raisedHandUserIds.indexOf(userId)
      if (index > -1) {
        state.raisedHandUserIds.splice(index, 1)
      }
    },

    [SET_PARTICIPANTS](state, participants) {
      state.participants = participants
    },

    [ADD_PARTICIPANT](state, participant) {
      state.participants.push(participant)
    },

    [REMOVE_PARTICIPANT](state, userId) {
      const indexParticipant = state.participants.findIndex((participant) => {
        return participant.user.id === userId
      })
      state.participants.splice(indexParticipant, 1)
    },

    [SET_STREAM_TO_PARTICIPANT](state, payload) {
      const { stream, userId } = { ...payload }
      console.log(state.participants)
      const participant = state.participants.find((x) => x.user.id === userId)
      this._vm.$set(participant, 'stream', stream)
    },

    [SET_CALL_TO_PARTICIPANT](state, payload) {
      const { userId, call } = { ...payload }
      const participant = state.participants.find((x) => x.user.id === userId)
      this._vm.$set(participant, 'call', call)
    },

    [SET_MEETING_INFO](state, meeting) {
      state.meetingInfo = meeting
    },

    [RESET_STATE](state) {
      Object.assign(state, getDefaultState())
    },
  },
  actions: {
    async fetchParticipants({ commit }, payload) {
      let response = await meetingApi.getPeers(payload.meetingId)
      commit(SET_PARTICIPANTS, response.data)
    },

    async fetchMeetingInfo({ commit }, payload) {
      const response = await meetingApi.getMeetingInfo(payload.meetingId)
      commit(SET_MEETING_INFO, response.data)
    },

    setUserStream({ commit, state }, stream) {
      commit(SET_USER_STREAM, stream)
      commit(SET_ENABLED_MICRO, state.enabledMicro)
      commit(SET_ENABLED_VIDEO, state.enabledVideo)
    },
  },
  getters: {
    getParticipantByPeerId: (state) => (peerId) => {
      return state.participants.find((x) => x.peerId === peerId)
    },
  },
}
export default meetings
