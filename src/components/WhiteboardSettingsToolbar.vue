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
    <v-container class='ml-2'>
      <v-row class='mt-2'>
        <v-col cols='4'>
          <v-select
            v-model='thickness'
            :items="thicknessElements"
            filled
            label="Толщина линии"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <v-spacer />
    <v-btn :disabled='!canUndo' @click='$emit("undo-action")' icon>
      <v-icon color='black'>mdi-undo</v-icon>
    </v-btn>
    <v-btn :disabled='!canRedo' @click='$emit("redo-action")' icon>
      <v-icon color='black'>mdi-redo</v-icon>
    </v-btn>
    <v-btn :disabled='!canClearBoard' class='ml-3' @click='$emit("clear-whiteboard")'>Очистить доску</v-btn>

  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'

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
    },
  },
  data() {
    return {
      colorPickerDialog: false,
      color: "",
      thickness: 2,
      thicknessElements: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
    }
  },
  computed: {
    ...mapState("meeting", {
      currentUserPermissions: state => state.currentUserPermissions
    }),

    canClearBoard() {
      return this.currentUserPermissions.canDrawing
    }
  },
  watch: {
    thickness(value) {
      this.$emit('change-thickness', value)
    },

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
