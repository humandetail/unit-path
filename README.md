# 获取 canvas 中一些路径上的点

获取直线、二阶贝塞尔曲线、三阶贝塞尔曲线、圆、圆弧组成的点

## 安装

```shell
# npm i -S unit-path
```

## 使用

```javascript
import UnitPath from 'unit-path';

const unitPath = new UnitPath();

const path = unitPath.setPath('LINE', { x: 50, y: 50 }, { x: 100, y: 100 });

const point = path.getPoint(.5);
// or
const points = path.getPoints(50);
```

## 参数说明

```js
setPath('Line', sp, ep);
setPath('TWO_ORDER_BEZIER', sp, cp, ep);
setPath('THREE_ORDER_BEZIER', sp, cp1, cp2, ep);
setPath('ARC', x, y, r, sAngle, eAngle, anitclockwise?);

getPoint(t); // t取值范围 [0, 1]

getPoints(quantity); // 获取点的数量
````
