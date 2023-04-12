import path from 'path'
import { globSync } from 'glob'
import fs from 'fs'
import { writeFile, commit } from '../filewriter'
import { compileTs } from '../compileTs'
import { compileFull } from '../compileFull'
import { parseFile } from '../parseFile'
import { run } from '../run'

// берет файл из реальной fs
// записывает во временное хранилище
function parseTemplate(
  fileName: string,
  src: string,
  dest: string,
  compile: (content: Buffer | string, optimize?: boolean) => string | Array<{ name: string; content: string }>,
  { typescript, format, pretty, minify }: { typescript: boolean; format: boolean; pretty: boolean; minify: boolean },
) {
  const fn = path.resolve(fileName)
  if (fs.existsSync(fn)) {
    const content = fs.readFileSync(fn)
    const result = compile(content, false)
    if (typeof result == 'string') {
      path.relative(src, fileName)
      writeFile(path.join(dest, path.relative(src, fileName) + (typescript ? '.ts' : '.js')), result, minify)
    } else {
      result.forEach(file => {
        writeFile(path.join(dest, path.basename(file.name) + (typescript ? '.ts' : '.js')), file.content, minify)
      })
    }
  }
}

export function build(
  src: string,
  dest: string,
  options: {
    typescript: boolean
    format: boolean
    pretty: boolean
    minify: boolean
    standalone: boolean
    single: boolean
    ext: string
    file: string
  },
  callback: (err?: unknown) => void,
) {
  try {
    const files = globSync(`${src}/**/*${options.ext ? options.ext : '.njs'}`)

    if (options.single) {
      const filelist = files.map(file => {
        const name = path.relative(src, file)
        const content = fs.readFileSync(file)
        return { name, template: parseFile(content) }
      })
      const templateFile = run(filelist, options.typescript ? 'singlefile.ts.njs' : 'singlefile.njs')
      if (typeof templateFile == 'string') {
        writeFile(`${dest}/${options.file}${options.typescript ? '.ts' : '.js'}`, templateFile, options.minify)
      } else {
        templateFile.forEach(file => {
          writeFile(`${dest}/${file.name}`, file.content, options.minify)
        })
      }
    } else {
      files.forEach(file => {
        parseTemplate(file, src, dest, options.typescript ? compileTs : compileFull, options)
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
          ? 'standalone.njs'
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
