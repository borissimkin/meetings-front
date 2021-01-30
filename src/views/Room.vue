<template>
  <div class="room p-4" style="">
    <div>
      <Videos
          :room-id="id"
          :user-id="userId"
      />
      <SettingsMediaDevices></SettingsMediaDevices>
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
      userId: '' + Math.random(),
      usersInChatRoom: []
    }
  },

  mounted() {
    this.$socket.client.emit('join-room', this.id, this.userId);
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