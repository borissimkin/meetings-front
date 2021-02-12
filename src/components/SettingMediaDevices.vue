<template>
  <div>
    <div
      class="toolbar"
    >
      <SettingMicrophone class="toolbar__button" />
      <SettingVideo class="toolbar__button" />
    </div>
  </div>
</template>

<script>
import SettingMicrophone from "@/components/SettingMicrophone";
import SettingVideo from "@/components/SettingVideo";
export default {
  name: "SettingsMediaDevices",
  components: {SettingVideo, SettingMicrophone}
}
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;

  &__button {

    &:first-child {
      padding-left: 1rem;
    }
    color: #ffffff;
    padding: .8rem;

    border: 1px solid #929292;
  }
}

</style>