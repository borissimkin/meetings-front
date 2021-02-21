import Vue from 'vue'
import App from './App.vue'
import VueSocketIOExt from 'vue-socket.io-extended'

import socket from '@/socket'
import vuetify from './plugins/vuetify'

Vue.use(VueSocketIOExt, socket)

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
