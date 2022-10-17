import { describe, expect, it, test } from 'vitest'

import UnitPath from '../src/index'
import { Point } from '../types/config.d'

describe('UnitPath', () => {
  const p0: Point = { x: 100, y: 100 }
  const p1: Point = { x: 200, y: 150 }
  const p2: Point = { x: 300, y: 50 }
  const p3: Point = { x: 400, y: 100 }

  const unitPath = new UnitPath()

  it('Should work correctly when type is `LINE`', () => {
    const points = unitPath.setPath('LINE', p0, p3).getPoints()

    expect(points.length).toBe(50)
    expect(points[0].x).toBe(p0.x)
    expect(points[0].y).toBe(p0.y)
    expect(points[50 - 1].x).toBe(p3.x)
    expect(points[50 - 1].y).toBe(p3.y)
  })

  it('Should work correctly when type is `TWO_ORDER_BEZIER`', () => {
    const twoOrderCurvePoints = unitPath.setPath('TWO_ORDER_BEZIER', p0, p1, p3).getPoints(10)
    expect(twoOrderCurvePoints.length).toBe(10)
    expect(twoOrderCurvePoints[0].x).toBe(p0.x)
    expect(twoOrderCurvePoints[0].y).toBe(p0.y)
    expect(twoOrderCurvePoints[10 - 1].x).toBe(p3.x)
    expect(twoOrderCurvePoints[10 - 1].y).toBe(p3.y)
  })

  it('Should work correctly when type is `THREE_ORDER_BEZIER`', () => {
    const threeOrderCurvePoints = unitPath.setPath('THREE_ORDER_BEZIER', p0, p1, p2, p3).getPoints(30)
    expect(threeOrderCurvePoints.length).toBe(30)
    expect(threeOrderCurvePoints[0].x).toBe(p0.x)
    expect(threeOrderCurvePoints[0].y).toBe(p0.y)
    expect(threeOrderCurvePoints[30 - 1].x).toBe(p3.x)
    expect(threeOrderCurvePoints[30 - 1].y).toBe(p3.y)
  })

  it('Should work correctly when type is `ARC`', () => {
    const arcPoint = unitPath.setPath('ARC', 100, 100, 50, 0, 2 * Math.PI).getPoint(0)
    expect(arcPoint.x).toBe(150)
    expect(arcPoint.y).toBe(100)
  })

  it('Should get correct value', () => {
    const un = new UnitPath({
      decimalPlaces: 0
    })
    const linePoint = un.setPath('LINE', { x: 0, y: 0 }, { x: 100, y: 100 }).getPoint(0.5)
    expect(linePoint.x % 1).toBe(0)
    expect(linePoint.y % 1).toBe(0)
  })

  it('Should work correctly', () => {
    const un = new UnitPath({
      decimalPlaces: 2
    })

    const arc1 = un.setPath('ARC', 200, 200, 100, 0, 2 * Math.PI)
    expect(arc1.getPoint(0.5)).toEqual({ x: 100, y: 200 })

    const arc2 = un.setPath('ARC', 200, 200, 100, 0, 2 * Math.PI, true)
    expect(arc2.getPoint(0.5)).toEqual({ x: 300, y: 200 })

    const arc3 = un.setPath('ARC', 200, 200, 100, 0, Math.PI, true)
    expect(arc3.getPoint(0.5)).toEqual({ x: 200, y: 100 })

    const arc4 = un.setPath('ARC', 200, 200, 100, 2 * Math.PI, 3 * Math.PI, false)
    expect(arc4.getPoint(0.5)).toEqual({ x: 200, y: 300 })
  })

  test('Should be undefined', () => {
    expect(() => (unitPath as any).setPath('ANOTHER_CRUVE')).toThrowError('The argument \'type\' expact \'LINE\', \'TWO_ORDER_BEZIER\', \'THREE_ORDER_BEZIER\', or \'ARC\', but got \'ANOTHER_CRUVE\'')
  })

  test('Throws an error when use an illegal decimalPlaces', () => {
    expect(() => new UnitPath({
      decimalPlaces: -2
    })).toThrowError('The argument \'decimalPlaces\' must be a positive integer or -1.')

    expect(() => new UnitPath({
      decimalPlaces: 1.1
    })).toThrowError('The argument \'decimalPlaces\' must be a positive integer or -1.')
  })

  test('Throws an error when use an illegal defaultQuantity', () => {
    expect(() => new UnitPath({
      defaultQuantity: -1
    })).toThrowError('The argument \'defaultQuantity\' must be a positive integer.')

    expect(() => new UnitPath({
      defaultQuantity: 3.5
    })).toThrowError('The argument \'defaultQuantity\' must be a positive integer.')
  })

  test('Throws an error when use an illegal t', () => {
    const un = new UnitPath()

    expect(() => un.getPoint()).toThrowError('Please set path first.')
    un.setPath('LINE', { x: 0, y: 0 }, { x: 100, y: 100 })
    expect(() => un.getPoint(-1)).toThrowError('The argument \'t\' must be between 0 and 1.')
    expect(() => un.getPoint(1.1)).toThrowError('The argument \'t\' must be between 0 and 1.')
  })

  test('Throws an error when use an illegal quantity', () => {
    const un = new UnitPath()

    expect(() => un.getPoints()).toThrowError('Please set path first.')
    expect(() => un.getPoints(1.1)).toThrowError('The argument \'quantity\' must be a positive integer.')
    expect(() => un.getPoints(-1)).toThrowError('The argument \'quantity\' must be a positive integer.')
  })
})
