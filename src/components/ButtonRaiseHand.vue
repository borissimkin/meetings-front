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
import { ADD_RAISED_HAND_USER_ID, REMOVE_RAISED_HAND_USER_ID } from '@/store/mutations.type'

export default {
  name: 'ButtonRaiseHand',
  computed: {
    ...mapState('meeting', {
      raisedHandUserIds: (state) => state.raisedHandUserIds,
    }),
    isRaiseHand() {
      return this.raisedHandUserIds.includes(this.$store.state.auth.currentUser.id)
    },

    colorIconHand() {
      return this.isRaiseHand ? 'orange' : 'black'
    },

    title() {
      return this.isRaiseHand ? 'Опустить руку' : 'Поднять руку'
    }
  },
  methods: {
    toggleRaiseHand() {
      this.$socket.client.emit('raise-hand', !this.isRaiseHand)
      const mutationType = this.isRaiseHand ? REMOVE_RAISED_HAND_USER_ID : ADD_RAISED_HAND_USER_ID
      this.$store.commit(`meeting/${mutationType}`, this.$store.state.auth.currentUser.id)
    }
  }
}
</script>

<style scoped>

</style>
