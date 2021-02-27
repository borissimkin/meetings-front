import server from './server'

export default {
  //todo: брать по айди собрания а не комнаты
  getPeers(meetingId) {
    return server.get(`/meeting/${meetingId}/peers`)
  },
}
