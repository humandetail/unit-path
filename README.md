# 获取一些路径上的点

<p>
  <a href="https://codecov.io/gh/humandetail/unit-path" > 
    <img src="https://codecov.io/gh/humandetail/unit-path/branch/main/graph/badge.svg?token=5X0OFEAMK3"/> 
  </a>
  <a href="https://www.npmjs.com/package/unit-path">
    <img src="https://img.shields.io/npm/v/unit-path.svg" />
  </a>
  <a href="https://github.com/humandetail/unit-path/actions/workflows/page.ci.yml">
    <img src="https://github.com/humandetail/unit-path/actions/workflows/page.ci.yml/badge.svg?branch=main" />
  </a>
  <a href="https://github.com/humandetail/unit-path">
    <img src="https://img.shields.io/github/license/humandetail/unit-path.svg" />
  </a>
  <a href="https://github.com/humandetail/unit-path">
    <img src="https://img.shields.io/github/issues/humandetail/unit-path.svg" />
  </a>
  <a href="https://github.com/humandetail/unit-path">
    <img src="https://img.shields.io/github/forks/humandetail/unit-path.svg" />
  </a>
  <a href="https://github.com/humandetail/unit-path">
    <img src="https://img.shields.io/github/stars/humandetail/unit-path.svg" />
  </a>
</p>

获取直线、二阶贝塞尔曲线、三阶贝塞尔曲线、圆、圆弧组成的点

## 安装

- npm

  ```bash
  npm i -S unit-path
  ```
  
- yarn

  ```bash
  yarn add -S unit-path
  ```
  
- pnpm

  ```bash
  pnpm add -S unit-path
  ```

## 使用

```javascript
import UnitPath from 'unit-path';

const unitPath = new UnitPath();
// 设置路径
const path = unitPath.setPath('LINE', { x: 50, y: 50 }, { x: 100, y: 100 });
// 获取指定位置上的点
const point = path.getPoint(.5);
// 获取路径上平均分布的点
const points = path.getPoints(50);
```

## 参数说明

`new UnitPath(options: UnitPathOptions)`:

```typescript
type UnitPathOptions = {
  // 保留几位小数，不设置则全保留
  decimalPlaces?: number
  // `getPoints()` 默认获取点的数量
  defaultQuantity?: number
}
```

### `setPath()`

- 直线

  ```typescript
  setPath(
    type: 'LINE',
    // 起点坐标
    startPoint: Point,
    // 终点坐标
    endPoint: Point
  )
  ```

- 二次贝塞尔曲线

  ```typescript
  setPath(
    type: 'TWO_ORDER_BEZIER',
    // 起点坐标
    startPoint: Point,
    // 控制点坐标
    controlPoint: Point,
    // 终点坐标
    endPoint: Point
  )
  ```

- 三次贝塞尔曲线

  ```typescript
  setPath(
    type: 'THREE_ORDER_BEZIER',
    // 起点坐标
    startPoint: Point,
    // 控制点 1 的坐标
    controlPoint1: Point,
    // 控制点 2 的坐标
    controlPoint2: Point,
    // 终点坐标
    endPoint: Point
  )
  ```

- 圆 / 圆弧

  ```typescript
  setPath(
    type: 'ARC',
    // 圆心坐标 x
    x: number,
    // 圆心坐标 y
    y: number,
    // 圆弧半径
    r: number,
    // 起始角弧度
    startAngle: number,
    // 结束角弧度
    endAngle: number,
    // 是否为逆时针方向
    anticlockwise?: boolean
  )
  ```

### `getPoint(t)`

`t` 表示点位于路径的位置，它的取值范围为 [0,1]，默认值为 0。

### `getPoints(quantity)`

`quantity` 表示获取该路径上点的数量，取值范围为[0,∞]。
