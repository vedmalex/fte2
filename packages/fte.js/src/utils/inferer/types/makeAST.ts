import * as t from '@babel/types'
import { Info, createMinInfo } from './Info'

// хранит информацию о выражении
export type Expression = {
  nodeId: number
  type: string
  optional?: boolean
  value?: string | number | boolean
  children: Array<Expression>
}

// хранит информацию о типе
export type TypeInfo = {
  id: number
  type: string
  optional?: boolean
  value: string | number | boolean | Array<TypeInfo>
  args?: number
  properties?: Set<number>
  callee?: Array<TypeInfo>
}

// хранит информацию о идентификаторе
export type IdentifierInfo = {
  id: number
  type:
    | 'call'
    | 'new'
    | 'object'
    | 'array'
    | 'Identifier'
    | 'NumericLiteral'
    | 'BooleanLiteral'
    | 'BigIntLiteral'
    | 'StringLiteral'
    | 'NullLiteral'
    | 'RegexLiteral'
    | 'RegExpLiteral'
    | 'TemplateLiteral'
    | 'ThisExpression'

  optional?: boolean
  value: string | number | boolean
  args?: number
  properties?: Set<number>
  callee?: Array<TypeInfo>
  root?: number
  typeName?: string
  name: string
}

// хранит информацию о вызове функции
export type FunctionInfo = {
  id: number
  type: 'call' | 'new'
  optional?: boolean
  value: string
  args: number
  callee: Array<TypeInfo>
}

