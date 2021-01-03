<template>
  <div >
    <Videos :room-id="id"></Videos>
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