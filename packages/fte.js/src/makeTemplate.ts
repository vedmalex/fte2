import { compileLight as compileTemplate } from './compileLight'
import { safeEval } from './safeEval'

export function makeTemplate(src: string, optimize = true) {
  let result
  const compiled = compileTemplate(src, optimize)
  try {
    result = safeEval(compiled)
  } catch (error) {
    result = {
      error: error,
      code: src,
    }
  } finally {
    return result
  }
}
