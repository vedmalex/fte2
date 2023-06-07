// info about a parameter

import { Scope } from '@babel/traverse'
import _ from 'lodash'

export type Info = {
  type: 'object' | 'array' | 'primitive' | 'function' | 'min'
  name: string
  typeName: string
  properties: Map<string, Info>
  children: Map<string, Info>
  parent?: Info
  optional?: boolean
  args?: number
  scope?: Scope
}

export function createMinInfo({ name, typeName, type }: { name: string; typeName?: string; type: Info['type'] }): Info {
  return {
    name,
    type: type ?? 'min',
    properties: new Map<string, Info>(),
    children: new Map<string, Info>(),
    typeName: typeName ?? _.upperFirst(name),
  }
}
