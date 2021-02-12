<template>
  <v-app>
    <v-card>
      <Header></Header>
    </v-card>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

import router from "@/router/router";
import store from "@/store";
import Header from "@/components/Header";

export default {
  components: {Header},
  router: router,
  store: store,
  name: 'App',
};
</script>
