<template>
  <v-container class='participants'>
    <h3 class='heading pa-1'>
      Участников: {{countParticipants}}
    </h3>
    <v-divider />
    <template v-if='isExamMeeting'>
      <ExamSettings />
      <v-divider />
    </template>
    <v-spacer></v-spacer>
    <MeetingParticipantsListItem :user='currentUser'
                                 :participantState='meetingStateOfCurrentUser' />
    <MeetingParticipantsListItem v-for='participant in onlineParticipants'
                                 :key='participant.user.id'
                                 :participantState='participantsMeetingState[participant.user.id]'
                                 :user='participant.user' />
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import MeetingParticipantsListItem from '@/components/MeetingParticipantsListItem'
import ExamSettings from '@/components/ExamSettings'

export default {
  name: 'MeetingParticipantsList',
  components: { ExamSettings, MeetingParticipantsListItem },
  computed: {
    ...mapState("auth", {
      currentUser: (state) => state.currentUser,
    }),
    ...mapState("meeting", {
      participantsMeetingState: (state) => state.participantsMeetingState,
      meetingStateOfCurrentUser: (state) => state.meetingStateOfCurrentUser,
      isExamMeeting: (state) => state.meetingInfo.isExam
    }),
    ...mapGetters("meeting", [
      'onlineParticipants'
    ]),

    countParticipants() {
      return this.onlineParticipants.length + 1
    },

  }
}
</script>

<style scoped>
.participants {
  background-color: #eeeeee;
  min-width: 100%;
  min-height: 700px;
  max-height: 700px;
  overflow: auto;

}


</style>
