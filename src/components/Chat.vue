<template>
  <div class="chat">
    <div id="chat-area" class="chat-area">
      <Message
        v-for="message of messages"
        :key="message.id"
        :date="message.message.date"
        :text="message.message.text"
        :user="message.user"
      />
    </div>
    <v-textarea
      v-model="inputMessage"
      append-icon="mdi-send"
      filled
      label="Сообщение"
      no-resize
      row-height="20"
      rows="3"
      @click:append="sendMessage"
      @keyup.enter="sendMessage"
    />
  </div>
</template>
<script>
import Message from './Message'
import meetingApi from "@/api/meeting.api"
import { mapState } from 'vuex'

export default {
  name: 'Chat',
  components: {
    Message,
  },
  props: {
    meetingId: {
      type: String,
      required: true,
      default: ''
    }
  },

  data() {
    return {
      inputMessage: '',
      users: [],
      messages: [],
    }
  },

  computed: {
    ...mapState('auth', {
      currentUser: (state) => state.currentUser,
    }),

    isEmptyInputMessage() {
      return !/\S/.test(this.inputMessage)
    },
  },

  sockets: {
    newMessage(data) {
      this.messages.push(data)
      this.$nextTick(() => {
        this.scrollDown()
      })
    },

  },

  async mounted() {
    const response = await meetingApi.getMeetingMessages(this.meetingId)
    this.messages =  response.data
    this.$nextTick(() => {
      this.scrollDown()
    })
  },

  methods: {
    sendMessage() {
      if (this.isEmptyInputMessage) {
        return
      }
      this.$socket.client.emit('new-message', {
        message: {
          text: this.inputMessage,
        },
      })
      this.inputMessage = ''
    },

    scrollDown() {
      const chat = document.getElementById('chat-area')
      chat.scrollTop = chat.scrollHeight
    },
  },
}
</script>

<style lang="scss" scoped>

.chat-area {
  display: flex;
  height: 600px;

  flex-direction: column;
  position: relative;
  border-radius: 0.2rem;
  overflow-y: auto;
  background-color: #eeeeee;
  border-bottom: 1px solid #bdbdbd;
}
</style>
