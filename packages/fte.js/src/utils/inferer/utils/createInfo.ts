import type { Scope } from '@babel/traverse'
import _ from 'lodash'
import type { Info } from '../types/Info'

// create info and add it to props
export function createInfo(
  props: Map<string, Info>,
  name: string,
  typeName: string,
  parent: string,
  type: Info['type'],
  scope?: Scope,
): Info {
  const parentInfo = props.get(parent)
  const info = {
    name,
    type,
    properties: new Map<string, Info>(),
    typeName: _.upperFirst(typeName),
    parent: parentInfo,
    children: new Map<string, Info>(),
    scope,
  } as Info
  if (parentInfo) {
    parentInfo.children.set(_.upperFirst(typeName), info)
  }
  props.set(name, info)
  return info
}
