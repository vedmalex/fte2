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
      target: ts.ScriptTarget.ES2020,
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
    return prepareCode(F.run({ context: compiled, name: 'raw.njs' }))
  } catch (e) {
    throw e
  }
}

export function compileFull(
  content: Buffer | string,
  options: { content: string; fileName: string },
) {
  const compiled = raw.parse(content.toString(), {
    grammarSource: options.fileName,
    reservedWords: [],
  })
  const F = new TemplateFactory({
    root: templateRoot,
  })
  return prepareCode(F.run({ context: compiled, name: 'compiled.njs' }))
}
