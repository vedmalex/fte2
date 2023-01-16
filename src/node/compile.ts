import { Parser } from '../parser/parse'
import * as esbuild from 'esbuild'

function prepareCode(text) {
  // return text
  const result = esbuild.transformSync(text, {
    minify: false,
    // treeShaking: true,
    // minifySyntax: true,
  })
  return result.code
}

import templates from '../templates'
import { TemplateFactoryStandalone } from '../standalone/factory'

export const F = new TemplateFactoryStandalone(templates)

export function run(context: any, template: keyof typeof templates) {
  return F.run(context, template)
}

export function compileLight(content: Buffer | string, optimize: boolean) {
  const compiled = Parser.parse(content.toString())
  const text = run(compiled, 'raw.njs')
  return optimize ? prepareCode(text) : (text as string)
}

export function compileFull(content: Buffer | string, optimize: boolean) {
  const compiled = Parser.parse(content.toString())
  const text = run(compiled, 'compiled.njs')
  return optimize ? prepareCode(text) : (text as string)
}

export function compileTs(content: Buffer | string, optimize: boolean) {
  const compiled = Parser.parse(content.toString())
  const text = run(compiled, 'es6module.njs')
  return optimize ? prepareCode(text) : (text as string)
}

export function parseFile(content: Buffer | string) {
  return Parser.parse(content.toString())
}
