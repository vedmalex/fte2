import { Parser } from '../../parser/parse'
import { prepareCode } from './prepareCode'
import { run } from './run'

export function compileTs(content: Buffer | string, optimize?: boolean) {
  const compiled = Parser.parse(content.toString())
  const text = run(compiled, 'es6module.ts.njs')
  return optimize ? prepareCode(text) : (text as string)
}
