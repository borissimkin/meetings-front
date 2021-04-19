<template>
  <div>
    <div class='exam-info'>
      <span class='caption pl-1'>Время подготовки:</span>
      <div>
        <span class='font-weight-medium caption'>{{countMinutesToPrepare}}</span>
        <v-icon color='black' class='px-1' size='small'>mdi-pencil</v-icon>
      </div>
    </div>
    <div class='exam-info mb-2'>
      <v-btn x-small>сбросить</v-btn>
      <v-btn x-small >запустить</v-btn>
    </div>
    <template>
      <v-divider />
      <div class='exam-info pa-1'>
        <span class='caption'>Отвечает: </span>
        <div>
          <span class='font-weight-medium caption'>Симикн Борис</span>
          <v-icon color='red' class='px-1' size='small'>mdi-close-box-outline</v-icon>
        </div>

      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ExamSettings',
  computed: {
    ...mapState("exam", {
      examInfo: state => state.examInfo
    }),
    countMinutesToPrepare() {
      return `${this.examInfo.minutesToPrepare} минут`
    }
  }
}
</script>

<style scoped>

.exam-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
