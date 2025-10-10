import { Parser } from 'fte.js-parser'
import { run } from './run'

export function compileTs(
  content: Buffer | string,
  fileName?: string,
  sourceRoot?: string,
  inlineMap = true,
  sourcemap = true,
) {
  const compiled = Parser.parse(content.toString(), {
    sourceMap: sourcemap,
    sourceFile: fileName,
    sourceContent: typeof content === 'string' ? content : content.toString(),
    sourceRoot,
  })
  return run(compiled, 'es6module.ts.njs')
}
