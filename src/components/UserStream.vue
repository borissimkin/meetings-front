<template>
  <div class='user-stream'>
    <video :srcObject.prop='stream' autoplay class='user-stream__video'>
    </video>
    <!--    <div class="user-stream__name">{{ "Борис Симкин" }}</div>-->
  </div>
</template>

<script>
export default {
  name: 'UserStream',
  props: {
    user: {
      required: true,
      type: Object,
      default: () => {
      },
    },
    stream: {
      required: true,
      type: MediaStream,
      default: () => { },
    },
  },
}
</script>

<style lang='scss' scoped>
.user-stream {
  width: 100%;
  height: 100%;
  background-color: gray;

  &__name {
    color: white;
  }

  &__video {
    height: 100%;
    object-fit: cover;
  }
}
</style>
