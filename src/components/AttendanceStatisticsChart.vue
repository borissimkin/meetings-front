<script>
import {Bar, mixins} from 'vue-chartjs'

const {reactiveProp} = mixins
export default {
  name: 'AttendanceStatisticsChart',
  extends: Bar,
  props: ['chartData', 'options'],
  mixins: [reactiveProp],
  watch: {
    options: {
      handler() {
        this.$data._chart.options = this.options
        this.$data._chart.update()
      },
      deep: true
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style scoped>

</style>
