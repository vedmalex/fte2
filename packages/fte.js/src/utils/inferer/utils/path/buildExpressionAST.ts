import * as t from '@babel/types'

export type Expression = {
  type: string
  optional?: boolean
  value?: string | number | boolean
  children: Array<Expression>
}

function cExpression(ast: t.Node): Expression {
  const node = {
    type: ast?.type || 'NullLiteral',
    children: [],
  } as Expression
  switch (ast.type) {
    // lieterals
    // only for literals
    case 'Identifier':
      node.value = ast.name
      break
    case 'NumericLiteral':
    case 'BooleanLiteral':
    case 'BigIntLiteral':
    case 'StringLiteral':
      node.value = ast.value
      break
    case 'NullLiteral':
      node.value = 'null'
      break
    case 'RegexLiteral':
    case 'RegExpLiteral':
      node.value = `/${ast.pattern}/${ast.flags}`
      break
    case 'TemplateLiteral':
      node.value = '`' + ast.quasis.map(q => q.value.raw).join('') + '`'
      break
    case 'ThisExpression':
      node.value = 'this'
  }
  return node
}

function getParamsFromNode(ast: t.Node): {
  term: boolean
  keys: Array<string | { property: string; term: boolean; type?: string }>
  type: string
  hoist: boolean
} {
  let term = false
  let hoist = false
  let type: string = ast?.type || 'NullLiteral'
  let keys: Array<string | { property: string; term: boolean; type?: string }> = []

  switch (type) {
    // lieterals
    // only for literals
    case 'Identifier':
    case 'NumericLiteral':
    case 'BooleanLiteral':
    case 'BigIntLiteral':
    case 'StringLiteral':
    case 'NullLiteral':
    case 'RegexLiteral':
    case 'ThisExpression':
      term = true
      break
    case 'RegExpLiteral':
      term = true
      break
    case 'TemplateLiteral':
      keys = ['quasis', 'expressions']
      term = true
      break
    case 'TemplateElement':
      keys = ['value', 'tail']
      term = true
      break
    // ArchiteralExpression
    case 'File':
      keys = [{ property: 'program', term: false }]
      break
    case 'Program':
      keys = [{ property: 'body', term: false }]
      break
    // expressionStatement
    case 'ExpressionStatement':
      keys = ['expression']
      hoist = true
      break
    // expression
    case 'OptionalCallExpression':
      keys = [
        { property: 'callee', term: true, type: 'call' },
        { property: 'optional', term: false },
        { property: 'arguments', term: true, type: 'arguments' },
      ]
      type = 'call'
      term = true
      hoist = true
      break
    case 'OptionalMemberExpression':
      keys = [
        { property: 'object', term: true, type: 'member' },
        { property: 'optional', term: false },
        { property: 'property', term: true, type: 'member' },
      ]
      type = 'member'
      hoist = true
      break
    case 'MemberExpression':
      keys = [
        { property: 'object', term: true, type: 'member' },
        { property: 'property', term: true, type: 'member' },
      ]
      type = 'member'
      hoist = true
      break
    case 'ConditionalExpression':
      keys = ['test', 'consequent', 'alternate']
      break
    case 'CallExpression':
      keys = [
        { property: 'callee', term: true, type: 'call' },
        { property: 'arguments', term: true, type: 'arguments' },
      ]
      type = 'call'
      hoist = true
      term = true
      break
    case 'BinaryExpression':
      keys = ['left', 'operator', 'right']
      break
    case 'LogicalExpression':
      keys = ['left', 'operator', 'right']
      break
    case 'AssignmentExpression':
      keys = ['left', 'operator', 'right']
      break
    case 'TaggedTemplateExpression':
      keys = ['tag', 'quasi']
      break
    case 'ObjectExpression':
      keys = ['properties']
      break
    case 'ObjectProperty':
      keys = ['key', 'value']
      break
    case 'NewExpression':
      keys = ['callee', 'arguments']
      break
    case 'ArrayExpression':
      keys = ['elements']
      break
    case 'UnaryExpression':
      keys = ['operator', 'arguments']
      break
    case 'UpdateExpression':
      keys = ['prefix', 'operator', 'arguments']
      break
    case 'ArrowFunctionExpression':
      keys = ['params', 'body']
      break
    case 'FunctionExpression':
      keys = ['id', 'params', 'body']
      break
    case 'SequenceExpression':
      keys = ['expressions']
      break
    //statements
    case 'BlockStatement':
      keys = ['body']
      break
    case 'ReturnStatement':
      keys = ['argument']
      break
    case 'IfStatement':
      keys = ['test', 'consequent', 'alternate']
      break
    case 'SwitchStatement':
      keys = ['discriminant', 'cases']
      break
    case 'SwitchCase':
      keys = ['test', 'consequent']
      break
    // code flow break
    case 'BreakStatement':
      keys = ['label']
      break
    case 'ContinueStatement':
      keys = ['label']
      break
    case 'LabeledStatement':
      keys = ['label', 'body']
      break
    case 'ThrowStatement':
      keys = ['argument']
      break
    // loops
    case 'ForStatement':
      keys = ['init', 'test', 'update', 'body']
      break
    case 'ForInStatement':
      keys = ['left', 'right', 'body']
      break
    case 'ForOfStatement':
      keys = ['left', 'right', 'body']
      break
    case 'WhileStatement':
      keys = ['test', 'body']
      break
    case 'DoWhileStatement':
      keys = ['body', 'test']
      break

    // context management
    case 'WithStatement':
      keys = ['object', 'body']
      break

    case 'TryStatement':
      keys = ['block', 'handler', 'finalizer']
      break
    case 'CatchClause':
      keys = ['param', 'body']
      break

    // patterns
    case 'ArrayPattern':
      keys = ['elements']
      break
    case 'ObjectPattern':
      keys = ['properties']
      break
    case 'AssignmentPattern':
      keys = ['left', 'right']
      break
    case 'RestElement':
      keys = ['argument']
      break
    case 'SpreadElement':
      keys = ['argument']
      break
    // declarations
    case 'VariableDeclaration':
      keys = ['declarations']
      break
    case 'VariableDeclarator':
      keys = ['id', 'init']
      break
  }

  return { term, keys, type, hoist }
}

