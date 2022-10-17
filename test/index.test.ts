import { describe, expect, it } from 'vitest';

import UnitPath from '../src/index';
import { Point } from '../types/config.d';

describe('UnitPath', () => {
  const p0: Point = { x: 100, y: 100 };
  const p1: Point = { x: 200, y: 150 };
  const p2: Point = { x: 300, y: 50 };
  const p3: Point = { x: 400, y: 100 };

  const unitPath = new UnitPath();

  it('Should work correctly when type is `LINE`', () => {
    const points = unitPath.setPath('LINE', p0, p3).getPoints();

    expect(points.length).toBe(50);
    expect(points[0].x).toBe(p0.x);
    expect(points[0].y).toBe(p0.y);
    expect(points[50 - 1].x).toBe(p3.x);
    expect(points[50 - 1].y).toBe(p3.y);
  });

  it('Should work correctly when type is `TWO_ORDER_BEZIER`', () => {
    const twoOrderCurvePoints = unitPath.setPath('TWO_ORDER_BEZIER', p0, p1, p3).getPoints(10);
    expect(twoOrderCurvePoints.length).toBe(10);
    expect(twoOrderCurvePoints[0].x).toBe(p0.x);
    expect(twoOrderCurvePoints[0].y).toBe(p0.y);
    expect(twoOrderCurvePoints[10 - 1].x).toBe(p3.x);
    expect(twoOrderCurvePoints[10 - 1].y).toBe(p3.y);
  });

  it('Should work correctly when type is `THREE_ORDER_BEZIER`', () => {
    const threeOrderCurvePoints = unitPath.setPath('THREE_ORDER_BEZIER', p0, p1, p2, p3).getPoints(30);
    expect(threeOrderCurvePoints.length).toBe(30);
    expect(threeOrderCurvePoints[0].x).toBe(p0.x);
    expect(threeOrderCurvePoints[0].y).toBe(p0.y);
    expect(threeOrderCurvePoints[30 - 1].x).toBe(p3.x);
    expect(threeOrderCurvePoints[30 - 1].y).toBe(p3.y);
  });

  it('Should work correctly when type is `ARC`', () => {
    const arcPoint = unitPath.setPath('ARC', 100, 100, 50, 0, 2 * Math.PI).getPoint(0);
    expect(arcPoint.x).toBe(150);
    expect(arcPoint.y).toBe(100);
  });
});
