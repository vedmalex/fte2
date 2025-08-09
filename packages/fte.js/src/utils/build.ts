import path from 'path'
import { globSync } from 'glob'
import fs from 'fs'
import { writeFile, writeRaw, commit } from '../filewriter'
import { compileTs } from '../compileTs'
import { compileFull } from '../compileFull'
import { parseFile } from '../parseFile'
import { run } from '../run'
import { generateContextTypes } from './contextTypes'

// берет файл из реальной fs
// записывает во временное хранилище
function parseTemplate(
  fileName: string,
  src: string,
  dest: string,
  compile: (
    content: Buffer | string,
    optimize?: boolean,
    outRelativeName?: string,
    sourceRoot?: string,
    inlineMap?: boolean,
    sourcemap?: boolean,
  ) => string | { code: string; map?: any } | Array<{ name: string; content: string }>,
  { typescript, format, pretty, minify, sourcemap, inlineMap }: { typescript: boolean; format: boolean; pretty: boolean; minify: boolean; sourcemap?: boolean; inlineMap?: boolean },
) {
  const fn = path.resolve(fileName)
  if (fs.existsSync(fn)) {
    const content = fs.readFileSync(fn)
    const relativeName = path.relative(src, fileName) + (typescript ? '.ts' : '.js')
    const result = compile(content, false, relativeName, src, inlineMap, sourcemap)
    const outPath = path.join(dest, relativeName)
    if (typeof result === 'string') {
      writeFile(outPath, result, minify)
    } else if (Array.isArray(result)) {
      result.forEach(file => {
        writeFile(path.join(dest, path.basename(file.name) + (typescript ? '.ts' : '.js')), file.content, minify)
      })
    } else if (result && typeof result === 'object' && 'code' in result) {
      writeFile(outPath, result.code, minify)
      if (sourcemap && inlineMap === false && result.map) {
        const mapPath = outPath + '.map'
        writeRaw(mapPath, JSON.stringify(result.map))
      }
    }
  }
}

export type BuildOptions = {
  typescript: boolean
  format: any
  pretty: boolean
  minify: boolean
  standalone: boolean
  single: boolean
  ext: string
  file: string
  sourcemap?: boolean
  inlineMap?: boolean
}

export function build(
  src: string,
  dest: string,
  options: BuildOptions,
  callback: (err?: unknown) => void,
) {
  try {
    const files = globSync(`${src}/**/*${options.ext ? options.ext : '.njs'}`)

    const moduleFormat: 'cjs' | 'esm' = (options as any).format === 'esm' ? 'esm' : 'cjs'

    if (options.single) {
      const filelist = files.map(file => {
        const name = path.relative(src, file)
        const content = fs.readFileSync(file)
        const template: any = parseFile(content)
        try {
          const ctxTypes = generateContextTypes(template)
          template.directives = template.directives || {}
          ;(template.directives as any).contextTypes = ctxTypes
        } catch {}
        return { name, template }
      })
      const templateFile = run(
        filelist,
        options.typescript
          ? 'singlefile.ts.njs'
          : moduleFormat === 'esm'
          ? 'singlefile.es6.njs'
          : 'singlefile.njs',
      )
      if (typeof templateFile == 'string') {
        writeFile(`${dest}/${options.file}${options.typescript ? '.ts' : '.js'}`, templateFile, options.minify)
      } else {
        templateFile.forEach(file => {
          writeFile(`${dest}/${file.name}`, file.content, options.minify)
        })
      }
    } else {
      files.forEach(file => {
        parseTemplate(file, src, dest, (
          content: Buffer | string,
          optimize?: boolean,
          fileName?: string,
          sourceRoot?: string,
        ) =>
          (options.typescript ? compileTs : compileFull)(
            content,
            optimize,
            fileName,
            sourceRoot,
            options.inlineMap,
            options.sourcemap,
          ),
        options,
        )
      })
      const indexFile = run(
        files.map(f => {
          return {
            name: path.relative(src, f),
            path: `./${path.relative(src, f)}${options.typescript ? '' : '.js'}`,
          }
        }),
        options.typescript
          ? options.standalone
            ? 'standalone.ts.njs'
            : 'standalone.index.ts.njs'
          : options.standalone
          ? moduleFormat === 'esm'
            ? 'standalone.es6.njs'
            : 'standalone.njs'
          : moduleFormat === 'esm'
          ? 'standalone.index.es6.njs'
          : 'standalone.index.njs',
      )
      if (typeof indexFile == 'string') {
        writeFile(`${dest}/${options.file}${options.typescript ? '.ts' : '.js'}`, indexFile, options.minify)
      } else {
        indexFile.forEach(file => {
          writeFile(`${dest}/${file.name}`, file.content, options.minify)
        })
      }
    }

    commit()
      .then(_ => callback())
      .catch(err => callback(err))
  } catch (err) {
    callback(err)
  }
}
