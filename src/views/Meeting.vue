<template>
  <div>
    <template v-if="!isPassedSettingMeeting">
      <ModalSettingDevices @setting-pass="handleConfirmSettingDevices" />
    </template>
    <template v-else>
      <div class="meeting p-4">
        <div>
          <v-tabs v-model="tab" background-color="secondary" dark>
            <v-tab> Стримы </v-tab>
            <v-tab> Доска </v-tab>
            <v-tab> Статистика </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <StreamingArea :meeting-id="meetingId"
                             :stream-type='streamType' />
              <SettingsMediaDevices />
            </v-tab-item>
            <v-tab-item eager>
              <Whiteboard
                :height="600"
                :width="900"
                style="min-width: 900px; min-height: 600px"
              ></Whiteboard>
            </v-tab-item>
            <v-tab-item >
              <AttendanceStatistics
                style='min-height: 600px; min-width: 900px'/>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <v-card
          max-height="600px"
          max-width="300px"
          min-height="600px"
          min-width="300px"
          flat
        >
          <v-tabs
            class="rounded-0"
            v-model="tabChat"
            fixed-tabs
            dark
            background-color="secondary"
          >
            <v-tab>
              <v-icon>mdi-message</v-icon>
            </v-tab>

            <v-tab>
              <v-icon>mdi-account-group</v-icon>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabChat">
            <v-tab-item>
              <MeetingChat :meeting-id="meetingId" />
            </v-tab-item>
            <v-tab-item>
              <MeetingParticipantsList />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </div>
    </template>
    <ModalCheckListener
      :checkpoint-id="checkpoint.checkpointId"
      :check-listeners-was-started="checkpoint.checkListenersWasStarted"
      @confirm-presence="handleConfirmPresence"
    >
    </ModalCheckListener>
  </div>
</template>

<script>
import MeetingChat from '@/components/MeetingChat'
import StreamingArea from '@/components/StreamingArea'
import SettingsMediaDevices from '@/components/SettingMediaDevices'
import Whiteboard from '@/components/Whiteboard'
import MeetingParticipantsList from '@/components/MeetingParticipantsList'
import ModalSettingDevices from '@/components/modals/ModalSettingDevices'
import {
  ADD_PARTICIPANT,
  ADD_PARTICIPANTS_MEETING_STATE,
  SET_RAISED_HAND_PARTICIPANT,
  RESET_STATE,
  REMOVE_PARTICIPANTS_MEETING_STATE,
  SET_ENABLED_AUDIO_PARTICIPANT,
  SET_ENABLED_VIDEO_PARTICIPANT,
  STOP_USER_STREAM,
  SET_ONLINE_PARTICIPANT,
  ADD_CHECKPOINT,
  ADD_USER_ID_TO_CHECKPOINT,
  SET_MINUTES_TO_PREPARE,
  SET_STUDENT_EXAM_STATES, ADD_STUDENT_EXAM_STATE,
} from '@/store/mutations.type'
import ModalCheckListener from '@/components/modals/ModalCheckListener'
import { mapGetters, mapMutations, mapState } from 'vuex'
import AttendanceStatistics from '@/components/AttendanceStatisitcs'
import { canStartCheckListeners } from '@/helpers/permissions'
import meetingApi from '@/api/meeting.api'
import streamTypes from '@/helpers/stream.type'
import {
  CHECK_LISTENERS_STARTED, CURRENT_USER_RESET_PREPARATION_TO_EXAM,
  CURRENT_USER_START_PREPARATION_TO_EXAM,
  ERROR_DATA_DOWNLOAD,
} from '@/helpers/toast.messages'
import { contentToastRaisedHand } from '@/toasts'
import { getFullName } from '@/helpers/username.process'