export function buildExpressionAST(ast: t.Node): Expression {
  function traverse(ast: any, parent: Expression) {
    const { keys, term, type } = getParamsFromNode(ast)
    if (term && keys.length > 0) {
      const node = cExpression({ ...ast, type })
      parent.children.push(node)
      parent = node
    }

    for (let key of keys) {
      const prop = typeof key === 'object' ? key.property : key
      const propType = typeof key === 'object' ? key.type : ast.type
      let createExpression = typeof key === 'object' ? key.term : false
      console.log(`${prop} ${createExpression}`)
      // const property = createExpression ? prop : parentProp
      let value = ast[prop]
      let node: Expression
      let children: Array<Expression>
      if (createExpression) {
        node = cExpression({
          ...value,
          type: `${propType}${
            keys.length > 1 && key !== 'optional' && !(typeof key === 'object' && key.type) ? `:${prop}` : ''
          }`,
        })
        children = node.children
        parent.children.push(node)
      } else {
        children = parent.children
        node = parent
      }

      if (value !== undefined) {
        // fix optional
        if (prop === 'optional' && value === true) {
          const tmp = children.pop()
          if (tmp) {
            tmp.optional = true
            children.push(tmp)
          }
          continue
        }

        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] === 'object') {
              let currentNode
              if (createExpression) {
                currentNode = cExpression(value[i])
                children.push(currentNode)
                children = currentNode.children
              } else {
                currentNode = node
              }
              traverse(value[i], currentNode)
            } else {
              children.push(value[i])
            }
          }
        } else if (value !== null) {
          let currentNode: Expression
          if (createExpression) {
            currentNode = cExpression(value)
            children.push(currentNode)
            children = currentNode.children
          } else {
            currentNode = node
          }
          if (typeof value === 'object') {
            traverse(value, currentNode)
          } else {
            children.push(value)
          }
        }
      }
    }
  }

  const root = cExpression({ ...ast })
  traverse(ast, root)
  return root
}
