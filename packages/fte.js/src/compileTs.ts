import { Parser } from 'fte.js-parser'
import { prepareCode } from './prepareCode'
import { run } from './run'
import { F } from './compile'
// import { inferTypesFromFunction } from './utils/inferer/typeinfer'

export function compileTs(
  content: Buffer | string,
  optimize?: boolean,
  fileName?: string,
  sourceRoot?: string,
  inlineMap: boolean = true,
  sourcemap: boolean = true,
) {
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
  const result = run(compiled, 'es6module.njs') as any
  // const types = inferTypesFromFunction(text as string)

  // const typedefs = run(types, 'typedefinitions.njs')
  // console.log(typedefs)
  if (typeof result === 'string') {
    return optimize ? prepareCode(result) : result
  }
  return result
}
