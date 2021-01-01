<template>
  <div style="display: flex">
      <TestVideo></TestVideo>
      <Chat></Chat>
  </div>
</template>

<script>
import TestVideo from "../components/TestVideo";
import Chat from "@/components/Chat";
export default {
  name: "Room",
  components: {
    Chat,
    TestVideo,
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
    this.$socket.client.emit('join-room', this.id, Math.random());
  },

}
</script>

<style scoped>

</style>