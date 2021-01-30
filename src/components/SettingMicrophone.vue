<template>
  <div @click="toggleMicrophone">
    <template v-if="$store.state.meeting.myAudio">
      <b-icon-mic></b-icon-mic>
    </template>
    <template v-else>
      <b-icon-mic-mute></b-icon-mic-mute>
    </template>
  </div>
</template>

<script>
import {SET_MY_AUDIO} from "@/store/mutations.type";

export default {
  name: "SettingMicrophone",
  methods: {
    toggleMicrophone() {
      this.$store.commit(SET_MY_AUDIO, !this.$store.state.meeting.myAudio)
    }
  }
}
</script>

<style scoped>

</style>