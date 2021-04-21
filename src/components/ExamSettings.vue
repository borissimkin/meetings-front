<template>
  <div>
    <div class='exam-info'>
      <span class='caption pl-1'>Время подготовки:</span>
      <div class='mb-2'>
        <span class='font-weight-medium caption pr-1'>{{countMinutesToPrepare}}</span>
        <ModalChangePrepareTimeExam v-if='canChangeTimeToPrepare'
                                    :initial-count-minutes='this.examInfo.minutesToPrepare' />
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
        <div v-if='respondedStudentName'>
          <span class='font-weight-medium caption'>{{ respondedStudentName }}</span>
          <v-icon color='red' class='px-1' size='small'>mdi-close-box-outline</v-icon>
        </div>

      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getFullName } from '@/helpers/username.process'
import ModalChangePrepareTimeExam from '@/components/modals/ModalChangePrepareTimeExam'

export default {
  name: 'ExamSettings',
  components: { ModalChangePrepareTimeExam },
  computed: {
    ...mapState("auth", {
      currentUserId: state => state.currentUser.id
    }),
    ...mapState("meeting", {
      meetingInfo: state => state.meetingInfo
    }),
    ...mapState("exam", {
      examInfo: state => state.examInfo
    }),
    countMinutesToPrepare() {
      return `${this.examInfo.minutesToPrepare} минут`
    },
    respondedStudentName() {
      const userId = this.examInfo.respondedUserId
      if (userId) {
        const user = this.$store.getters["meeting/getParticipantByUserId"](userId)
        if (user) {
          return getFullName(user.firstName, user.lastName)
        }
      }
      return ""
    },
    canChangeTimeToPrepare() {
      return this.meetingInfo.creator.id === this.currentUserId
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
