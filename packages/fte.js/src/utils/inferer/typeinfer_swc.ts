import { Info } from './Info'
import { createInfo } from './createInfo'
import {
  ArrowFunctionExpression,
  ClassMethod,
  Fn,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  MethodProperty,
  Module,
  Param,
  Pattern,
  PrivateMethod,
  VariableDeclaration,
  VariableDeclarator,
  parseSync,
} from '@swc/core'
import {
  BaseVistor,
  isArrowFunctionExpression,
  isBindingIdentifier,
  isFunctionDeclaration,
  isFunctionExpression,
  isPropertyName,
  isIdentifier,
  isCallExpression,
  isVariableDeclarator,
  isClass,
  isClassMethod,
  isPrivateMethod,
  isMethodProperty,
  isParam,
  isArrayPattern,
  isRestElement,
  isObjectPattern,
  isAssignmentPattern,
  isInvalid,
  isExpression,
} from './Visitor'

export function inferTypesFromFunction(funcCode: string): Map<string, Info> {
  // create source file
  const code = funcCode.trim()
  const sourceFile = parseSync(code, { syntax: 'typescript' })
  // reserver result array
  console.log(JSON.stringify(sourceFile, null, 2))
  const result = new Map<string, Info>()
  VisitAllFunctions(result, sourceFile, code)
  return result
}

function VisitAllFunctions(result: Map<string, Info>, sourceFile: Module, code: string) {
  const extractFunction = new BaseVistor({
    visitFunction: n => {
      if (isFunctionDeclaration(n)) {
        const name = extractName(n.identifier)
        createFunction(result, name, n)
      }
      return n
    },
    visitVariableDeclarator(n) {
      if (n.init) {
        if (isArrowFunctionExpression(n.init)) {
          const name = extractName(n)
          createFunction(result, name, n.init)
        } else if (isFunctionExpression(n.init)) {
          const name = extractName(n)
          createFunction(result, name, n.init)
        } else if (isCallExpression(n.init)) {
          const name = extractName(n)
          const extractor = new BaseVistor({
            visitFunctionExpression: n => {
              createFunction(result, name, n)
              return n
            },
            visitArrowFunctionExpression: n => {
              createFunction(result, name, n)
              return n
            },
          })
          extractor.visitCallExpression(n.init)
        }
      }
      return n
    },
    visitClassMethod(n) {
      if (isPropertyName(n.key) && isIdentifier(n.key)) {
        const name = extractName(n.key)
        createFunction(result, name, n)
      }
      return n
    },
    visitPrivateMethod(n) {
      if (isPropertyName(n.key) && isIdentifier(n.key)) {
        const name = extractName(n.key)
        createFunction(result, name, n)
      }
      return n
    },
  })
  extractFunction.visitProgram(sourceFile)
  return result
}

function extractName(n: VariableDeclarator | Identifier) {
  if (isIdentifier(n)) {
    return n.value
  } else if (isVariableDeclarator(n) && isBindingIdentifier(n.id)) {
    return n.id.value
  } else return 'anonymous'
}

export type FunctionType =
  | FunctionExpression
  | ArrowFunctionExpression
  | ClassMethod
  | PrivateMethod
  | FunctionDeclaration
  | MethodProperty

function createFunction(result: Map<string, Info>, name: string, func: FunctionType) {
  const info = createInfo(result, name, name, '', 'function')
  result.set(info.name, info)
  if (isFunctionExpression(func)) {
    func.params.forEach(p => {
      processPattern(p.pat, result, info)
    })
  } else if (isArrowFunctionExpression(func)) {
    func.params.forEach(p => {
      processPattern(p, result, info)
    })
  } else if (isClassMethod(func)) {
    func.function.params.forEach(p => {
      processPattern(p.pat, result, info)
    })
  } else if (isPrivateMethod(func)) {
    func.function.params.forEach(p => {
      processPattern(p.pat, result, info)
    })
  } else if (isFunctionDeclaration(func)) {
    func.params.forEach(p => {
      processPattern(p.pat, result, info)
    })
  } else if (isMethodProperty(func)) {
    func.params.forEach(p => {
      processPattern(p.pat, result, info)
    })
  }
}

// export type Pattern = BindingIdentifier | ArrayPattern | RestElement | ObjectPattern | AssignmentPattern | Invalid | Expression;

function processPattern(node: Pattern, result: Map<string, Info>, func: Info) {
  if (isBindingIdentifier(node)) {
    const param = createInfo(result, node.value, node.value, '', 'primitive')
    func.properties.set(param.name, param)
    result.set(param.name, param)
  } else if (isArrayPattern(node)) {
  } else if (isRestElement(node)) {
  } else if (isObjectPattern(node)) {
  } else if (isAssignmentPattern(node)) {
  } else if (isInvalid(node)) {
  } else if (isExpression(node)) {
  }
}

// для поддержания уровня вложенности необходимо использовать стек
// который будет содержать текущий контекст
// переменные внутри контекста могут друг друга перекрывать
// поэтому на каждом уровне будет свой контекст
