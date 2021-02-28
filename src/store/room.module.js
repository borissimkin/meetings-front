import roomApi from '../api/room.api'
import meetingApi from '../api/meeting.api'

import {
  SET_ERROR,
  SET_LOADING,
  SET_MEETINGS,
  ADD_MEETING,
  RESET_STATE,
} from './mutations.type'

const getDefaultState = () => {
  return {
    meetings: [],
    loading: false,
    error: false,
  }
}

const room = {
  namespaced: true,

  state: getDefaultState(),

  mutations: {
    [SET_MEETINGS](state, meetings) {
      state.meetings = meetings
    },

    [ADD_MEETING](state, meeting) {
      state.meetings.push(meeting)
    },

    [SET_ERROR](state, value) {
      state.error = value
    },

    [SET_LOADING](state, value) {
      state.loading = value
    },

    [RESET_STATE](state) {
      Object.assign(state, getDefaultState())
    },
  },

  actions: {
    async fetchMeetings({ commit }, payload) {
      const { roomId } = { ...payload }
      commit(SET_LOADING, true)
      try {
        const response = await roomApi.getAllMeetings(roomId)
        commit(SET_MEETINGS, response.data)
      } catch {
        commit(SET_ERROR, true)
      } finally {
        commit(SET_LOADING, false)
      }
    },

    async addMeeting({ commit }, payload) {
      try {
        const response = await meetingApi.createMeeting(payload)
        commit(ADD_MEETING, response.data)
      } catch (e) {
        console.log(e)
        throw e
      }
    },
  },
}
export default room
