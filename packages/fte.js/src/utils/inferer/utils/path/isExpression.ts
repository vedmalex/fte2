import { Expression } from './Expression'

export function isExpression(node: unknown): node is Expression {
  return typeof node === 'object' && node !== null && (node as any).type === 'expression'
}
