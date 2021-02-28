<template>
  <div class='meeting p-4'>
    <div>
      <v-tabs v-model='tab'
              background-color='primary'
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
    <Chat />
  </div>
</template>

<script>
import Chat from '@/components/Chat'
import StreamingArea from '@/components/StreamingArea'
import SettingsMediaDevices from '@/components/SettingMediaDevices'
import Whiteboard from '@/components/Whiteboard'

export default {
  name: 'Meeting',
  components: {
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
    }
  },

  sockets: {
    userDisconnected(user) {
      console.log(`Отключился ${user}`)
    },
  },

  mounted() {
    this.$socket.client.emit('join-meeting', this.meetingId)
  },

  beforeDestroy() {
    this.$socket.client.emit('leave-meeting', this.meetingId)
  },
}
</script>

<style scoped>
.meeting {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
