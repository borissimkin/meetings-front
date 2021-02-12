<template>
  <v-menu
      :nudge-width="200"
      offset-x
  >
    <template v-slot:activator="{ on, attrs }">
      <v-icon
          dark
          v-bind="attrs"
          v-on="on"
      >
        mdi-account
      </v-icon>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Симкин Борис(заглушка)</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item to="login">
          Выйти
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
//todo: текущее имя
export default {
name: "AccountMenu"
}
</script>

<style scoped>

</style>