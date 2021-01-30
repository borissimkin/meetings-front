<template>
  <div>
    <b-button-toolbar>
      <b-button-group>
        <SettingMicrophone></SettingMicrophone>
      </b-button-group>
    </b-button-toolbar>
  </div>
</template>

<script>
import SettingMicrophone from "@/components/SettingMicrophone";
export default {
  name: "SettingsMediaDevices",
  components: {SettingMicrophone}
}
</script>

<style scoped>

</style>