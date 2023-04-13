import * as ts from 'typescript'

export type FunctionDefinition = {
  /**
   * name of the function
   */
  name: string
  /**
   * params of the function
   */
  params: Array<Info>
  /**
   * extra types that are used in the function
   */
  types: Array<Info>
}

export type Info = {
  parent: string
  name: string
  type: 'object' | 'array' | 'primitive' | 'function'
  properties: Set<string>
}

export function inferTypesFromFunction(funcCode: string): Array<FunctionDefinition> {
  const sourceFile = ts.createSourceFile('temp.ts', funcCode, ts.ScriptTarget.ES2015, true)
  const result: Array<FunctionDefinition> = []
  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) {
      let funcDef = { params: [] as Info[], types: [] as Info[] } as FunctionDefinition
      result.push(funcDef)
      if (ts.isFunctionExpression(node) && ts.isPropertyAssignment(node.parent)) {
        funcDef.name = node.parent.name.getText()
      }
      if (ts.isFunctionDeclaration(node)) {
        funcDef.name = node.name?.getText() ?? ''
      }
      const list = node.parameters.map((param): [Info, Array<Info>] => {
        const paramName = param.name.getText(sourceFile)
        if (param.type) {
          return [{ name: paramName, type: param.type.getText(sourceFile) } as Info, [] as Info[]]
        } else {
          return findUsage(sourceFile, paramName, node)
        }
      })
      list.forEach(([param, types]) => {
        funcDef.params.push(param)
        funcDef.types.push(...types)
      })
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return result
}

function findUsage(
  sourceFile: ts.SourceFile,
  paramName: string,
  node: ts.FunctionDeclaration | ts.FunctionExpression,
): [Info, Info[]] {
  const props = new Map<string, Info>()
  props.set(paramName, { name: paramName, parent: '', type: 'primitive', properties: new Set() })
  function findUsages(node: ts.Node) {
    if (ts.isPropertyAccessExpression(node)) {
      const expression = node.expression.getText(sourceFile)
      if (props.has(expression)) {
        const item = props.get(expression) as Info
        item.properties.add(node.name.getText(sourceFile))
      } else {
        if (ts.isElementAccessExpression(node.expression)) {
          const obj = node.expression.expression.getText()
          debugger
          if (props.has(obj)) {
            const item = props.get(obj) as Info
            item.type = 'array'
            const subProp = node.name.getText()

            const containmentType = props.has(`${item.name}Containment`)
              ? (props.get(`${item.name}Containment`) as Info)
              : (props.set(`${item.name}Containment`, {
                  name: `${item.name}Containment`,
                  parent: item.name,
                  type: 'object',
                  properties: new Set(),
                }),
                props.get(`${item.name}Containment`) as Info)

            containmentType.properties.add(subProp)

            props.set(subProp, {
              parent: item.name,
              name: `${item.name}.${subProp}`,
              type: 'primitive',
              properties: new Set(),
            })
          }
        } else if (ts.isPropertyAccessExpression(node.expression)) {
          // пометить что объект это массив
          debugger
        }
      }
    } else if (ts.isVariableDeclaration(node) && node.initializer && props.has(node.initializer.getText(sourceFile))) {
      const property = node.initializer.getText(sourceFile)
      ts.forEachChild(node.name, element => {
        if (ts.isBindingElement(element)) {
          const subProp = element.name.getText()
          const prop = props.get(property) as Info
          prop.properties.add(subProp)
          props.set(subProp, {
            parent: prop.name,
            name: `${prop.name}.${subProp}`,
            type: 'primitive',
            properties: new Set(),
          })
        }
      })
    }
    ts.forEachChild(node, findUsages)
  }

  node.body && ts.forEachChild(node.body, findUsages)

  return [props.get(paramName) as Info, Array.from(props.values()).filter(t => t.parent !== '')]
}
