import { Info } from './Info'
import { createInfo } from './createInfo'

import * as t from '@babel/types'
import traverse, { NodePath } from '@babel/traverse'
import * as parser from '@babel/parser'

export function inferTypesFromFunction(funcCode: string): Map<string, Info> {
  // create source file
  const code = funcCode.trim()
  const sourceFile = parser.parse(code, { plugins: ['typescript'], sourceType: 'script' })
  // reserver result array
  console.log(JSON.stringify(sourceFile, null, 2))
  const result = new Map<string, Info>()
  VisitAllFunctions(result, sourceFile, code)
  return result
}

function VisitAllFunctions(result: Map<string, Info>, ast: t.File, code: string) {
  const extractFunction = {
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      const name = extractName(path.node.id)
      if (name) {
        createFunction(result, name, path.node)
      }
    },
    VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
      const name = extractName(path.node.id)
      if (name) {
        const init = path.node.init
        if (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init)) {
          createFunction(result, name, init)
        } else if (t.isCallExpression(init)) {
          const extractor = {
            FunctionExpression(path: NodePath<t.FunctionExpression>) {
              createFunction(result, name, path.node)
            },
            ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
              createFunction(result, name, path.node)
            },
          }
          traverse(init, extractor, path.scope, path.state, path.parentPath)
        }
      }
    },
    ClassMethod(path: NodePath<t.ClassMethod>) {
      const name = extractName(path.node.key)
      if (name) {
        createFunction(result, name, path.node)
      }
    },
    ClassPrivateMethod(path: NodePath<t.ClassPrivateMethod>) {
      const name = extractName(path.node.key)
      if (name) {
        createFunction(result, name, path.node)
      }
    },
  }
  traverse(ast, extractFunction)
  return result
}

function extractName(
  n: t.LVal | t.Identifier | t.StringLiteral | t.Expression | t.PrivateName | null | undefined,
): string {
  if (t.isIdentifier(n)) {
    return n.name
  } else if (t.isObjectPattern(n)) {
    return extractName(n)
  } else return 'anonymous'
}

function createFunction(result: Map<string, Info>, name: string, func: t.Function) {
  const info = createInfo(result, name, name, '', 'function')
  result.set(info.name, info)
  if (t.isFunctionExpression(func)) {
    func.params.forEach(p => {
      processPattern(p, result, info)
    })
  } else if (t.isArrowFunctionExpression(func)) {
    func.params.forEach(p => {
      processPattern(p, result, info)
    })
  } else if (t.isClassMethod(func)) {
    func.params.forEach(p => {
      processPattern(p, result, info)
    })
  } else if (t.isClassPrivateMethod(func)) {
    func.params.forEach(p => {
      processPattern(p, result, info)
    })
  } else if (t.isFunctionDeclaration(func)) {
    func.params.forEach(p => {
      processPattern(p, result, info)
    })
  }
}

function processPattern(
  node: t.Identifier | t.TSParameterProperty | t.RestElement | t.Pattern,
  result: Map<string, Info>,
  func: Info,
) {
  if (t.isIdentifier(node)) {
    const param = createInfo(result, node.name, node.name, '', 'primitive')
    func.properties.set(param.name, param)
    result.set(param.name, param)
  }
}

// для поддержания уровня вложенности необходимо использовать стек
// который будет содержать текущий контекст
// переменные внутри контекста могут друг друга перекрывать
// поэтому на каждом уровне будет свой контекст
