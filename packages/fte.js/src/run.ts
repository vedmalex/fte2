import templates from 'fte.js-templates'
import { F } from './compile'

export function run<T>(context: T, template: keyof typeof templates) {
  return F.run(
    {
      ...context,
      // Pass source map options if parser provided source info
    } as any,
    template,
  )
}
