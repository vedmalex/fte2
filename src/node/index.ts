import { TemplateFactory as Factory } from './factory'
import { Template } from './template'
import {
  F,
  compileFull,
  compileLight,
  compileTs,
  run,
  parseFile,
} from './compile'
import { Parser } from '../parser/parse'

export {
  Factory,
  Template,
  compileLight,
  compileFull,
  Parser,
  run,
  compileTs,
  parseFile,
}

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
  return tpl.factory.run(context, ONLY_ONE)
}
