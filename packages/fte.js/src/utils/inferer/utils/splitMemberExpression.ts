import * as t from '@babel/types'
import { extractName } from './extractName'

/*
1 берем параметра
2 ищем его в биндинге
3 если находим, то ищем его использование
4 если находим, то смотрим как он используется
5 если используется как массив, то тип массив
6 если используется как объект, то тип объект
7 если используется как примитив, то тип примитив
8 если не находим, то тип примитив
*/

export function splitMemberExpression(node: t.MemberExpression): string[] {
  if (t.isMemberExpression(node)) {
    const propertyName = extractName(node.property)
    if (t.isIdentifier(node.object)) {
      // If the left-hand side is an identifier, return the concatenated name
      return [extractName(node.object), propertyName]
    } else if (t.isMemberExpression(node.object)) {
      // If the left-hand side is a MemberExpression, recursively traverse the tree
      return splitMemberExpression(node.object).concat(propertyName)
    } else {
      // Otherwise, return an empty array
      return []
    }
  } else return []
}
