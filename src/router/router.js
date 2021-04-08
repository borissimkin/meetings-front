import Vue from 'vue'

import Router from 'vue-router'
import Home from '@/views/Home'
import Login from '@/views/Login'
import NotFound from '@/views/NotFound'
import roomApi from '../api/room.api'
import meetingApi from '../api/meeting.api'
import store from '@/store'
import redirectService from '@/services/redirect.service'
import RegistrationForm from '@/views/RegistrationForm'
import Room from '@/views/Room'
import Meeting from '@/views/Meeting'
import { socket } from '@/socket'
import WasConnectedToMeeting from '@/views/WasConnectedToMeeting'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/room/:id',
      name: 'room',
      component: Room,
      meta: {
        requiresAuth: true,
      },
      props: true,
      async beforeEnter(to, from, next) {
        const response = await roomApi.isRoomExist(to.params.id)
        if (!response.data.exists) {
          next('404')
        } else {
          next()
        }
      },
    },
    {
      path: `/room/:roomId/meeting/:meetingId`,
      name: 'meeting',
      component: Meeting,
      meta: {
        requiresAuth: true,
      },
      props: true,
      async beforeEnter(to, from, next) {
        try {
          await meetingApi.canConnectToMeeting(
            to.params.roomId,
            to.params.meetingId
          )
          next()
        } catch (error) {
          if (error.response.status === 404) {
            next('404')
          } else if (error.response.status === 400) {
            next('was-connected-to-meeting')
          }
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: async (to, from, next) => {
        if (store.getters['auth/isLoggedIn']) {
          await store.dispatch('auth/logout')
          socket.close()
        }
        next()
      },
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationForm,
    },
    {
      path: '/was-connected-to-meeting',
      name: 'wasConnectedToMeeting',
      component: WasConnectedToMeeting,
    },
    {
      path: '*',
      name: '404',
      component: NotFound,
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    store.dispatch('auth/fetchCurrentUser').then(next)
  }
  if (
    to.name !== '/login' &&
    to.name !== '/registration' &&
    to.matched.some((record) => record.meta.requiresAuth) &&
    !store.getters['auth/isLoggedIn']
  ) {
    redirectService.setRedirectPath(to.path)
    next({ path: '/login', replace: false })
  } else {
    next()
  }
})
export default router
