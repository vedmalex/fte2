import * as fs from 'fs'
import { compileLight as compileTemplate } from './compile'

export function safeEval(src: string) {
  let retval
  try {
    retval = eval(src)
  } catch (err) {
    fs.writeFileSync('failed.js', src)
    console.log('\t \x1b[34m' + err.message + '\x1b[0m')
    console.log("for mode debug information see 'failed.js' ")
  }
  return retval
}

export function makeFunction(fnDef, name) {
  let result: { err?: any; code?: any }
  try {
    const fname = name.replace(/[\s,\\\/\.\-]/g, '_')
    result = safeEval(
      'function ' +
        fname +
        ' (' +
        fnDef.parameters +
        '){\n' +
        fnDef.body +
        '\n}',
    )
  } catch (error) {
    result = {
      err: error,
      code: fnDef.body,
    }
  } finally {
    return result
  }
}

export function makeTemplate(src: string, optimize: boolean = true) {
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
