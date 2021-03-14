<template>
  <div>
    <AttendanceStatisticsChart
      class='statistics-chart'
      :chart-data='testChartData'/>
    <div class='ma-1'>
      <v-btn class='ma-2'>Последняя проверка</v-btn>
      <v-btn class='ma-2'>Только текущие участники собрания</v-btn>
    </div>
  </div>
</template>

<script>
/**
 * [ {
 *   checkpoint: {
 *     id,
 *     createdAt
 *   },
 *   userIds: []
 * },
 * {
 *   checkpoint:
 * }
 *
 * ]
 *
 *
 * **/
import AttendanceStatisticsChart from '@/components/AttendanceStatisticsChart'
export default {
  name: 'AttendanceStatistics',
  components: { AttendanceStatisticsChart },
  computed: {
    testChartData() {
      return {
        labels: ['Иванов Иван', 'Иванов Иван', 'Иванов Иван', 'Иванов Иван', 'Иванов Иван', 'Иванов Иван', 'Иванов Иван'],
        datasets: [{
          label: 'Количество пройденных проверок',
          backgroundColor: '#f87979',
          // data: []
          data: [1, 5, 2, 1, 3, 1, 2]
        }],
      }
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
