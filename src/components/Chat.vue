<template>
  <div class="chat">
    <div id="chat-area" class="chat-area">
      <Message v-for="message of messages" :key="message.id" :author="message.author.name"
               :text="message.text">
      </Message>
    </div>
    <div class="d-flex">
      <b-textarea v-model="inputMessage" placeholder="Написать сообщение..." @keyup.enter="sendMessage">
      </b-textarea>
      <button class="send-button" v-on:click="sendMessage">Отправить</button>
    </div>
  </div>

</template>
<script>
/**todo: Нужно как то чтобы элементы добавлялись к низу чата, но вместо аншифт был пуш */

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
      if (!this.inputMessage) {
        //todo: сделать кнопку не активной
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
      console.log(chat)
      chat.scrollTop = chat.scrollHeight;
    }

  },
}
</script>

<style scoped>
.chat {
  /*float: right;*/
  padding-right: 50px;
}

.chat-area {
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid black;
  min-width: 300px;
  width: 300px;
  min-height: 800px;
  height: 800px;
  overflow-y: auto;
  /*overflow-x: hidden;*/
}


</style>