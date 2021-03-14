<template>
  <v-btn @click='checkListeners'>
    Проверить слушателей
  </v-btn>
</template>

<script>

export default {
  name: 'ButtonCheckListeners',
  methods: {
    checkListeners() {
      this.$socket.client.emit('check-listeners');
    }
  }
}
</script>

<style scoped>

</style>
