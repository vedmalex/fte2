import { Parser } from '../parser/parse'
import { TemplateFactoryStandalone } from './factory'
import templates from '../templates'

export { Parser }
export const F = new TemplateFactoryStandalone(templates)

export function run(context: any, template: keyof typeof templates) {
  return F.run(context, template)
}

export function compileLight(content: Buffer | string) {
  const compiled = Parser.parse(content.toString())
  return run(compiled, 'raw.njs')
}

export function compileFull(content: Buffer | string) {
  const compiled = Parser.parse(content.toString())
  return run(compiled, 'compiled.njs')
}

export function compileTs(content: Buffer | string) {
  const compiled = Parser.parse(content.toString())
  return run(compiled, 'es6module.njs')
}

export function parseFile(content: Buffer | string) {
  return Parser.parse(content.toString())
}