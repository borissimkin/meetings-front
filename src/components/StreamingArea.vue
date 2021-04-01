<template>
  <div>
    <div id='video-grid'>
      <div :class="{'speaking': meetingStateOfCurrentUser.isSpeaking}" class='post-1'>
        <VideoPlayer v-show='isShowStreamCurrentUser' :stream='streamCurrentUser' muted></VideoPlayer>
        <VideoStreamPlaceholder v-show='!isShowStreamCurrentUser' :user='currentUser'></VideoStreamPlaceholder>
        <span class='stream-name'>{{ getName(currentUser) }}</span>
      </div>
      <template v-for='(place, index) in Object.keys(streamPlaces)'>
        <div v-if='streamPlaces[place]'
             :key='`place-${index}`'
             :class='place'
        >

          <div :class="{'speaking': participantIsSpeaking(streamPlaces[place].user.id)}"
               style='width: 100%; height: 100%'>
            <VideoPlayer v-show='isShowStreamParticipant(streamPlaces[place].stream, streamPlaces[place].user.id)'
                         :stream='streamPlaces[place].stream'>

            </VideoPlayer>
            <VideoStreamPlaceholder
              v-show='!isShowStreamParticipant(streamPlaces[place].stream, streamPlaces[place].user.id)'
              :key='`place-${index}`' :user='streamPlaces[place].user'>

            </VideoStreamPlaceholder>
            <span :key='`name-${streamPlaces[place].user.id}`' class='stream-name'>{{ getName(streamPlaces[place].user)
              }}</span>

          </div>

        </div>
        <template v-else>
          <div :key='`place-${index}`'
               :class='place'
               class='video-placeholder'
               v-bind:style="{ 'background-image': 'url(' + placeholderImage + ')'}" />
        </template>
      </template>
      <video v-for='stashedParticipant in stashedParticipantsStream'
             v-show='false'
             :key='`stashed-stream-${stashedParticipant.user.id}`'
             :srcObject.prop='stashedParticipant.stream'
             autoplay />
    </div>
  </div>
</template>

