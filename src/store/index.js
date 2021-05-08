import Vue from 'vue'
import Vuex from 'vuex'
import meeting from './meeting.module'
import auth from './auth.module'
import home from './home.module'
import room from '@/store/room.module'
import exam from '@/store/exam.module'

Vue.use(Vuex)

let store = new Vuex.Store({
  modules: {
    meeting,
    auth,
    home,
    room,
    exam,
  },
})

export default store
