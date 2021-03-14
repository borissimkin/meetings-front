<script>
import {Bar, mixins} from 'vue-chartjs'

const {reactiveProp} = mixins
export default {
  name: 'AttendanceStatisticsChart',
  extends: Bar,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              precision: 0
            }
          }]
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style scoped>

</style>
