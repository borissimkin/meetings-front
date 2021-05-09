<template>
  <v-toolbar dense>
    <v-menu v-model='colorPickerDialog' :close-on-content-click='false'>
      <template v-slot:activator='{on, attrs}'>
        <div v-bind='attrs' v-on='on'
             class='color-picker'
             :style='{"background-color": currentColor}'></div>
      </template>
      <v-color-picker
        v-model='color'
        dot-size="10"
        hide-inputs
        mode="hexa"
        show-swatches
        swatches-max-height="100"
      ></v-color-picker>
    </v-menu>
    <v-spacer />
    <v-btn :disabled='!canUndo' @click='$emit("undo-action")' icon>
      <v-icon color='black'>mdi-undo</v-icon>
    </v-btn>
    <v-btn :disabled='!canRedo' @click='$emit("redo-action")' icon>
      <v-icon color='black'>mdi-redo</v-icon>
    </v-btn>
    <v-btn class='ml-3' @click='$emit("clear-whiteboard")'>Очистить доску</v-btn>

  </v-toolbar>
</template>

<script>
export default {
  name: 'WhiteboardSettingsToolbar',
  props: {
    canUndo: {
      type: Boolean,
      required: true,
      default: false,
    },
    canRedo: {
      type: Boolean,
      required: true,
      default: false,
    },
    currentColor: {
      type: String,
      required: true,
      default: "#000000"
    }
  },
  data() {
    return {
      colorPickerDialog: false,
      color: ""
    }
  },
  watch: {
    colorPickerDialog(value) {
      if (!value) {
        this.$emit('change-color', this.color)
      }
    }
  },
}
</script>

<style scoped>
.color-picker {
  min-height: 30px;
  min-width: 30px;
}

</style>
