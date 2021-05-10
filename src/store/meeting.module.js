import {
  REMOVE_PARTICIPANTS_MEETING_STATE,
  ADD_PARTICIPANT,
  SET_RAISED_HAND_PARTICIPANT,
  SET_IS_SPEAKING_CURRENT_USER,
  REMOVE_PARTICIPANT,
  SET_IS_SPEAKING_PARTICIPANT,
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
  SET_ENABLED_VIDEO_PARTICIPANT,
  SET_ENABLED_AUDIO_PARTICIPANT,
  SET_ONLINE_PARTICIPANT,
  SET_CHECKPOINTS,
  ADD_CHECKPOINT,
  ADD_USER_ID_TO_CHECKPOINT,
  SET_NORMAL_MODE_SHOW_VIDEOS,
  SET_MEETING_PERMISSIONS,
  ADD_MEETING_PERMISSIONS,
  EDIT_MEETING_PERMISSIONS,
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
    participants: [],
    checkpoints: [],
    permissions: [],
    normalModeShowVideos: true,
    meetingInfo: {
      id: 0,
      creator: {
        id: 0,
        firstName: '',
        lastName: '',
      },
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
      if (!state.userStream) {
        return
      }
      state.userStream.getTracks().forEach(function (track) {
        if (track.readyState === 'live') {
          track.stop()
        }
      })
    },

    [SET_IS_SPEAKING_CURRENT_USER](state, value) {
      state.meetingStateOfCurrentUser.isSpeaking = value
    },

    [SET_IS_SPEAKING_PARTICIPANT](state, payload) {
      const { userId, isSpeaking } = { ...payload }
      state.participantsMeetingState[userId].isSpeaking = isSpeaking
    },

    [SET_RAISED_HAND_CURRENT_USER](state, value) {
      state.meetingStateOfCurrentUser.isRaisedHand = value
    },

    [SET_RAISED_HAND_PARTICIPANT](state, payload) {
      const { userId, isRaisedHand } = { ...payload }
      state.participantsMeetingState[userId].isRaisedHand = isRaisedHand
    },

    [SET_ENABLED_AUDIO_PARTICIPANT](state, payload) {
      const { userId, enabledAudio } = { ...payload }
      state.participantsMeetingState[userId].enabledAudio = enabledAudio
    },

    [SET_ENABLED_VIDEO_PARTICIPANT](state, payload) {
      const { userId, enabledVideo } = { ...payload }
      state.participantsMeetingState[userId].enabledVideo = enabledVideo
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
      const participant = state.participants.find((x) => x.user.id === userId)
      this._vm.$set(participant, 'stream', stream)
    },

    [SET_CALL_TO_PARTICIPANT](state, payload) {
      const { userId, call } = { ...payload }
      const participant = state.participants.find((x) => x.user.id === userId)
      this._vm.$set(participant, 'call', call)
    },

    [SET_ONLINE_PARTICIPANT](state, payload) {
      const { userId, online } = { ...payload }
      const participant = state.participants.find((x) => x.user.id === userId)
      if (participant) {
        participant.online = online
      }
    },

    [SET_MEETING_INFO](state, meeting) {
      state.meetingInfo = meeting
    },

    [RESET_STATE](state) {
      Object.assign(state, getDefaultState())
    },

    [SET_PARTICIPANTS_MEETING_STATE](state, payload) {
      Object.entries(payload).forEach(([key]) => (payload[key].isSpeaking = false))
      state.participantsMeetingState = payload
    },

    [SET_CHECKPOINTS](state, payload) {
      state.checkpoints = payload
    },

    [ADD_CHECKPOINT](state, checkpoint) {
      state.checkpoints.push(checkpoint)
    },

    [ADD_USER_ID_TO_CHECKPOINT](state, payload) {
      const { userId, checkpointId } = { ...payload }
      const checkpoint = state.checkpoints.find((checkpoint) => checkpoint.id === checkpointId)
      checkpoint.userIds.push(userId)
    },

    [ADD_PARTICIPANTS_MEETING_STATE](state, payload) {
      const { userId, meetingState } = { ...payload }
      meetingState.isSpeaking = false
      this._vm.$set(state.participantsMeetingState, userId, meetingState)
    },

    [REMOVE_PARTICIPANTS_MEETING_STATE](state, userId) {
      this._vm.$delete(state.participantsMeetingState, userId)
    },

    [SET_NORMAL_MODE_SHOW_VIDEOS](state, value) {
      state.normalModeShowVideos = value
    },

    [SET_MEETING_PERMISSIONS](state, permissions) {
      state.permissions = permissions
    },

    [ADD_MEETING_PERMISSIONS](state, userPermissions) {
      state.permissions.push(userPermissions)
    },

    [EDIT_MEETING_PERMISSIONS](state, payload) {
      const { userId, ...permissions } = { ...payload }
      const userPermission = state.permissions.find((x) => x.userId === userId)
      if (userPermission) {
        Object.entries(userPermission).forEach(([key]) => {
          userPermission[key] = permissions[key]
        })
      }
    },
  },
  actions: {
    async fetchParticipants({ commit }, payload) {
      const response = await meetingApi.getAllParticipants(payload.meetingId)
      commit(SET_PARTICIPANTS, response.data)
    },

    async fetchPermissions({ commit }, payload) {
      const response = await meetingApi.getMeetingPermissions(payload.meetingId)
      console.log({ response })
      commit(SET_MEETING_PERMISSIONS, response.data)
    },

    async fetchCheckpoints({ commit }, payload) {
      const response = await meetingApi.getCheckpoints(payload.meetingId)
      commit(SET_CHECKPOINTS, response.data)
    },

    async fetchMeetingInfo({ commit }, payload) {
      const response = await meetingApi.getMeetingInfo(payload.meetingId)
      commit(SET_MEETING_INFO, response.data)
    },

    async fetchParticipantsMeetingState({ commit }, payload) {
      const response = await meetingApi.getParticipantsMeetingState(payload.meetingId)
      const participantsMeetingState = response.data
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

    getParticipantByUserId: (state) => (userId) => {
      return state.participants.find((x) => x.user.id === userId)
    },

    onlineParticipants: (state) => {
      return state.participants.filter((participant) => participant.online)
    },

    currentUserPermissions: (state, _, rootState) => {
      return state.permissions.find((x) => x.userId === rootState.auth.currentUser.id)
    },
  },
}
export default meetings
