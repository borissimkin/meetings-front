<template>
  <v-container class='participants'>
    <h3 class='heading pa-1'>
      Участников: {{countParticipants}}
    </h3>
    <v-divider />
    <v-spacer></v-spacer>
    <MeetingParticipantsListItem :user='currentUser'
                                 :participantState='meetingStateOfCurrentUser' />
    <MeetingParticipantsListItem v-for='participant in participants'
                                 :key='participant.user.id'
                                 :participantState='participantsMeetingState[participant.user.id]'
                                 :user='participant.user' />
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import MeetingParticipantsListItem from '@/components/MeetingParticipantsListItem'

export default {
  name: 'MeetingParticipantsList',
  components: { MeetingParticipantsListItem },
  computed: {
    ...mapState("auth", {
      currentUser: (state) => state.currentUser,
    }),
    ...mapState("meeting", {
      participants: (state) => state.participants,
      participantsMeetingState: (state) => state.participantsMeetingState,
      meetingStateOfCurrentUser: (state) => state.meetingStateOfCurrentUser,
    }),

    countParticipants() {
      return this.participants.length + 1
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

.participants-item {
  /*display: flex;*/
  /*justify-content: space-between;*/

}

</style>
