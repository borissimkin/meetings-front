<template>
  <div>
    <div class='toolbar'>
      <SettingMicrophone class='toolbar__button' />
      <SettingVideo class='toolbar__button' />
      <ButtonRaiseHand class='toolbar__button' />
      <v-btn v-if='canStartCheckListeners' class='toolbar__button' @click='checkListeners' >
        Проверить слушателей
      </v-btn>
    </div>
  </div>
</template>

<script>
//todo: Переименовать, либо вынести отсюда компоненты не отвечающие с медиа
import SettingMicrophone from '@/components/SettingMicrophone'
import SettingVideo from '@/components/SettingVideo'
import ButtonRaiseHand from '@/components/ButtonRaiseHand'

export default {
  name: 'SettingsMediaDevices',
  components: { ButtonRaiseHand, SettingVideo, SettingMicrophone },
  computed: {
    canStartCheckListeners() {
      return this.$store.state.meeting.meetingInfo.creatorId === this.$store.state.auth.currentUser.id
    }
  },
  methods: {
    checkListeners() {
      //todo: тоаст
      this.$socket.client.emit('check-listeners');
    }
  }
}
</script>

<style lang='scss' scoped>
.toolbar {
  display: flex;

  &__button {
    margin: .7rem

  }
}
</style>
