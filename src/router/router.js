import Vue from "vue";

import Router from "vue-router";
import Home from "@/views/Home";
import Room from "@/views/Room";
import Login from "@/views/Login";
import NotFound from "@/views/NotFound";
import roomApi from "../api/room.api";
import store from "@/store";
import redirectService from "@/services/redirect.service"
import RegistrationForm from "@/views/RegistrationForm";


Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: "/room/:id",
      name: "room",
      component: Room,
      meta: {
        requiresAuth: true,
      },
      props: true,
      async beforeEnter(to, from, next) {
        const response = await roomApi.isRoomExist(to.params.id);
        if (!response.data.exists) {
          next("404")
        } else {
          next()
        }

      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter: async (to, from, next) => {
        if (store.getters["auth/isLoggedIn"]) {
          await store.dispatch("auth/logout");
        }
        next()
      }
    },
    {
      path: "/registration",
      name: "registration",
      component: RegistrationForm, //todo: может надо было делать все в одной??
    },
    {
      path: '*',
      name: "404",
      component: NotFound
    }
  ]
});


router.beforeEach((to, from, next) => {
  if (to.name !== '/login' && to.matched.some(record => record.meta.requiresAuth) && !store.getters["auth/isLoggedIn"]) {
    redirectService.setRedirectPath(to.path);
    next({path: "/login", replace: false});
  } else {
    next()
  }

})
export default router;