<script>
import Peer from 'peerjs'
import { getPeerConfig } from '@/peer.server'
import { mapGetters, mapMutations, mapState } from 'vuex'
import {
  SET_CALL_TO_PARTICIPANT,
  SET_IS_SPEAKING_CURRENT_USER,
  SET_IS_SPEAKING_PARTICIPANT,
  SET_STREAM_TO_PARTICIPANT,
  STOP_USER_STREAM,
} from '@/store/mutations.type'
import VideoStreamPlaceholder from '@/components/VideoStreamPlaceholder'
import { getFullName } from '@/helpers/username.process'
import hark from 'hark'
import VideoPlayer from '@/components/VideoPlayer'
import streamTypes from '@/helpers/stream.type'
import { concatDesktopStreamAndAudioStream } from '@/helpers/stream.process'
import { ERROR_MEDIA_DEVICES, ERROR_MICRO } from '@/helpers/toast.messages'
//todo: все таки вынести видео в отдельные компоненты
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
  components: { VideoPlayer, VideoStreamPlaceholder },
  props: {
    meetingId: {
      type: String,
      required: true,
    },
    streamType: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      myPeer: new Peer(undefined, getPeerConfig()),
      maxCountVideos: 6,
      placeholderImage: require('@/assets/stream-placeholder.png'),
    }
  },
  computed: {
    ...mapState('meeting', {
      streamCurrentUser: (state) => state.userStream,
      meetingStateOfCurrentUser: (state) => state.meetingStateOfCurrentUser,
      participantsMeetingState: (state) => state.participantsMeetingState,
    }),
    ...mapState('auth', {
      currentUser: state => state.currentUser,
    }),

    ...mapGetters('meeting',
      ['getParticipantByPeerId', 'onlineParticipants'],
    ),

    isShowStreamCurrentUser() {
      return this.streamCurrentUser && this.meetingStateOfCurrentUser.enabledVideo
    },

    streamPlaces() {
      const places = {}
      //todo: пока что в главном окне всегда текущий пользователь, потом переделается
      //todo: пока что тупой вариант без приоритетов
      for (let i = 1; i < this.maxCountVideos; i++) {
        places[`post-${i + 1}`] = this.onlineParticipants[i - 1]
      }
      return places
    },

    stashedParticipantsStream() {
      return this.onlineParticipants.filter(participant => {
        for (let place of Object.keys(this.streamPlaces)) {
          const streamPlace = this.streamPlaces[place]
          if (!streamPlace) {
            continue
          }
          const user = streamPlace.user
          if (user) {
            if (user.id === participant.id) {
              return false
            }
          }
        }
        return true
      })
    },
  },
  mounted() {
    if (this.streamType === streamTypes.WEBCAM) {
      this.initWebcamStream()
    } else if (this.streamType === streamTypes.DESKTOP) {
      this.initDesktopStream()
    } else {
      console.error(`Stream type=${this.streamType} not found`)
      return
    }

    this.myPeer.on('open', (peerId) => {
      this.$socket.client.emit('call-connect', peerId)
    })
  },

  beforeDestroy() {
    this.myPeer.destroy()
    this.$store.commit(`meeting/${STOP_USER_STREAM}`)
  },

  sockets: {
    callConnected(user, peerId) {
      this.connectToNewUser(user, peerId, this.streamCurrentUser)
    },

    userSpeak(user) {
      const payload = {
        userId: user.id,
        isSpeaking: true,
      }
      this.setIsSpeakingParticipant(payload)
    },

    userStopSpeak(user) {
      const payload = {
        userId: user.id,
        isSpeaking: false,
      }
      this.setIsSpeakingParticipant(payload)
    },
  },

  methods: {
    ...mapMutations('meeting', {
      setIsSpeakingCurrentUser: SET_IS_SPEAKING_CURRENT_USER,
      setIsSpeakingParticipant: SET_IS_SPEAKING_PARTICIPANT,
    }),

    callInit(stream) {
      this.$store.dispatch('meeting/setUserStream', stream)
      this.myPeer.on('call', this.answerToCall)
    },

    initSpeechDetection(stream) {
      const speechEvents = hark(stream, {})
      speechEvents.on('speaking', this.speakHandler)
      speechEvents.on('stopped_speaking', this.stopSpeakHandler)
    },

    answerToCall(call) {
      call.answer(this.streamCurrentUser)
      call.on('stream', (userStream) => {
        const participant = this.getParticipantByPeerId(call.peer)
        if (participant) {
          this.$store.commit(`meeting/${SET_STREAM_TO_PARTICIPANT}`, {
            userId: participant.user.id,
            stream: userStream,
          })
          this.$store.commit(`meeting/${SET_CALL_TO_PARTICIPANT}`, {
            userId: participant.user.id,
            call,
          })
        } else {
          console.log(`participant not found ${call.peer}`)
        }
      })
    },

    isShowStreamParticipant(stream, userId) {
      return stream && this.participantsMeetingState[userId]?.enabledVideo

    },
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

    initWebcamStream() {
      const constraints = {
        video: true,
        audio: true,
      }
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          this.initSpeechDetection(stream)
          this.callInit(stream)
        })
        .catch((error) => {
          console.error(error)
          this.$toast.error(ERROR_MEDIA_DEVICES)
        })
    },

    initDesktopStream() {
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then( async (stream) => {
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({audio: true})
            const concatenatedStream = concatDesktopStreamAndAudioStream(stream, audioStream)
            this.initSpeechDetection(concatenatedStream)
            this.callInit(concatenatedStream)
          } catch (error) {
            console.log(error)
            this.$toast.error(ERROR_MICRO)
            this.callInit(stream)
          }
        })
        .catch((error) => {
          console.error(error)
          this.$toast.error(ERROR_MEDIA_DEVICES)
        })
    }
  },
}
</script>

<style lang='scss' scoped>
$border-color: #cdcdcd;


#video-grid {
  border: 1px solid $border-color;
  border-right: 0;
  display: grid;
  grid-template-areas:
    'post-1 post-1 post-2'
    'post-1 post-1 post-3'
    'post-6 post-5 post-4';
  grid-template-rows: repeat(3, 200px);
  grid-template-columns: repeat(3, 300px);

}

.speaking {
  box-shadow: 0 0 20px #0002ff;
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
  border: 1px solid $border-color;
}

.video-stream + .video-stream {
  border-left: 0;
  border-bottom: 0;
}

.video-placeholder {
  background-size: 100px;
  background-position: center;
}

.post-1 {
  @extend .video-stream;
  grid-area: post-1;
}

.post-2 {
  @extend .video-stream;

  grid-area: post-2;
}

.post-3 {
  @extend .video-stream;

  grid-area: post-3;
}

.post-4 {
  @extend .video-stream;

  grid-area: post-4;
}

.post-5 {
  @extend .video-stream;

  grid-area: post-5;
}

.post-6 {
  @extend .video-stream;

  grid-area: post-6;
}


</style>
