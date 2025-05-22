export interface Point {
  x: number
  y: number
}

export type CurveType = 'LINE' | 'TWO_ORDER_BEZIER' | 'THREE_ORDER_BEZIER' | 'ARC'

// eslint-disable-next-line no-unused-vars
export type Calculator = (t: number) => Point

export interface UnitPathOptions {
  decimalPlaces?: number
  defaultQuantity?: number
}
export default class UnitPath {
  #calculator?: Calculator
  #decimalPlaces: number = -1
  #defaultQuantity: number = 50

  /**
   * @param { UnitPathOptions } [options] - 可选
   * @param { number } [options.decimalPlaces] - 保留几位小数，不设置则全保留
   * @param { number } [options.defaultQuantity] - `getPoints()` 默认获取点的数量
   */
  constructor (options: UnitPathOptions = {}) {
    const {
      decimalPlaces = -1,
      defaultQuantity = 50
    } = options
    this.setDecimalPlaces(decimalPlaces)
    this.setDefaultQuantity(defaultQuantity)
  }

  setDecimalPlaces (decimalPlaces: number = -1): void {
    if (typeof decimalPlaces !== 'number' || decimalPlaces % 1 !== 0 || decimalPlaces < -1) {
      throw new TypeError('The argument \'decimalPlaces\' must be a positive integer or -1.')
    }
    this.#decimalPlaces = decimalPlaces
  }

  setDefaultQuantity (defaultQuantity: number): void {
    if (typeof defaultQuantity !== 'number' || defaultQuantity % 1 !== 0 || defaultQuantity <= 0) {
      throw new TypeError('The argument \'defaultQuantity\' must be a positive integer.')
    }

    this.#defaultQuantity = defaultQuantity
  }

  setPath (type: 'ARC', x: number, y: number, r: number, startAngle: number, endAngle: number, anticlockwise?: boolean): UnitPath
  setPath (type: 'THREE_ORDER_BEZIER', startPoint: Point, controlPoint1: Point, controlPoint2: Point, endPoint: Point): UnitPath
  setPath (type: 'TWO_ORDER_BEZIER', startPoint: Point, controlPoint: Point, endPoint: Point): UnitPath
  setPath (type: 'LINE', startPoint: Point, endPoint: Point): UnitPath
  setPath (type: CurveType, ...args: any[]): UnitPath {
    switch (type) {
      case 'LINE':
        this.#calculator = this.#setLinePath(args[0], args[1])
        break
      case 'TWO_ORDER_BEZIER':
        this.#calculator = this.#setTwoOrderBezierPath(args[0], args[1], args[2])
        break
      case 'THREE_ORDER_BEZIER':
        this.#calculator = this.#setThreeOrderBezierPath(args[0], args[1], args[2], args[3])
        break
      case 'ARC':
        this.#calculator = this.#setArcPath(args[0], args[1], args[2], args[3], args[4], args[5])
        break
      default:
        throw new TypeError(`The argument 'type' expact 'LINE', 'TWO_ORDER_BEZIER', 'THREE_ORDER_BEZIER', or 'ARC', but got '${type}'`)
    }
    return this
  }

