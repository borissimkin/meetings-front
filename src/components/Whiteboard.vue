<template>
  <div class='canvas-wrapper'>
    <canvas id='js-board'
            :height='height'
            :width='width'
            class='whiteboard'
            @mousedown='startDraw'
            @mousemove='drawing'
            @mouseout='endDraw'
            @mouseup='endDraw'>

    </canvas>
    <WhiteboardSettingsToolbar
      :can-redo='canRedo'
      :can-undo='canUndo'
      :current-color='currentColor'
      @change-color='changeColor'
      @clear-whiteboard='clearWhiteboard'
      @redo-action='redoAction'
      @undo-action='undoAction'/>
    <v-overlay absolute  :value="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import meetingApi from "@/api/meeting.api"
import { ERROR_SYNC_WHITEBOARD } from '@/helpers/toast.messages'
import WhiteboardSettingsToolbar from '@/components/WhiteboardSettingsToolbar'

export default {
  name: 'Whiteboard',
  components: { WhiteboardSettingsToolbar },
  props: {
    width: {
      type: Number,
      required: true,
      default: 900,
    },
    height: {
      type: Number,
      required: true,
      default: 600,
    },
  },
  //todo: добавить толщину линии
  data() {
    return {
      loading: false,
      currentColor: '#000000',
      fractionDigits: 4,
      currentCursorPosition: {
        x: 0,
        y: 0,
      },
      /**
       * {
       *   id
       *   userId,
       *   drawings: "[]"
       * }
       * **/
      whiteboardData: [],
      /**
       * {
       *   x0,
       *   y0,
       *   x1,
       *   y1,
       *   color
       * }
       * **/
      currentLine: [], // пока мышьку не отпустили сюда будут добавляться элементы данной линии
      actionIdsInCurrentSessions: [],
      rollbackActions: [],
      isDrawing: false,
      context: null,
      canvas: null,
    }
  },
  computed: {
    ...mapState("auth", {
      currentUser: state => state.currentUser
    }),
    ...mapState("meeting", {
      meetingHashId: state => state.meetingInfo.hashId
    }),

    canRedo() {
      return !!this.rollbackActions.length
    },

    canUndo() {
      return !!this.actionIdsInCurrentSessions.length
    }
  },
  async mounted() {
    this.loading = true
    this.canvas = document.getElementById('js-board')
    this.context = this.canvas.getContext('2d')
    try {
      const response = await meetingApi.getWhiteboardData(this.meetingHashId)
      const whiteboardData = response.data
      this.whiteboardData = whiteboardData
      const drawings = whiteboardData.map(x => x.drawings)
      this.redrawBoard(drawings)
    } catch (error) {
      console.log({error})
      this.$toast.error(ERROR_SYNC_WHITEBOARD)
    } finally {
      this.loading = false
    }
  },
  sockets: {
    whiteboardDrawing(data) {
      const w = this.width
      const h = this.height
      this.drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color)
    },

    whiteboardEndDrawing(whiteboardData) {
      this.whiteboardData.push(whiteboardData)
      if (whiteboardData.userId === this.currentUser.id) {
        this.actionIdsInCurrentSessions.push(whiteboardData.id)
      }
    },

    whiteboardCreateElement(whiteboardData) {
      this.whiteboardData.push(whiteboardData)
      if (whiteboardData.userId === this.currentUser.id) {
        this.actionIdsInCurrentSessions.push(whiteboardData.id)
      }
      this.drawElement(JSON.parse(whiteboardData.drawings))
    },

    whiteboardRemoveElement(actionId) {
      this.removeElement(actionId)
    },

    whiteboardClear() {
      this.resetWhiteboard()
    }

  },

  methods: {
    changeColor(color) {
      this.currentColor = color
    },

    clearWhiteboard() {
      this.$socket.client.emit('whiteboard-clear')
      this.resetWhiteboard()
    },

    removeElement(actionId) {
      const index = this.whiteboardData.findIndex(x => x.id === actionId)
      if (index !== -1) {
        this.whiteboardData.splice(index, 1)
        const drawings = this.whiteboardData.map(x => x.drawings)
        if (this.currentLine.length) {
          drawings.push(JSON.stringify(this.currentLine))
        }
        this.redrawBoard(drawings)
      }
    },

    redoAction() {
      const actionString = this.rollbackActions.pop()
      if (!actionString) {
        return
      }
      const action = JSON.parse(actionString)
      this.$socket.client.emit('whiteboard-create-element', action)
    },

    undoAction() {
      const actionId = this.actionIdsInCurrentSessions.pop()
      if (!actionId) {
        return
      }
      this.$socket.client.emit('whiteboard-remove-element', actionId)
      const action = this.whiteboardData.find(x => x.id === actionId)
      this.rollbackActions.push(action.drawings)
      this.removeElement(actionId)
    },

    resetWhiteboard() {
      this.currentLine = []
      this.whiteboardData = []
      this.actionIdsInCurrentSessions = []
      this.rollbackActions = []
      this.context.clearRect(0, 0, this.width, this.height)
    },

    getMousePositionOnCanvas(event) {
      const rect = this.canvas.getBoundingClientRect()
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    },

    redrawBoard(drawings) {
      this.context.clearRect(0, 0, this.width, this.height)
      drawings.forEach(drawing => {
        const drawingObj = JSON.parse(drawing)
        this.drawElement(drawingObj)
      })
    },

    drawElement(element) {
      this.context.beginPath()
      element.forEach(elem => {
        this.context.moveTo(elem.x0 * this.width, elem.y0 * this.height)
        this.context.lineTo(elem.x1 * this.width, elem.y1 * this.height)
        this.context.strokeStyle = elem.color
        this.context.lineWidth = 2
      })
      this.context.stroke()
      this.context.closePath()
    },

    startDraw(event) {
      this.isDrawing = true
      const position = this.getMousePositionOnCanvas(event)
      this.currentCursorPosition = { ...position }
    },
    endDraw(event) {
      if (!this.isDrawing) {
        return
      }
      this.isDrawing = false
      const position = this.getMousePositionOnCanvas(event)
      this.drawLine(this.currentCursorPosition.x,
        this.currentCursorPosition.y,
        position.x, position.y, this.currentColor, true)
      this.$socket.client.emit('whiteboard-end-drawing', this.currentLine)
      this.currentLine = []

    },

    drawing: _.throttle(function(event) {
      if (!this.isDrawing) {
        return
      }
      const position = this.getMousePositionOnCanvas(event)
      const { x, y } = { ...position }
      this.drawLine(this.currentCursorPosition.x, this.currentCursorPosition.y, x, y, this.currentColor, true)
      this.currentCursorPosition.x = x
      this.currentCursorPosition.y = y
    }, 10),

    drawLine(x0, y0, x1, y1, color, emit) {
      this.context.beginPath()
      this.context.moveTo(x0, y0)
      this.context.lineTo(x1, y1)
      this.context.strokeStyle = color
      this.context.lineWidth = 2
      this.context.stroke()
      this.context.closePath()
      if (!emit) {
        return
      }
      const w = this.width
      const h = this.height
      const drawingElement = {
        x0: (x0 / w).toFixed(this.fractionDigits),
        y0: (y0 / h).toFixed(this.fractionDigits),
        x1: (x1 / w).toFixed(this.fractionDigits),
        y1: (y1 / h).toFixed(this.fractionDigits),
        color,
      }
      this.currentLine.push(drawingElement)
      this.$socket.client.emit('whiteboard-drawing', drawingElement)

    },
  },
}
</script>

<style scoped>
.canvas-wrapper {
  width: 100%;
  height: 100%
}

.whiteboard {
  height: 600px;
  width: 900px;
  position: absolute;
  border: 1px solid black;
}

</style>
