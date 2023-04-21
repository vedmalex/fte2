import { Info } from './types/Info'

import * as t from '@babel/types'
import { Scope } from '@babel/traverse'
import * as parser from '@babel/parser'
import { extractName } from './utils/extractName'
import { createFunction } from './utils/createFunction'
import { visitAllFunctions } from './utils/visitAllFunctions'
import { FunctionType } from './FunctionType'

export function inferTypesFromFunction(funcCode: string): Map<string, Info> {
  // create source file
  const code = funcCode.trim()
  const sourceFile = parser.parse(code, { plugins: ['typescript'], sourceType: 'script' })
  // reserver result array
  console.log(JSON.stringify(sourceFile, null, 2))
  const result = new Map<FunctionType, Scope>()
  visitAllFunctions(result, sourceFile)
  const context = new Map<string, Info>()
  let anonymousCount = 0
  const anonynmous = () => `anonymous${anonymousCount++}`
  result.forEach((scope, node) => {
    let name = ''
    if (t.isArrowFunctionExpression(node) || t.isFunctionExpression(node)) {
      if (t.isVariableDeclarator(scope.parentBlock)) {
        name = extractName(scope.parentBlock.id, anonynmous)
      } else name = anonynmous()
    } else if (t.isFunctionDeclaration(node) || t.isFunctionExpression(node)) {
      name = extractName(node.id, anonynmous)
    } else if (t.isObjectMethod(node) || t.isClassMethod(node) || t.isClassPrivateMethod(node)) {
      name = extractName(node.key, anonynmous)
    }
    createFunction(context, name, node, scope, anonynmous)
  })
  return context
}
