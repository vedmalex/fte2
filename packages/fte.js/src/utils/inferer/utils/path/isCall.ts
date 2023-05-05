import { Call } from './Call'

export function isCall(node: unknown): node is Call {
  return typeof node === 'object' && node !== null && (node as any).type === 'call'
}
