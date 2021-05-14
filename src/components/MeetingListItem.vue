<template>
  <v-list-item :to='`/room/${roomHashId}/meeting/${meeting.hashId}`'>
    <v-list-item-content>
      <v-list-item-title v-text='meeting.name' class='text--primary'></v-list-item-title>
      <v-list-item-subtitle
        class="text--primary text-caption"
        v-text="creatorName"
      ></v-list-item-subtitle>
      <v-list-item-subtitle
        class="text-caption"
        v-text="timeSpending"
      ></v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-list-item-action-text v-if='meeting.isExam'
                               class='red--text'
                               v-text='`экзамен`'></v-list-item-action-text>
      <v-icon v-if='meeting.isCheckListeners'
              title='С проверкой слушателей'>
        mdi-account-multiple-check
      </v-icon>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { getMeetingTime } from '@/helpers/datetime.process'
import { getFullName } from '@/helpers/username.process'

export default {
  name: 'MeetingListItem',
  props: {
    meeting: {
      type: Object,
      required: true,
      default: () => {}
    },
    roomHashId: {
      type: String,
      required: true,
      default: ""
    }
  },
  computed: {
    timeSpending() {
      const {startDate, startTime, endTime} = {...this.meeting}
      return getMeetingTime({startTime, startDate, endTime})
    },
    creatorName() {
      return getFullName(this.meeting.creator.firstName, this.meeting.creator.lastName)
    }
  }
}
</script>

<style scoped>

</style>
