import { Info } from '../types/Info'
import { TSBaseType } from '../types/TSBaseType'
import { TSPrimitive } from '../types/TSPrimitive'
import { TSFunction } from '../types/TSFunction'
import { TSArray } from '../types/TSArray'
import { TSObject } from '../types/TSObject'

export function processInfo(info: Info): TSBaseType {
  if (info.type === 'function') {
    return new TSFunction(info.name, [...info.properties.values()].map(processInfo))
  }
  if (info.type === 'array') {
    return new TSArray(info.name, processInfo(info.children.values().next().value))
  }
  if (info.type === 'object') {
    return new TSObject(info.name, [...info.properties.values()].map(processInfo))
  }
  if (info.type === 'primitive') {
    return new TSPrimitive(info.name)
  }
  throw new Error('unknown type')
}
