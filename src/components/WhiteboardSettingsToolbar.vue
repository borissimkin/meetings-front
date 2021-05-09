<template>
  <v-toolbar dense >
    <v-toolbar-items>
      <v-btn @click='$emit("clear-whiteboard")'>Очистить доску</v-btn>
      <v-menu v-model='colorPickerDialog' :close-on-content-click='false'>
        <template v-slot:activator='{on, attrs}'>
          <v-btn v-bind='attrs'
                 v-on='on'>Выбрать цвет</v-btn>
        </template>
        <v-color-picker
          dot-size="25"
          swatches-max-height="200"
        ></v-color-picker>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color='blue darken-1'
            text
            @click='colorPickerDialog = false'
          >
            Отмена
          </v-btn>
          <v-btn
            color='blue darken-1'
            text
            @click='chooseColor'
          >
            выбрать
          </v-btn>
        </v-card-actions>
      </v-menu>
      <v-icon color='black' :disabled='!canUndo' @click='$emit("undo-action")'>mdi-undo</v-icon>
      <v-icon color='black' :disabled='!canRedo' @click='$emit("redo-action")'>mdi-redo</v-icon>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: 'WhiteboardSettingsToolbar',
  props: {
    canUndo: {
      type: Boolean,
      required: true,
      default: false
    },
    canRedo: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      colorPickerDialog: false
    }
  },
  methods: {
    chooseColor() {
      console.log('Выбран цвет')
    }
  }
}
</script>

<style scoped>

</style>
