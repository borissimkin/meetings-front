import server from "./server";

const resource = '/profile'

export default {
  getCurrentUser() {
    return server.get(`${resource}/current-user`)
  },

}