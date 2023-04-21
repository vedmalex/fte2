import * as t from '@babel/types'
import traverse, { NodePath, Scope } from '@babel/traverse'
import { FunctionType } from '../FunctionType'

export function visitAllFunctions(context: Map<FunctionType, Scope>, ast: t.File) {
  const extractFunction = {
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      context.set(path.node, path.scope)
    },
    FunctionExpression(path: NodePath<t.FunctionExpression>) {
      context.set(path.node, path.scope)
    },
    ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
      context.set(path.node, path.scope)
    },
    ObjectMethod(path: NodePath<t.ObjectMethod>) {
      context.set(path.node, path.scope)
    },
    ClassMethod(path: NodePath<t.ClassMethod>) {
      context.set(path.node, path.scope)
    },
    ClassPrivateMethod(path: NodePath<t.ClassPrivateMethod>) {
      context.set(path.node, path.scope)
    },
  }
  traverse(ast, extractFunction)
  return context
}
