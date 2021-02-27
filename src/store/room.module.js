import roomApi from '../api/room.api'

import {
  SET_ERROR,
  SET_LOADING,
  SET_MEETINGS,
  ADD_MEETING,
} from './mutations.type'

const room = {
  namespaced: true,

  state: {
    meetings: [],
    loading: false,
    error: false,
  },

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

    // async addMeeting({ commit }, payload) {
    //   try {
    //     const { name } = { ...payload }
    //     const response = await roomApi.createRoom(name)
    //     commit(ADD_MEETING, response.data)
    //   } catch (e) {
    //     console.log(e)
    //     todo
    // }
    // },
  },
}
export default room
