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
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Whiteboard',
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
  data() {
    return {
      currentColor: 'black',
      currentCursorPosition: {
        x: 0,
        y: 0,
      },
      isDrawing: false,
      context: null,
      canvas: null,
    }
  },
  mounted() {
    this.canvas = document.getElementById('js-board')
    this.context = this.canvas.getContext('2d')
  },
  sockets: {
    whiteboardDrawing(data) {
      const w = this.width
      const h = this.height
      this.drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color)
    },

  },

  methods: {
    getMousePositionOnCanvas(event) {
      const rect = this.canvas.getBoundingClientRect()
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }

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
      this.$socket.client.emit('whiteboard-drawing', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color,
      })

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