// создает выражение из ast узла
function cExpression(ast: t.Node, nodeId: number): Expression {
  const node: Expression = {
    nodeId,
    type: fixType(ast.type),
    children: [],
  }
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

// приводит информацию о типе к нужному виду
function fixType(type: string): string {
  let result = type
  switch (result) {
    case 'CallExpression':
      result = 'call'
      break
    case 'OptionalCallExpression':
      result = 'call'
      break
    case 'NewExpression':
      result = 'new'
      break
    case 'OptionalNewExpression':
      result = 'new'
      break
    case 'MemberExpression':
      result = 'member'
      break
    case 'OptionalMemberExpression':
      result = 'member'
      break
    case 'SpreadElement':
    case 'RestElement':
      result = 'rest'
      break
  }
  return result
}

// создает информацию о типе из ast узла необходимую для построения дерева
function getParamsFromNode(ast: t.Node): {
  term: boolean
  keys: Array<string | { property: string; term: boolean; type?: string; separate?: boolean; hoist?: boolean }>
  type: string
  hoist: boolean
} {
  let term = false
  let hoist = false
  let type: string = ast?.type || 'NullLiteral'
  let keys: Array<string | { property: string; term: boolean; type?: string; separate?: boolean; hoist?: boolean }> = []

  switch (ast?.type) {
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
      keys = [{ property: 'body', term: false, separate: true }]
      break
    // expressionStatement
    case 'ExpressionStatement':
      keys = ['expression']
      hoist = true
      break
    // expression
    case 'CallExpression':
      keys = [
        { property: 'callee', term: false, type: fixType(ast.type) },
        { property: 'arguments', term: true, type: 'arguments', separate: true },
      ]
      term = true
      break
    case 'OptionalCallExpression':
      keys = [
        { property: 'callee', term: false, type: fixType(ast.type) },
        { property: 'optional', term: false },
        { property: 'arguments', term: true, type: 'arguments', separate: true },
      ]
      term = true
      break
    case 'NewExpression':
      keys = [
        { property: 'callee', term: false, type: fixType(ast.type) },
        { property: 'arguments', term: true, type: 'arguments', separate: true },
      ]
      term = true
      break
    case 'MemberExpression':
      keys = [
        { property: 'object', term: false, type: fixType(ast.type) },
        { property: 'property', term: false, type: fixType(ast.type), hoist: true, separate: ast.computed },
      ]
      term = true
      // hoist = true
      break
    case 'OptionalMemberExpression':
      keys = [
        { property: 'object', term: false, type: fixType(ast.type) },
        { property: 'optional', term: false },
        { property: 'property', term: false, type: fixType(ast.type), hoist: true, separate: ast.computed },
      ]
      // hoist = true
      term = true
      break
    case 'ConditionalExpression':
      keys = ['test', 'consequent', 'alternate']
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
      keys = [{ property: 'argument', term: true, type: 'member' }]
      term = false
      break
    case 'SpreadElement':
      keys = [{ property: 'argument', term: true, type: 'member' }]
      term = false
      break
    // declarations
    case 'VariableDeclaration':
      keys = ['declarations']
      break
    case 'VariableDeclarator':
      keys = ['id', 'init']
      break
  }

  return { term, keys, type: fixType(type), hoist }
}

// выполняет рекурсивный обход узла и извлекает из него все идентификаторы
// используется для поиска полного пути в выражении
function convertMember(ast: Expression, visited?: (ast: Expression) => void) {
  const result: IdentifierInfo[] = []
  visited?.(ast)
  for (const v of [...ast.children]) {
    if (v.type !== 'arguments') {
      if (v.type === 'member' || v.type === 'call') {
        result.push(...convertMember(v, visited))
      } else {
        result.push(convertExpressionToTypeInfo(v))
      }
    }
  }
  return result
}

// преобразует узел в информацию об идентификаторе
function convertExpressionToTypeInfo(v: Expression): IdentifierInfo {
  return {
    type: v.type as any,
    value: (v.value as string) ?? v.type,
    optional: v.optional,
    id: v.nodeId,
    name: typeof v.value === 'string' ? v.value : String(v.value),
  }
}

export function makeAST(ast: t.Node) {
  //инициализируем дерево с нулевым элементом
  let nodeId = 0
  // здесь хранятся все узлы
  const nodes: Record<number, Expression> = {}

  // формирование дерева выражения необходимой структуры
  function traverse(ast: any, parent: Expression) {
    const { keys, term, type, hoist } = getParamsFromNode(ast)
    if (term && !hoist) {
      const node = cExpression({ ...ast, type }, nodeId++)
      nodes[node.nodeId] = node
      if (!parent.children) parent.children = []
      parent.children.push(node)
      parent = node
    }

    for (let key of keys) {
      const prop = typeof key === 'object' ? key.property : key
      const propType = typeof key === 'object' ? key.type : ast.type
      let createExpression = typeof key === 'object' ? key.term : false
      let separate = typeof key === 'object' ? key.separate ?? false : false
      // const property = createExpression ? prop : parentProp
      let value = ast[prop]
      let node: Expression
      let children: Array<Expression>
      if (createExpression) {
        node = cExpression(
          {
            ...value,
            type: `${propType}${
              keys.length > 1 && key !== 'optional' && !(typeof key === 'object' && key.type) ? `:${prop}` : ''
            }`,
          },
          nodeId++,
        )
        nodes[node.nodeId] = node
        children = node.children
        parent.children.push(node)
      } else {
        children = parent.children
        node = parent
      }

      if (value !== undefined) {
        // fix optional
        if (prop === 'optional') {
          if (value) {
            const tmp = children.pop()
            if (tmp) {
              tmp.optional = value
              children.push(tmp)
            }
          }
          continue
        }

        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] === 'object') {
              let currentNode: Expression
              const { term } = getParamsFromNode(value[i])
              if (separate && !term) {
                currentNode = cExpression(value[i], nodeId++)
                nodes[currentNode.nodeId] = currentNode
                children.push(currentNode)
                children = currentNode.children
              } else {
                currentNode = node
              }
              traverse(value[i], currentNode)
            } else {
              children.push(cExpression(t.stringLiteral(value[i]), nodeId++))
            }
          }
        } else if (value !== null) {
          if (typeof value === 'object') {
            let currentNode: Expression
            const { term } = getParamsFromNode(value)
            if (separate && !term) {
              currentNode = cExpression(value, nodeId++)
              nodes[currentNode.nodeId] = currentNode
              children.push(currentNode)
              children = currentNode.children
            } else {
              currentNode = node
            }
            traverse(value, currentNode)
          } else {
            let tmp: t.Node
            switch (typeof value) {
              case 'string':
                tmp = t.stringLiteral(value)
                break
              case 'number':
                tmp = t.numericLiteral(value)
                break
              case 'boolean':
                tmp = t.booleanLiteral(value)
                break
              default:
                throw new Error(`Unknown type ${typeof value}`)
            }
            children.push(cExpression(tmp, nodeId++))
          }
        }
      }
    }
  }

  // создаем корневой узел
  const root = cExpression({ ...ast }, nodeId++)
  // добавляем его в список узлов
  nodes[root.nodeId] = root

  // запускаем обход
  traverse(ast, root)

  // после того как обход завершен
  // начинаем обработку вызовов функций

  // здесь хранятся все вызовы функций
  // нам нужно знать всю цепочку, чтобы последнему элементу поставить тип 'call' или 'new'

  const calls: FunctionInfo[] = []

  // здесь хранятся все цепочки обращений к свойствам
  const members: Array<IdentifierInfo[]> = []
  // здесь хранятся все идентификаторы по которым будем искать вхождение
  const identifiers: Map<number, IdentifierInfo> = new Map()
  // при обходе узлов, мы не должны обрабатывать дважды один и тот же узел
  const processed = { member: new Set<number>(), call: new Set<number>(), identifier: new Set<number>() }

  // обход дерева и формирование всех необходимых артефактов для выражения
  function traverseExpression(root: Expression) {
    switch (root.type) {
      case 'member': {
        if (processed.member.has(root.nodeId)) break
        members.push(
          convertMember(root, item => {
            processed.member.add(item.nodeId)
          }),
        )
        break
      }
      case 'call':
      case 'new': {
        if (processed.call.has(root.nodeId)) break
        processed.call.add(root.nodeId)
        const children = [...root.children]
        const args = children.pop()!
        const callee = children

        calls.push({
          id: root.nodeId,
          value: root.value as string,
          type: root.type,
          callee: callee
            .map(v => {
              if (v.type === 'call') {
                return convertMember(v)
              } else {
                return v.type === 'Identifier' ? convertExpressionToTypeInfo(v) : convertMember(v)
              }
            })
            .reduce((ret: TypeInfo[], cur) => {
              if (Array.isArray(cur)) {
                ret.push(...cur)
              } else {
                ret.push(cur)
              }
              return ret
            }, []),
          args: args.children.length,
        })
        break
      }
      case 'Identifier': {
        if (processed.identifier.has(root.nodeId)) break
        processed.identifier.add(root.nodeId)
        identifiers.set(root.nodeId, {
          type: root.type,
          value: root.value as string,
          optional: root.optional,
          id: root.nodeId,
          name: root.value as string,
        })
        break
      }
    }
    for (const child of root.children) {
      traverseExpression(child)
    }
  }

  // запускаем обход по нашему дереву
  traverseExpression(root)

  // обход цепочек обращений к свойствам
  for (const member of members) {
    // используем копию, чтобы не изменять исходные данные
    const memberCpy = [...member]
    let prev: IdentifierInfo | null = null
    for (const m of memberCpy) {
      // если идентификатор еще не был добавлен, то добавляем его
      if (!identifiers.has(m.id)) {
        const tmp = convertExpressionToTypeInfo(nodes[m.id])
        identifiers.set(tmp.id, tmp)
      }
      // получаем текущий идентификатор
      const curr = identifiers.get(m.id)!
      // если предыдущий идентификатор в цепочки последовательности существует
      if (prev) {
        // если значение текущего элемента строка, то скорее всего речь идет об объекте
        // если нет, то скорее всего речь идет об массиве
        prev.type = typeof curr.value === 'string' ? 'object' : 'array'
        if (!prev.properties) {
          prev.properties = new Set()
        }
        // добавляем текущий идентификатор в список свойств parent
        prev.properties.add(curr.id)
        // добавляем ссылку на предыдущий идентификатор
        curr.root = prev.id
      }
      // сохраняем текущий идентификатор как предыдущий
      prev = curr
    }
  }

  // помечаем вызов функции как вызов функции
  for (const call of calls) {
    let func = [...call.callee!].pop()
    const item = identifiers.get(func!.id)!
    item.type = call.type
    item.args = call.args
  }

  // хранилище всех найденных в выражении типов
  const types = new Map<string, IdentifierInfo>()

  // функция для получения пути до идентификатора
  // используется для поиска вхождения и для получения типа
  function getPath(v: IdentifierInfo) {
    if (v.root) {
      return `${getPath(identifiers.get(v.root) ?? convertExpressionToTypeInfo(nodes[v.id])!)}|${v.value}`
    }
    return v.value
  }

  // обработанные ids
  const idsProcessed = new Set<number>()
  // функция для обработки идентификаторов
  function processIds(v: IdentifierInfo) {
    // если идентификатор уже был обработан, то выходим
    if (idsProcessed.has(v.id)) return
    // помечаем идентификатор как обработанный
    idsProcessed.add(v.id)
    // получаем путь до идентификатора
    const path = getPath(v)
    // если тип не был найден, то добавляем его в список
    v.typeName = path

    if (!types.has(path)) {
      // если идентификатор не имеет родителя, то добавляем его в список
      types.set(path, v)
    } else {
      // если идентификатор имеет родителя, то добавляем его в список
      // добавляем как свойство родителя
      if (v.properties && v.properties.size > 0) {
        // ищем такой же идентификатор в parent свойствах
        const same = types.get(path)!
        // проверяем а есть ли свойства у него, если нет создаем
        if (!same.properties) same.properties = new Set()
        // добавляем все свойства в parent
        for (const id of v.properties) {
          same.properties.add(id)
          identifiers.get(id)!.root = same.id
        }
      }
      // удаляем идентификатор из списка
      // поскольку это обращение к свойству объекта
      identifiers.delete(v.id)
    }
  }

  // вычищаем все идентификаторы от обращений к свойствам
  identifiers.forEach((v, k) => {
    processIds(v)
  })

  // конечный продукт
  const infos = new Map<string, Info>()

  //
  types.forEach(id => {
    // создаем минимальную информацию о типе
    const tmp = createMinInfo({
      name: id.name,
      type:
        id.type == 'array' || id.type == 'object'
          ? id.type
          : id.type == 'call' || id.type == 'new'
          ? 'function'
          : 'primitive',
      typeName: id.typeName,
    })
    // если у идентификатора есть свойства, то добавляем их в список
    const props = [...(id.properties?.values() ?? [])]
    // обрабатываем все свойства
    props
      // получаем информацию о свойстве
      .map(item => identifiers.get(item) ?? convertExpressionToTypeInfo(nodes[item]))
      // создаем минимальную информацию о свойстве
      .map(v =>
        createMinInfo({
          name: v.name,
          typeName: v.typeName!,
          type:
            v.type == 'array' || v.type == 'object'
              ? v.type
              : v.type == 'call' || v.type == 'new'
              ? 'function'
              : 'primitive',
        }),
      )
      // добавляем в список свойств для Info
      .forEach(v => tmp.properties.set(v.name, v))

    // берем путь до идентификатора
    const parts = tmp.typeName.split('|')
    // если путь состоит из одного элемента
    if (parts.length === 1) {
      // добавляем Info в корень
      infos.set(tmp.typeName, tmp)
    } else if (parts.length > 1) {
      // если путь состоит из нескольких элементов
      const parent = infos.get(parts[0])!
      // добавляем Info в children родителя
      parent.children.set(tmp.typeName, tmp)
    }
  })

  return infos
}
