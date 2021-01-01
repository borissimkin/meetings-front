<template>
  <div class="chat">
    <div class="chat-area">
      <Message v-for="message of messages" :key="message.id" :author="message.author.name"
               :text="message.text"></Message>
    </div>
    <textarea v-model="inputMessage" placeholder="Написать сообщение..." @keyup.enter="sendMessage"></textarea>
    <button class="send-button" v-on:click="sendMessage">Отправить</button>
  </div>

</template>
<script>
/**todo: Переделать это */

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
      "newMessage": '',

    }
  },

  sockets: {
    newMessage(data) {
      this.messages.push({'text': data, 'author': {'name': 'Аноним'}})
    },

    userConnected(userId) {
      this.messages.push({'text': 'Присоединился', author: {'name': userId }})
    },

    userDisconnected(userId) {
      this.messages.push({'text': 'Отсоединился', author: {'name': userId }})
    }

  },
  methods: {
    sendMessage() {
      this.$socket.client.emit('new-message', this.inputMessage);
      this.messages.push({text: this.inputMessage, author: {name: 'Я'}})
      this.inputMessage = "";
    },

  },
}
</script>

<style scoped>
.chat {
  float: right;
  padding-right: 50px;
}

.chat-area {
  position: relative;
  border: 1px solid black;
  min-width: 400px;
  width: 400px;
  min-height: 800px;
  height: 800px;
  overflow-y: auto;
}


</style>