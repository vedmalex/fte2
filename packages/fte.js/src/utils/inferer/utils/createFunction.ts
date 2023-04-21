import { Info } from '../types/Info'
import { createInfo } from './createInfo'
import * as t from '@babel/types'
import { Scope } from '@babel/traverse'
import { processArgument } from './processArgument'

export function createFunction(
  context: Map<string, Info>,
  name: string,
  func: t.Function,
  scope: Scope,
  anonynmous: () => string,
) {
  const info = createInfo(context, name, name, '', 'function', scope)
  context.set(info.name, info)
  let result = new Map<string, Info>()
  func.params.forEach((p, index) => {
    processArgument(index, p, result, info, scope, anonynmous)
  })
}
