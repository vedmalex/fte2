import * as memFs from 'mem-fs'
import * as editor from 'mem-fs-editor'
import { extname } from 'path'
import * as esbuild from 'esbuild'

const store = memFs.create()
const fs = editor.create(store)

function parseFile(
  text: string,
  minify: boolean = true,
  pretty: boolean = false,
  parser: string = 'babel',
) {
  // return text
  let code: string, result: string
  try {
    if (minify) {
      result = esbuild.transformSync(text, {
        minify: true,
      }).code
    } else {
      if (parser == 'babel') {
        result = esbuild.transformSync(text, {
          minify: false,
          // treeShaking: true,
          // minifyIdentifiers: true,
          // minifySyntax: true,
        }).code
      } else {
        result = text
      }
    }
    return result
  } catch (err) {
    console.error(text)
    throw err
  }
}

function getParserForFileName(fileName: string) {
  let parser: string
  switch (extname(fileName)) {
    case '.jsx':
    case '.js':
    case '.mjs':
      parser = 'babel'
      break
    case '.tsx':
    case '.ts':
      parser = 'typescript'
      break
    case '.json':
      parser = 'json-stringify'
      break
    case '.css':
      parser = 'css'
      break
    case '.htm':
    case '.html':
    case '.xhtml':
      parser = 'html'
      break
    default:
      parser = 'babel'
  }
  return parser
}

export function writeFile(
  fn: string,
  data: string,
  {
    format,
    minify,
    pretty,
  }: { format?: boolean; minify?: boolean; pretty?: boolean } = {},
) {
  if (format) {
    try {
      const fType = fn.match(/\.js?$/)
      let result
      if (fType) {
        result = parseFile(data, minify, pretty, getParserForFileName(fn))
      } else {
        result = data
      }
      fs.write(fn, result)
    } catch (err) {
      fs.write('err.' + fn, data)
      console.error(err)
    }
  } else {
    fs.write(fn, data)
  }
}

export function readFile(fn) {
  fs.read(fn)
}

export function commit() {
  return new Promise((res, rej) => {
    return fs.commit((err) => {
      if (err) return rej(err)
      else res(true)
    })
  })
}
