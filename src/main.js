import Vue from 'vue'
import App from './App.vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import dayjs from 'dayjs'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
require('dayjs/locale/ru')
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import socket from '@/socket'
import vuetify from './plugins/vuetify'

Vue.use(VueSocketIOExt, socket)

const optionsToast = {
  position: 'bottom-left',
  timeout: 5000,
  closeOnClick: true,
  maxToasts: 3,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.5,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
}

Vue.use(Toast, optionsToast)

dayjs.locale('ru')
dayjs.extend(isSameOrAfter)
new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
