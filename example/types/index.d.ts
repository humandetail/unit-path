import { CurveType } from '../../types/config.d';

export type State = {
  type: CurveType
  args: Record<string, any>
  t: number
  quantity: number
}
