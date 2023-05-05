import { Info } from './types/Info'

import { Scope } from '@babel/traverse'
import * as parser from '@babel/parser'
import { visitAllFunctions } from './utils/visitAllFunctions'
import { processFunctions } from './utils/processFunctions'

export function inferTypesFromFunction(funcCode: string): Map<string, Info> {
  // create source file
  const code = funcCode.trim()
  const sourceFile = parser.parse(code, { plugins: ['typescript'], sourceType: 'script' })
  // reserver result array
  console.log(JSON.stringify(sourceFile, null, 2))
  const result = visitAllFunctions(sourceFile)
  const context = new Map<string, Info>()
  processFunctions(result, context)
  return context
}
