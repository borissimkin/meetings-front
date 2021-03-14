import server from './server'

export default {
  getAllParticipants(meetingId) {
    return server.get(`/meeting/${meetingId}/all-participants`)
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

  getMeetingInfo(meetingId) {
    return server.get(`/meeting/${meetingId}`)
  },

  getParticipantsMeetingState(meetingId) {
    return server.get(`/meeting/${meetingId}/states-participants`)
  },
}
