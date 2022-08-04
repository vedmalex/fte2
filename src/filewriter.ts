import * as memFs from 'mem-fs'
import * as editor from 'mem-fs-editor'
import * as astring from 'astring'
import * as acorn from 'acorn'
import prettier from 'prettier'
import { extname } from 'path'
import * as swc from '@swc/core'

const store = memFs.create()
const fs = editor.create(store)

function parseFile(
  text: string,
  minify: boolean = true,
  pretty: boolean = false,
  parser: string = 'babel',
) {
  let code: string, result: string
  try {
    if (minify) {
      result = swc.minifySync(text, {
        sourceMap: true,
        compress: {
          side_effects: false,
          unused: true,
        },
        mangle: true,
      }).code
    } else {
      if (parser == 'babel') {
        // code = text
        // const ast = acorn.parse(code, { ecmaVersion: 'latest' })
        // result = astring.generate(ast, { comments: true })
        result = swc.transformSync(text, {
          jsc: {
            minify: {
              compress: {
                dead_code: true,
                defaults: false,
                ecma: 2020,
                side_effects: false,
                unused: true,
                unsafe: false,
                passes: 1,
              },
              format: { beautify: true, semicolons: true },
            },
          },
        }).code
      } else {
        result = text
      }
      // if (pretty) {
      //   result = prettier.format(result, {
      //     semi: false,
      //     trailingComma: 'all',
      //     singleQuote: true,
      //     printWidth: 80,
      //     tabWidth: 2,
      //     arrowParens: 'avoid',
      //     parser,
      //   })
      // }
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
