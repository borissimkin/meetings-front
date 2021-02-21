<template>
  <div>
    <template v-if="enabledVideo">
      <v-icon x-large @click="toggleVideo"> mdi-video </v-icon>
    </template>
    <template v-else>
      <v-icon x-large @click="toggleVideo"> mdi-video-off </v-icon>
    </template>
  </div>
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
