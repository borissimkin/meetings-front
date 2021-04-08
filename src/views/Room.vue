<template>
  <v-container>
    <div class='title mb-2'>
      {{titleText}}
    </div>
    <v-card>
      <ModalCreateMeeting :room-id='id'>
      </ModalCreateMeeting>
      <v-list three-line>
        <v-subheader>
          {{ subtitleText }}
        </v-subheader>
        <v-list-item-group>
          <template v-for='(meeting, index) in meetings'>
            <MeetingListItem :meeting='meeting'
                             :room-hash-id='id'
                             :key='meeting.id' />
            <v-divider
              v-if="index < meetings.length - 1"
              :key="`divider-${index}`"
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import ModalCreateMeeting from '@/components/modals/ModalCreateMeeting'
import { RESET_STATE } from '@/store/mutations.type'
import MeetingListItem from '@/components/MeetingListItem'
import roomApi from "@/api/room.api"
import { mapState } from 'vuex'
export default {
  name: 'Room',
  components: { MeetingListItem, ModalCreateMeeting },
  props: {
    id: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      roomInfo: {}
    }
  },
  computed: {
    titleText() {
      return this.roomInfo?.name
    },

    subtitleText() {
      return this.meetings ? 'Собрания' : 'Собраний нет'
    },
    ...mapState('room', {
      meetings: state => state.meetings
    })
  },
  mounted() {
    this.$store.dispatch('room/fetchMeetings', {
      roomId: this.id
    })
    roomApi.getRoom(this.id).then((response) => {
      this.roomInfo = response.data
    })
  },

  beforeDestroy() {
    this.$store.commit(`room/${RESET_STATE}`)
  }
}
</script>

<style scoped>

</style>
