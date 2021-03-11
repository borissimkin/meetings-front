<template>
  <v-btn
    depressed
    elevation='6'
    fab
    @click='toggleMicrophone'>
      <v-icon>{{enabledMicro ? 'mdi-microphone' : 'mdi-microphone-off'}}</v-icon>
  </v-btn>
</template>

<script>
import { SET_ENABLED_MICRO_OF_CURRENT_USER } from '@/store/mutations.type'
import { mapState } from 'vuex'

export default {
  name: 'SettingMicrophone',
  computed: {
    ...mapState('meeting', {
      enabledMicro: (state) => state.meetingStateOfCurrentUser.enabledMicro,
    }),
  },
  methods: {
    toggleMicrophone() {
      this.$store.commit(`meeting/${SET_ENABLED_MICRO_OF_CURRENT_USER}`, !this.enabledMicro)
    },
  },
}
</script>

<style lang='scss' scoped></style>
