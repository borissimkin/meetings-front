<template>
    <div class="message">
        <div class="message-area">
            <div class="message-text">
                {{text}}
            </div>
        </div>
        <div class="author">
            <div class="author-text">
                {{author}}
            </div>
        </div>
    </div>
    
</template>

<script>
    export default {
        name: "Message",
        props: {
            text: String,
            author: String,
        },
        methods: {

        },

    }
</script>

<style scoped>
    .message {
        background-color: cornflowerblue;
        text-align: right;
        margin-top: 1rem;
        margin-bottom: 1rem;
        width: 50%;

    }

    .message-text {
        color: white;
        padding-right: 1rem;
    }

    .author-text {
        font-size: 0.75rem;
        padding-right: 0.5rem;

    }

</style>