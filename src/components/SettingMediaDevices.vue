<template>
  <div>
    <b-button-toolbar
      :justify="true"
      class="toolbar"
    >
      <b-button-group>
        <SettingMicrophone class="toolbar__button" />
        <SettingVideo class="toolbar__button" />
      </b-button-group>
    </b-button-toolbar>
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
  background-color: #656565;

  &__button {

    &:first-child {
      padding-left: 1rem;
    }
    color: #ffffff;
    padding: .8rem;
    font-size: 1.5rem;

    border: 1px solid #929292;

    &:hover {
      cursor: pointer;
      color: #AFAFAF
    };
  }
}

</style>