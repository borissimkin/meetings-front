<template>
  <v-btn
    depressed
    elevation='6'
    fab
    :title='title'
    @click='toggleRaiseHand'>
    <v-icon :color='colorIconHand' >mdi-hand-right</v-icon>
  </v-btn>
</template>

<script>
import { mapState } from 'vuex'
import { SET_RAISED_HAND_CURRENT_USER } from '@/store/mutations.type'

export default {
  name: 'ButtonRaiseHand',
  computed: {
    ...mapState('meeting', {
      meetingStateOfCurrentUser: (state) => state.meetingStateOfCurrentUser,
    }),

    isRaisedHand() {
      return this.meetingStateOfCurrentUser.isRaisedHand
    },

    colorIconHand() {
      return this.isRaisedHand ? 'orange' : 'black'
    },

    title() {
      return this.isRaisedHand ? 'Опустить руку' : 'Поднять руку'
    }
  },
  methods: {
    toggleRaiseHand() {
      const value = !this.isRaisedHand
      this.$socket.client.emit('raise-hand', value)
      this.$store.commit(`meeting/${SET_RAISED_HAND_CURRENT_USER}`, value)
    }
  }
}
</script>

<style scoped>

</style>
