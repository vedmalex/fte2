import { Parser } from 'fte.js-parser'
import { prepareCode } from './prepareCode'
import { run } from './run'
import { F } from './compile'

export function compileFull(
  content: Buffer | string,
  optimize?: boolean,
  fileName?: string,
  sourceRoot?: string,
  inlineMap: boolean = true,
  sourcemap: boolean = true,
) {
  // Configure template factory options for this compilation
  F.options = {
    ...F.options,
    sourceMap: sourcemap,
    inline: inlineMap,
    sourceFile: fileName,
    sourceRoot,
  } as any

  const compiled = Parser.parse(content.toString(), {
    sourceMap: sourcemap,
    sourceFile: fileName,
    sourceContent: typeof content === 'string' ? content : content.toString(),
    sourceRoot,
  })
  const result = run(compiled, 'compiled.njs') as any
  if (typeof result === 'string') {
    return optimize ? prepareCode(result) : result
  }
  return result
}
