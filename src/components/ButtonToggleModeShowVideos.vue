<template>
  <v-btn
    depressed
    elevation='6'
    fab
    :title='title'
    @click='toggleMode'>
    <v-icon :color='colorIcon' >mdi-eye</v-icon>
  </v-btn>
</template>

<script>
import { mapState } from 'vuex'
import { SET_NORMAL_MODE_SHOW_VIDEOS } from '@/store/mutations.type'

export default {
  name: 'ButtonToggleModeShowVideos',
  computed: {
    ...mapState('meeting', {
      normalModeShowVideos: (state) => state.normalModeShowVideos,
    }),

    colorIcon() {
      return this.normalModeShowVideos ? 'black' : 'orange'
    },

    title() {
      return this.normalModeShowVideos ? 'Включить режим наблюдения за экзаменом'
        : 'Выключить режим наблюдения за экзаменом '
    }
  },
  methods: {
    toggleMode() {
      const value = !this.normalModeShowVideos
      this.$store.commit(`meeting/${SET_NORMAL_MODE_SHOW_VIDEOS}`, value)
    }
  }
}
</script>

<style scoped>

</style>
