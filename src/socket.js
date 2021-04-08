import io from 'socket.io-client'
import store from '@/store'
import router from '@/router/router'

export const socket = io.connect(process.env.VUE_APP_SERVER_PATH)

socket.on('connect', () => {
  socket
    .emit('authenticate', { token: store.state.auth.token })
    .on('unauthorized', () => {
      if (router.history.current.name !== 'login') {
        router.push('/login')
      }
      store.dispatch('auth/logout')
    })
})
