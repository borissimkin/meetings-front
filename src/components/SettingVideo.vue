<template>
  <v-btn
    depressed
    elevation='6'
    fab
    @click='toggleVideo'>
      <v-icon color='black' > {{enabledVideo ? 'mdi-video' : 'mdi-video-off'}}</v-icon>
  </v-btn>
</template>

<script>
import { SET_ENABLED_VIDEO_OF_CURRENT_USER } from '@/store/mutations.type'
import { mapState } from 'vuex'
export default {
  name: 'SettingVideo',
  computed: {
    ...mapState('meeting', {
      enabledVideo: (state) => state.meetingStateOfCurrentUser.enabledVideo,
    }),
  },
  methods: {
    toggleVideo() {
      const value = !this.enabledVideo
      this.$socket.client.emit('toggle-video', value)
      this.$store.commit(`meeting/${SET_ENABLED_VIDEO_OF_CURRENT_USER}`, value)
    },
  },
}
</script>

<style scoped></style>
