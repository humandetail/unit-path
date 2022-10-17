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
