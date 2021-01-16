<template>
  <div id="video-grid"></div>
</template>

<script>
import Peer from "peerjs"
export default {
  name: "Videos",
  props: ['roomId', 'userId'], //todo: userId to store
  data() {
    return {
      myPeer: new Peer(undefined, {
        host: '/',
        port: 3001,
      }),
      videoGrid: null,
      peers: {},
    }
  },
  mounted() {
    const myVideo = document.createElement('video')
    this.videoGrid = document.getElementById('video-grid')
    myVideo.muted = true
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      this.addVideoStream(myVideo, stream);

      this.myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          this.addVideoStream(video, userVideoStream)
        })
      })

      this.$socket.client.on('callConnected', (peerId, userId) => {
        this.connectToNewUser(peerId, userId, stream)
      })


    });

    this.myPeer.on('open', peerId => {
      this.$socket.client.emit('call-connect', peerId, this.userId)
    })

  },

  sockets: {
    userDisconnected(userId) {
      console.log(`disconnect ${userId}`)
      if (this.peers[userId]) {
        this.peers[userId].close()
      }
    }
    //todo: call disconnected

  },

  methods: {
    connectToNewUser(peerId, userId, stream) {
      const call = this.myPeer.call(peerId, stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        this.addVideoStream(video, userVideoStream)
      })
      call.on('close', () => {
        video.remove()
      })
      this.peers[peerId] = call;
    },

    addVideoStream(video, stream) {
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => {
        video.play()
      });
      this.videoGrid.append(video);

    }
  }

}
</script>

<style scoped>
#video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-auto-rows: 100px;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>