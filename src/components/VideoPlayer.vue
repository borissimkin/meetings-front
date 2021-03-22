<template>
  <div class='video-player' ref='video'>
    <video
      :srcObject.prop='stream'
      autoplay>
    </video>
    <v-icon class="video-controls" large color='white' @click='toggleFullScreen'>mdi-fullscreen</v-icon>
  </div>

</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    stream: {
      required: true,
      default: null
    }
  },
  methods: {
    toggleFullScreen() {
      const video = this.$refs.video;
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        }
      }
    }
  }
}
</script>

<style scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 100%;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;

}

.video-controls {
  right: 0;
  bottom: 0;
  position: absolute;
}

</style>
