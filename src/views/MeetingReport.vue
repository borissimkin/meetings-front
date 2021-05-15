<template>
  <v-container class='container'>
    <v-card>
      <v-btn :to='`/room/${roomId}`' class='ma-3'>Назад</v-btn>
      <div class='container__header'>
        <h2>
          {{ meetingInfo.name }}
        </h2>
        <h3>Создатель собрания: {{getFullName(meetingInfo.creator.firstName, meetingInfo.creator.lastName)}}</h3>
        <h3>{{ timeSpending }}</h3>
        <h4>
          Всего участников: {{ countParticipants }}
        </h4>
        <h5>
          Количество проверок слушателей: {{ countCheckpoints }}
        </h5>
      </div>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">
              Участник
            </th>
            <th>
              Количество пройденных проверок
            </th>
            <th>
              Присоединился к собранию
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="item in visitorsWithoutCreator"
            :key="item.id"
          >
            <td>{{ getFullName(item.user.firstName, item.user.lastName) }}</td>
            <td>{{ item.countPassedCheckpoints }}</td>
            <td>{{ processCreatedAtVisitor(item.createdAt) }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider />
      <h2 class='ma-3'>Запись чата собрания</h2>
      <MeetingChatReport :messages='messages' />
    </v-card>
  </v-container>
</template>

<script>
import MeetingChatReport from '@/components/MeetingChatReport'
import { meetingEntity } from '@/helpers/entities/meeting'
import meetingApi from "@/api/meeting.api"
import { getFullName } from '@/helpers/username.process'
import { getMeetingTime, toFormatTimeOrDatetime } from '@/helpers/datetime.process'
export default {
  name: 'MeetingReport',
  components: { MeetingChatReport },
  props: {
    meetingId: {
      type: String,
      required: true,
      default: '',
    },
    roomId: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      messages: [],
      /**
       * {
       *   id:,
       *   countPassedCheckpoints
       *   createdAt
       *   user: {
       *     id,
       *     firstName,
       *     lastName
       *   }
       * }
       *
       * **/
      visitors: [],
      checkpoints: [],
      meetingInfo: { ...meetingEntity }
    }
  },
  computed: {
    timeSpending() {
      const {startDate, startTime, endTime} = {...this.meetingInfo}
      return getMeetingTime({ startTime, startDate, endTime });
    },
    visitorsWithoutCreator() {
      return this.visitors.filter(x => x.user.id !== this.meetingInfo.creator.id)
    },
    countCheckpoints() {
      return this.checkpoints.length
    },
    countParticipants() {
      return this.visitors.length
    }
  },
  mounted() {
    this.fetchMeetingInfo()
    this.fetchMessages()
    this.fetchVisitors()
    this.fetchCheckpoints()
  },
  methods: {
    async fetchMeetingInfo() {
      const response = await meetingApi.getMeetingInfo(this.meetingId)
      this.meetingInfo = response.data
    },
    async fetchMessages() {
      const response = await meetingApi.getMeetingMessages(this.meetingId)
      this.messages = response.data
    },
    async fetchVisitors() {
      const response = await meetingApi.getMeetingVisitors(this.meetingId)
      const visitors = response.data
      visitors.sort((x1, x2) => x2.countPassedCheckpoints - x1.countPassedCheckpoints)
      this.visitors = visitors
    },

    processCreatedAtVisitor(datetime) {
      return toFormatTimeOrDatetime(datetime)
    },

    async fetchCheckpoints() {
      const response = await meetingApi.getCheckpoints(this.meetingId)
      this.checkpoints = response.data
    },

    getFullName(firstName, lastName) {
      return getFullName(firstName, lastName)
    }

  }
}
</script>

<style scoped>
.container {
  margin: auto;
  width: 50%;
  padding: 10px;
}
.container__header {
  display: flex;
  flex-direction: column;
  align-items: center;

}
</style>
