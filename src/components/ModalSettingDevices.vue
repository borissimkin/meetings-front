<template>
  <v-dialog v-model='dialog'
            max-width='600px'
            persistent>
    <v-card>
      <v-card-title>
        <span class='headline'>Присоединиться к собранию</span>
      </v-card-title>
      <v-container>
        <v-card-subtitle>
          Не забудьте дать доступ к медиаустройствам после захода в собрание, вне зависимости от ваших текущих настроек
        </v-card-subtitle>
        <v-row>
          <v-spacer></v-spacer>
          <div class='d-flex mr-3'>
            <v-switch v-model='form.onVideo'></v-switch>
            <v-icon color='black' class='mr-1'> {{form.onVideo ? 'mdi-video' : 'mdi-video-off'}}</v-icon>
          </div>

          <v-switch v-model='form.onMicrophone'></v-switch>
          <v-icon color='black'> {{form.onMicrophone ? 'mdi-microphone' : 'mdi-microphone-off'}}</v-icon>
          <v-spacer></v-spacer>

        </v-row>

      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color='blue darken-1'
          text
          @click="handlePassSettings"
        >
          Продолжить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { SET_ENABLED_MICRO_OF_CURRENT_USER, SET_ENABLED_VIDEO_OF_CURRENT_USER } from '@/store/mutations.type'

export default {
  name: 'ModalSettingDevices',
  data() {
    return {
      dialog: true,
      form: {
        onMicrophone: false,
        onVideo: false,
      }

    }
  },
  methods: {
    handlePassSettings() {
      this.$store.commit(`meeting/${SET_ENABLED_VIDEO_OF_CURRENT_USER}`, this.form.onVideo)
      this.$store.commit(`meeting/${SET_ENABLED_MICRO_OF_CURRENT_USER}`, this.form.onMicrophone)
      this.dialog = false
      this.$emit('setting-pass')
    }
  }
}
</script>

<style scoped>

</style>