import { safeEval } from './safeEval'

export function makeFunction(fnDef, name) {
  let result: { err?: any; code?: any }
  try {
    const fname = name.replace(/[\s,\\\/\.\-]/g, '_')
    result = safeEval('function ' + fname + ' (' + fnDef.parameters + '){\n' + fnDef.body + '\n}')
  } catch (error) {
    result = {
      err: error,
      code: fnDef.body,
    }
  } finally {
    //@ts-ignore
    return result
  }
}
