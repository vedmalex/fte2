import { TemplateFactory as Factory } from './factory'
import { Template } from './template'
import { compileLight, compileFull } from './compile'

export { Factory, Template, compileLight, compileFull }

export function parse(source: string, context: any): string | object[] {
  const ONLY_ONE = 'ONLY_ONE'
  const factory = new Factory({})
  const tpl = new Template({
    source: source,
    name: ONLY_ONE,
    factory,
  })
  tpl.compile()
  factory.cache[ONLY_ONE] = tpl
  return tpl.factory.run(context, ONLY_ONE, false)
}
