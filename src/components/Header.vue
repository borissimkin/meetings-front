<template>
  <v-toolbar
      dark
      flat>

    <v-app-bar-nav-icon></v-app-bar-nav-icon>

    <v-toolbar-title>Meetings</v-toolbar-title>
    <v-spacer></v-spacer>
    <AccountMenu v-if="isLoggedIn"></AccountMenu>
  </v-toolbar>
</template>

<script>
import AccountMenu from "@/components/AccountMenu";
import {mapGetters} from "vuex";
export default {
  name: "Header",
  components: {AccountMenu},
  computed: {
    ...mapGetters("auth", [
        "isLoggedIn"
    ])
  }
}
</script>

<style scoped>

</style>