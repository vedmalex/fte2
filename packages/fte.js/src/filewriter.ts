import * as memFs from 'mem-fs'
import * as editor from 'mem-fs-editor'
import { parse, join } from 'path'
import * as swc from '@swc/core'

const store = memFs.create()
const fs = editor.create(store as any)

function parseFile(text: string, minify: boolean = false) {
  let result: string
  try {
    if (minify) {
      result = swc.printSync(swc.parseSync(text, { syntax: 'typescript' }), { minify: true }).code
    } else {
      result = swc.printSync(swc.parseSync(text, { syntax: 'typescript' }), { minify: false }).code
    }
    return result
  } catch (err) {
    console.error(text)
    throw err
  }
}

export function writeFile(fn: string, data: string, minify?: boolean) {
  try {
    // Preserve sourceMappingURL comments removed by SWC
    const inlineMatch = data.match(/\/\/\#\s*sourceMappingURL=data:application\/json;base64,[^\n\r]+/)
    const externalMatch = data.match(/\/\/\#\s*sourceMappingURL=[^\n\r]+\.map/)

    let result = parseFile(data, minify)

    const hasAnyMapComment = /\/\/\#\s*sourceMappingURL=/.test(result)
    if (!hasAnyMapComment) {
      if (inlineMatch) {
        result += `\n${inlineMatch[0]}`
      } else if (externalMatch) {
        result += `\n${externalMatch[0]}`
      }
    }

    fs.write(fn, result)
  } catch (err) {
    const parsedFn = parse(fn)
    fs.write(join(parsedFn.dir, `${parsedFn.name}.err${parsedFn.ext}`), data)
    console.error(err)
  }
}

export function writeRaw(fn: string, data: string) {
  fs.write(fn, data)
}

export function commit() {
  return new Promise((res, rej) => {
    return fs.commit(err => {
      if (err) return rej(err)
      else res(true)
    })
  })
}
