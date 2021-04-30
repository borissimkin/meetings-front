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
    <template v-if='!examStateIsEmpty'>
      <div v-if='prepareStart' class='px-1 text-caption font-weight-light' :class="{'red--text': timeIsGone}">
        {{ formatShowTimer }}
      </div>
    </template>
  </v-card>
</template>

<script>
import { getFullName } from '@/helpers/username.process'
import { mapState } from 'vuex'
import _ from "lodash"
import dayjs from 'dayjs'
import { fromSecondsToTime, fromTimeToSeconds } from '@/helpers/datetime.process'

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
    prepareStart(newPrepareStart) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.createTimer()
      console.log({newPrepareStart})
    },

    countMinutesToPrepare(newCountMinutes) {
      console.log({newCountMinutes})
    }
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
      return this.examInfo.minutesToPrepare
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
  methods: {
    //todo: както сохранить нереактивно минуты на подготовку. Можно прям в функции сразу вычислять оставшееся время
    createTimer() {
      this.timer = setInterval(() => {
        const leftSeconds = dayjs().diff(dayjs(this.examState.prepareStart), "seconds")
        let totalSeconds = this.examInfo.minutesToPrepare * 60 - leftSeconds;
        if (totalSeconds < 0) {
          totalSeconds = 0
          clearInterval(this.timer)
        }
        const time = fromSecondsToTime(totalSeconds)
        Object.assign(this.leftTimeToPrepare, time)

      }, 1000)
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
