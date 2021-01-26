<template>
  <div style="display: flex; justify-content: space-between">
    <Videos :room-id="id" :user-id="userId"></Videos>
    <Chat></Chat>
  </div>
</template>

<script>
import Chat from "@/components/Chat";
import Videos from "@/components/Videos";
export default {
  name: "Room",
  components: {
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

</style>