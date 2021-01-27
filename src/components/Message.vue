<template>
  <div class="message m-2 p-2">
    <div class="message-text">
      {{ text }}
    </div>
    <div class="author">
      <div class="author-text">
        {{ author }}
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
  background-color: #6078f3;
  text-align: left;
  border-radius: 0.1rem;
  bottom: 0;
  min-width: 250px;

}

.message-text {
  word-wrap:break-word;
  color: white;
  font-size: .8rem;
}

.author-text {
  font-size: 0.75rem;
  padding-right: 0.5rem;
  color: white;


}

</style>