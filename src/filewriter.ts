import * as memFs from 'mem-fs'
import * as editor from 'mem-fs-editor'
import { parse, join } from 'node:path'
import * as swc from '@swc/core'

const store = memFs.create()
const fs = editor.create(store as any)

function parseFile(text: string, minify: boolean = false) {
  let result: string
  try {
    if (minify) {
      result = swc.printSync(swc.parseSync(text, { syntax: 'typescript' }), { minify: true }).code

      // result = swc.transformSync(text, {
      //   jsc: { parser: { syntax: 'typescript' }},
      //   // minify: true,
      // }).code
    } else {
      result = swc.printSync(swc.parseSync(text, { syntax: 'typescript' }), { minify: false }).code
      // result = swc.transformSync(text, {
      //   jsc: { parser: { syntax: 'typescript' }},
      //   // minify: minify,
      //   // treeShaking: true,
      //   // minifyIdentifiers: true,
      //   // minifySyntax: true,
      // }).code
    }
    return result
  } catch (err) {
    console.error(text)
    throw err
  }
}

export function writeFile(fn: string, data: string, minify?: boolean) {
  try {
    let result = parseFile(data, minify)
    fs.write(fn, result)
  } catch (err) {
    const parsedFn = parse(fn)
    fs.write(join(parsedFn.dir, `${parsedFn.name}.err${parsedFn.ext}`), data)
    console.error(err)
  }
}

export function commit() {
  return new Promise((res, rej) => {
    return fs.commit((err) => {
      if (err) return rej(err)
      else res(true)
    })
  })
}
