<template>
  <v-dialog v-model='dialog'
            max-width='600px'
            persistent>
    <v-card>
      <v-card-title>
        <span class='headline'>Вы здесь?</span>
      </v-card-title>
      <v-container>
        <v-card-subtitle>
          {{`Нажите "${textConfirmButton}", чтобы подтвердить что вы здесь`}}
        </v-card-subtitle>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color='blue darken-1'
          text
          @click="confirmPresence"
        >
          {{textConfirmButton}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>
export default {
  name: 'ModalCheckListener',
  data() {
    return {
      dialog: false,
      textConfirmButton: 'OK'
    }
  },
  props: {
    checkpointId: {
      type: Number,
      required: true,
      default: 0
    },

    checkListenersWasStarted: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  watch: {
    checkListenersWasStarted() {
      this.dialog = this.checkListenersWasStarted
    }
  },
  methods: {
    confirmPresence() {
      this.$emit('confirm-presence')
    }
  }
}
</script>

<style scoped>

</style>