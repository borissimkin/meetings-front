import server from './server'

export default {
  getPeers(meetingId) {
    return server.get(`/meeting/${meetingId}/peers`)
  },

  createMeeting(payload) {
    return server.post(`/meeting`, payload)
  },

  isMeetingExist(roomId, meetingId) {
    return server.get(`/room/${roomId}/meeting/${meetingId}/exists`)
  },

  getMeetingMessages(meetingId) {
    return server.get(`/meeting/${meetingId}/messages`)
  },
}
