import {
  REMOVE_PARTICIPANTS_MEETING_STATE,
  ADD_PARTICIPANT,
  SET_RAISED_HAND_PARTICIPANT,
  ADD_SPEAKING_USER_ID,
  REMOVE_PARTICIPANT,
  REMOVE_SPEAKING_USER_ID,
  RESET_STATE,
  SET_CALL_TO_PARTICIPANT,
  SET_ENABLED_VIDEO_OF_CURRENT_USER,
  SET_ENABLED_AUDIO_OF_CURRENT_USER,
  SET_MEETING_INFO,
  SET_PARTICIPANTS,
  SET_PARTICIPANTS_MEETING_STATE,
  SET_RAISED_HAND_CURRENT_USER,
  SET_STREAM_TO_PARTICIPANT,
  SET_USER_STREAM,
  ADD_PARTICIPANTS_MEETING_STATE,
  STOP_USER_STREAM,
} from '@/store/mutations.type'
import meetingApi from '@/api/meeting.api'

const getDefaultState = () => {
  return {
    meetingStateOfCurrentUser: {
      isRaisedHand: false,
      enabledAudio: false,
      enabledVideo: false,
      isSpeaking: false,
    },
    userStream: null,
    participantsMeetingState: {}, // {userId: {isSpeaking, isRaisedHand, enabledAudio, enabledVideo}}
    speakingUserIds: [], //todo
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
    [SET_ENABLED_AUDIO_OF_CURRENT_USER](state, value) {
      state.meetingStateOfCurrentUser.enabledAudio = value
      if (state.userStream) {
        for (let track of state.userStream.getAudioTracks()) {
          track.enabled = value
        }
      }
    },

    [SET_ENABLED_VIDEO_OF_CURRENT_USER](state, value) {
      state.meetingStateOfCurrentUser.enabledVideo = value
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

    [SET_RAISED_HAND_CURRENT_USER](state, value) {
      state.meetingStateOfCurrentUser.isRaisedHand = value
    },

    [SET_RAISED_HAND_PARTICIPANT](state, payload) {
      const {userId, isRaisedHand} = {...payload}
      state.participantsMeetingState[userId].isRaisedHand = isRaisedHand
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

    [SET_PARTICIPANTS_MEETING_STATE](state, payload) {
      state.participantsMeetingState = payload
    },

    [ADD_PARTICIPANTS_MEETING_STATE](state, payload) {
      const {userId, meetingState} = {...payload}
      console.log(state.participantsMeetingState[userId])
      this._vm.$set(state.participantsMeetingState, userId, meetingState)

    },

    [REMOVE_PARTICIPANTS_MEETING_STATE](state, userId) {
      this._vm.$delete(state.participantsMeetingState, userId)
    }
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

    //todo
    fetchParticipantsMeetingState({ commit, state }, payload) {
      //todo: fetch
      console.log(payload)
      const participantsMeetingState = {}
      state.participants.forEach((participant) => {
        participantsMeetingState[participant.user.id] = {
          isSpeaking: false,
          isRaisedHand: false,
          enabledAudio: false,
          enabledVideo: false,
        }
      })
      console.log(participantsMeetingState)
      commit(SET_PARTICIPANTS_MEETING_STATE, participantsMeetingState)
    },

    setUserStream({ commit, state }, stream) {
      commit(SET_USER_STREAM, stream)
      commit(SET_ENABLED_AUDIO_OF_CURRENT_USER, state.meetingStateOfCurrentUser.enabledAudio)
      commit(SET_ENABLED_VIDEO_OF_CURRENT_USER, state.meetingStateOfCurrentUser.enabledVideo)
    },
  },
  getters: {
    getParticipantByPeerId: (state) => (peerId) => {
      return state.participants.find((x) => x.peerId === peerId)
    },
  },
}
export default meetings
