import templates from 'fte.js-templates'
import { F } from './compile'

export function run<T>(context: T, template: string) {
  return F.run(context as any, template)
}
