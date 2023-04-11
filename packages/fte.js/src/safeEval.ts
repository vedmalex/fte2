import * as fs from 'fs'

export function safeEval(src: string) {
  let retval
  try {
    retval = eval(src)
  } catch (err) {
    fs.writeFileSync('failed.js', src)
    console.log('\t \x1b[34m' + (err as Error).message + '\x1b[0m')
    console.log("for mode debug information see 'failed.js' ")
  }
  return retval
}
