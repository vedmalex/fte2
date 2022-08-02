import * as memFs from 'mem-fs'
import * as editor from 'mem-fs-editor'
import * as astring from 'astring'
import * as acorn from 'acorn'
import prettier from 'prettier'
import { extname, parse } from 'path'
import * as swc from '@swc/core'
import { Volume, createFsFromVolume, IFs } from 'memfs'
import { Union } from 'unionfs'

// import * as hwfs from 'fs'
// const ufs = new Union()

export const temp = new Volume({})
export const result = new Volume({})

// export const fs = ufs
//   .use(hwfs)
//   .use(createFsFromVolume(temp) as unknown as IFs)
//   .use(createFsFromVolume(result) as unknown as IFs)

const store = memFs.create()
const memfs_store = editor.create(store)

function parseFile(
  text: string,
  minify: boolean = true,
  pretty: boolean = false,
  parser: string = 'babel',
) {
  let code: string, result: string
  try {
    if (minify) {
      // result = esbuild.transformSync(text, {
      //   treeShaking: true,
      //   minify,
      // }).code

      result = swc.minifySync(text, {
        sourceMap: true,
        compress: true,
        mangle: true,
      }).code
    } else {
      if (parser == 'babel') {
        code = text
        const ast = acorn.parse(code, { ecmaVersion: 'latest' })
        result = astring.generate(ast, { comments: true })
      } else {
        result = text
      }
      if (pretty) {
        result = prettier.format(result, {
          semi: false,
          trailingComma: 'all',
          singleQuote: true,
          printWidth: 80,
          tabWidth: 2,
          arrowParens: 'avoid',
          parser,
        })
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

const ensureDirBase = (fs: IFs) => (file: string) => {
  const dir = parse(file).dir
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export const write = (fs: IFs) => {
  const ensureDir = ensureDirBase(fs)
  return (
    fn: string,
    data: string,
    {
      format,
      minify,
      pretty,
    }: { format?: boolean; minify?: boolean; pretty?: boolean } = {},
  ) => {
    ensureDir(fn)
    const file = parse(fn)
    if (format) {
      try {
        const fType = file.ext.match(/\.js?$/)
        let result: string
        if (fType) {
          result = parseFile(data, minify, pretty, getParserForFileName(fn))
        } else {
          result = data
        }

        fs.writeFileSync(fn, result)
      } catch (err) {
        fs.writeFileSync('err.' + fn, data)
        console.error(err)
      }
    } else {
      fs.writeFileSync(fn, data)
    }
  }
}

export const read = (fs: IFs) => (fn: string) => {
  fs.readFileSync(fn)
}

export const writeFileTemp = write(temp as unknown as IFs)
export const writeFile = write(result as unknown as IFs)

export const readFileTemp = read(temp as unknown as IFs)
export const readFile = read(result as unknown as IFs)

export function commit() {
  const files = result.toJSON()
  return new Promise((res, rej) => {
    Object.keys(files).forEach((current) => {
      memfs_store.write(current, files[current])
    })
    return memfs_store.commit((err) => {
      if (err) return rej(err)
      else res(true)
    })
  })
}
