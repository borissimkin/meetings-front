import server from './server'

export default {
  isRoomExist(roomId) {
    return server.get(`/room/${roomId}/exists`)
  },

  createRoom(name) {
    return server.post(`/room`, { name })
  },

  getAllRooms() {
    return server.get('/rooms')
  },

  getAllMeetings(roomId) {
    return server.get(`/room/${roomId}/meetings`)
  },

  getRoom(roomId) {
    return server.get(`/rooms/${roomId}`)
  },
}
