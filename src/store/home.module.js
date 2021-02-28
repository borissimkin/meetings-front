import roomApi from '../api/room.api'

import { SET_ERROR, SET_LOADING, SET_ROOMS, ADD_ROOM } from './mutations.type'

const auth = {
  namespaced: true,

  state: {
    rooms: [],
    loading: false,
    error: false,
  },

  mutations: {
    [SET_ROOMS](state, rooms) {
      state.rooms = rooms
    },

    [ADD_ROOM](state, room) {
      state.rooms.push(room)
    },

    [SET_ERROR](state, value) {
      state.error = value
    },

    [SET_LOADING](state, value) {
      state.loading = value
    },
  },

  actions: {
    async fetchRooms({ commit }) {
      commit(SET_LOADING, true)
      try {
        const response = await roomApi.getAllRooms()
        commit(SET_ROOMS, response.data)
      } catch {
        commit(SET_ERROR, true)
      } finally {
        commit(SET_LOADING, false)
      }
    },

    async addRoom({ commit }, payload) {
      try {
        const { name } = { ...payload }
        const response = await roomApi.createRoom(name)
        commit(ADD_ROOM, response.data)
      } catch (e) {
        console.log(e)
        //todo
      }
    },
  },
}
export default auth
