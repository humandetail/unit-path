<template>
  <div class="input-wrapper">
    <div class="row">
      <label for="type-selector">Type: </label>
      <select
        v-model="currentType"
        id="type-selector"
      >
        <option
          v-for="item of types"
          :key="item.type"
          :value="item.type"
        >
          {{ item.label }}
        </option>
      </select>
    </div>

    <div class="row">
      <label>Arguments</label>
      
      <template v-for="item of formItems" :key="item.name">
        <div>
          <label>
            {{ item.label }}: 
            <input
              v-if="item.type === 'number'"
              type="number"
              @change="(e: any) => handleFormChange(e, item)"
            />

            <template v-if="item.type === 'boolean'">
              <label>
                <input
                  type="radio"
                  :name="item.name"
                  :value="true"
                  checked
                  @change="(e: any) => handleFormChange(e, item)"
                />
                是
              </label>
              <label>
                <input
                  type="radio"
                  :name="item.name"
                  :value="true"
                  @change="(e: any) => handleFormChange(e, item)"
                />
                否
              </label>
            </template>
          </label>
        </div>
      </template>
    </div>

    <div class="row">
      <label>Setting</label>
      <div>
        <label>
          t:
          <input
            type="number"
            v-model="t"
            :max="1"
            :min="0"
            :step="0.01"
            style="width: 100px"
          />
        </label>
      </div>
      <div>
        <label>
          quantity:
          <input
            type="number"
            v-model="quantity"
            :max="100"
            :min="1"
            :step="1"
            style="width: 100px"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, computed, watch } from 'vue'
import { CurveType } from '../../types/config.d'
const types: Array<{
  label: string,
  type: CurveType
}> = [
  { label: 'LINE - 直线', type: 'LINE' },
  { label: 'TWO_ORDER_BEZIER - 二次贝塞尔曲线', type: 'TWO_ORDER_BEZIER' },
  { label: 'THREE_ORDER_BEZIER - 三次贝塞尔曲线', type: 'THREE_ORDER_BEZIER' },
  { label: 'ARC - 圆/圆弧', type: 'ARC' },
]

const currentType = ref<CurveType>('LINE')
const formState = ref<Record<string, any>>({})
const t = ref<number>(0)
const quantity = ref<number>(10)

const emit = defineEmits<{(type: 'change', value: Ref<{
  type: CurveType
  args: Record<string, any>
  t: number
  quantity: number
}>): void}>()

const formItemsMap: Record<CurveType, Array<{
  name: string
  type: string
  label: string
}>> = {
  'LINE': [
    { name: 'startX', type: 'number', label: '起始点 x 坐标' },
    { name: 'startY', type: 'number', label: '起始点 y 坐标' },
    { name: 'endX', type: 'number', label: '结束点 x 坐标' },
    { name: 'endY', type: 'number', label: '结束点 y 坐标' },
  ],
  'TWO_ORDER_BEZIER': [
    { name: 'startX', type: 'number', label: '起始点 x 坐标' },
    { name: 'startY', type: 'number', label: '起始点 y 坐标' },
    { name: 'ctrlX', type: 'number', label: '控制点 x 坐标' },
    { name: 'ctrlY', type: 'number', label: '控制点 y 坐标' },
    { name: 'endX', type: 'number', label: '结束点 x 坐标' },
    { name: 'endY', type: 'number', label: '结束点 y 坐标' },
  ],
  'THREE_ORDER_BEZIER': [
    { name: 'startX', type: 'number', label: '起始点 x 坐标' },
    { name: 'startY', type: 'number', label: '起始点 y 坐标' },
    { name: 'ctrlX1', type: 'number', label: '第一个控制点 x 坐标' },
    { name: 'ctrlY1', type: 'number', label: '第一个控制点 y 坐标' },
    { name: 'ctrlX2', type: 'number', label: '第二个控制点 x 坐标' },
    { name: 'ctrlY2', type: 'number', label: '第二个控制点 y 坐标' },
    { name: 'endX', type: 'number', label: '结束点 x 坐标' },
    { name: 'endY', type: 'number', label: '结束点 y 坐标' },
  ],
  'ARC': [
    { name: 'x', type: 'number', label: '圆心 x 坐标' },
    { name: 'y', type: 'number', label: '圆心 y 坐标' },
    { name: 'r', type: 'number', label: '半径' },
    { name: 'startAngle', type: 'number', label: '起始角（角度）' },
    { name: 'endAngle', type: 'number', label: '结束角（角度）' },
    { name: 'anticlockwise', type: 'boolean', label: '是否逆时针绘制' },
  ]
}

const formItems = computed<Array<{
  name: string
  type: string
  label: string
}>>(() => formItemsMap[currentType.value])

const state = computed(() => ({
  type: currentType.value,
  args: formState.value,
  t: t.value,
  quantity: quantity.value
}))

const handleFormChange = (e: InputEvent, item: {
  name: string
  type: string
  label: string
}) => {
  if (!e.target) return
  const value = (e.target as HTMLInputElement).value

  formState.value = {
    ...formState.value,
    [item.name]: Number(value)
  }
}

watch(() => currentType, () => {
  formState.value = {}
})

watch(() => state, (state) => {
  emit('change', state)
}, { deep: true })
</script>

<style>

</style>