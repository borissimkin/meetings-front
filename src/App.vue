<template>
  <v-app>
    <v-card>
      <TheHeader />
    </v-card>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import router from '@/router/router'
import store from '@/store'
import TheHeader from '@/components/TheHeader'

export default {
  name: 'App',
  components: { TheHeader },
  router: router,
  store: store,
}
</script>
