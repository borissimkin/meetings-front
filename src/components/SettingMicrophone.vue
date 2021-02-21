<template>
  <div>
    <template v-if="enabledMicro">
      <v-icon x-large @click="toggleMicrophone"> mdi-microphone </v-icon>
    </template>
    <template v-else>
      <v-icon x-large @click="toggleMicrophone"> mdi-microphone-off </v-icon>
    </template>
  </div>
</template>

<script>
import { SET_ENABLED_MICRO } from '@/store/mutations.type'
import { mapState } from 'vuex'

export default {
  name: 'SettingMicrophone',
  computed: {
    ...mapState('meeting', {
      enabledMicro: (state) => state.enabledMicro,
    }),
  },
  methods: {
    toggleMicrophone() {
      this.$store.commit(`meeting/${SET_ENABLED_MICRO}`, !this.enabledMicro)
    },
  },
}
</script>

<style lang="scss" scoped></style>
