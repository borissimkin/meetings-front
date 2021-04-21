<template>
  <v-dialog v-model='dialog'
            max-width='600px'
            persistent
            @keydown.esc='dialog=false'>
    <template v-slot:activator='{on, attrs}'>
      <v-btn
        v-bind='attrs'
        v-on='on'
        dark
        small
      >
        Создать собрание
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class='headline'>Создать собрание</span>
      </v-card-title>
      <v-container>
        <v-form v-model='valid' @submit.prevent='createMeeting'>
          <v-row>
            <v-col>
              <v-text-field v-model='form.name'
                            :rules='meetingNameRules'
                            counter='50' label='Название собрания'></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-menu
                ref='menuStartDate'
                v-model='menus.menuStartDate'
                :close-on-content-click='false'
                :return-value.sync='form.startDate'
                min-width='auto'
                transition='scale-transition'
              >
                <template v-slot:activator='{ on, attrs }'>
                  <v-text-field
                    v-model='form.startDate'
                    v-bind='attrs'
                    v-on='on'
                    append-icon='mdi-calendar'
                    label='Дата проведения'
                    :rules='startDateRules'
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model='form.startDate'
                  no-title
                  scrollable
                  :allowed-dates='allowedStartDates'
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    color='primary'
                    text
                    @click='menus.menuStartDate = false'
                  >
                    Отмена
                  </v-btn>
                  <v-btn
                    color='primary'
                    text
                    @click='$refs.menuStartDate.save(form.startDate)'
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-menu ref='menuStartTime'
                      v-model='menus.menuStartTime'
                      :close-on-content-click='false'
                      :return-value.sync='form.startTime'
                      max-width='290px'
                      min-width='290px'
                      transition='scale-transition'>
                <template v-slot:activator='{ on, attrs }'>
                  <v-text-field
                    v-model='form.startTime'
                    v-bind='attrs'
                    v-on='on'
                    append-icon='mdi-clock-time-four-outline'
                    :rules='startTimeRules'
                    label='Время начала'
                    readonly
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-model='form.startTime'
                  format='24hr'
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    color='primary'
                    text
                    @click='menus.menuStartTime = false'
                  >
                    Отмена
                  </v-btn>
                  <v-btn
                    color='primary'
                    text
                    @click='handleSaveStartTime'
                  >
                    OK
                  </v-btn>
                </v-time-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-menu ref='menuEndTime'
                      v-model='menus.menuEndTime'
                      :close-on-content-click='false'
                      :return-value.sync='form.endTime'
                      max-width='290px'
                      min-width='290px'
                      transition='scale-transition'>
                <template v-slot:activator='{ on, attrs }'>
                  <v-text-field
                    v-model='form.endTime'
                    v-bind='attrs'
                    v-on='on'
                    append-icon='mdi-clock-time-four-outline'
                    :rules='endTimeRules'
                    label='Время окончания'
                    readonly
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-model='form.endTime'
                  format='24hr'
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    color='primary'
                    text
                    @click='menus.menuEndTime = false'
                  >
                    Отмена
                  </v-btn>
                  <v-btn
                    color='primary'
                    text
                    @click='$refs.menuEndTime.save(form.endTime)'
                  >
                    OK
                  </v-btn>
                </v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-checkbox v-model='form.isExam' label='Экзамен'></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-checkbox v-model='form.isCheckListeners' :disabled='isDisabledCheckListeners'
                          label='Проверка слушателей'></v-checkbox>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color='blue darken-1'
          text
          @click='dialog = false'
        >
          Закрыть
        </v-btn>
        <v-btn
          :loading='loading'
          :disabled='!valid'
          color='blue darken-1'
          text
          @click='createMeeting'
        >
          Создать
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
//todo: валидировать время чтобы в прошлое нельзя было ставить и чтобы время начала не было больше времени окончания
import dayjs from "dayjs";
import { fromTimeToDayjs } from '@/helpers/datetime.process'
import { ERROR_MESSAGE, MEETING_WAS_CREATED } from '@/helpers/toast.messages'
export default {
  name: 'ModalCreateMeeting',
  props: {
    roomId: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      defaultMeetingDurationMinutes: 90,
      loading: false,
      dialog: false,
      menus: {
        menuStartDate: false,
        menuStartTime: false,
        menuEndTime: false,
      },
      meetingNameRules: [
        (v) => !!v || 'Название обязательно',
      ],
      startDateRules: [
        (v) => !!v || 'Дата проведенния обязательна',
      ],
      startTimeRules: [
        (v) => !!v || 'Время начала обзательно',
      ],
      endTimeRules: [
        (v) => !!v || 'Время окончания обзательно',
      ],
      form: {
        name: '',
        startDate: new Date().toISOString().substr(0, 10),
        startTime: null,
        endTime: null,
        isCheckListeners: false,
        isExam: false,
      },
      valid: false,
    }
  },
  computed: {
    isDisabledCheckListeners() {
      return this.form.isExam
    },

    isExam() {
      return this.form.isExam
    },
  },
  watch: {
    isExam(val) {
      if (val) {
        this.form.isCheckListeners = false
      }
    }
  },
  methods: {
    async createMeeting() {
      this.loading = true
      try {
        await this.$store.dispatch(`room/addMeeting`, {
          roomId: this.roomId,
          ...this.form,
        })
        this.$toast.success(MEETING_WAS_CREATED)
      } catch (e) {
        console.log(e)
        this.$toast.error(ERROR_MESSAGE)
      } finally {
        this.loading = false
        this.dialog = false
      }
    },

    calculateEndTime(starTime) {
      let endTime = fromTimeToDayjs(starTime)
      endTime = endTime.add(this.defaultMeetingDurationMinutes, "minutes")
      endTime = endTime.format("HH:mm")
      return endTime
    },

    handleSaveStartTime() {
      const time = this.form.startTime
      this.$refs.menuStartTime.save(time)

      const endTime = this.calculateEndTime(time)
      this.form.endTime = endTime
      this.$refs.menuEndTime.save(endTime)
    },

    allowedStartDates(date) {
      return dayjs(date).isSameOrAfter(dayjs(), 'day')
    },
  },
}
</script>

<style scoped>

</style>
