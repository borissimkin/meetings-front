<template>
  <div>
    <template v-if='!isPassedSettingMeeting'>
      <ModalSettingDevices @setting-pass='isPassedSettingMeeting = true'/>
    </template>
    <template v-else>
      <div class='meeting p-4'>
        <div>
          <v-tabs v-model='tab'
                  background-color='secondary'
                  dark>
            <v-tab>
              Стримы
            </v-tab>
            <v-tab>
              Доска
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model='tab'>
            <v-tab-item>
              <StreamingArea :meeting-id='meetingId' />
              <SettingsMediaDevices />
            </v-tab-item>
            <v-tab-item :eager='true'>
              <Whiteboard :height='600' :width='900' style='min-width: 900px; min-height: 600px'></Whiteboard>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <v-card max-height='600px' max-width='300px' min-height='600px' min-width='300px' flat>
          <v-tabs
            class='rounded-0'
            v-model="tabChat"
            fixed-tabs
            dark
            background-color='secondary'
          >
            <v-tab>
              <v-icon>mdi-message</v-icon>
            </v-tab>

            <v-tab>
              <v-icon>mdi-account-group</v-icon>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabChat">
            <v-tab-item >
              <Chat :meeting-id='meetingId' />
            </v-tab-item>
            <v-tab-item>
              <MeetingParticipantsList />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </div>
    </template>
    <ModalCheckListener :checkpoint-id='checkpoint.checkpointId'
                        :check-listeners-was-started='checkpoint.checkListenersWasStarted'
                        @confirm-presence='handleConfirmPresence'>
    </ModalCheckListener>
  </div>
</template>

<script>
import Chat from '@/components/Chat'
import StreamingArea from '@/components/StreamingArea'
import SettingsMediaDevices from '@/components/SettingMediaDevices'
import Whiteboard from '@/components/Whiteboard'
import MeetingParticipantsList from '@/components/MeetingParticipantsList'
import ModalSettingDevices from '@/components/ModalSettingDevices'
import { ADD_PARTICIPANT, REMOVE_PARTICIPANT } from '@/store/mutations.type'
import ModalCheckListener from '@/components/ModalCheckListener'

export default {
  name: 'Meeting',
  components: {
    ModalCheckListener,
    ModalSettingDevices,
    MeetingParticipantsList,
    Whiteboard,
    SettingsMediaDevices,
    StreamingArea,
    Chat,
  },
  props: {
    roomId: {
      type: String,
      required: true,
      default: ''
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
      isPassedSettingMeeting: false,

      checkpoint: {
        checkListenersWasStarted: false,
        checkpointId: 0,
        timeout: 20 * 1000,
        timeoutHandler: null
      },
    }
  },

  sockets: {
    userConnected(user) {
      this.$store.commit(`meeting/${ADD_PARTICIPANT}`, { user })
    },

    userDisconnected(user) {
      this.$store.commit(`meeting/${REMOVE_PARTICIPANT}`, user.id)
    },

    checkListeners(checkpoint) {
      this.checkpoint.checkpointId = checkpoint.id;
      this.checkpoint.checkListenersWasStarted = true

      this.checkpoint.timeoutHandler = setTimeout(this.resetCheckpoint, this.checkpoint.timeout)
    }

  },

  mounted() {
    this.$socket.client.emit('join-meeting', this.meetingId)
    this.$store.dispatch('meeting/fetchMeetingInfo', {
      meetingId: this.meetingId
    })
    this.$store.dispatch(`meeting/fetchParticipants`, {
      meetingId: this.meetingId
    })
  },

  beforeDestroy() {
    this.$socket.client.emit('leave-meeting', this.meetingId)
  },

  methods: {
    handleConfirmPresence() {
      this.$socket.client.emit('pass-check-listeners', this.checkpoint.checkpointId)
      this.resetCheckpoint()
    },

    resetCheckpoint() {
      this.checkpoint.checkListenersWasStarted = false
      this.checkpoint.checkpointId = 0;
      this.checkpoint.timeoutHandler = null
    }
  }
}
</script>

<style scoped>
.meeting {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}


</style>
