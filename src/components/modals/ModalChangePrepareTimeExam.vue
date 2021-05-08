<template>
  <v-dialog v-model='dialog' max-width='400px'>
    <template v-slot:activator='{on, attrs}'>
      <v-icon color='black' v-bind='attrs'
              v-on='on'  size='small'>mdi-pencil</v-icon>
    </template>
    <v-card>
      <v-card-title>
        <span class='headline'>Время на подготовку</span>
      </v-card-title>
      <v-container>
        <v-card-subtitle>
          Установите количество минут на подготовку
        </v-card-subtitle>

        <v-form @submit.prevent='confirm'>
          <v-text-field class='px-2' v-model='countMinutes' type='number' min='1' label='Минуты'/>

        </v-form>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color='blue darken-1'
          text
          @click='dialog = false'
        >
          Отмена
        </v-btn>
        <v-btn
          color='blue darken-1'
          text
          @click="confirm"
        >
          Подтвердить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { SET_MINUTES_TO_PREPARE } from '@/store/mutations.type'

export default {
  name: 'ModalChangePrepareTimeExam',
  props: {
    initialCountMinutes: {
      type: Number,
      required: true,
      default: 1
    }
  },
  data() {
    return {
      dialog: false,
      countMinutes: 1,
    }
  },
  watch: {
    initialCountMinutes(value) {
      this.countMinutes = value
    }
  },
  mounted() {
    this.countMinutes = this.initialCountMinutes;
  },
  methods: {
    confirm() {
      const number = Math.round(this.countMinutes);
      this.$socket.client.emit('change-minutes-to-prepare-exam', number)
      this.$store.commit(`exam/${SET_MINUTES_TO_PREPARE}`, number)
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
