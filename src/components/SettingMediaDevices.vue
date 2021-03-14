<template>
  <div>
    <div class='toolbar'>
      <SettingAudio class='toolbar__button' />
      <SettingVideo class='toolbar__button' />
      <ButtonRaiseHand class='toolbar__button' />
    </div>
  </div>
</template>

<script>
//todo: Переименовать, либо вынести отсюда компоненты не отвечающие с медиа
import SettingAudio from '@/components/SettingAudio'
import SettingVideo from '@/components/SettingVideo'
import ButtonRaiseHand from '@/components/ButtonRaiseHand'

export default {
  name: 'SettingsMediaDevices',
  components: { ButtonRaiseHand, SettingVideo, SettingAudio },
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
