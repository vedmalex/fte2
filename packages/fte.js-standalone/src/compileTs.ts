import { Parser } from 'fte.js-parser'
import { run } from './run'

export function compileTs(content: Buffer | string) {
  const compiled = Parser.parse(content.toString())
  return run(compiled, 'es6module.ts.njs')
}
