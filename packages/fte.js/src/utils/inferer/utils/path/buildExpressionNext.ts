import * as t from '@babel/types'

// file types
export type File = {
  type: 'File'
  program: Program
}

export type Program = {
  type: 'Program'
  body: ExpressionStatement[]
}

export type ArchiteralExpression = File | Program

// expression types
export type ExpressionStatement = {
  type: 'ExpressionStatement'
  expression: Expression
}

// expression types
export type Expression =
  | OptionalCallExpression
  | OptionalMemberExpression
  | MemberExpression
  | ConditionalExpression
  | CallExpression
  | BinaryExpression
  | LogicalExpression
  | AssignmentExpression
  | TaggedTemplateExpression
  | ObjectExpression
  | NewExpression
  | ArrayExpression
  | UnaryExpression
  | UpdateExpression
  | ArrowFunctionExpression
  | FunctionExpression
  | SequenceExpression

export type OptionalCallExpression = {
  type: 'OptionalCallExpression'
  callee: Expression
  optional: boolean
  arguments: Expression[]
}

export type OptionalMemberExpression = {
  type: 'OptionalMemberExpression'
  object: Expression
  optional: boolean
  property: Expression
}

export type MemberExpression = {
  type: 'MemberExpression'
  object: Expression
  property: Expression
}

export type ConditionalExpression = {
  type: 'ConditionalExpression'
  test: Expression
  consequent: Expression
  alternate: Expression
}

export type CallExpression = {
  type: 'CallExpression'
  callee: Expression
  arguments: Expression[]
}

export type BinaryExpression = {
  type: 'BinaryExpression'
  left: Expression
  operator: string
  right: Expression
}

export type LogicalExpression = {
  type: 'LogicalExpression'
  left: Expression
  operator: string
  right: Expression
}

export type AssignmentExpression = {
  type: 'AssignmentExpression'
  left: Expression
  operator: string
  right: Expression
}

export type TaggedTemplateExpression = {
  type: 'TaggedTemplateExpression'
  tag: Expression
  quasi: TemplateLiteral
}

export type TemplateLiteral = {
  type: 'TemplateLiteral'
  quasis: TemplateElement[]
  expressions: Expression[]
}

export type TemplateElement = {
  type: 'TemplateElement'
  value: {
    cooked: string
    raw: string
  }
  tail: boolean
}

export type ObjectExpression = {
  type: 'ObjectExpression'
  properties: ObjectProperty[]
}

export type ObjectProperty = {
  type: 'ObjectProperty'
  key: Expression
  value: Expression
}

export type NewExpression = {
  type: 'NewExpression'
  callee: Expression
  arguments: Expression[]
}

export type ArrayExpression = {
  type: 'ArrayExpression'
  elements: Expression[]
}

export type UnaryExpression = {
  type: 'UnaryExpression'
  operator: string
  prefix: boolean
  argument: Expression
}

export type UpdateExpression = {
  type: 'UpdateExpression'
  operator: string
  prefix: boolean
  argument: Expression
}

export type ArrowFunctionExpression = {
  type: 'ArrowFunctionExpression'
  params: Expression[]
  body: Expression
}

export type FunctionExpression = {
  type: 'FunctionExpression'
  id: Identifier
  params: Expression[]
  body: Expression
}

export type SequenceExpression = {
  type: 'SequenceExpression'
  expressions: Expression[]
}

// literal types
export type Listeral =
  | Identifier
  | NumericLiteral
  | BooleanLiteral
  | BigIntLiteral
  | StringLiteral
  | NullLiteral
  | RegExpLiteral
  | RegexLiteral
  | TemplateLiteral
  | ThisExpression

export type Identifier = {
  type: 'Identifier'
  name: string
}

export type NumericLiteral = {
  type: 'NumericLiteral'
  value: number
}

export type BooleanLiteral = {
  type: 'BooleanLiteral'
  value: boolean
}

export type BigIntLiteral = {
  type: 'BigIntLiteral'
  value: bigint
}

