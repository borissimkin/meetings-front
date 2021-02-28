<template>
  <v-menu :nudge-width="200" offset-x>
    <template v-slot:activator="{ on, attrs }">
      <v-icon v-bind="attrs" v-on="on" dark> mdi-account </v-icon>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ fullName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item to="/login"> Выйти </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { getFullName } from '@/helpers/username.process'
import { mapState } from 'vuex'

export default {
  name: 'AccountMenu',

  computed: {
    ...mapState('auth', {
      currentUser: (state) => state.currentUser,
    }),

    fullName() {
      return getFullName(this.currentUser.firstName, this.currentUser.lastName)
    },
  },
}
</script>

<style scoped></style>
