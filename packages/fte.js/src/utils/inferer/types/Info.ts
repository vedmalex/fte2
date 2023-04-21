// info about a parameter

import { Scope } from '@babel/traverse'
import { FunctionType } from '../FunctionType'

export type Info = {
  parent: Info
  scope: Scope
  children: Map<string, Info>
  typeName: string
  name: string
  type: 'object' | 'array' | 'primitive' | 'function'
  properties: Map<string, Info>
}
