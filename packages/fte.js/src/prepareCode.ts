import * as swc from '@swc/core'

export function prepareCode(text) {
  // return text
  return swc.printSync(swc.parseSync(text, { syntax: 'typescript' })).code
}
