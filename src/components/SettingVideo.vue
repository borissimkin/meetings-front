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
import { SET_ENABLED_VIDEO } from '@/store/mutations.type'
import { mapState } from 'vuex'
export default {
  name: 'SettingVideo',
  computed: {
    ...mapState('meeting', {
      enabledVideo: (state) => state.enabledVideo,
    }),
  },
  methods: {
    toggleVideo() {
      this.$store.commit(`meeting/${SET_ENABLED_VIDEO}`, !this.enabledVideo)
    },
  },
}
</script>

<style scoped></style>
