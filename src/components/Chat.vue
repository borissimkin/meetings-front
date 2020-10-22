<template>
    <div class="chat">
        <div class="chat-area">
            <Message :author="message.author.name" :text="message.text" v-for="message of messages" :key="message.id"></Message>
        </div>
        <textarea @keyup.enter="sendMessage" v-model="inputMessage" placeholder="Написать сообщение..."></textarea>
        <button  v-on:click="sendMessage" class="send-button">Отправить</button>
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
            /**
             *  Принимает сообщение */
            receiveMessage(data) {
                this.messages.push({'text': data, 'author': {'name': 'Аноним'}})
            },

        },
        methods: {
            sendMessage() {
                /** Отправка сообщения, добавляет это сообщение к себе */
                this.$socket.client.emit('message', this.inputMessage);
                this.messages.push({text: this.inputMessage, author: {name: 'Я'}})
                this.inputMessage = "";
            }

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