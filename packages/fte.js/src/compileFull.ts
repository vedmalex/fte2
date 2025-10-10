import { Parser } from 'fte.js-parser'
import { F } from './compile'
import { prepareCode } from './prepareCode'
import { run } from './run'

export function compileFull(
  content: Buffer | string,
  optimize?: boolean,
  fileName?: string,
  sourceRoot?: string,
  inlineMap = true,
  sourcemap = true,
) {
  // Configure template factory options for this compilation
  F.options = {
    ...F.options,
    sourceMap: sourcemap,
    inline: inlineMap,
    sourceFile: fileName,
    sourceRoot,
  } as any

  const parsed = Parser.parse(content.toString(), {
    sourceMap: sourcemap,
    sourceFile: fileName,
    sourceContent: typeof content === 'string' ? content : content.toString(),
    sourceRoot,
  })

  // Convert parsed result to plain object for template context
  const templateContext = {
    main: parsed.main,
    blocks: parsed.blocks,
    slots: parsed.slots,
    directives: parsed.directives,
  }
  const result = run(templateContext, 'compiled.njs') as any
  if (typeof result === 'string') {
    return optimize ? prepareCode(result) : result
  }
  return result
}
