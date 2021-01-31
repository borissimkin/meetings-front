<template>
  <div @click="toggleVideo">
    <template v-if="enabledVideo">
      <b-icon-camera-video />
    </template>
    <template v-else>
      <b-icon-camera-video-off />
    </template>
  </div>
</template>

<script>
import {SET_ENABLED_VIDEO} from "@/store/mutations.type";
import { mapState } from "vuex"
export default {
  name: "SettingVideo",
  computed: {
    ...mapState("meeting", {
      enabledVideo: state => state.enabledVideo,
    })
  },
  methods: {
    toggleVideo() {
      this.$store.commit(`meeting/${SET_ENABLED_VIDEO}`, !this.enabledVideo)

    }

  }
}
</script>

<style scoped>

</style>