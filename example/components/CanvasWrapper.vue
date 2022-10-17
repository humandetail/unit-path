<template>
  <div class="canvas-wrapper">
    <div>
      {{ point }}
    </div>

    <div>
      <div v-for="(item, index) of points" :key="index">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import UnitPath from 'unit-path'

import { State } from '../types'
import { Point } from '../../types/config'

const props = withDefaults(defineProps<{
  state: State | null
}>(), {
  state: () => null
})

const point = ref<Point>()
const points = ref<Point[]>([])

const unitPath = new UnitPath()

watch(() => props.state, (state) => {
  if (!state) return
  try {
    const { type, args, t, quantity } = state

    let _args: any[] = []

    switch (type) {
      case 'LINE':
        _args = [{
          x: args.startX,
          y: args.startY
        }, {
          x: args.endX,
          y: args.endY
        }]
        break
      case 'ARC':
        _args = [...(args as any[])]
        break
      case 'TWO_ORDER_BEZIER':
        _args = [{
          x: args.startX,
          y: args.startY
        }, {
          x: args.ctrlX,
          y: args.ctrlY
        }, {
          x: args.endX,
          y: args.endY
        }]
        break
      case 'THREE_ORDER_BEZIER':
        _args = [{
          x: args.startX,
          y: args.startY
        }, {
          x: args.ctrlX1,
          y: args.ctrlY1
        }, {
          x: args.ctrlX2,
          y: args.ctrlY2
        }, {
          x: args.endX,
          y: args.endY
        }]
        break
      default:
        break
    }
    const path = unitPath.setPath(state.type, ..._args)

    point.value = path.getPoint(t)
    points.value = path.getPoints(quantity)
  } catch (e) {
    console.log(e)
  }
})

</script>
