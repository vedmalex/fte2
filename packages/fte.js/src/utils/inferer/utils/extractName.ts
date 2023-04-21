import * as t from '@babel/types'

export function extractName(
  n:
    | t.LVal
    | t.Identifier
    | t.StringLiteral
    | t.Expression
    | t.PrivateName
    | t.AssignmentPattern
    | t.ObjectProperty
    | null
    | undefined,
  anonymous: () => string,
): string {
  if (t.isIdentifier(n)) {
    return n.name
  } else if (t.isPrivateName(n)) {
    return n.id.name
  } else if (t.isObjectProperty(n)) {
    return extractName(n.key, anonymous)
  } else if (t.isStringLiteral(n)) {
    return n.value
  } else if (t.isAssignmentExpression(n)) {
    return extractName(n.left, anonymous)
    // } else if (t.isMemberExpression(n)) {
    //   const property = extractName(n.property, anonymous)
    //   if (t.isIdentifier(n.object)) {
    //     return [...extractName(n.object, anonymous), ...property]
    //   } else return property
  } else if (t.isRestElement(n)) {
    return extractName(n.argument, anonymous)
  } else if (t.isAssignmentPattern(n)) {
    return extractName(n.left, anonymous)
    // } else if (t.isArrayPattern(n)) {
    //   return n.elements.flatMap(element => extractName(element, anonymous))
    // } else if (t.isObjectPattern(n)) {
    //   return n.properties.flatMap(property => extractName(property, anonymous))
  } else if (t.isTSParameterProperty(n)) {
    return extractName(n.parameter, anonymous)
  } else if (t.isTSAsExpression(n)) {
    return extractName(n.expression, anonymous)
  } else if (t.isTSTypeAssertion(n)) {
    return extractName(n.expression, anonymous)
  } else if (t.isTSNonNullExpression(n)) {
    return extractName(n.expression, anonymous)
  } else {
    return anonymous()
  }
}
