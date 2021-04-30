<template>
  <div>
    <div class='exam-info'>
      <span class='caption pl-1'>Время подготовки:</span>
      <div class='my-auto py-2'>
        <span class='font-weight-medium caption pr-1'>{{countMinutesToPrepare}}</span>
        <ModalChangePrepareTimeExam v-if='canManageSettings'
                                    :initial-count-minutes='this.examInfo.minutesToPrepare' />
      </div>
    </div>
    <div v-if='canManageSettings' class='exam-info mb-2'>
      <v-btn x-small>сбросить</v-btn>
      <v-btn @click='startAllPreparations' :loading='isLoading' x-small >запустить</v-btn>
    </div>
    <template>
      <v-divider />
      <div class='exam-info pa-1'>
        <span class='caption'>Отвечает: </span>
        <div v-if='respondedStudentName'>
          <span class='font-weight-medium caption'>{{ respondedStudentName }}</span>
          <v-icon v-if='canManageSettings' color='red' class='px-1' size='small'>mdi-close-box-outline</v-icon>
        </div>

      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getFullName } from '@/helpers/username.process'
import ModalChangePrepareTimeExam from '@/components/modals/ModalChangePrepareTimeExam'
import meetingApi from "@/api/meeting.api"
import { START_ALL_PREPARATIONS_TO_EXAM } from '@/helpers/toast.messages'

export default {
  name: 'ExamSettings',
  components: { ModalChangePrepareTimeExam },
  data() {
    return {
      isLoading: false
    }
  },
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
    canManageSettings() {
      return this.meetingInfo.creator.id === this.currentUserId
    }
  },
  methods: {
    async startAllPreparations() {
      try {
        this.isLoading = true
        await meetingApi.startAllPreparations(this.meetingInfo.hashId)
        this.$toast.success(START_ALL_PREPARATIONS_TO_EXAM)
      } catch (e) {
        console.error({e})
      } finally {
        this.isLoading = false
      }
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
