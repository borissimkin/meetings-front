import Vue from 'vue'
import App from './App.vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import socket from '@/socket'
import vuetify from './plugins/vuetify'

Vue.use(VueSocketIOExt, socket)

dayjs.extend(isSameOrAfter)
new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
