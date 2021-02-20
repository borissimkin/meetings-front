<template>
  <div class="chat">
    <div
      id="chat-area"
      class="chat-area"
    >
      <Message
        v-for="message of messages"
        :key="message.id"
        :user="message.user"
        :text="message.message.text"
        :date="message.message.date"
      />
    </div>
    <div class="enter-message">
      <v-textarea
        v-model="inputMessage"
        solo
        label="Написать сообщение..."
        no-resize
        rows="4"
        row-height="20"
        @keyup.enter="sendMessage"
      />
      <div
        class="enter-message__button"
        :class="{'enter-message__button_disabled': isEmptyInputMessage}"
        @click="sendMessage"
      >
        <div @click="sendMessage">
          <v-icon x-large>
            mdi-send
          </v-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import Message from "./Message";
import {mapState} from "vuex"

export default {
  /** todo: может передавать только id?
   * send message {
   *   message: {
   *     text
   *   }
   * }
   *
   * receive message {
   *   user {
   *     id,
   *     firstName,
   *     lastName,
   *   },
   *   message {
   *     id
   *     text,
   *     date
   *   }
   *
   * }**/

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
    ...mapState("auth", {
      currentUser: state => state.currentUser,
    }),

    isEmptyInputMessage() {
      return !/\S/.test(this.inputMessage)
    },
  },

  sockets: {
    newMessage(data) {
      console.log({data})
      this.messages.push(data);
      this.$nextTick(() => {
        this.scrollDown()
      })

    },

    userConnected(userId) {
      console.log(userId);
      // this.messages.push({'text': 'Присоединился', author: {'name': userId}})
    },

    userDisconnected(userId) {
      console.log(userId);
      // this.messages.push({'text': 'Отсоединился', author: {'name': userId}})
    }

  },
  methods: {
    sendMessage() {
      if (this.isEmptyInputMessage) {
        return
      }
      this.$socket.client.emit('new-message', {
        message: {
          text: this.inputMessage
        }
      });
      this.inputMessage = "";
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
  min-height: 700px;
  max-height: 700px;
  overflow-y: auto;
  background-color: #EEEEEE;
  box-shadow: 0 5px 10px #BDBDBD;

}

.enter-message__button {
  display: flex;
}


</style>