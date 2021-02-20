<template>
  <div
    class="room p-4"
    style=""
  >
    <div>
      <Videos
        :room-id="id"
      />
      <SettingsMediaDevices />
    </div>
    <Chat />
  </div>
</template>

<script>
import Chat from "@/components/Chat";
import Videos from "@/components/Videos";
import SettingsMediaDevices from "@/components/SettingMediaDevices";
export default {
  name: "Room",
  components: {
    SettingsMediaDevices,
    Videos,
    Chat,
  },
  props: {
    id: {
      type: String,
      required: true,
      default: ''
    },

  },
  data() {
    return {
      usersInChatRoom: []
    }
  },

  mounted() {
    this.$socket.client.emit('join-room', this.id);
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