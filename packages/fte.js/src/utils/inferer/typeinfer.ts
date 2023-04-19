/*
SUMMARY: This file contains a function that takes a string of typescript code
and returns a list of functions with their parameters and types.
*/
import * as ts from 'typescript'
import { Info } from './Info'
import { createInfo } from './createInfo'

// all kinds of functions
type FunctionNode = ts.FunctionDeclaration | ts.FunctionExpression | ts.ArrowFunction
// check if node is any kind of function
function isFunctionNode(node: ts.Node): node is FunctionNode {
  return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)
}
// infer types from function
export function inferTypesFromFunction(funcCode: string): Map<string, Info> {
  // create source file
  const sourceFile = ts.createSourceFile('temp.ts', funcCode, ts.ScriptTarget.ES2015, true)
  // reserver result array

  const result = new Map<string, Info>()
  // visit all functions in depth first order
  visitAllFunctions(result, sourceFile, sourceFile)
  return result
}

function processFunctionParams(funcDef: Info, paramName: string, props: Map<string, Info>) {
  props.forEach((prop, name) => {
    if (prop.name === paramName) {
      funcDef.properties.set(name, prop)
    } else {
      funcDef.children.set(name, prop)
    }
  })
}

// visit all functions in depth first order
function visitAllFunctions(result: Map<string, Info>, sourceFile: ts.SourceFile, node: ts.Node) {
  // if node is any kind of function
  if (isFunctionNode(node)) {
    // create function definition storage
    let name: string | undefined
    // get function name
    if (ts.isFunctionExpression(node) && ts.isPropertyAssignment(node.parent)) {
      name = node.parent.name.getText()
    } else if (ts.isFunctionDeclaration(node)) {
      name = node.name?.getText() ?? ''
    } else {
      name = `${node.parent?.getText()}.anonymous`
    }
    const funcDef = createInfo(result, name, name, '', 'function')
    const scopeResult = new Map<string, Info>()
    node.parameters.forEach((param, index) => {
      if (ts.isIdentifier(param.name)) {
        const paramName = param.name.getText(sourceFile)
        findParemeterUsage(scopeResult, sourceFile, paramName, node)
        processFunctionParams(funcDef, paramName, scopeResult)
      } else if (ts.isObjectBindingPattern(param.name)) {
        const arg = createInfo(scopeResult, `param${index}`, `param${index}`, '', 'object')
        ts.forEachChild(param.name, field => {
          if (ts.isBindingElement(field)) {
            const name = field.name.getText(sourceFile)
            arg.properties.set(name, createInfo(scopeResult, name, name, arg.name, 'primitive'))
            findParemeterUsage(scopeResult, sourceFile, field.name.getText(sourceFile), node)
          }
        })
        processFunctionParams(funcDef, arg.name, scopeResult)
      } else {
        throw new Error('unknown parameter type')
      }
    })
  }
  ts.forEachChild(node, visiting => visitAllFunctions(result, sourceFile, visiting))
}

// find parameter usage
function findParemeterUsage(
  props: Map<string, Info>,
  sourceFile: ts.SourceFile,
  paramName: string,
  node: FunctionNode,
) {
  // store all usages of the parameter
  // it will later user to store all properties of the parameter
  // for recursive traversal of the parameter usages
  // create info for the parameter
  createInfo(props, paramName, paramName, '', 'primitive')
  // if node has a body
  if (node.body) {
    ts.forEachChild(node.body, visitingNode => findUsages(sourceFile, props, visitingNode))
  }
}

// find usages of the parameter
function findUsages(sourceFile: ts.SourceFile, props: Map<string, Info>, node: ts.Node) {
  if (ts.isPropertyAccessExpression(node)) {
    processPropertyAccessExpression(sourceFile, props, node)
  } else if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
    processForEach(sourceFile, props, node)
  } else if (ts.isVariableDeclaration(node) && node.initializer && props.has(node.initializer.getText(sourceFile))) {
    processVariableDeclaration(sourceFile, props, node)
  }

  ts.forEachChild(node, visitingNode => findUsages(sourceFile, props, visitingNode))
}

