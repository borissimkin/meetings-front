<template>
  <v-btn @click='checkListeners'>
    Проверить слушателей
  </v-btn>
</template>

<script>

import { CHECK_LISTENERS_STARTED } from '@/helpers/toast.messages'

export default {
  name: 'ButtonCheckListeners',
  methods: {
    checkListeners() {
      this.$socket.client.emit('check-listeners');
      this.$toast.info(CHECK_LISTENERS_STARTED)
    }
  }
}
</script>

<style scoped>

</style>
