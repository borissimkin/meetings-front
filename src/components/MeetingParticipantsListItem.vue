<template>
  <v-card class='pa-1 mt-2 mb-2 ' flat>
    <div class='menu mx-1'>
      <v-btn x-small v-if='canSetDrawingPermission && !isHostOfMeeting' icon @click='changeDrawingPermission'>
        <v-icon small :color='colorDrawingIcon'>{{ drawingIcon }}</v-icon>
      </v-btn>
      <v-icon v-else-if='!isHostOfMeeting' small :color='colorDrawingIcon'>{{ drawingIcon }}</v-icon>
      <span v-if='isHostOfMeeting' class='text-caption'>создатель собрания</span>
      <v-spacer v-else/>
      <ParticipantSettingsMenu :user='user' v-if='showMenuSettings' />
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
    <template v-if='!examStateIsEmpty'>
      <div v-if='prepareStart' class='px-1 text-caption font-weight-light' :class="{'red--text': timeIsGone}">
        {{ formatShowTimer }}
      </div>
    </template>
  </v-card>
</template>

<script>
import { getFullName } from '@/helpers/username.process'
import { mapGetters, mapState } from 'vuex'
import _ from "lodash"
import dayjs from 'dayjs'
import { fromSecondsToTime, fromTimeToSeconds } from '@/helpers/datetime.process'
import ParticipantSettingsMenu from '@/components/ParticipantSettingsMenu'
import { EDIT_MEETING_PERMISSIONS } from '@/store/mutations.type'

export default {
  name: 'MeetingParticipantsListItem',
  components: { ParticipantSettingsMenu },
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
    permissions: {
      type: Object,
      required: true,
      default: () => {}
    },
    showMenuSettings: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      timer: null,
      leftTimeToPrepare: {
        hours: 0,
        minutes: 0,
        seconds: 0

      }
    }
  },
  watch: {
    prepareStart(value) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      if (value) {
        this.createTimer()
      }
    },
  },
  computed: {
    ...mapState("meeting", {
      meetingHostId: state => state.meetingInfo.creator.id
    }),
    ...mapState("exam", {
      studentExamStates: state => state.studentExamStates
    }),
    ...mapState("exam", {
      examInfo: state => state.examInfo
    }),
    ...mapGetters("meeting", ["currentUserIsHost"]),

    name() {
      return getFullName(this.user.firstName, this.user.lastName)
    },

    examState() {
      const state = this.studentExamStates.find(examState => examState.userId === this.user.id)
      return state ? state : {}
    },

    prepareStart() {
      return this.examState.prepareStart
    },

    countMinutesToPrepare() {
      return this.examState.minutesToPrepare
    },

    canSetDrawingPermission() {
      return this.currentUserIsHost
    },

    canDrawing() {
      return !!this.permissions?.canDrawing
    },

    drawingIcon() {
      return this.canDrawing ? "mdi-pencil" : "mdi-pencil-off"
    },

    colorDrawingIcon() {
      return this.canDrawing ? "red" : "black"
    },

    examStateIsEmpty() {
      return _.isEmpty(this.examState)
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
    },

    timeIsGone() {
      return !fromTimeToSeconds(this.leftTimeToPrepare.hours, this.leftTimeToPrepare.minutes, this.leftTimeToPrepare.seconds)
    },

    formatShowTimer() {
      return `${this.partTimeToShow(this.leftTimeToPrepare.hours)}:${this.partTimeToShow(this.leftTimeToPrepare.minutes)}:${this.partTimeToShow(
        this.leftTimeToPrepare.seconds
      )}`;
    }

  },
  mounted() {
    if (this.examState && this.prepareStart) {
      this.createTimer()
    }
  },
  methods: {
    createTimer() {
      this.timer = setInterval(() => {
        const leftSeconds = dayjs().diff(dayjs(this.examState.prepareStart), "seconds")
        let totalSeconds = this.countMinutesToPrepare * 60 - leftSeconds;
        if (totalSeconds < 0) {
          totalSeconds = 0
          clearInterval(this.timer)
        }
        const time = fromSecondsToTime(totalSeconds)
        Object.assign(this.leftTimeToPrepare, time)

      }, 1000)
    },

    changeDrawingPermission() {
      const payload = { userId: this.user.id, canDrawing: !this.canDrawing}
      this.$socket.client.emit('change-can-drawing', payload)
      this.$store.commit(`meeting/${EDIT_MEETING_PERMISSIONS}`, payload)
    },

    partTimeToShow(number) {
      const stringNumber = number.toString();
      if (stringNumber.length < 2) {
        return `0${stringNumber}`;
      }
      return stringNumber;
    }

  }
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
