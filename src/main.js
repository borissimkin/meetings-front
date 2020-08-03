import Vue from 'vue'
import App from './App.vue'
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

Vue.config.productionTip = false
let serverPath = (Vue.config.productionTip) ? 'https://www.api.com' : 'http://127.0.0.1:3000'

const socket = io(serverPath);

Vue.use(VueSocketIOExt, socket);


new Vue({
  render: h => h(App),
}).$mount('#app')
