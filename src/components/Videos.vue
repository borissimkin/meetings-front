<template>
  <div id="video-grid" />
<!--  <div>-->
<!--    <button @click="testOffMedia">Выключить</button>-->
<!--    <button @click="testOnMedia">Включить</button>-->
<!--  </div>-->
</template>

<script>
import Peer from "peerjs"
import { getPeerConfig } from "@/peerServer";
import server from "@/server"

export default {
  name: "Videos",
  props: {
    roomId: {
      type: Number,
      required: true,
    },
    //todo: в стор
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      myPeer: new Peer(undefined, getPeerConfig()),
      myStream: null,
      videoGrid: null,
      peers: [],
      maxCountVideos: 6,
    }
  },
  async mounted() {
    this.peers = await this.fetchPeers();
    const myVideo = document.createElement('video')
    myVideo.classList.add('post-1')
    this.videoGrid = document.getElementById('video-grid')
    myVideo.muted = true
    try {
      this.myStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      this.addVideoStream(myVideo, this.myStream);

    } catch (error) {
      console.log({ error })
    }
    console.log('awdawda')
    this.myPeer.on('open', peerId => {
      console.log(peerId)
      this.$socket.client.emit('call-connect', peerId, this.userId)
    })

  },

  sockets: {
    userDisconnected(userId) {
      let indexPeerElement = this.peers.findIndex(x => {
        return x.userId === userId
      })
      if (indexPeerElement === -1) {
        return
      }
      const peer = this.peers[indexPeerElement];
      const video = peer.video;
      video.remove();
      peer.call.close();
      this.peers.splice(indexPeerElement, 1);
    }

  },

  methods: {
    testOffMedia() {
      // console.log(this.myStream.getTracks(), this.myStream.getAudioTracks(), this.myStream.getVideoTracks())

      const tracks = this.myStream.getTracks()
      for (let track of tracks) {
        track.enabled = false
      }

      // console.log(tracks)
    },

    testOnMedia() {
      const tracks = this.myStream.getTracks()
      for (let track of tracks) {
        track.enabled = true
      }
    },

    getPeerByPeerId(peerId) {
      return this.peers.find(peer => peer.peerId === peerId)
    },

    async fetchPeers() {
      //todo: конечно же прорефакторить
      let response = await server.get(`/room/${this.roomId}/peers`)
      return response.data;
    },

    connectToNewUser(peerId, userId, stream) {
      console.log('connect new user')
      const call = this.myPeer.call(peerId, stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        this.addVideoStream(video, userVideoStream)
      })
      call.on('close', () => {
        video.remove()
      })
      this.peers.push(
          {
            userId: userId,
            peerId: peerId,
            call: call,
            video: video
          }
      )
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

<style lang="scss">
#video-grid {
  display: grid;
  grid-template-areas: "post-1 post-1 post-2"
                       "post-1 post-1 post-3"
                       "post-6 post-5 post-4";
  grid-template-rows: repeat(3, 200px);
  grid-template-columns: repeat(3, 1fr);
}
.post-1 {
  grid-area: post-1;
}

.post-2 {
  grid-area: post-2;

}
.post-3 {
  grid-area: post-3;
}

.post-4 {
  grid-area: post-4;
}

.post-5 {
  grid-area: post-5;
}

.post-6 {
  grid-area: post-6;
}


video {
  height: 100%;
  object-fit: cover;
}

</style>