import * as t from '@babel/types'
import traverse, { NodePath, Scope } from '@babel/traverse'
import { FunctionType } from '../types/FunctionType'

export function visitAllFunctions(ast: t.File) {
  const context: Array<NodePath<FunctionType>> = []
  const extractFunction = {
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      context.push(path)
    },
    FunctionExpression(path: NodePath<t.FunctionExpression>) {
      context.push(path)
    },
    ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
      context.push(path)
    },
    ObjectMethod(path: NodePath<t.ObjectMethod>) {
      context.push(path)
    },
    ClassMethod(path: NodePath<t.ClassMethod>) {
      context.push(path)
    },
    ClassPrivateMethod(path: NodePath<t.ClassPrivateMethod>) {
      context.push(path)
    },
  }
  traverse(ast, extractFunction)
  return context
}
