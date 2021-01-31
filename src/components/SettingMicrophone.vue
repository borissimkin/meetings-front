<template>
  <div
    class="microphone"
    @click="toggleMicrophone"
  >
    <template v-if="enabledMicro">
      <b-icon-mic />
    </template>
    <template v-else>
      <b-icon-mic-mute />
    </template>
  </div>
</template>

<script>
import {SET_ENABLED_MICRO} from "@/store/mutations.type";
import { mapState } from "vuex"

export default {
  name: "SettingMicrophone",
  computed: {
    ...mapState("meeting", {
      enabledMicro: state => state.enabledMicro,
    })
  },
  methods: {
    toggleMicrophone() {
      this.$store.commit(`meeting/${SET_ENABLED_MICRO}`, !this.enabledMicro)
    }
  }
}
</script>

<style scoped lang="scss">

</style>