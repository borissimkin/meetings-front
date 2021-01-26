<template>
  <div id="video-grid">
  </div>
</template>

<script>
import Peer from "peerjs"
import { getPeerConfig } from "@/peerServer";
import server from "@/server"

export default {
  name: "Videos",
  props: ['roomId', 'userId', 'users'], //todo: store implement
  data() {
    return {
      myPeer: new Peer(undefined, getPeerConfig()),
      videoGrid: null,
      peers: [],
    }
  },
  async mounted() {
    this.peers = await this.fetchPeers();
    console.log(this.peers)
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
          const peer = this.getPeerByPeerId(call.peer)
          if (peer) {
            peer.video = video;
            peer.call = call;
          } else {
            console.log(`peer not found ${call.peer}`);
          }
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
    getPeerByPeerId(peerId) {
      return this.peers.find(peer => peer.peerId === peerId)
    },

    async fetchPeers() {
      //todo: конечно же прорефакторить
      let response = await server.get(`/room/${this.roomId}/peers`)
      console.log({response})
      return response.data;

    },

    connectToNewUser(peerId, userId, stream) {
      const call = this.myPeer.call(peerId, stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        this.addVideoStream(video, userVideoStream)
      })
      call.on('close', () => {
        console.log('remove')
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

<style>
#video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-auto-rows: 400px;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>