import * as swc from '@swc/core'
import * as realFs from 'fs'
import * as memFs from 'mem-fs'
import * as editor from 'mem-fs-editor'
import { join, parse } from 'path'

const store = memFs.create()
const fs = editor.create(store as any)

function parseFile(text: string, minify = false) {
  let result: string
  try {
    const ast = swc.parseSync(text, {
      syntax: 'typescript',
      comments: true,
    } as any)
    // Preserve comments on print. swc attaches comments to ast; printSync keeps them by default.
    result = swc.printSync(ast, { minify }).code
    return result
  } catch (err) {
    try {
      const snippet = text.split(/\r?\n/).slice(0, 40).join('\n')
      console.error(snippet)
    } catch {
      console.error(text)
    }
    throw err
  }
}

export function writeFile(fn: string, data: string, minify?: boolean) {
  try {
    // Preserve sourceMappingURL comments removed by SWC
    const inlineMatch = data.match(
      /\/\/#\s*sourceMappingURL=data:application\/json;base64,[^\n\r]+/,
    )
    const externalMatch = data.match(/\/\/#\s*sourceMappingURL=[^\n\r]+\.map/)
    // Capture typedef block comments which SWC may drop on print
    const typedefBlocks = (data.match(/\/\*\*[\s\S]*?\*\//g) || []).filter(
      (b) => /@typedef/.test(b),
    )

    let result = parseFile(data, minify)

    const hasAnyMapComment = /\/\/#\s*sourceMappingURL=/.test(result)
    if (!hasAnyMapComment) {
      if (inlineMatch) {
        result += `\n${inlineMatch[0]}`
      } else if (externalMatch) {
        result += `\n${externalMatch[0]}`
      }
    }

    // Re-inject typedef block if missing after print
    if (!/@typedef/.test(result) && typedefBlocks.length > 0) {
      result = `${typedefBlocks[0]}\n${result}`
    }

    fs.write(fn, result)
  } catch (err) {
    const parsedFn = parse(fn)
    // Save error file in the target directory
    const errPath = join(parsedFn.dir, `${parsedFn.name}.err${parsedFn.ext}`)
    // Ensure directory exists
    const errDir = parsedFn.dir
    if (!realFs.existsSync(errDir)) {
      realFs.mkdirSync(errDir, { recursive: true })
    }
    realFs.writeFileSync(errPath, data)
    try {
      // Also persist latest error to workspace for easier debugging during tests
      const debugDir = join(process.cwd(), 'packages', 'fte.js', 'tmp')
      if (!realFs.existsSync(debugDir)) {
        realFs.mkdirSync(debugDir, { recursive: true })
      }
      const safeName = parsedFn.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      realFs.writeFileSync(
        join(debugDir, `${safeName}.err${parsedFn.ext}`),
        data,
      )
      console.error(`Compilation error saved to: ${join(parsedFn.dir, `${parsedFn.name}.err${parsedFn.ext}`)}`)
    } catch { }
    console.error(err)
  }
}

export function writeRaw(fn: string, data: string) {
  fs.write(fn, data)
}

export function commit() {
  return fs.commit()
}
