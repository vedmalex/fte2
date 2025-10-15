import { Parser } from 'fte.js-parser'
import { F } from './compile'
import { run } from './run'
import { optimizeResult } from './utils/optimizeResult'

export function compileLight(
  content: Buffer | string,
  optimize: boolean,
  fileName?: string,
  sourceRoot?: string,
  inlineMap = true,
  sourcemap = true,
) {
  F.options = {
    ...F.options,
    sourceMap: sourcemap,
    inline: inlineMap,
    sourceFile: fileName,
    sourceRoot,
  } as any

  const sourceText = typeof content === 'string' ? content : content.toString()
  const compiled = Parser.parse(sourceText, {
    sourceMap: sourcemap,
    sourceFile: fileName,
    sourceContent: sourceText,
    sourceRoot,
  })

  const result = run(compiled, 'raw.njs') as any
  return optimizeResult(result, optimize)
}
