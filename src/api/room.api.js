import server from './server'

export default {
  isRoomExist(roomId) {
    return server.get(`/room/${roomId}/exists`)
  },
}
