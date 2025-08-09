import templates from 'fte.js-templates'
import { F } from './compile'

export function run<T>(context: T, template: string) {
  const payload: any = Array.isArray(context)
    ? (context as any)
    : ({
        ...(context as any),
      } as any)
  return F.run(payload, template)
}
