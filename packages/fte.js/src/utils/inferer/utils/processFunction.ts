import { Info } from '../types/Info'
import { createInfo } from './createInfo'
import * as t from '@babel/types'
import { NodePath, Scope } from '@babel/traverse'
import { processArgument } from './processArgument'
import { FunctionType } from '../types/FunctionType'
import { extractName } from './extractName'
import { makeAST } from '../types/makeAST'

export function processFunction(context: Map<string, Info>, path: NodePath<FunctionType>, anonynmous: () => string) {
  let name = ''
  const { node: func, scope } = path
  if (t.isArrowFunctionExpression(func) || t.isFunctionExpression(func)) {
    if (t.isVariableDeclarator(path.parent)) {
      name = extractName(path.parent.id, anonynmous)
    } else if (t.isObjectProperty(path.parent)) {
      name = extractName(path.parent, anonynmous)
    } else {
      // тут нужно как-то выяснить, а не является ли эта функция итератором
      // и дать ей имя
      // название| вызова | (арг1 / арг2 / арг3)
      // param|forEach|arg0 --- например
      name = anonynmous()
    }
  } else if (t.isFunctionDeclaration(func) || t.isFunctionExpression(func)) {
    name = extractName(func.id, anonynmous)
  } else if (t.isObjectMethod(func) || t.isClassMethod(func) || t.isClassPrivateMethod(func)) {
    name = extractName(func.key, anonynmous)
  }

  const info = createInfo(context, name, name, '', 'function', scope)

  context.set(info.name, info)
  // хранит информацию обо всех параметрах функции
  let result = new Map<string, Info>()
  func.params.forEach((p, index) => {
    processArgument(index, p, result, info, scope, anonynmous)
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
  //
  console.log('mergeInfo', info.type, itemUsage.type)
  info.type = itemUsage.type
  //
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
  if (itemUsage.args && ((info.args && itemUsage.args > info.args) || !info.args)) {
    info.args = itemUsage.args
  }
  if (!info.optional && itemUsage.optional) {
    info.optional = itemUsage.optional
  }
}
