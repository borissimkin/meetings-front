<template>
  <div>
    <div id='video-grid'>
      <div class='post-1' :class="{'speaking': isSpeaking($store.state.auth.currentUser.id)}">
        <template v-if='myStream'>
          <video :srcObject.prop='myStream' autoplay muted></video>
        </template>
        <template v-else>
          <VideoStreamPlaceholder :user='$store.state.auth.currentUser'></VideoStreamPlaceholder>
        </template>
        <span class='stream-name'>{{ getName($store.state.auth.currentUser) }}</span>
      </div>
      <div v-for='(peer, index) in peers' :key='`${peer.peerId}-${peer.user.id}`'
           :class="{'hidden-stream': isHiddenStream(index),
                    'speaking': isSpeaking(peer.user.id)}"
           class='video-stream'>
        <template v-if='peer.stream'>
          <video
            :srcObject.prop='peer.stream'
            autoplay>
          </video>
          <span class='stream-name'>{{ getName(peer.user) }}</span>
        </template>
        <template v-else>
          <VideoStreamPlaceholder :user='peer.user'></VideoStreamPlaceholder>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Peer from 'peerjs'
import { getPeerConfig } from '@/peer.server'
import { mapMutations, mapState } from 'vuex'
import {
  ADD_SPEAKING_USER_ID,
  REMOVE_SPEAKING_USER_ID,
  STOP_USER_STREAM,
} from '@/store/mutations.type'
import VideoStreamPlaceholder from '@/components/VideoStreamPlaceholder'
import { getFullName } from '@/helpers/username.process'
import hark from 'hark'

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
  name: 'StreamingArea',
  components: { VideoStreamPlaceholder },
  props: {
    meetingId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      myPeer: new Peer(undefined, getPeerConfig()),
      maxCountVideos: 6,
    }
  },
  computed: {
    ...mapState('meeting', {
      myStream: (state) => state.userStream,
      peers: (state) => state.participants,
      speakingUserIds: (state => state.speakingUserIds)
    }),
  },
  mounted() {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.$store.dispatch('meeting/setUserStream', stream)

        const speechEvents = hark(this.myStream, {})
        speechEvents.on('speaking', this.speakHandler)
        speechEvents.on('stopped_speaking', this.stopSpeakHandler)
        //todo: если уже есть в комнате то не давать стрим

        this.myPeer.on('call', (call) => {
          console.log({ call })
          call.answer(this.myStream)
          call.on('stream', (userStream) => {
            const peer = this.getPeerByPeerId(call.peer)
            if (peer) {
              this.$set(peer, 'stream', userStream)
              this.$set(peer, 'call', call)
            } else {
              console.log(`peer not found ${call.peer}`)
            }
          })
        })
        this.$socket.client.on('callConnected', (user, peerId) => {
          this.connectToNewUser(user, peerId, this.myStream)
        })
      })
    this.myPeer.on('open', (peerId) => {
      this.$socket.client.emit('call-connect', peerId)
    })
  },

  beforeDestroy() {
    this.myPeer.destroy()
    this.$store.commit(`meeting/${STOP_USER_STREAM}`)
  },

  sockets: {
    userDisconnected(user) {
      //todo: проблема в том что щас один пользователь может создавать кучу стримов (щас неверно закрываются стримы)
      let indexPeerElement = this.peers.findIndex((peer) => {
        return peer.user.id === user.id
      })
      if (indexPeerElement === -1) {
        return
      }
      const peer = this.peers[indexPeerElement]
      if (peer.call) {
        peer.call.close()
      }
      this.peers.splice(indexPeerElement, 1)
    },
    userSpeak(user) {
      this.addSpeakingUserId(user.id)
    },

    userStopSpeak(user) {
      this.removeSpeakingUserId(user.id)
    },
  },

  methods: {
    ...mapMutations('meeting', {
      addSpeakingUserId: ADD_SPEAKING_USER_ID,
      removeSpeakingUserId: REMOVE_SPEAKING_USER_ID,
    }),
    isSpeaking(userId) {
      return this.speakingUserIds.includes(userId)

    },
    getName(user) {
      return getFullName(user.firstName, user.lastName)
    },

    speakHandler() {
      this.addSpeakingUserId(this.$store.state.auth.currentUser.id)
      this.$socket.client.emit('user-speak')
    },

    stopSpeakHandler() {
      this.removeSpeakingUserId(this.$store.state.auth.currentUser.id)
      this.$socket.client.emit('user-stop-speak')
    },

    isHiddenStream(index) {
      return index > this.maxCountVideos
    },

    getPeerByPeerId(peerId) {
      return this.peers.find((peer) => peer.peerId === peerId)
    },

    connectToNewUser(user, peerId, stream) {
      console.log({user, peerId, stream})
      const call = this.myPeer.call(peerId, stream)
      const peer = {
        user,
        peerId,
        call,
      }
      call.on('stream', (userStream) => {
        this.$set(peer, 'stream', userStream)
      })

      call.on('close', () => {
        console.log('call close')
        //todo: надо подумать, может быть что когда дисконектед то в обработке сокета уже все делается
        // this.peers.
        // video.remove()
      })
      this.peers.push(peer)
    },
  },
}
</script>

<style lang='scss' scoped>
#video-grid {
  display: grid;
  grid-template-areas:
    'post-1 post-1 post-2'
    'post-1 post-1 post-3'
    'post-6 post-5 post-4';
  grid-template-rows: repeat(3, 200px);
  grid-template-columns: repeat(3, 300px);

}

.speaking {
  border: 5px solid #7b7dbd;
  box-shadow: 0 0 20px #48496d;
}

.stream-name {
  position: absolute;
  left: 0;
  bottom: 0;
  color: white;
  padding: 5px;
}

.hidden-stream {
  visibility: hidden;
}

.video-stream {
  position: relative;
}

.post-1 {
  @extend .video-stream;
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
  width: 100%;
  height: auto;
  max-height: 100%;
  //height: 100%;
  //width: 100%;
  object-fit: cover;
}

</style>
