<template>
  <div>
    <InputWrapper @change="handleStateChange" />
    <CanvasWrapper
      :state="state"
    />
    <div>
      <!-- <h2>演示：</h2> -->
      <!-- <canvas
        ref="canvasRef"
        width="500"
        height="400"
        class="canvas"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import InputWrapper from '../components/InputWrapper.vue'
import CanvasWrapper from '../components/CanvasWrapper.vue'
import { State } from '../types'

import UnitPath from 'unit-path'
import { Ref, onMounted, ref } from 'vue'
import { Point } from '../../types/config'

const state = ref<State>()

const handleStateChange = (e: Ref<State>) => {
  state.value = e.value
}

function getPoint (x: number, y: number): Point {
  return { x, y }
}

const canvasRef = ref<HTMLCanvasElement>()
const ctx = ref()

const sp = getPoint(50, 50)
const cp1 = getPoint(200, 50)
const cp2 = getPoint(50, 400)
const ep = getPoint(350, 300)

const unitPath = new UnitPath()
const points = unitPath.setPath('THREE_ORDER_BEZIER', sp, cp1, cp2, ep).getPoints(100)

onMounted(() => {
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext('2d')
    loop(ctx.value)
  }
})

function drawPath (ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.strokeStyle = '#000'
  ctx.globalAlpha = .1
  ctx.beginPath()
  ctx.moveTo(sp.x, sp.y)
  ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, ep.x, ep.y)
  ctx.stroke()
  ctx.closePath()
  ctx.restore()
}


const length = points.length
const MAX = 52
const temp: Point[] = []
let i = 0

function loop (ctx: CanvasRenderingContext2D) {
  if (i >= length) {
    i = 0;
  }
  temp.push(points[i++])

  if (temp.length > MAX) {
    temp.shift()
  }

  ctx.clearRect(0, 0, 600, 500)
  drawPath(ctx)

  temp.forEach((point, index) => {
    ctx.save()
    ctx.fillStyle = `hsl(${300 - 2 * (i + 1)}, 100%, 50%)`
    ctx.globalAlpha = index * 0.02
    ctx.beginPath()
    ctx.arc(point.x, point.y, index * 0.1, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  });

  requestAnimationFrame(() => loop(ctx))
}
</script>

<style scoped>
.canvas {
  box-shadow: 0 0 10px #f1f1f1;
}
</style>