export type StringLiteral = {
  type: 'StringLiteral'
  value: string
}

export type NullLiteral = {
  type: 'NullLiteral'
}

export type RegExpLiteral = {
  type: 'RegExpLiteral'
  pattern: string
  flags: string
}

export type RegexLiteral = {
  type: 'RegexLiteral'
  pattern: string
  flags: string
}

export type ThisExpression = {
  type: 'ThisExpression'
}

// statement types

export type Statement =
  | BlockStatement
  | ReturnStatement
  | IfStatement
  | SwitchStatement
  | BreakStatement
  | ContinueStatement
  | LabeledStatement
  | ThrowStatement
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | WhileStatement
  | DoWhileStatement
  | WithStatement
  | TryStatement

export type BlockStatement = {
  type: 'BlockStatement'
  body: Statement[]
}

export type ReturnStatement = {
  type: 'ReturnStatement'
  argument: Expression
}

export type IfStatement = {
  type: 'IfStatement'
  test: Expression
  consequent: Statement
  alternate: Statement
}

export type SwitchStatement = {
  type: 'SwitchStatement'
  discriminant: Expression
  cases: SwitchCase[]
}

export type SwitchCase = {
  type: 'SwitchCase'
  test: Expression
  consequent: Statement[]
}

// code flow breaks
export type BreakStatement = {
  type: 'BreakStatement'
  label: Identifier
}

export type ContinueStatement = {
  type: 'ContinueStatement'
  label: Identifier
}

export type LabeledStatement = {
  type: 'LabeledStatement'
  label: Identifier
  body: Statement
}

export type ThrowStatement = {
  type: 'ThrowStatement'
  argument: Expression
}

// loops

export type ForStatement = {
  type: 'ForStatement'
  init: Expression
  test: Expression
  update: Expression
  body: Statement
}

export type ForInStatement = {
  type: 'ForInStatement'
  left: Expression
  right: Expression
  body: Statement
}

export type ForOfStatement = {
  type: 'ForOfStatement'
  left: Expression
  right: Expression
  body: Statement
}

export type WhileStatement = {
  type: 'WhileStatement'
  test: Expression
  body: Statement
}

export type DoWhileStatement = {
  type: 'DoWhileStatement'
  test: Expression
  body: Statement
}

export type WithStatement = {
  type: 'WithStatement'
  object: Expression
  body: Statement
}

export type TryStatement = {
  type: 'TryStatement'
  block: BlockStatement
  handler: CatchClause
  finalizer: BlockStatement
}

export type CatchClause = {
  type: 'CatchClause'
  param: Expression
  body: BlockStatement
}

// patterns

export type Pattern = ObjectPattern | ArrayPattern | RestElement | AssignmentPattern

export type ObjectPattern = {
  type: 'ObjectPattern'
  properties: ObjectProperty[]
}

export type ArrayPattern = {
  type: 'ArrayPattern'
  elements: Expression[]
}

export type RestElement = {
  type: 'RestElement'
  argument: Expression
}

export type AssignmentPattern = {
  type: 'AssignmentPattern'
  left: Expression
  right: Expression
}

export type Node = ArchiteralExpression | ExpressionStatement | Expression | Listeral | Statement | Pattern