export default {
  name: 'Meeting',
  components: {
    AttendanceStatistics,
    ModalCheckListener,
    ModalSettingDevices,
    MeetingParticipantsList,
    Whiteboard,
    SettingsMediaDevices,
    StreamingArea,
    MeetingChat,
  },
  props: {
    roomId: {
      type: String,
      required: true,
      default: '',
    },
    meetingId: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      tab: null,
      tabChat: null,
      tabStatistic: null,
      isPassedSettingMeeting: false,
      streamType: streamTypes.WEBCAM,

      checkpoint: {
        checkListenersWasStarted: false,
        checkpointId: 0,
        timeout: 20 * 1000,
        timeoutHandler: null,
      },
    }
  },

  computed: {
    ...mapState('meeting', {
      meetingStateOfCurrentUser: (state) => state.meetingStateOfCurrentUser,
      meetingInfo: state => state.meetingInfo
    }),
    ...mapState('auth', {
      currentUser: state => state.currentUser
    }),
    ...mapGetters('meeting', [
      'getParticipantByUserId'
    ]),
    ...mapState("exam", {
      studentExamStates: state => state.studentExamStates
    }),

    isBossOfThisMeeting() {
      return this.currentUser.id === this.meetingInfo.creator.id
    }
  },

  sockets: {
    userConnected(user, userSettingDevices) {
      const participant = this.getParticipantByUserId(user.id)
      if (participant) {
        this.$store.commit(`meeting/${SET_ONLINE_PARTICIPANT}`, {
          userId: user.id,
          online: true
        })
      } else {
        const newParticipant = {
          user,
          online: true,
          peerId: ""
        }
        this.$store.commit(`meeting/${ADD_PARTICIPANT}`, newParticipant)
      }
      const {enabledVideo, enabledAudio} = {...userSettingDevices}
      this.$store.commit(`meeting/${ADD_PARTICIPANTS_MEETING_STATE}`, {
        userId: user.id,
        meetingState: {
          isRaisedHand: false,
          enabledVideo,
          enabledAudio,
        }
      })
    },

    studentConnected(examState) {
      const currentExamState = this.studentExamStates.find(x => x.userId === examState.userId)
      if (!currentExamState) {
        this.$store.commit(`exam/${ADD_STUDENT_EXAM_STATE}`, examState)
      }
    },

    userDisconnected(user) {
      this.$store.commit(`meeting/${SET_ONLINE_PARTICIPANT}`, {
        userId: user.id,
        online: false
      })
      this.$store.commit(`meeting/${REMOVE_PARTICIPANTS_MEETING_STATE}`, user.id)
    },

    checkListeners(checkpoint) {
      this.addCheckpoint({
        ...checkpoint,
        userIds: []
      })
      if (canStartCheckListeners(this.currentUser.id, this.meetingInfo.creator.id)) {
        this.$toast.info(CHECK_LISTENERS_STARTED)
        return
      }
      this.checkpoint.checkpointId = checkpoint.id
      this.checkpoint.checkListenersWasStarted = true

      this.checkpoint.timeoutHandler = setTimeout(
        this.resetCheckpoint,
        this.checkpoint.timeout
      )
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    },

    startPreparation(studentExamStates) {
      this.$store.commit(`exam/${SET_STUDENT_EXAM_STATES}`, studentExamStates)
      if (studentExamStates.find(examState => examState.userId === this.currentUser.id)) {
        this.$toast.info(CURRENT_USER_START_PREPARATION_TO_EXAM)
      }
    },

    resetPreparation(studentExamStates) {
      this.$store.commit(`exam/${SET_STUDENT_EXAM_STATES}`, studentExamStates)
      if (studentExamStates.find(examState => examState.userId === this.currentUser.id)) {
        this.$toast.info(CURRENT_USER_RESET_PREPARATION_TO_EXAM)
      }
    },

    passCheckListeners(checkpointId, userId) {
      this.addUserIdToCheckpoint({
        checkpointId,
        userId
      })
    },

    raisedHand(userId, isRaisedHand) {
      this.$store.commit(`meeting/${SET_RAISED_HAND_PARTICIPANT}`, {
        userId,
        isRaisedHand,
      })
      if (this.isBossOfThisMeeting && isRaisedHand) {
        this.showToastRaisedHand(userId)
      }
    },

    toggleAudio(userId, enabledAudio) {
      this.$store.commit(`meeting/${SET_ENABLED_AUDIO_PARTICIPANT}`, {
        userId,
        enabledAudio,
      })
    },

    changeMinutesToPrepareExam(minutesToPrepare) {
      this.$store.commit(`exam/${SET_MINUTES_TO_PREPARE}`, minutesToPrepare)
    },

    toggleVideo(userId, enabledVideo) {
      this.$store.commit(`meeting/${SET_ENABLED_VIDEO_PARTICIPANT}`, {
        userId,
        enabledVideo,
      })
    },
  },

  beforeDestroy() {
    if (this.isPassedSettingMeeting) {
      this.$store.commit(`meeting/${STOP_USER_STREAM}`)
      this.$store.commit(`meeting/${RESET_STATE}`)
      this.$socket.client.emit('leave-meeting', this.meetingId)
    }
  },

  methods: {
    ...mapMutations('meeting', {
      addCheckpoint: ADD_CHECKPOINT,
      addUserIdToCheckpoint: ADD_USER_ID_TO_CHECKPOINT
    }),

    showToastRaisedHand(userId) {
      const participant = this.getParticipantByUserId(userId)
      if (!participant) {
        console.error("Raised hand toast doesnt show, participant not found!")
        return;
      }
      const toastId = this.$toast(contentToastRaisedHand({
        userFullName: getFullName(participant.user.firstName,
          participant.user.lastName)
      }, {
        click: () => {
          //todo: давать права на рисование
          this.$toast.dismiss(toastId)
        }
      }))
    },

    async handleConfirmSettingDevices(streamType) {
      this.streamType = streamType;
      const meetingId = this.meetingId
      const settingDevices = {
        enabledVideo: this.meetingStateOfCurrentUser.enabledVideo,
        enabledAudio: this.meetingStateOfCurrentUser.enabledAudio
      }
      try {
        await meetingApi.canConnectToMeeting(
          this.roomId,
          this.meetingId
        )
      }
      catch (error) {
        if (error.response.status === 404) {
          return this.$router.push("/404")
        } else if (error.response.status === 400) {
          return this.$router.push("/was-connected-to-meeting")
        }
      }
      this.$store.dispatch(`meeting/fetchCheckpoints`, {
        meetingId
      })
      this.$store.dispatch('meeting/fetchMeetingInfo', {
        meetingId
      })
      try {
        await Promise.all([
          this.$store.dispatch(`meeting/fetchParticipants`, {
            meetingId,
          }),
          this.$store.dispatch(`meeting/fetchParticipantsMeetingState`, {
            meetingId,
          }),
        ])
        if (this.meetingInfo.isExam) {
          this.fetchExam(meetingId)
        }
        this.$socket.client.emit('join-meeting', meetingId, settingDevices)
        this.isPassedSettingMeeting = true

      } catch (error) {
        this.$toast.error(ERROR_DATA_DOWNLOAD)
        console.log(error)
      }
    },

    fetchExam(meetingId) {
      this.$store.dispatch("exam/fetchExamInfo", meetingId)
      this.$store.dispatch("exam/fetchStudentExamStates", meetingId)

    },

    handleConfirmPresence() {
      this.$socket.client.emit(
        'pass-check-listeners',
        this.checkpoint.checkpointId
      )
      this.addUserIdToCheckpoint({
        checkpointId: this.checkpoint.checkpointId,
        userId: this.currentUser.id
      })
      this.resetCheckpoint()
    },

    resetCheckpoint() {
      this.checkpoint.checkListenersWasStarted = false
      this.checkpoint.checkpointId = 0
      this.checkpoint.timeoutHandler = null
    },
  },
}
</script>

<style scoped>
.meeting {
  display: flex;
  justify-content: center;
}
</style>