// process variable declaration
function processPropertyAccessExpression(
  sourceFile: ts.SourceFile,
  props: Map<string, Info>,
  node: ts.PropertyAccessExpression,
) {
  const expression = node.expression.getText(sourceFile)
  if (props.has(expression)) {
    const item = props.get(expression) as Info
    const propertyName = node.name.getText(sourceFile)
    const current = createInfo(props, propertyName, `${item.typeName}.${propertyName}`, item.typeName, 'primitive')
    item.properties.set(propertyName, current)
  } else {
    if (ts.isElementAccessExpression(node.expression)) {
      const obj = node.expression.expression.getText()
      if (props.has(obj)) {
        const item = props.get(obj) as Info
        item.type = 'array'
        const subProp = node.name.getText()

        const containmentType = props.has(`${item.typeName}Containment`)
          ? (props.get(`${item.typeName}Containment`) as Info)
          : createInfo(props, item.typeName, `${item.typeName}Containment`, item.typeName, 'object')

        const current = createInfo(props, subProp, `${item.typeName}.${subProp}`, item.typeName, 'primitive')
        containmentType.properties.set(subProp, current)
      }
    } else if (ts.isPropertyAccessExpression(node.expression)) {
      const obj = node.expression.expression.getText()
      if (props.has(obj)) {
        const item = props.get(obj) as Info
        item.type = 'object'
        const subProp = node.name.getText()

        const current = createInfo(props, item.typeName, `${item.typeName}.${subProp}`, item.typeName, 'primitive')
        item.properties.set(subProp, current)
      }
    }
  }
}

//extract parts of the path of expression
function extractPathParts(path: ts.LeftHandSideExpression) {
  const parts = path.getText().split('.')
  return parts
}

// process forEach
function processForEach(sourceFile: ts.SourceFile, props: Map<string, Info>, node: ts.CallExpression) {
  const expression = node.expression as ts.PropertyAccessExpression
  const forEachCalledOn = expression.expression
  const forEachMethodName = expression.name.getText(sourceFile)

  if (forEachMethodName === 'forEach' && node.arguments.length > 0) {
    const pathParts = extractPathParts(forEachCalledOn)
    let property: Info | undefined
    let prev: Info | undefined
    do {
      const part = pathParts.shift() as string
      if (props.has(part)) {
        property = props.get(part) as Info
        property.type = 'object'
      } else {
        if (property) {
          prev = property
          property = createInfo(props, part, `${property.typeName}.${part}`, property.typeName, 'primitive')
          prev.properties.set(part, property)
        } else {
          break
        }
      }
    } while (pathParts.length > 0)
    if (property) {
      property.type = 'array'
    }

    // get first argument, for `forEach`-expression it is callback function
    // expression name is `forEach` and it has at least one argument
    // expression expression is always array it holds the path for forEach
    // [path].forEach(callback)
    // callback is always a function
    // path can be a variable or a property access expression

    const callback = node.arguments[0]
    if (
      ts.isArrayTypeNode(forEachCalledOn) ||
      (ts.isIdentifier(forEachCalledOn) && property) ||
      (ts.isPropertyAccessExpression(forEachCalledOn) && property)
    ) {
      if (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) {
        // extract first parameter and handle destructuring
        const param = callback.parameters[0]

        if (ts.isIdentifier(param.name)) {
          const paramName = param.name.getText(sourceFile)
          createInfo(props, paramName, `${property!.typeName}Containment`, property!.typeName, 'object')
        } else if (ts.isObjectBindingPattern(param.name)) {
          const subtype = createInfo(
            props,
            `${property!.typeName}Containment`,
            `${property!.typeName}Containment`,
            property!.typeName,
            'object',
          )

          ts.forEachChild(param.name, element => {
            if (ts.isBindingElement(element)) {
              const subProp = element.name.getText()
              const current = createInfo(
                props,
                subProp,
                `${subtype!.typeName}.${subProp}`,
                subtype!.typeName,
                'primitive',
              )
              subtype.properties.set(subProp, current)
            }
          })
        }

        ts.forEachChild(callback.body, (visitingNode: ts.Node) => findUsages(sourceFile, props, visitingNode))
      }
    }
  }
}

// process variable declaration
function processVariableDeclaration(sourceFile: ts.SourceFile, props: Map<string, Info>, node: ts.VariableDeclaration) {
  const property = node.initializer!.getText(sourceFile)
  ts.forEachChild(node.name, element => {
    if (ts.isBindingElement(element)) {
      const subProp = element.name.getText()
      const prop = props.get(property) as Info
      const current = createInfo(props, prop.typeName, `${prop.typeName}.${subProp}`, prop.typeName, 'primitive')
      prop.properties.set(subProp, current)
    }
  })
}

// TODO: допилить код связывания объектов в дерево типов
