import Vue from 'vue'
import App from './App.vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import dayjs from 'dayjs'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
require('dayjs/locale/ru')
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import { socket } from '@/socket'
import vuetify from './plugins/vuetify'
import { optionsToast } from '@/toasts'

Vue.use(VueSocketIOExt, socket)

Vue.use(Toast, optionsToast)

dayjs.locale('ru')
dayjs.extend(isSameOrAfter)
new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
