<template>
  <div class='room p-4'>
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
          <StreamingArea :room-id='id' />
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
  name: 'Room',
  components: {
    Whiteboard,
    SettingsMediaDevices,
    StreamingArea,
    Chat,
  },
  props: {
    id: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      usersInChatRoom: [],
      tab: null,
    }
  },

  mounted() {
    this.$socket.client.emit('join-room', this.id)
  },

  beforeDestroy() {
    this.$socket.client.emit('disconnect')
  },
}
</script>

<style scoped>
.room {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
