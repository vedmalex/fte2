import { Property } from './Property'

export function isProperty(node: unknown): node is Property {
  return typeof node === 'object' && node !== null && (node as any).type === 'property'
}
