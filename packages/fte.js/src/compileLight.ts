import { Parser } from 'fte.js-parser'
import { prepareCode } from './prepareCode'
import { run } from './run'

export function compileLight(content: Buffer | string, optimize: boolean) {
  const compiled = Parser.parse(content.toString())
  const text = run(compiled, 'raw.njs')
  return optimize ? prepareCode(text) : (text as string)
}
