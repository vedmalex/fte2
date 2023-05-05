import { Index } from './Index'

export function isIndex(node: unknown): node is Index {
  return typeof node === 'object' && node !== null && (node as any).type === 'index'
}
