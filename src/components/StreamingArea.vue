<template>
  <div>
    <div id='video-grid'>
      <template v-for='(place, index) in Object.keys(streamPlaces)'>
        <div v-if='streamPlaces[place]'
             :key='`place-${index}`'
             :class='place'
        >

          <div :class="{'speaking': participantIsSpeaking(streamPlaces[place].user.id)}"
               style='width: 100%; height: 100%'>
            <VideoPlayer v-show='isShowStreamParticipant(streamPlaces[place].stream, streamPlaces[place].user.id)'
                         :muted='streamPlaces[place].user.id === currentUser.id'
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
import { concatVideoStreamAndAudioStream } from '@/helpers/stream.process'
import { ERROR_MEDIA_DEVICES, ERROR_MICRO, ERROR_VIDEO } from '@/helpers/toast.messages'

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

      cyclicChangeVideoStreams: {
        userIdCurrentCyclicInterval: 0,
        timer: null,
        secondsInterval: 5
      }
    }
  },
  computed: {
    ...mapState('meeting', {
      streamCurrentUser: (state) => state.userStream,
      meetingStateOfCurrentUser: (state) => state.meetingStateOfCurrentUser,
      participantsMeetingState: (state) => state.participantsMeetingState,
      meetingInfo: state => state.meetingInfo
    }),
    ...mapState('auth', {
      currentUser: state => state.currentUser,
    }),

    ...mapState('exam', {
      respondedUserId: state => state.examInfo.respondedUserId
    }),

    ...mapGetters('meeting',
      ['getParticipantByPeerId', 'onlineParticipants'],
    ),
    participantCurrentUser() {
      return {
        user: this.currentUser,
        online: true,
        stream: this.streamCurrentUser
      }
    },
    //todo: сделать кнопку по которой включается циклическая смена
    //todo: разделить на два компутеда, а в третьем компутеде вычислять какой отдавать в шаблон
    streamPlaces() {
      //todo: убрал условие пока условие на включенное видео
      const places = {}
      if (this.meetingInfo.isExam) {
        let participants = this.onlineParticipants.filter(participant =>
          this.respondedUserId !== participant.user.id
        )
        if (this.toAddCurrentUser) {
          participants.push(this.participantCurrentUser)
        }
        participants.sort((a, b) => a.user.id - b.user.id)
        if (participants.length > this.maxCountVideos) {
          const indexParticipant = participants.findIndex(x => x.user.id === this.cyclicChangeVideoStreams.userIdCurrentCyclicInterval)
          if (indexParticipant !== -1) {
            const slicedParticipants = participants.slice(indexParticipant)
            if (indexParticipant !== 0) {
              const leftParticipants = participants.slice(0, indexParticipant)
              participants = [...leftParticipants, ...slicedParticipants]
            } else {
              participants = slicedParticipants
            }
          }
        }
        if (this.respondedUserId) {
          let participant
          if (this.respondedUserId === this.currentUser.id) {
            participant = this.participantCurrentUser
          } else {
            participant = this.onlineParticipants.find(x => x.user.id === this.respondedUserId)
          }
          if (participant) {
            participants.unshift(participant)
          }
        }
        for (let i = 0; i < this.maxCountVideos; i++) {
          places[`post-${i+1}`] = participants[i]
        }

      } else {
        for (let i = 0; i < this.maxCountVideos; i++) {
          const elementQueue = this.participantsPriorityQueue[i]
          places[`post-${i+1}`] = elementQueue ? elementQueue.participant : elementQueue
        }
      }
      return places
    },

    toAddCurrentUser() {
      return this.currentUser.id !== this.meetingInfo.creator.id && this.respondedUserId !== this.currentUser.id
    },

    participantsPriorityQueue() {
      const participants = [...this.onlineParticipants, this.participantCurrentUser]
      const participantWithPriority = participants.map(participant => {
        const priority = this.calculatePriority(participant)
        return {
          participant,
          priority
        }
      })
      participantWithPriority.sort((a, b) => {
        return b.priority - a.priority
      })
      return participantWithPriority
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
            if (user.id === participant.user.id) {
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
    if (this.meetingInfo.isExam) {
      this.timer = setInterval(this.cyclicChangeVideos,
        this.cyclicChangeVideoStreams.secondsInterval * 1000)
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

    cyclicChangeVideos() {
      const participantUserIds = [...this.onlineParticipants, this.participantCurrentUser]
        .filter(participant => participant.user.id !== this.meetingInfo.creator.id)
        .filter(participant => participant.user.id !== this.cyclicChangeVideoStreams.userIdCurrentCyclicInterval)
        .map(participant => participant.user.id)
      const min = Math.min(...participantUserIds)
      this.cyclicChangeVideoStreams.userIdCurrentCyclicInterval = min
    },

    calculatePriority(participant) {
      const priorities = {
        enabledVideo: 2,
        isSpeaking: 1,
        isCreatorOfMeeting: 3
      }
      const meetingState = participant.user.id === this.currentUser.id ? this.meetingStateOfCurrentUser : this.participantsMeetingState[participant.user.id]
      if (!meetingState) {
        return 0
      }
      let sumPriority = 0
      for (const priority in priorities) {
        if (meetingState[priority]) {
          sumPriority += priorities[priority]
        }
      }
      if (participant.user.id === this.meetingInfo.creator.id) {
        sumPriority += priorities.isCreatorOfMeeting
      }
      return sumPriority
    },

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
      if (userId === this.currentUser.id) {
        return stream && this.meetingStateOfCurrentUser.enabledVideo
      }
      return stream && this.participantsMeetingState[userId]?.enabledVideo

    },
    participantIsSpeaking(userId) {
      if (userId === this.currentUser.id) {
        return this.meetingStateOfCurrentUser.isSpeaking
      }
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
      const constraints = {
        'mandatory': {
          'OfferToReceiveAudio': true,
          'OfferToReceiveVideo': true
        },
      }
      const call = this.myPeer.call(peerId, stream, constraints)
      call.on('stream', (userStream) => {
        this.$store.commit(`meeting/${SET_STREAM_TO_PARTICIPANT}`,
          {
            userId: user.id,
            stream: userStream,
          })
      })
    },

    async initWebcamStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
        this.initSpeechDetection(stream)
        this.callInit(stream)
      } catch {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({video: true})
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({audio: true})
            const concatenatedStream = concatVideoStreamAndAudioStream(videoStream, audioStream)
            this.initSpeechDetection(concatenatedStream)
            this.callInit(concatenatedStream)
          } catch (error) {
            this.$toast.error(ERROR_MICRO)
            this.callInit(videoStream)
          }
        } catch (error) {
          this.$toast.error(ERROR_VIDEO)
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({audio: true})
            this.initSpeechDetection(audioStream)
            this.callInit(audioStream)
          } catch (e) {
            this.$toast.error(ERROR_MICRO)
            this.callInit(new MediaStream())
          }
        }

      }

    },

    initDesktopStream() {
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then( async (stream) => {
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({audio: true})
            const concatenatedStream = concatVideoStreamAndAudioStream(stream, audioStream)
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
