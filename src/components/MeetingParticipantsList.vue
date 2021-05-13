<template>
  <v-container class='participants'>
    <h3 class='heading pa-1'>
      Участников: {{countParticipants}}
    </h3>
    <v-divider />
    <template v-if='meetingInfo.isExam'>
      <ExamSettings />
      <v-divider />
    </template>
    <v-spacer></v-spacer>
    <MeetingParticipantsListItem :user='currentUser'
                                 :participantState='meetingStateOfCurrentUser'
                                 :show-menu-settings='false'
                                 :permissions='currentUserPermissions'
                                  />
    <MeetingParticipantsListItem v-for='participant in onlineParticipants'
                                 :key='participant.user.id'
                                 :show-menu-settings='isShowMenuSettingOnParticipants'
                                 :permissions='getPermissionByUserId(participant.user.id)'
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
      meetingInfo: (state) => state.meetingInfo,
      currentUserPermissions: state => state.currentUserPermissions,
      permissions: state => state.permissions
    }),
    ...mapState("exam", {
      studentExamStates: (state) => state.studentExamStates,
    }),
    ...mapGetters("meeting", [
      'onlineParticipants'
    ]),

    countParticipants() {
      return this.onlineParticipants.length + 1
    },

    isShowMenuSettingOnParticipants() {
      return this.currentUser.id === this.meetingInfo.creator.id
    }

  },
  methods: {
    getPermissionByUserId(userId) {
      const permissions = this.permissions.find(x => x.userId === userId)
      if (permissions) {
        return permissions
      }
      return {}
    }
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
