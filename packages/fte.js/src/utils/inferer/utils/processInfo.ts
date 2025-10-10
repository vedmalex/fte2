import type { Info } from '../types/Info'
import { TSArray } from '../types/TSArray'
import type { TSBaseType } from '../types/TSBaseType'
import { TSFunction } from '../types/TSFunction'
import { TSObject } from '../types/TSObject'
import { TSPrimitive } from '../types/TSPrimitive'

export function processInfo(info: Info): TSBaseType {
  if (info.type === 'function') {
    return new TSFunction(
      info.name,
      [...info.properties.values()].map(processInfo),
    )
  }
  if (info.type === 'array') {
    const firstChild = info.children.values().next().value
    if (!firstChild) {
      return new TSArray(info.name, new TSPrimitive('unknown'))
    }
    return new TSArray(info.name, processInfo(firstChild))
  }
  if (info.type === 'object') {
    return new TSObject(
      info.name,
      [...info.properties.values()].map(processInfo),
    )
  }
  if (info.type === 'primitive') {
    return new TSPrimitive(info.name)
  }
  throw new Error('unknown type')
}
