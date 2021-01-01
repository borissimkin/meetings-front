import Vue from "vue";
import server from "@/server"

import Router from "vue-router";
import Home from "@/views/Home";
import Room from "@/views/Room";
import NotFound from "@/views/NotFound";


Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/404",
      name: "notFound",
      component: NotFound
    },
    {
      path: "/room/:id",
      name: "room",
      component: Room,
      props: true,
      async beforeEnter(to, from, next) {
        const response = await server.get(`/room/${to.params.id}/exists`);
        if (!response.data.exists) {
          next("/404")
        } else {
          next()
        }

      }
    }
  ]
});

export default router;