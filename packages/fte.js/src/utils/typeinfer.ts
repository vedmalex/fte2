import * as ts from 'typescript'

// function nodeToString(node: ts.Node, sourceFile: ts.SourceFile) {
//   const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
//   const result = printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)
//   console.log(result, ts.SyntaxKind[node.kind])
//   return result
// }

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
          return findUsage(param, sourceFile, paramName, node)
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

// const funcCode = `
// import { TemplateBase } from "fte.js-base";
// export default {
//     alias: [
//         "standalone.ts.njs"
//     ],
//     script: function(files, _content, partial, slot, options) {
//         var out: Array<string> = [];
//         out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'");
//         for(let i = 0; i < files.length; i += 1){
//             out.push("\n");
//             out.push("  import " + (files[i].name.replaceAll(/[\s\.]/g, "_")) + " from '" + (files[i].path) + "'");
//         }
//         out.push("\n");
//         out.push("\n");
//         out.push("const templates = {");
//         for(let i = 0; i < files.length; i += 1){
//             out.push("\n");
//             out.push("  '" + (files[i].name) + "': " + (files[i].name.replaceAll(/[\s\.]/g, "_")) + ",");
//         }
//         out.push("\n");
//         out.push("}\n");
//         out.push("\n");
//         out.push("const F = new Factory(templates)\n");
//         out.push("\n");
//         out.push("function run<T>(context:T, name:string) => {\n");
//         out.push("  return F.run(context, name)\n");
//         out.push("}\n");
//         out.push("export default run");
//         return out.join("");
//     },
//     compile: function(this: TemplateBase) {},
//     dependency: {}
// };

// `

// console.log(
//   JSON.stringify(
//     inferTypesFromFunction(funcCode),
//     (_, value: unknown) => {
//       if (value instanceof Set) {
//         return [...value]
//       }
//       return value
//     },
//     2,
//   ),
// )

function findUsage(
  param: ts.ParameterDeclaration,
  sourceFile: ts.SourceFile,
  paramName: string,
  node: ts.FunctionDeclaration | ts.FunctionExpression,
): [Info, Info[]] {
  // nodeToString(param, sourceFile)

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
          // дать название параметра
          // пометить что поле это объект
          // node.name == название поля
          // node.expression == доступ к полю
          // node.expression.expression =
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
        // nodeToString(node, sourceFile)
      }
    } else if (ts.isVariableDeclaration(node) && node.initializer && props.has(node.initializer.getText(sourceFile))) {
      const property = node.initializer.getText(sourceFile)
      // nodeToString(node, sourceFile)
      ts.forEachChild(node.name, element => {
        if (ts.isBindingElement(element)) {
          const subProp = element.name.getText()
          // nodeToString(element, sourceFile)
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
