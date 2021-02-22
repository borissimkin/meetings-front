<template>
  <div class='room p-4'>
    <div>
      <StreamingArea :room-id='id' />
      <SettingsMediaDevices />
    </div>
    <Chat />
  </div>
</template>

<script>
import Chat from '@/components/Chat'
import StreamingArea from '@/components/StreamingArea'
import SettingsMediaDevices from '@/components/SettingMediaDevices'

export default {
  name: 'Room',
  components: {
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
    }
  },

  mounted() {
    this.$socket.client.emit('join-room', this.id)
  },

  beforeDestroy() {
    this.$socket.client.emit('disconnect')
  }
}
</script>

<style scoped>
.room {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
