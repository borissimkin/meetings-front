import server from './server'

export default {
  signIn(email, password) {
    return server.post('/sign-in', { email, password })
  },

  signUp(payload) {
    return server.post('/sign-up', payload)
  },
}
