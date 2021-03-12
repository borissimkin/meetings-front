<template>
  <div>
    <div id='video-grid'>
      <div :class="{'speaking': isSpeakingCurrentUser}" class='post-1'>
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
import { mapGetters, mapMutations, mapState } from 'vuex'
import {
  SET_IS_SPEAKING_CURRENT_USER,
  SET_IS_SPEAKING_PARTICIPANT, SET_CALL_TO_PARTICIPANT,
  SET_STREAM_TO_PARTICIPANT,
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
      isSpeakingCurrentUser: (state) => state.meetingStateOfCurrentUser.isSpeaking,
      participantsMeetingState: (state) => state.participantsMeetingState
    }),
    ...mapGetters('meeting',
      ['getParticipantByPeerId']
    ),
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

        this.myPeer.on('call', (call) => {
          call.answer(this.myStream)
          call.on('stream', (userStream) => {
            const participant = this.getParticipantByPeerId(call.peer)
            if (participant) {
              this.$store.commit(`meeting/${SET_STREAM_TO_PARTICIPANT}`, {
                userId: participant.user.id,
                stream: userStream
              })
              this.$store.commit(`meeting/${SET_CALL_TO_PARTICIPANT}`, {
                userId: participant.user.id,
                call
              })
            } else {
              console.log(`participant not found ${call.peer}`)
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
    userSpeak(user) {
      const payload = {
        userId: user.id,
        isSpeaking: true
      }
      this.setIsSpeakingParticipant(payload)
    },

    userStopSpeak(user) {
      const payload = {
        userId: user.id,
        isSpeaking: false
      }
      this.setIsSpeakingParticipant(payload)
    },
  },

  methods: {
    ...mapMutations('meeting', {
      setIsSpeakingCurrentUser: SET_IS_SPEAKING_CURRENT_USER,
      setIsSpeakingParticipant: SET_IS_SPEAKING_PARTICIPANT,
    }),
    participantIsSpeaking(userId) {
      return this.participantsMeetingState[userId]?.isSpeaking

    },
    getName(user) {
      return getFullName(user.firstName, user.lastName)
    },

    speakHandler() {
      this.setIsSpeakingCurrentUser(true)
      this.$socket.client.emit('user-speak')
    },

    stopSpeakHandler() {
      this.setIsSpeakingCurrentUser(false)
      this.$socket.client.emit('user-stop-speak')
    },

    isHiddenStream(index) {
      return index > this.maxCountVideos
    },

    connectToNewUser(user, peerId, stream) {
      const call = this.myPeer.call(peerId, stream)
      call.on('stream', (userStream) => {
        this.$store.commit(`meeting/${SET_STREAM_TO_PARTICIPANT}`,
          {
            userId: user.id,
            stream: userStream,
          })
      })
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
