import { Parser } from '../parser/parse'
import * as ts from 'typescript'

function prepareCode(src) {
  const result = ts.transpileModule(src, {
    compilerOptions: {
      allowJs: true,
      strict: false,
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ES2022,
    },
  })
  return result.outputText
}

import templates from '../templates'
import { TemplateFactoryStandalone } from '../standalone/factory'

export const F = new TemplateFactoryStandalone(templates)

export function run(context: any, template: keyof typeof templates) {
  return F.run(context, template)
}

export function compileLight(content: Buffer | string) {
  const compiled = Parser.parse(content.toString())
  return prepareCode(run(compiled, 'raw.njs'))
}

export function compileFull(content: Buffer | string) {
  const compiled = Parser.parse(content.toString())
  return prepareCode(run(compiled, 'compiled.njs'))
}

export function compileTs(content: Buffer | string) {
  const compiled = Parser.parse(content.toString())
  return prepareCode(run(compiled, 'es6module.njs'))
}

export function parseFile(content: Buffer | string) {
  return Parser.parse(content.toString())
}
