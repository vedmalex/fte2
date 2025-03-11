import { Parser } from 'fte.js-parser'
import { prepareCode } from './prepareCode'
import { run } from './run'
// import { inferTypesFromFunction } from './utils/inferer/typeinfer'

export function compileTs(content: Buffer | string, optimize?: boolean) {
  const compiled = Parser.parse(content.toString())
  const text = run(compiled, 'es6module.njs')
  // const types = inferTypesFromFunction(text as string)

  // const typedefs = run(types, 'typedefinitions.njs')
  // console.log(typedefs)
  return optimize ? prepareCode(text) : (text as string)
}
