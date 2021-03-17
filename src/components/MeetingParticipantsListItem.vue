<template>
  <v-card class='pa-1 mt-2 mb-2 ' flat>
    <div class='menu'>
      <span v-if='isHostOfMeeting' class='text-caption px-1'>создатель собрания</span>
      <v-spacer v-else/>
      <v-icon>mdi-dots-horizontal</v-icon>
    </div>
    <div class='content px-1'>
      <div class='font-weight-medium'>
        {{ name }}
      </div>
      <div>
        <v-icon color='black' small>{{ isEnabledVideo ? `mdi-video` : `mdi-video-off`}}</v-icon>
        <v-icon color='black' small>{{ isEnabledAudio ? `mdi-microphone` : `mdi-microphone-off`}}</v-icon>
        <v-icon v-show='isSpeaking' color='black' small>mdi-account-voice</v-icon>
        <v-icon v-show='isRaisedHand' color='orange'>mdi-hand-right</v-icon>
      </div>
    </div>
    <!--    <div class='px-1 text-caption font-weight-light'>-->
    <!--      {{new Date().toISOString()}}-->
    <!--    </div>-->
  </v-card>
</template>

<script>
import { getFullName } from '@/helpers/username.process'
import { mapState } from 'vuex'

export default {
  name: 'MeetingParticipantsListItem',
  props: {
    user: {
      type: Object,
      required: true,
      default: () => {
      },
    },
    participantState: {
      type: Object,
      required: true,
      default: () => {
      },
    },
  },
  computed: {
    ...mapState("meeting", {
      meetingHostId: state => state.meetingInfo.creator.id
    }),
    name() {
      return getFullName(this.user.firstName, this.user.lastName)
    },

    isRaisedHand() {
      return this.participantState?.isRaisedHand
    },

    isSpeaking() {
      return this.participantState?.isSpeaking
    },

    isEnabledVideo() {
      return this.participantState?.enabledVideo
    },

    isEnabledAudio() {
      return this.participantState?.enabledAudio
    },

    isHostOfMeeting() {
      return this.user.id === this.meetingHostId
    }
  },
}
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: space-between;
}
.is-speaking {
  box-shadow: 0 0 20px #0002ff;

}
.content {
  display: flex;
  justify-content: space-between;
}
</style>
