import server from './server'

export default {
  //todo: брать по айди собрания а не комнаты
  getPeers(roomId) {
    return server.get(`/room/${roomId}/peers`)
  },
}
