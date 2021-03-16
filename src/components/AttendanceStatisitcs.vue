<template>
  <div>
    <template v-if='checkpoints.length'>
      <AttendanceStatisticsChart
        class='statistics-chart'
        :options='chartOptions'
        :chart-data='testChartData'/>
      <div class='ml-3'>
        <ButtonCheckListeners v-if='canStartCheckListeners' />
        <template v-if='showFilterLastCheckpoint'>
          <v-switch
            v-model="statisticFilters.lastCheckpoint"
            :label="labelFilterCheckpoint"
          ></v-switch>
        </template>
        <v-switch
          v-model="statisticFilters.currentParticipants"
          label="Только текущие участники собрания"
        ></v-switch>
      </div>
    </template>
    <template v-else>
      <div class='text-h5  mt-2 '>Проверка слушателей еще не проводилась</div>
    </template>
  </div>
</template>

<script>
import AttendanceStatisticsChart from '@/components/AttendanceStatisticsChart'
import { mapState } from 'vuex'
import { getFullName } from '@/helpers/username.process'
import { toFormatTimeOrDatetime } from '@/helpers/datetime.process'
import ButtonCheckListeners from '@/components/ButtonCheckListeners'
import { canStartCheckListeners } from '@/helpers/permissions'
export default {
  name: 'AttendanceStatistics',
  components: { ButtonCheckListeners, AttendanceStatisticsChart },
  data() {
    return {
      baseChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      statisticFilters: {
        currentParticipants: false,
        lastCheckpoint: false
      },
    }
  },
  computed: {
    ...mapState('meeting', {
      checkpoints: state => state.checkpoints,
      participants: state => state.participants,
      meetingHostId: state => state.meetingInfo.creator.id
    }),

    ...mapState('auth', {
      currentUser: state => state.currentUser
    }),

    canStartCheckListeners() {
      return canStartCheckListeners(this.currentUser.id, this.meetingHostId)
    },

    chartOptions() {
      return {
        ...this.baseChartOptions,
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              precision: 0,
              max: this.checkpoints.length
            }
          }],
        }

      }

    },

    showFilterLastCheckpoint() {
      const minCountCheckpoints = 2
      return this.checkpoints.length > minCountCheckpoints

    },

    lastCheckpoint() {
      const ids = this.checkpoints.map(checkpoint => checkpoint.id)
      const maxId = Math.max(...ids)
      return this.checkpoints.find(checkpoint => checkpoint.id === maxId)
    },

    labelFilterCheckpoint() {
      return `Результаты последней проверки (${toFormatTimeOrDatetime(this.lastCheckpoint?.createdAt)})`
    },

    currentUserIsHost() {
      return this.isHostOfMeeting(this.currentUser.id)
    },

    participantCurrentUser() {
      return {
        user: this.currentUser,
        online: true
      }
    },

    participantsForChart() {
      let participants = this.participants;
      if (this.statisticFilters.currentParticipants) {
        participants = participants.filter(participant => participant.online)
      }
      if (!this.currentUserIsHost) {
        participants = [...participants, this.participantCurrentUser]
      }
      return participants
    },

    checkpointsForChart() {
      let checkpoints = this.checkpoints
      if (this.statisticFilters.lastCheckpoint) {
        checkpoints = this.checkpoints.filter(checkpoint => checkpoint.id === this.lastCheckpoint.id)
      }
      return checkpoints
    },

    chartData() {
      const result = {
        labels: [],
        data: [],
      }
      this.participantsForChart.forEach(participant => {
        const {id, firstName, lastName} = {...participant.user}
        if (this.isHostOfMeeting(id)) {
          return
        }
        result.labels.push(getFullName(firstName, lastName))
        const countPassedCheckpoint = this.checkpointsForChart.reduce((accumulator, checkpoint) => {
          if (checkpoint.userIds.includes(id)) {
            return accumulator + 1
          }
          return accumulator
        }, 0)
        result.data.push(countPassedCheckpoint)
      })
      return result
    },

    testChartData() {
      //labels: ['Иванов Иван', 'Иванов Иван', 'Иванов Иван', 'Иванов Иван', 'Иванов Иван', 'Иванов Иван', 'Иванов Иван'],
      //data: [1, 5, 2, 1, 3, 1, 2],
      return {
        labels: this.chartData.labels,
        datasets: [{
          label: 'Количество пройденных проверок',
          backgroundColor: '#f87979',
          data: this.chartData.data,
          maxBarThickness: 50,
        }],
      }
    }

  },

  methods: {
    isHostOfMeeting(userId) {
      return userId === this.meetingHostId
    }
  }


}
</script>

<style scoped>
.statistics-chart {
  width: 100%;
  height: 100%;
}
</style>
