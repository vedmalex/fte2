import { prepareCode } from '../prepareCode'

export function optimizeResult(result: any, optimize?: boolean) {
  if (!optimize) {
    return result
  }

  if (typeof result === 'string') {
    return prepareCode(result)
  }

  if (result && typeof result === 'object' && 'code' in result) {
    return {
      ...result,
      code: prepareCode(result.code),
    }
  }

  return result
}
