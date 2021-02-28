<template>
  <div>
    <div class='toolbar'>
      <SettingMicrophone class='toolbar__button' />
      <SettingVideo class='toolbar__button' />
    </div>
  </div>
</template>

<script>
import SettingMicrophone from '@/components/SettingMicrophone'
import SettingVideo from '@/components/SettingVideo'

export default {
  name: 'SettingsMediaDevices',
  components: { SettingVideo, SettingMicrophone },
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
