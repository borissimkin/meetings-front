<template>
  <div class="chat">
    <div
      id="chat-area"
      class="chat-area"
    >
      <Message
        v-for="message of messages"
        :key="message.id"
        :author="message.author.name"
        :text="message.text"
      />
    </div>
    <div class="enter-message">
      <b-form-textarea
        v-model="inputMessage"
        class="enter-message__area"
        size="sm"
        rows="3"
        no-resize
        placeholder="Написать сообщение..."
        @keyup.enter="sendMessage"
      />
      <div
        class="enter-message__button p-4"
        :class="{'enter-message__button_disabled': isEmptyInputMessage}"
        @click="sendMessage"
      >
        <b-icon-triangle-half
          rotate="90"
          scale="2"
        />
      </div>
    </div>
  </div>
</template>
<script>

import Message from "./Message";


export default {
  name: "Chat",
  components: {
    Message,

  },

  data() {
    return {
      "inputMessage": "",
      "users": [],
      "messages": [],

    }
  },

  computed: {
    isEmptyInputMessage() {
      return !/\S/.test(this.inputMessage)
    },
  },

  sockets: {
    newMessage(data) {
      this.messages.push({'text': data, 'author': {'name': 'Аноним'}})
    },

    userConnected(userId) {
      this.messages.push({'text': 'Присоединился', author: {'name': userId}})
    },

    userDisconnected(userId) {
      this.messages.push({'text': 'Отсоединился', author: {'name': userId}})
    }

  },
  methods: {
    sendMessage() {
      if (this.isEmptyInputMessage) {
        return
      }
      this.$socket.client.emit('new-message', this.inputMessage);
      this.messages.push({text: this.inputMessage, author: {name: 'Я'}})
      this.inputMessage = "";
      this.$nextTick(() => {
        this.scrollDown()
      })
    },

    scrollDown() {
      const chat = document.getElementById('chat-area')
      chat.scrollTop = chat.scrollHeight;
    }

  },
}
</script>

<style scoped lang="scss">
.enter-message {
  display: flex;

  &__area {
    background-color: #444444;
    color: white;
    outline: none;
    border:1px solid #656565

  }

  &__area:focus {
    background-color: #444444;
    color: white;
    box-shadow: 0 0 10px #656565;
    outline: none;
    border:1px solid #656565
  }

  &__button {
    display: flex;
    align-items: center;
    cursor: pointer;

    &_disabled {
      cursor: default;
      opacity: .5;
    }
  }
}

.chat {
}

.chat-area {
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 0.2rem;
  min-width: 300px;
  width: 300px;
  min-height: 800px;
  height: 800px;
  overflow-y: auto;
  background-color: #333333;

}


</style>