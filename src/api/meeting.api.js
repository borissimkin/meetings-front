import server from './server'

export default {
  getPeers(meetingId) {
    return server.get(`/meeting/${meetingId}/peers`)
  },

  createMeeting(payload) {
    return server.post(`/meeting`, payload)
  },
}
