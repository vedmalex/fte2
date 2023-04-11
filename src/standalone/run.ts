import templates from '../templates'
import { F } from './compile'

export function run(context: any, template: keyof typeof templates) {
  return F.run(context, template)
}
