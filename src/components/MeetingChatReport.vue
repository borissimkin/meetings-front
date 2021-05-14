<template>
  <div class="chat">
    <Message
      v-for="message of messages"
      :key="message.id"
      :date="message.message.date"
      :text="message.message.text"
      :user="message.user"
    />
  </div>
</template>

<script>
import Message from '@/components/Message'
export default {
  name: 'MeetingChatReport',
  components: { Message },
  props: {
    messages: {
      type: Array,
      required: true,
      default: () => [],
    }
  },
}
</script>

<style scoped>
.chat {
  max-height: 700px;
  overflow: auto;
}

</style>
