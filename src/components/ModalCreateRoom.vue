<template>
  <v-dialog v-model='dialog'
            max-width='600px'
            persistent
            @keydown.esc='dialog=false'>
    <template v-slot:activator='{on, attrs}'>
      <v-btn
        v-bind='attrs'
        v-on='on'
        dark
        small
      >
        Создать комнату
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class='headline'>Создать комнату</span>
      </v-card-title>
      <v-container>
        <v-form v-model='valid' @submit.prevent='createNewRoom'>
          <v-row>
            <v-col>
              <v-text-field v-model='nameRoom'
                            :rules='nameRoomRules'
                            counter='50' label='Название команты'></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color='blue darken-1'
          text
          @click='dialog = false'
        >
          Закрыть
        </v-btn>
        <v-btn
          :disabled='!valid'
          color='blue darken-1'
          text
          @click='dialog = false'
        >
          Создать
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalCreateRoom',
  data() {
    return {
      dialog: false,
      nameRoom: '',
      nameRoomRules: [
        (v) => !!v || 'Название обязательно',
      ],
      valid: false,

    }
  },
  methods: {
    async createNewRoom() {
      await this.$store.dispatch('home/addRoom', {
        name: this.nameRoom,
      })
      this.dialog = false
      this.nameRoom = ''
    },
  }
}
</script>

<style scoped>

</style>