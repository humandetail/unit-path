/*
 * @FilePath: /unit-path/src/__test__/UnitPath.test.ts
 * @Description: test
 * @Author: humandetail
 * @Date: 2021-04-05 18:40:11
 * @LastEditors: humandetail
 * @LastEditTime: 2021-04-05 19:49:53
 */

import UnitPath, { IPoint } from '../index';

test('UnitPath', () => {
  const unitPath = new UnitPath();

  function getPoint (x: number, y: number): IPoint {
    return {
      x,
      y
    }
  }

  const p0 = getPoint(100, 100);
  const p1 = getPoint(200, 150);
  const p2 = getPoint(300, 50);
  const p3 = getPoint(400, 100);
  
  const linePoints = unitPath.setPath('LINE', p0, p3).getPoints(50);
  expect(linePoints.length).toBe(50);
  expect(linePoints[0].x).toBe(p0.x);
  expect(linePoints[0].y).toBe(p0.y);
  expect(linePoints[50 - 1].x).toBe(p3.x);
  expect(linePoints[50 - 1].y).toBe(p3.y);

  const twoOrderCurvePoints = unitPath.setPath('TWO_ORDER_BEZIER', p0, p1, p3).getPoints(10);
  expect(twoOrderCurvePoints.length).toBe(10);
  expect(twoOrderCurvePoints[0].x).toBe(p0.x);
  expect(twoOrderCurvePoints[0].y).toBe(p0.y);
  expect(twoOrderCurvePoints[10 - 1].x).toBe(p3.x);
  expect(twoOrderCurvePoints[10 - 1].y).toBe(p3.y);

  const threeOrderCurvePoints = unitPath.setPath('THREE_ORDER_BEZIER', p0, p1, p2, p3).getPoints(30);
  expect(threeOrderCurvePoints.length).toBe(30);
  expect(threeOrderCurvePoints[0].x).toBe(p0.x);
  expect(threeOrderCurvePoints[0].y).toBe(p0.y);
  expect(threeOrderCurvePoints[30 - 1].x).toBe(p3.x);
  expect(threeOrderCurvePoints[30 - 1].y).toBe(p3.y);

  const arcPoint = unitPath.setPath('ARC', 100, 100, 50, 0, 2 * Math.PI).getPoint(0);
  expect(arcPoint.x).toBe(150);
  expect(arcPoint.y).toBe(100);
});
