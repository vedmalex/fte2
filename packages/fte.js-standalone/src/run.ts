import type templates from 'fte.js-templates'
import { F } from './compile'

export function run(context: any, template: keyof typeof templates) {
  return F.run(context, template)
}
