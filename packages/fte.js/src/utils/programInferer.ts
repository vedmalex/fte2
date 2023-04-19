// import { parseSync } from '@swc/core'
// import * as ts from 'typescript'

// const code = `
// function func({name, info}) {
//   function other({context, generation}){
//     generation += 1
//     name.toString()
//     return context
//   }
//   other(info)
//   return name
// }
// `
// const sourceFile = parseSync(code, { syntax: 'typescript' })

// function findUsages(node: Node, variableName: string) {
//   if (ts.isIdentifier(node) && node.getText() === variableName) {
//     let currentNode: any = node
//     let context: Array<any> = []

//     while (currentNode) {
//       if (ts.isFunctionDeclaration(currentNode)) {
//         context.push({ type: 'FunctionDeclaration', name: currentNode.name?.getText() })
//       } else if (ts.isVariableDeclaration(currentNode)) {
//         context.push({ type: 'VariableDeclaration', name: currentNode.name.getText() })
//       } else if (ts.isExpressionStatement(currentNode)) {
//         context.push({ type: 'ExpressionStatement' })
//       } else if (ts.isReturnStatement(currentNode)) {
//         context.push({ type: 'ReturnStatement' })
//       }

//       currentNode = currentNode.parent
//     }

//     console.log(`Found usage of '${variableName}' in context:`, context.reverse())
//   }

//   ts.forEachChild(node, child => findUsages(child, variableName))
// }

// findUsages(sourceFile, 'name')
// findUsages(sourceFile, 'info')
