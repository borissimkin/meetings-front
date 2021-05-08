<template>
  <div>
    <div class='toolbar'>
      <SettingAudio class='toolbar__button' />
      <SettingVideo class='toolbar__button' />
      <ButtonRaiseHand v-if='canRaiseHand' class='toolbar__button' />
      <ButtonToggleModeShowVideos v-if='showToggleVideoMode' class='toolbar__button' />
    </div>
  </div>
</template>

<script>
//todo: Переименовать, либо вынести отсюда компоненты не отвечающие с медиа
import SettingAudio from '@/components/SettingAudio'
import SettingVideo from '@/components/SettingVideo'
import ButtonRaiseHand from '@/components/ButtonRaiseHand'
import ButtonToggleModeShowVideos from '@/components/ButtonToggleModeShowVideos'
import { mapState } from 'vuex'

export default {
  name: 'SettingsMediaDevices',
  components: { ButtonToggleModeShowVideos, ButtonRaiseHand, SettingVideo, SettingAudio },
  computed: {
    ...mapState("meeting", {
      meetingInfo: state => state.meetingInfo,
    }),
    ...mapState("auth", {
      currentUser: state => state.currentUser
    }),

    currentUserIsHost() {
      return this.currentUser.id === this.meetingInfo.creator.id
    },

    showToggleVideoMode() {
      return this.currentUserIsHost && this.meetingInfo.isExam
    },

    canRaiseHand() {
      return !this.currentUserIsHost
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
