import { Parser } from 'fte.js-parser'
import { F } from './compile'
import { run } from './run'
import { optimizeResult } from './utils/optimizeResult'
// import { inferTypesFromFunction } from './utils/inferer/typeinfer'

export function compileTs(
  content: Buffer | string,
  optimize?: boolean,
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

  const result = run(compiled, 'es6module.njs') as any
  // const types = inferTypesFromFunction(result as string)

  // const typedefs = run(types, 'typedefinitions.njs')
  // console.log(typedefs)
  return optimizeResult(result, optimize)
}
