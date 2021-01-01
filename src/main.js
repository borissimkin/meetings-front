import Vue from 'vue'
import App from './App.vue'
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

let serverPath = process.env.VUE_APP_SERVER_PATH;

const socket = io(serverPath);

Vue.use(VueSocketIOExt, socket);


new Vue({
  render: h => h(App),
}).$mount('#app')
