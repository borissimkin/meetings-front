<template>
  <v-container>
    <div class='title mb-2'>
      Собрания
    </div>
    <v-card>
      <ModalCreateMeeting>
      </ModalCreateMeeting>
      <v-list two-line>
        <v-subheader>
          {{ headerText }}
        </v-subheader>
        <v-list-item-group>
          <v-list-item v-for='meeting in $store.state.room.meetings'
                       :key='meeting.id' :to='`/room/${id}/meeting/${meeting.hashId}`'>
            <v-list-item-content>

              {{ meeting.hashId }}
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import ModalCreateMeeting from '@/components/ModalCreateMeeting'
export default {
  name: 'Room',
  components: { ModalCreateMeeting },
  props: {
    id: {
      type: String,
      required: true,
      default: '',
    },
  },
  computed: {
    headerText() {
      return this.$store.state.room.meetings.length ? 'Собрания' : 'Собраний нет'
    }
  },
  mounted() {
    this.$store.dispatch('room/fetchMeetings', {
      roomId: this.id
    })
  }
}
</script>

<style scoped>

</style>