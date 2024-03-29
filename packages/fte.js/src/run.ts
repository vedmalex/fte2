import templates from 'fte.js-templates'
import { F } from './compile'

export function run<T>(context: T, template: keyof typeof templates) {
  return F.run(context, template)
}