export function buildExpression(ast: t.Node) {
  let dot = ['digraph AST {\n']
  let id = 0

  function traverse(node: t.Node, parentId) {
    let nodeId = id++

    let color: string
    if (node === null) node = t.nullLiteral()
    switch (node.type) {
      // only for literals
      case 'Identifier':
        color = 'red'
        dot.push(`  ${nodeId} [label="ID:${node.name}", style="filled", fillcolor="${color}"];\n`)
        break
      case 'NumericLiteral':
        color = 'green'
        dot.push(`  ${nodeId} [label="NUM:${node.value}", style="filled", fillcolor="${color}"];\n`)
        break
      case 'BooleanLiteral':
        color = 'green'
        dot.push(`  ${nodeId} [label="BOOL:${node.value}", style="filled", fillcolor="${color}"];\n`)
        break
      case 'BigIntLiteral':
        color = 'green'
        dot.push(`  ${nodeId} [label="BIG:${node.value}", style="filled", fillcolor="${color}"];\n`)
        break
      case 'StringLiteral':
        color = 'green'
        dot.push(`  ${nodeId} [label="STR:${node.value}", style="filled", fillcolor="${color}"];\n`)
        break
      case 'NullLiteral':
        color = 'gray'
        dot.push(`  ${nodeId} [label="NULL", style="filled", fillcolor="${color}"];\n`)
        break
      case 'RegexLiteral':
      case 'RegExpLiteral':
        color = 'green'
        dot.push(`  ${nodeId} [label="REGEXP:/${node.pattern}/${node.flags}", style="filled", fillcolor="${color}"];\n`)
        break
      case 'TemplateLiteral':
        color = 'green'
        dot.push(`  ${nodeId} [label="${node.type}"];\n`)
        break
      // other types
      case 'ThisExpression':
        color = 'green'
        dot.push(`  ${nodeId} [label="THIS", style="filled", fillcolor="${color}"];\n`)
        break
      default:
        dot.push(`  ${nodeId} [label="${node.type}"];\n`)
    }

    if (parentId !== null) {
      dot.push(`  ${parentId} -> ${nodeId};\n`)
    }

    let keys: Array<string> = []
    switch (node.type) {
      // lieterals
      case 'Identifier':
      case 'NumericLiteral':
      case 'StringLiteral':
      case 'BooleanLiteral':
      case 'BigIntLiteral':
      case 'NullLiteral':
      case 'RegExpLiteral':
      case 'RegexLiteral':
        break
      case 'TemplateLiteral':
        keys = ['quasis', 'expressions']
        break
      case 'TemplateElement':
        keys = ['value', 'tail']
        break
      // ArchiteralExpression
      case 'File':
        keys = ['program']
        break
      case 'Program':
        keys = ['body']
        break
      // expressionStatement
      case 'ExpressionStatement':
        keys = ['expression']
        break
      // expression
      case 'OptionalCallExpression':
        keys = ['callee', 'optional', 'arguments']
        break
      case 'OptionalMemberExpression':
        keys = ['object', 'optional', 'property']
        break
      case 'MemberExpression':
        keys = ['object', 'property']
        break
      case 'ConditionalExpression':
        keys = ['test', 'consequent', 'alternate']
        break
      case 'CallExpression':
        keys = ['callee', 'arguments']
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
        keys = ['operator', 'argument']
        break
      case 'UpdateExpression':
        keys = ['prefix', 'operator', 'argument']
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
    let currentNode = nodeId
    for (let key of keys) {
      let value = node[key]
      if (Array.isArray(value)) {
        let newNodeId = id++
        dot.push(`  ${currentNode} -> ${newNodeId};\n`)
        dot.push(`  ${newNodeId} [label="${key}"];\n\n`)
        for (let i = 0; i < value.length; i++) {
          if (typeof value[i] === 'object') {
            traverse(value[i], newNodeId)
          } else {
            let newNodeId = id++
            dot.push(`  ${currentNode} -> ${newNodeId};\n`)
            dot.push(`  ${newNodeId} [label="${key}${value[i]}"];\n\n`)
          }
        }
      } else if (value !== null) {
        if (typeof value === 'object') {
          let newNodeId = id++
          dot.push(`  ${currentNode} -> ${newNodeId};\n`)
          dot.push(`  ${newNodeId} [label="${key}"];\n\n`)
          traverse(value, newNodeId)
        } else {
          let newNodeId = id++
          dot.push(`  ${currentNode} -> ${newNodeId};\n`)
          dot.push(`  ${newNodeId} [label="${key}: ${value}"];\n\n`)
        }
      }
    }
  }

  traverse(ast, null)
  dot.push('}')

  return dot
}
