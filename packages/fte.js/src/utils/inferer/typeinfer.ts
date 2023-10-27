import { Info } from './types/Info'

import * as parser from '@babel/parser'
import { visitAllFunctions } from './utils/visitAllFunctions'
import { processInfo } from './utils/processInfo'
import { TSBaseType } from './types/TSBaseType'
import { processFunction } from './utils/processFunction'

export function inferTypesFromFunction(funcCode: string): Map<string, Info> {
  // create source file
  const code = funcCode.trim()
  const sourceFile = parser.parse(code, { plugins: ['typescript'], sourceType: 'module' })
  // reserver result array
  const result = visitAllFunctions(sourceFile)
  const context = new Map<string, Info>()

  let anonymousCount = 0
  const anonynmous = () => `anonymous${anonymousCount++}`
  result.forEach(path => {
    processFunction(context, path, anonynmous)
  })

  const res: TSBaseType[] = []
  context.forEach(value => {
    res.push(processInfo(value))
  })
  return context
}
