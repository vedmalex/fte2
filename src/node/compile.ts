import * as raw from '../../grammar/raw.peggy.js'
import * as ts from 'typescript'
// import * as fs from 'fs-extra';
import * as path from 'path'
import { TemplateFactory } from './factory'

const templateRoot = path.join(__dirname, './../../templates')
function prepareCode(src) {
  const result = ts.transpileModule(src, {
    compilerOptions: {
      allowJs: true,
      strict: false,
      module: ts.ModuleKind.CommonJS,
    },
  })
  return result.outputText
}

export function compileLight(content: Buffer | string) {
  try {
    const compiled = raw.parse(content.toString())
    const F = new TemplateFactory({
      root: templateRoot,
    })
    return prepareCode(F.run(compiled, 'raw.njs'))
  } catch (e) {
    throw e
  }
}

export function compileFull(content: Buffer | string) {
  const compiled = raw.parse(content.toString())
  const F = new TemplateFactory({
    root: templateRoot,
  })
  return prepareCode(F.run(compiled, 'compiled.njs'))
}
