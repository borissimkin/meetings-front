<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

import router from "@/router/router";
import store from "@/store";

export default {
  router: router,
  store: store,
  name: 'App',
};
</script>