  /**
   * 获取路径上指定位置的点
   * @param { number } [t] - 点位于路径的位置，取值范围 [0,1]
   * @returns { Point } 指定位置上的坐标
   */
  getPoint (t: number = 0): Point {
    if (!this.#calculator) {
      throw new Error('Please set path first.')
    }

    if (t > 1 || t < 0) {
      throw new RangeError('The argument \'t\' must be between 0 and 1.')
    }

    let { x, y } = this.#calculator(t)

    if (this.#decimalPlaces > -1) {
      x = Number(x.toFixed(this.#decimalPlaces))
      y = Number(y.toFixed(this.#decimalPlaces))
    }

    return { x, y }
  }

  /**
   * 获取路径上平均分布的点
   * 获取点的数量为 quantity + 1 个点，包含起点和终点
   * @param { number } quantity - 获取点的数量
   * @returns { Point[] } 平均分布在曲线上指定数量的点组成的数组
   */
  getPoints (quantity?: number): Point[] {
    if (!quantity) {
      quantity = this.#defaultQuantity
    }

    if (typeof quantity !== 'number' || quantity % 1 !== 0 || quantity <= 0) {
      throw new TypeError('The argument \'quantity\' must be a positive integer.')
    }

    const points = []
    for (let i = 0; i < quantity; i++) {
      points.push(this.getPoint(i / (quantity - 1)))
    }

    return points
  }

  /**
   * 直线路径
   * @param { IPoint } startPoint - 起始坐标
   * @param { IPoint } endPoint - 结束坐标
   * @returns { Calculator }
   */
  #setLinePath (startPoint: Point, endPoint: Point): Calculator {
    const { x: x0, y: y0 } = startPoint
    const { x: x1, y: y1 } = endPoint

    return (t: number) => {
      // B(t) = P0 + (P1 - P0) * t
      return {
        x: x0 + (x1 - x0) * t,
        y: y0 + (y1 - y0) * t
      }
    }
  }

  /**
   * 二阶贝塞尔曲线路径
   * @param { IPoint } startPoint 起始点
   * @param { IPoint } controlPoint 控制点
   * @param { IPoint } endPoint 结束点
   * @returns { Calculator }
   */
  #setTwoOrderBezierPath (startPoint: Point, controlPoint: Point, endPoint: Point): Calculator {
    const { x: x0, y: y0 } = startPoint
    const { x: x1, y: y1 } = controlPoint
    const { x: x2, y: y2 } = endPoint

    return (t: number) => {
      // B(t) = (1 - t)² * P0 + 2 * t * (1 - t) * P1 + t² * P2
      return {
        x: Math.pow(1 - t, 2) * x0 + 2 * t * (1 - t) * x1 + Math.pow(t, 2) * x2,
        y: Math.pow(1 - t, 2) * y0 + 2 * t * (1 - t) * y1 + Math.pow(t, 2) * y2
      }
    }
  }

  /**
   * 三阶贝塞尔曲线路径
   * @param { IPoint } startPoint - 起始点
   * @param { IPoint } controlPoint1 - 控制点1
   * @param { IPoint } controlPoint2 - 控制点2
   * @param { IPoint } endPoint - 结束点
   * @returns { Calculator }
   */
  #setThreeOrderBezierPath (startPoint: Point, controlPoint1: Point, controlPoint2: Point, endPoint: Point): Calculator {
    const { x: x0, y: y0 } = startPoint
    const { x: x1, y: y1 } = controlPoint1
    const { x: x2, y: y2 } = controlPoint2
    const { x: x3, y: y3 } = endPoint

    return (t: number) => {
      // B(t) = P0 * (1 - t)³ + 3 * P1 * t * (1 - t)² + 3 * P2 * t² * (1 - t) + P3 * t³
      return {
        x: x0 * Math.pow(1 - t, 3) + 3 * x1 * t * Math.pow(1 - t, 2) + 3 * x2 * Math.pow(t, 2) * (1 - t) + x3 * Math.pow(t, 3),
        y: y0 * Math.pow(1 - t, 3) + 3 * y1 * t * Math.pow(1 - t, 2) + 3 * y2 * Math.pow(t, 2) * (1 - t) + y3 * Math.pow(t, 3)
      }
    }
  }

  /**
   * 圆 / 圆弧计算
   * @param { number } x - 圆心x
   * @param { number } y - 圆心y
   * @param { number } r - 半径
   * @param { number } startAngle - 起始角
   * @param { number } endAngle - 结束角
   * @param { boolean } [anitclockwise] - 是否逆时针方向
   * @returns { Calculator }
   */
  #setArcPath (x: number, y: number, r: number, startAngle: number, endAngle: number, anitclockwise: boolean = false): Calculator {
    const PI = Math.PI
    const PI2 = 2 * PI

    if (anitclockwise) {
      // 顺时针绘制时，交换起始角和结束角
      ([startAngle, endAngle] = [endAngle, startAngle])
    }
    // 处理特殊情况
    if (endAngle - startAngle >= PI2) {
      endAngle = startAngle + PI2
    } else {
      if (startAngle !== endAngle) {
        if ((startAngle - endAngle) % PI2 === 0) {
          endAngle = startAngle
        } else {
          startAngle = startAngle % PI2
          while (endAngle > startAngle + PI2) {
            endAngle -= PI2
          }
        }
      }
    }

    // 弧的总角度值
    const angleCount = startAngle > endAngle
      ? PI2 - startAngle + endAngle
      : endAngle - startAngle

    return (t: number) => {
      if (anitclockwise) {
        // 反方向
        t = 1 - t
      }
      const degree = angleCount * t + startAngle
      return {
        x: x + Math.cos(degree) * r,
        y: y + Math.sin(degree) * r
      }
    }
  }
}
