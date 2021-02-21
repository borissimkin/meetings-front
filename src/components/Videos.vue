<template>
  <div>
    <div id="video-grid">
      <video class="post-1" v-if="myStream" autoplay  muted style="border: 1px solid black" :srcObject.prop="myStream"></video>
      <video v-for="peer in peers"
             :key="peer.peerId"
             autoplay
             :srcObject.prop="peer.stream">
      </video>
    </div>
  </div>
</template>

<script>
import Peer from "peerjs"
import { getPeerConfig } from "@/peer.server";
import meetingApi from "@/api/meeting.api";
import {mapState} from "vuex"
import {STOP_USER_STREAM} from "@/store/mutations.type";

/**
 * peer {
 *   user: {
 *     id
 *     firstName
 *     lastName
 *   },
 *   peerId
 *   call,
 *   stream
 * }
 * **/
export default {
  name: "Videos",
  props: {
    roomId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      myPeer: new Peer(undefined, getPeerConfig()),
      peers: [],
      maxCountVideos: 6,
    }
  },
  computed: {
    ...mapState("meeting", {
      myStream: state => state.userStream,
    })
  },
  async mounted() {
    await this.fetchPeers();
    console.log({peers: this.peers})
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      this.$store.dispatch("meeting/setUserStream", stream)
      this.myPeer.on('call', call => {
        call.answer(this.myStream);
        call.on('stream', userStream => {
          const peer = this.getPeerByPeerId(call.peer)
          if (peer) {
            this.$set(peer, "stream", userStream)
            this.$set(peer, "call", call)
          } else {
            console.log(`peer not found ${call.peer}`);
          }
        })
      })
      this.$socket.client.on('callConnected', (user, peerId) => {
        this.connectToNewUser(user, peerId, this.myStream)
      })
    });
    this.myPeer.on('open', peerId => {
      this.$socket.client.emit('call-connect', peerId)
    })


  },

  beforeDestroy() {
    this.myPeer.destroy()
    this.$store.commit(`meeting/${STOP_USER_STREAM}`)
  },

  sockets: {
    userDisconnected(user) {
      //todo: проблема в том что щас один пользователь может создавать кучу стримов
      let indexPeerElement = this.peers.findIndex(peer => {
        return peer.user.id === user.id
      })
      if (indexPeerElement === -1) {
        return
      }
      const peer = this.peers[indexPeerElement];
      peer.call.close();
      this.peers.splice(indexPeerElement, 1);
    }

  },

  methods: {
    getPeerByPeerId(peerId) {
      return this.peers.find(peer => peer.peerId === peerId)
    },

    async fetchPeers() {
      let response = await meetingApi.getPeers(this.roomId);
      this.peers = response.data;
    },

    connectToNewUser(user, peerId, stream) {
      const call = this.myPeer.call(peerId, stream)
      const peer = {
        user,
        peerId,
        call,
      }
      call.on('stream', userStream => {
        this.$set(peer, "stream", userStream)
      })

      call.on('close', () => {
        console.log('call close')
        //todo: надо подумать, может быть что когда дисконектед то в обработке сокета уже все делается
        // this.peers.
        // video.remove()
      })
      this.peers.push(peer)
    },
  }

}
</script>

<style scoped lang="scss">
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