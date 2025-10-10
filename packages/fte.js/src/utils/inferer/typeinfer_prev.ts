import * as parser from '@babel/parser'
import traverse, { type NodePath, type Scope } from '@babel/traverse'

import * as t from '@babel/types'
import type { Info } from './types/Info'
import { createInfo } from './utils/createInfo'

export function inferTypesFromFunction(funcCode: string): Map<string, Info> {
  // create source file
  const code = funcCode.trim()
  const sourceFile = parser.parse(code, {
    plugins: ['typescript'],
    sourceType: 'script',
  })
  // reserver result array
  console.log(JSON.stringify(sourceFile, null, 2))
  const result = new Map<string, Info>()
  VisitAllFunctions(result, sourceFile)
  return result
}

function VisitAllFunctions(result: Map<string, Info>, ast: t.File) {
  const extractFunction = {
    FunctionDeclaration(
      path: NodePath<t.FunctionDeclaration>,
      context: Map<string, Info>,
    ) {
      const name = extractName(path.node.id)[0]
      createFunction(context, name, path.node, path.scope)
    },
    VariableDeclarator(
      path: NodePath<t.VariableDeclarator>,
      context: Map<string, Info>,
    ) {
      const name = extractName(path.node.id)[0]
      if (name) {
        const init = path.node.init
        if (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init)) {
          createFunction(context, name, init, path.scope)
        } else if (t.isCallExpression(init)) {
          const extractor = {
            FunctionExpression(path: NodePath<t.FunctionExpression>) {
              createFunction(context, name, path.node, path.scope)
            },
            ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
              createFunction(context, name, path.node, path.scope)
            },
          }
          traverse(init, extractor, path.scope, path.state, path.parentPath)
        }
      }
    },
    ObjectMethod(path: NodePath<t.ObjectMethod>, context: Map<string, Info>) {
      const name = extractName(path.node.key)[0]
      if (name) {
        createFunction(context, name, path.node, path.scope)
      }
    },
    ClassMethod(path: NodePath<t.ClassMethod>, context: Map<string, Info>) {
      const name = extractName(path.node.key)[0]
      if (name) {
        createFunction(context, name, path.node, path.scope)
      }
    },
    ClassPrivateMethod(
      path: NodePath<t.ClassPrivateMethod>,
      context: Map<string, Info>,
    ) {
      const name = extractName(path.node.key)[0]
      if (name) {
        createFunction(context, name, path.node, path.scope)
      }
    },
  }
  traverse(ast, extractFunction, undefined, result)
  return result
}

function extractName(
  n:
    | t.LVal
    | t.Identifier
    | t.StringLiteral
    | t.Expression
    | t.PrivateName
    | t.AssignmentPattern
    | t.ObjectProperty
    | t.PatternLike
    | null
    | undefined,
): Array<string> {
  if (t.isIdentifier(n)) {
    return [n.name]
  } else if (t.isPrivateName(n)) {
    return [n.id.name]
  } else if (t.isObjectProperty(n)) {
    return extractName(n.key)
  } else if (t.isStringLiteral(n)) {
    return [n.value]
  } else if (t.isAssignmentExpression(n)) {
    return extractName(n.left)
  } else if (t.isMemberExpression(n)) {
    const property = extractName(n.property)
    if (t.isIdentifier(n.object)) {
      return [...extractName(n.object), ...property]
    } else return property
  } else if (t.isRestElement(n)) {
    return extractName(n.argument)
  } else if (t.isAssignmentPattern(n)) {
    return extractName(n.left)
  } else if (t.isArrayPattern(n)) {
    return n.elements.flatMap((element) => extractName(element))
  } else if (t.isObjectPattern(n)) {
    return n.properties.flatMap((property) => extractName(property))
  } else if (t.isTSParameterProperty(n)) {
    return extractName(n.parameter)
  } else if (t.isTSAsExpression(n)) {
    return extractName(n.expression)
  } else if (t.isTSTypeAssertion(n)) {
    return extractName(n.expression)
  } else if (t.isTSNonNullExpression(n)) {
    return extractName(n.expression)
  } else if (t.isVoidPattern(n)) {
    // VoidPattern doesn't have a name, return empty array
    return []
  } else return ['anonymous']
}

function createFunction(
  context: Map<string, Info>,
  name: string,
  func: t.Function,
  scope: Scope,
) {
  const info = createInfo(context, name, name, '', 'function', scope)
  context.set(info.name, info)
  func.params.forEach((p, index) => {
    processPattern(index, p, context, info, scope)
  })
}

function processPattern(
  index: number,
  node: t.Identifier | t.TSParameterProperty | t.RestElement | t.Pattern,
  result: Map<string, Info>,
  func: Info,
  scope: Scope,
) {
  if (t.isIdentifier(node)) {
    // в этом случает параметр является примитивом
    const name = extractName(node)[0]
    const param = createInfo(result, name, name, '', 'primitive', scope)
    func.properties.set(param.name, param)
    result.set(param.name, param)
  } else if (t.isTSParameterProperty(node)) {
    // в этом случает параметр является свойством класса
    // и необходимо проверять его использование внутри класса и внутри функции
    // если он используется внутри класса то он не является параметром функции
    // и используется с параметром this.<name>
    const parameters = extractName(node.parameter)
    parameters.forEach((name) => {
      const param = createInfo(result, name, name, '', 'primitive', scope)
      func.properties.set(param.name, param)
      result.set(param.name, param)
    })
  } else if (t.isRestElement(node)) {
    // в этом случает параметр является массивом
    const parameters = extractName(node.argument)
    parameters.forEach((name) => {
      const param = createInfo(result, name, name, '', 'array', scope)
      func.properties.set(param.name, param)
      result.set(param.name, param)
    })
  } else if (t.isPattern(node)) {
    if (t.isObjectPattern(node)) {
      // в этом случает параметр является объектом
      const paramName = `param${index}`
      const paramObj = createInfo(
        result,
        paramName,
        paramName,
        '',
        'object',
        scope,
      )
      func.properties.set(paramObj.name, paramObj)
      node.properties.forEach((p) => {
        const parameter = extractName(p)[0]
        const param = createInfo(
          result,
          parameter,
          parameter,
          paramName,
          'primitive',
          scope,
        )
        paramObj.properties.set(param.name, param)
        result.set(param.name, param)
      })
    } else if (t.isArrayPattern(node)) {
      // в этом случает параметр является массивом
      const paramName = `param${index}`
      const paramObj = createInfo(
        result,
        paramName,
        paramName,
        '',
        'object',
        scope,
      )
      func.properties.set(paramObj.name, paramObj)
      node.elements.forEach((p) => {
        const parameter = extractName(p)[0]
        const param = createInfo(
          result,
          parameter,
          parameter,
          paramName,
          'primitive',
          scope,
        )
        paramObj.properties.set(param.name, param)
        result.set(param.name, param)
      })
    } else if (t.isAssignmentPattern(node)) {
      // в этом случает параметр является примитивом
      const parameter = extractName(node.left)[0]
      const param = createInfo(
        result,
        parameter,
        parameter,
        parameter,
        'primitive',
        scope,
      )
      func.properties.set(param.name, param)
      result.set(param.name, param)
    }
  }
}

// для поддержания уровня вложенности необходимо использовать стек
// который будет содержать текущий контекст
// переменные внутри контекста могут друг друга перекрывать
// поэтому на каждом уровне будет свой контекст
