import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { Expression } from './Expression'
import { Part } from './Part'
import { Call } from './Call'

function hasChildren(node) {
  if (!t.isNode(node)) {
    return false
  }

  const keys = t.VISITOR_KEYS?.[node.type]?.filter(key => (Array.isArray(node[key]) ? node[key].length > 0 : node[key]))
  return keys?.length > 0
}

export function buildExpression(path: NodePath<t.Node>, name?: string) {
  const expression: Expression = {
    name: name ?? '',
    type: 'expression',
    optional: false,
    children: [],
  }

  if (t.isOptionalCallExpression(path.node) || t.isCallExpression(path.node)) {
    const result = buildExpression(path.get('callee') as NodePath<t.Node>, name) as Part
    if (result.children?.length) {
      expression.children.push(...result.children)
      const last = result.children[result.children.length - 1]
      last.type = 'call'
      last.arguments = []
      if (!name) expression.name = result.children[0].name
    } else {
      result.type = 'call'
      result.arguments = []
      expression.children.push(result)
      if (!name) expression.name = result.name
    }
    const args = path.get('arguments') as NodePath<t.Node>[]

    for (let i = 0; i < args.length; i++) {
      const argResult = buildExpression(args[i], `arg${i}`)
      const call = expression.children[expression.children.length - 1] as Call
      call.type = 'call'
      call.arguments = []
      call.arguments.push(argResult)
    }
  } else {
    if (hasChildren(path.node)) {
      console.log(path.node.type)
      traverse(
        path.node,
        {
          enter(path) {
            console.log(`!${path.node.type}`)
            processExpression(path, expression.children)
          },
        },
        path.scope,
      )
    } else {
      switch (path.node.type) {
        case 'Identifier':
          expression.name = path.node.name
          break
        case 'NumericLiteral':
          expression.name = path.node.value
          break
        case 'StringLiteral':
          expression.name = path.node.value
          break
      }
    }
  }

  return expression
}

export function processCall(path: NodePath<t.Node>, pathArray: Part[]) {
  const result = buildExpression(path.get('callee') as NodePath<t.Node>) as Part
  result.optional = t.isOptionalCallExpression(path.node)
  if (result.children?.length) {
    pathArray.push(...result.children)
  } else {
    pathArray.push(result)
  }
  const call = pathArray[pathArray.length - 1] as Call
  call.type = 'call'
  call.arguments = []
  const args = path.get('arguments') as NodePath<t.Node>[]

  if (args?.length) {
    for (let i = 0; i < args.length; i++) {
      const argResult = buildExpression(args[i], `arg${i}`)
      call.arguments.push(argResult)
    }
  }

  path.skip()
}

export function processOptionalMember(
  path: NodePath<t.OptionalCallExpression | t.OptionalMemberExpression>,
  pathArray: Part[],
) {
  // пара object/property
  // в CallExpression optional относиться к property
  const result = buildExpression(path) as Part

  if (t.isOptionalCallExpression(path.node)) {
    // вся конструкция optional или нет
  } else if (t.isOptionalMemberExpression(path.node)) {
    // только предпоследний optional
  }

  let optional: Part
  if (result.children?.length) {
    pathArray.push(...result.children)
    if (t.isOptionalCallExpression(path.node)) {
      optional = result.children[result.children.length - 1]
      // вся конструкция optional или нет
    } else {
      optional = result.children[result.children.length - 2]
    }
  } else {
    pathArray.push(result)
    optional = result
  }
  optional.optional = path.node.optional
  path.skip()
}

export function processExpression(path: NodePath<t.Node>, pathArray: Part[]) {
  switch (path.node.type) {
    case 'OptionalCallExpression':
      processOptionalMember(path as NodePath<t.OptionalCallExpression>, pathArray)
      break
    case 'OptionalMemberExpression':
      processOptionalMember(path as NodePath<t.OptionalMemberExpression>, pathArray)
      break
    case 'CallExpression':
      processCall(path, pathArray)
      break
    case 'Identifier':
      pathArray.push({
        name: path.node.name,
        type: 'property',
        optional: t.isOptionalMemberExpression(path.parent),
      })
      break
    case 'NumericLiteral':
    case 'StringLiteral':
      pathArray.push({
        name: path.node.value,
        type: 'index',
        optional: t.isOptionalMemberExpression(path.parent),
      })
      break
  }
}
