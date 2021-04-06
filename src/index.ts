export type CURVE_TYPE = 'LINE' | 'TWO_ORDER_BEZIER' | 'THREE_ORDER_BEZIER' | 'ARC';

export interface IPoint {
  x: number;
  y: number;
};

export interface ICalculator {
  (t: number): IPoint;
}

export default class UnitPath {
  private _calculator: ICalculator | null = null;
  constructor () {}

  /**
   * 设置路径
   * @param {*} type 
   * @param  {...any} args 
   */
  setPath (type: CURVE_TYPE, startPoint: IPoint, endPoint: IPoint): UnitPath;
  setPath (type: CURVE_TYPE, startPoint: IPoint, controlPoint: IPoint, endPoint: IPoint): UnitPath;
  setPath (type: CURVE_TYPE, startPoint: IPoint, controlPoint1: IPoint, controlPoint2: IPoint, endPoint: IPoint): UnitPath;
  setPath (type: CURVE_TYPE, x: number, y: number, r: number, startAngle: number, endAngle: number, anticlockwise?: boolean): UnitPath;
  setPath (type: CURVE_TYPE, ...args: any[]): UnitPath {
    switch (type) {
      case 'LINE':
        this._calculator = this._line(args[0], args[1]);
        break;
      case 'TWO_ORDER_BEZIER':
        this._calculator = this._twoOrderBezierCurve(args[0], args[1], args[2]);
        break;
      case 'THREE_ORDER_BEZIER':
        this._calculator = this._threeOrderBezierCurve(args[0], args[1], args[2], args[3]);
        break;
      case 'ARC':
        this._calculator = this._arc(args[0], args[1], args[2], args[3], args[4], args[5]);
        break;
      default:
        this._calculator = null;
        break;
    }

    return this;
  }

  /**
   * 获取路径上指定位置的点
   * @param { number } t - 点位于路径的位置，取值[0, 1];
   * @returns 返回指定位置的点
   */
  getPoint (t: number): IPoint {
    if (!this._calculator) {
      throw new Error('Curve path setup failed.');
    }
    return this._calculator(t);
  }

  /**
   * 获取路径上平均分布的点
   * 获取点的数量为 quantity + 1 个点，包含起点和终点
   * @param { number } quantity - 获取点的数量
   * @returns 返回数量为 quantity 个点组成的数组
   */
  getPoints (quantity: number): IPoint[] {
    if (quantity <= 0) {
      throw new RangeError('The parameter "quantity" must be greater than 0.');
    }

    const points = [];
    for (let i = 0; i < quantity; i++) {
      points.push(this.getPoint(i / (quantity - 1)));
    }

    return points;
  }

  /**
   * 直线计算方式
   * @param { number } t - 百分比值
   * @param { IPoint } startPoint - 起始坐标
   * @param { IPoint } endPoint - 结束坐标
   * @returns 返回一个坐标点
   */
  private _line (startPoint: IPoint, endPoint: IPoint): ICalculator {
    const { x: x0, y: y0 } = startPoint;
    const { x: x1, y: y1 } = endPoint;

    return (t: number) => {
      if (t > 1 || t < 0) {
        throw new Error('The value range of paramter "t" is [0, 1].');
      }

      // B(t) = P0 + (P1 - P0) * t
      return {
        x: x0 + (x1 - x0) * t,
        y: y0 + (y1 - y0) * t
      };
    };
  }

  /**
   * 二阶贝塞尔曲线计算方式
   * @param { IPoint } startPoint 起始点
   * @param { IPoint } controlPoint 控制点
   * @param { IPoint } endPoint 结束点
   * @returns 返回一个坐标点
   */
  private _twoOrderBezierCurve (startPoint: IPoint, controlPoint: IPoint, endPoint: IPoint): ICalculator {
    const { x: x0, y: y0 } = startPoint;
    const { x: x1, y: y1 } = controlPoint;
    const { x: x2, y: y2 } = endPoint;

    return (t: number) => {
      if (t > 1 || t < 0) {
        throw new Error('The value range of paramter "t" is [0, 1].');
      }

      // B(t) = (1 - t)² * P0 + 2 * t * (1 - t) * P1 + t² * P2
      return {
        x: Math.pow(1 - t, 2) * x0 + 2 * t * (1 - t) * x1 + Math.pow(t, 2) * x2,
        y: Math.pow(1 - t, 2) * y0 + 2 * t * (1 - t) * y1 + Math.pow(t, 2) * y2
      };
    };
  }

  /**
   * 三阶贝塞尔曲线计算方式
   * @param { IPoint } startPoint - 起始点
   * @param { IPoint } controlPoint1 - 控制点1
   * @param { IPoint } controlPoint2 - 控制点2
   * @param { IPoint } endPoint - 结束点
   * @returns 返回一个坐标点
   */
  private _threeOrderBezierCurve (startPoint: IPoint, controlPoint1: IPoint, controlPoint2: IPoint, endPoint: IPoint) {
    const { x: x0, y: y0 } = startPoint;
    const { x: x1, y: y1 } = controlPoint1;
    const { x: x2, y: y2 } = controlPoint2;
    const { x: x3, y: y3 } = endPoint;

    return (t: number) => {
      if (t > 1 || t < 0) {
        throw new Error('The value range of paramter "t" is [0, 1].');
      }

      // B(t) = P0 * (1 - t)³ + 3 * P1 * t * (1 - t)² + 3 * P2 * t² * (1 - t) + P3 * t³
      return {
        x: x0 * Math.pow(1 - t, 3) + 3 * x1 * t * Math.pow(1 - t, 2) + 3 * x2 * Math.pow(t, 2) * (1 - t) + x3 * Math.pow(t, 3),
        y: y0 * Math.pow(1 - t, 3) + 3 * y1 * t * Math.pow(1 - t, 2) + 3 * y2 * Math.pow(t, 2) * (1 - t) + y3 * Math.pow(t, 3)
      };
    };
  }

  /**
   * 圆 / 圆弧计算
   * @param { number } x - 圆心x
   * @param { number } y - 圆心y
   * @param { number } r - 半径
   * @param { number } startAngle - 起始角
   * @param { number } endAngle - 结束角
   * @param { boolean } [anitclockwise] - 是否逆时针方向
   * @returns 返回一个坐标点
   */
  private _arc (x: number, y: number, r: number, startAngle: number, endAngle: number, anitclockwise: boolean = false): ICalculator {
    const PI = Math.PI;
    const PI2 = 2 * PI;
    
    let angleCount: number; // 弧的总角度值

    if (anitclockwise) {
      // 顺时针绘制时，交换起始角和结束角
      ([startAngle, endAngle] = [endAngle, startAngle]);
    }
    // 处理特殊情况
    if (endAngle - startAngle >= PI2) {
      endAngle = startAngle + PI2;
    } else {
      if (startAngle !== endAngle) {
        if ((startAngle - endAngle) % PI2 === 0) {
          endAngle = startAngle;
        } else {
          startAngle = startAngle % PI2;
          while (endAngle > startAngle + PI2) {
            endAngle -= PI2;
          }
        }
      }
    }

    angleCount = startAngle > endAngle
      ? PI2 - startAngle + endAngle
      : endAngle - startAngle;

    return (t: number) => {
      if (t > 1 || t < 0) {
        throw new Error('The value range of paramter "t" is [0, 1].');
      }

      if (anitclockwise) {
        // 反方向
        t = 1 - t;
      }
      const degree = angleCount * t + startAngle;
      return {
        x: x + Math.cos(degree) * r,
        y: y + Math.sin(degree) * r
      }
    }
  }
}
