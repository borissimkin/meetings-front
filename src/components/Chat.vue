<template>
    <div class="chat-area">
        <Message :author="message.author.name" :text="message.text" v-for="message of messages" :key="message.id"></Message>
        <textarea v-model="inputMessage" placeholder="Написать сообщение..."></textarea>
        <button v-on:click="sendMessage" class="send-button">Отправить</button>

<!--        <form action="">-->
<!--            < v-model="message" id="m" autocomplete="off" /><button>Send</button>-->
<!--        </form>-->
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
                "newMessage": '',

            }
        },

        sockets: {
            /**
             * Принимает сообщение */
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
    .chat-area {
        border: 1px solid black;
        width: 50%;
    }


</style>