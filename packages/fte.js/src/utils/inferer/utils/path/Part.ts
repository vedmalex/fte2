import { isCall } from './isCall'
import { isExpression } from './isExpression'
import { isIndex } from './isIndex'
import { isProperty } from './isProperty'

export type Part = {
  name: string | number | boolean
  type: 'index' | 'property' | 'call' | 'expression'
  optional: boolean
  children?: Part[]
  arguments?: Part[]
}

export function isPart(p: any): p is Part {
  return isIndex(p) || isCall(p) || isProperty(p) || isExpression(p)
}
