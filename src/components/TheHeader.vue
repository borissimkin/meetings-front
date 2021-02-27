<template>
  <v-toolbar dark flat>
    <v-app-bar-nav-icon />

    <v-toolbar-title class="mr-5">
      <v-btn text to="/">Meetings</v-btn>
    </v-toolbar-title>
    <v-spacer />
    <AccountMenu v-if="isLoggedIn" />
  </v-toolbar>
</template>

<script>
import AccountMenu from '@/components/AccountMenu'
import { mapGetters } from 'vuex'

export default {
  name: 'TheHeader',
  components: { AccountMenu },
  computed: {
    ...mapGetters('auth', ['isLoggedIn']),
  },
}
</script>

<style scoped></style>
