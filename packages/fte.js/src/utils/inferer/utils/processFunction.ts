import { type NodePath, Scope } from '@babel/traverse'
import * as t from '@babel/types'
import type { FunctionType } from '../types/FunctionType'
import type { Info } from '../types/Info'
import { makeAST } from '../types/makeAST'
import { createInfo } from './createInfo'
import { extractName } from './extractName'
import { processArgument } from './processArgument'

export function processFunction(
  context: Map<string, Info>,
  path: NodePath<FunctionType>,
  anonymous: () => string,
) {
  let name = ''
  const { node: func, scope } = path
  if (t.isArrowFunctionExpression(func) || t.isFunctionExpression(func)) {
    if (t.isVariableDeclarator(path.parent)) {
      name = extractName(path.parent.id, anonymous)
    } else if (t.isObjectProperty(path.parent)) {
      name = extractName(path.parent, anonymous)
    } else {
      // тут нужно как-то выяснить, а не является ли эта функция итератором
      // и дать ей имя
      // название| вызова | (арг1 / арг2 / арг3)
      // param|forEach|arg0 --- например
      name = anonymous()
    }
  } else if (t.isFunctionDeclaration(func) || t.isFunctionExpression(func)) {
    name = extractName(func.id, anonymous)
  } else if (
    t.isObjectMethod(func) ||
    t.isClassMethod(func) ||
    t.isClassPrivateMethod(func)
  ) {
    name = extractName(func.key, anonymous)
  }

  const info = createInfo(context, name, name, '', 'function', scope)

  context.set(info.name, info)
  // хранит информацию обо всех параметрах функции
  const result = new Map<string, Info>()
  func.params.forEach((p, index) => {
    processArgument(index, p, result, info, scope, anonymous)
  })

  // обрабатываем использование параметров внутри функции
  result.forEach((info, paramName) => {
    const binding = path.scope.getBinding(paramName)
    if (!binding) {
      if (!info.children) info.type = 'primitive'
      return
    }

    // Ищем использование параметра внутри функции
    for (let j = 0; j < binding.referencePaths.length; j++) {
      const refPath = binding.referencePaths[j]
      const expression = refPath.getStatementParent()
      // нужно найти все обращения к параметру
      // и посмотреть, какие свойства у него используются
      if (expression) {
        const infos = makeAST(expression.node)
        const itemUsage = infos.get(refPath.toString())
        if (itemUsage) mergeInfo(info, itemUsage)
      }
    }
  })
}

// сливает информацию об использовании параметра внутри функции
function mergeInfo(info: Info, itemUsage: Info) {
  info.type = itemUsage.type
  itemUsage.properties.forEach((value, key) => {
    if (info.properties.has(key)) {
      const prop = info.properties.get(key)!
      mergeInfo(prop, value)
    } else {
      info.properties.set(key, value)
    }
  })
  itemUsage.children.forEach((value, key) => {
    if (info.children.has(key)) {
      const prop = info.children.get(key)!
      mergeInfo(prop, value)
    } else {
      info.children.set(key, value)
    }
  })
  if (
    itemUsage.args &&
    ((info.args && itemUsage.args > info.args) || !info.args)
  ) {
    info.args = itemUsage.args
  }
  if (!info.optional && itemUsage.optional) {
    info.optional = itemUsage.optional
  }
}
