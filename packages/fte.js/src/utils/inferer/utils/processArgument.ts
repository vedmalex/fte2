import { Info } from '../types/Info'
import { createInfo } from './createInfo'
import * as t from '@babel/types'
import { Scope } from '@babel/traverse'
import { extractName } from './extractName'

export function processArgument(
  index: number,
  node: t.Identifier | t.TSParameterProperty | t.RestElement | t.Pattern,
  actualAgruments: Map<string, Info>,
  func: Info,
  scope: Scope,
  anonynmous: () => string,
) {
  if (t.isIdentifier(node)) {
    // в этом случает параметр является примитивом
    const name = extractName(node, anonynmous)
    const param = createInfo(actualAgruments, name, name, '', 'primitive', scope)
    func.properties.set(param.name, param)
    actualAgruments.set(param.name, param)
  } else if (t.isTSParameterProperty(node)) {
    // в этом случает параметр является свойством класса
    const parameter = extractName(node.parameter, anonynmous)
    const param = createInfo(actualAgruments, parameter, parameter, '', 'primitive', scope)
    func.properties.set(param.name, param)
    actualAgruments.set(param.name, param)
  } else if (t.isRestElement(node)) {
    // в случае если ...rest в Function он является array
    // в этом случает параметр является массивом
    const parameter = extractName(node.argument, anonynmous)
    const param = createInfo(actualAgruments, parameter, parameter, '', 'array', scope)
    func.properties.set(param.name, param)
    actualAgruments.set(param.name, param)
  } else if (t.isPattern(node)) {
    if (t.isObjectPattern(node)) {
      // в этом случает параметр является объектом
      const paramName = `param${index}`
      const paramObj = createInfo(actualAgruments, paramName, paramName, '', 'object', scope)
      func.properties.set(paramObj.name, paramObj)
      node.properties.forEach(p => {
        const parameter = extractName(p, anonynmous)
        const param = createInfo(actualAgruments, parameter, parameter, paramName, 'primitive', scope)
        paramObj.properties.set(param.name, param)
        actualAgruments.set(param.name, param)
      })
    } else if (t.isArrayPattern(node)) {
      // в этом случает параметр является массивом
      const paramName = `param${index}`
      const paramObj = createInfo(actualAgruments, paramName, paramName, '', 'array', scope)
      func.properties.set(paramObj.name, paramObj)
      node.elements.forEach(p => {
        const parameter = extractName(p, anonynmous)
        const param = createInfo(actualAgruments, parameter, parameter, paramName, 'primitive', scope)
        paramObj.properties.set(param.name, param)
        actualAgruments.set(param.name, param)
      })
    } else if (t.isAssignmentPattern(node)) {
      // в этом случает параметр является примитивом и ему присваивается какое-то значение
      const parameter = extractName(node.left, anonynmous)
      const param = createInfo(actualAgruments, parameter, parameter, parameter, 'primitive', scope)
      func.properties.set(param.name, param)
      actualAgruments.set(param.name, param)
    }
  }
}
