<template>
  <v-btn depressed elevation="6" fab @click="toggleAudio">
    <v-icon>{{
      enabledAudio ? 'mdi-microphone' : 'mdi-microphone-off'
    }}</v-icon>
  </v-btn>
</template>

<script>
import { SET_ENABLED_AUDIO_OF_CURRENT_USER } from '@/store/mutations.type'
import { mapState } from 'vuex'

export default {
  name: 'SettingAudio',
  computed: {
    ...mapState('meeting', {
      enabledAudio: (state) => state.meetingStateOfCurrentUser.enabledAudio,
    }),
  },
  methods: {
    toggleAudio() {
      const value = !this.enabledAudio
      this.$socket.client.emit('toggle-audio', value)
      this.$store.commit(
        `meeting/${SET_ENABLED_AUDIO_OF_CURRENT_USER}`,
        value
      )
    },
  },
}
</script>

<style lang="scss" scoped></style>
