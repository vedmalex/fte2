import { Info } from '../types/Info'
import { createInfo } from './createInfo'
import * as t from '@babel/types'
import traverse, { Binding, Scope } from '@babel/traverse'
import { extractName } from './extractName'

export function processArgument(
  index: number,
  node: t.Identifier | t.TSParameterProperty | t.RestElement | t.Pattern,
  result: Map<string, Info>,
  func: Info,
  scope: Scope,
  anonynmous: () => string,
) {
  if (t.isIdentifier(node)) {
    // в этом случает параметр является примитивом
    const name = extractName(node, anonynmous)
    const param = createInfo(result, name, name, '', 'primitive', scope)
    func.properties.set(param.name, param)
    result.set(param.name, param)
  } else if (t.isTSParameterProperty(node)) {
    // в этом случает параметр является свойством класса
    const parameter = extractName(node.parameter, anonynmous)
    const param = createInfo(result, parameter, parameter, '', 'primitive', scope)
    func.properties.set(param.name, param)
    result.set(param.name, param)
  } else if (t.isRestElement(node)) {
    // в этом случает параметр является массивом
    const parameter = extractName(node.argument, anonynmous)
    debugger
    discoverType(scope.getBinding(parameter), parameter, func.scope.block)
    const param = createInfo(result, parameter, parameter, '', 'array', scope)
    func.properties.set(param.name, param)
    result.set(param.name, param)
  } else if (t.isPattern(node)) {
    if (t.isObjectPattern(node)) {
      // в этом случает параметр является объектом
      const paramName = `param${index}`
      const paramObj = createInfo(result, paramName, paramName, '', 'object', scope)
      func.properties.set(paramObj.name, paramObj)
      node.properties.forEach(p => {
        const parameter = extractName(p, anonynmous)
        const param = createInfo(result, parameter, parameter, paramName, 'primitive', scope)
        paramObj.properties.set(param.name, param)
        result.set(param.name, param)
      })
    } else if (t.isArrayPattern(node)) {
      // в этом случает параметр является массивом
      const paramName = `param${index}`
      const paramObj = createInfo(result, paramName, paramName, '', 'array', scope)
      func.properties.set(paramObj.name, paramObj)
      node.elements.forEach(p => {
        const parameter = extractName(p, anonynmous)
        const param = createInfo(result, parameter, parameter, paramName, 'primitive', scope)
        paramObj.properties.set(param.name, param)
        result.set(param.name, param)
      })
    } else if (t.isAssignmentPattern(node)) {
      // в этом случает параметр является примитивом
      const parameter = extractName(node.left, anonynmous)
      debugger
      discoverType(scope.getBinding(parameter), parameter, func.scope.block)
      const param = createInfo(result, parameter, parameter, parameter, 'primitive', scope)
      func.properties.set(param.name, param)
      result.set(param.name, param)
    }
  }
}

// Traverse the AST and look for nodes that reference the binding
function discoverType(binding: Binding | undefined, param: string, ast: t.Node) {
  let type = ''
  if (binding?.referenced) {
    binding.referencePaths.forEach(path => {
      traverse(
        path.node,
        {
          enter(path) {
            if (path.isVariableDeclarator()) {
              // If the binding is declared in this scope, try to infer its type
              if (t.isArrayExpression(path.node.init)) {
                type = 'array'
              } else if (t.isObjectExpression(path.node.init)) {
                type = 'object'
              } else if (t.isCallExpression(path.node.init)) {
                const callee = path.node.init.callee
                debugger
                // if (callee.object && callee.object.name === binding.name) {
                //   if (
                //     callee.property &&
                //     ['push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'forEach', 'map', 'filter'].includes(
                //       callee.property.name,
                //     )
                //   ) {
                //     type = 'array'
                //   }
                // }
              }
            } else if (path.isMemberExpression()) {
              // If the binding is used with a member expression, try to infer its type
              // if (path.node.object && path.node.object.name === binding.name) {
              //   if (path.node.property && path.node.property.type === 'Identifier') {
              //     if (
              //       ['push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'forEach', 'map', 'filter'].includes(
              //         path.node.property.name,
              //       )
              //     ) {
              //       type = 'array'
              //     } else {
              //       type = 'object'
              //     }
              //   }
              // }
            }
          },
        },
        path.scope,
        path,
      )
    })
  }

  return type
}
