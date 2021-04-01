<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Присоединиться к собранию</span>
      </v-card-title>
      <v-container>
        <v-card-subtitle class='red--text'>
          Не забудьте дать доступ к медиаустройствам после захода в собрание,
          вне зависимости от ваших текущих настроек
        </v-card-subtitle>
        <v-row>
          <v-spacer />
          <v-radio-group
            v-model="form.streamType"
            mandatory
          >
            <v-radio
              :value="streamTypes.WEBCAM"
            >
              <template v-slot:label>
                <v-icon color='black' title='Веб-камера'>mdi-webcam</v-icon>
                <small>Веб-камера</small>
              </template>

            </v-radio>
            <v-radio
              :value=streamTypes.DESKTOP
              :disabled='isMobile'
            >
              <template v-slot:label>
                <v-icon color='black' title='Рабочий стол'>mdi-monitor-screenshot</v-icon>
                <small>Демонстрация экрана</small>
              </template>
            </v-radio>
          </v-radio-group>
          <v-spacer />
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <div class="d-flex mr-3">
            <v-switch v-model="form.onVideo"></v-switch>
            <v-icon color="black" class="mr-1">
              {{ form.onVideo ? 'mdi-video' : 'mdi-video-off' }}</v-icon
            >
          </div>

          <v-switch v-model="form.onAudio"></v-switch>
          <v-icon color="black">
            {{ form.onAudio ? 'mdi-microphone' : 'mdi-microphone-off' }}</v-icon
          >
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handlePassSettings">
          Продолжить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  SET_ENABLED_AUDIO_OF_CURRENT_USER,
  SET_ENABLED_VIDEO_OF_CURRENT_USER,
} from '@/store/mutations.type'
import streamTypes from "@/helpers/stream.type"
import { isMobile } from '@/helpers/mobile.checker'

export default {
  name: 'ModalSettingDevices',
  data() {
    return {
      dialog: true,
      form: {
        streamType: streamTypes.WEBCAM,
        onAudio: false,
        onVideo: false,
      },
    }
  },
  computed: {
    streamTypes() {
      return streamTypes
    },
    isMobile() {
      return isMobile()
    }
  },
  methods: {
    handlePassSettings() {
      this.$store.commit(
        `meeting/${SET_ENABLED_VIDEO_OF_CURRENT_USER}`,
        this.form.onVideo
      )
      this.$store.commit(
        `meeting/${SET_ENABLED_AUDIO_OF_CURRENT_USER}`,
        this.form.onAudio
      )
      this.dialog = false
      this.$emit('setting-pass', this.form.streamType)
    },
  },
}
</script>

<style scoped></style>
