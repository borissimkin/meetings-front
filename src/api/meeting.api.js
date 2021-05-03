import server from './server'

export default {
  getAllParticipants(meetingId) {
    return server.get(`/meeting/${meetingId}/all-participants`)
  },

  createMeeting(payload) {
    return server.post(`/meeting`, payload)
  },

  canConnectToMeeting(roomId, meetingId) {
    return server.get(`/room/${roomId}/meeting/${meetingId}/can-connect`)
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

  getCheckpoints(meetingId) {
    return server.get(`/meeting/${meetingId}/checkpoints`)
  },

  getExamInfo(meetingId) {
    return server.get(`/meeting/${meetingId}/exam`)
  },

  getStudentExamStates(meetingId) {
    return server.get(`/meeting/${meetingId}/exam/student-states`)
  },

  startAllPreparations(meetingId) {
    return server.put(`/meeting/${meetingId}/exam/start-all-preparation`)
  },

  resetAllPreparations(meetingId) {
    return server.put(`/meeting/${meetingId}/exam/reset-all-preparation`)
  },

  resetPreparationToUser(meetingId, userId) {
    return server.put(`/meeting/${meetingId}/exam/reset-preparation/${userId}`)
  },

  startPreparationToUser(meetingId, userId) {
    return server.put(`/meeting/${meetingId}/exam/start-preparation/${userId}`)
  },
}
