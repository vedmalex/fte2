import { Parser } from '../parser/parse'
import { run } from './run'

export function compileLight(content: Buffer | string) {
  const compiled = Parser.parse(content.toString())
  return run(compiled, 'raw.njs')
}
