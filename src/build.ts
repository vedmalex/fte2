import path from 'path'
import glob from 'glob'
import { compileTs, compileFull, run, parseFile } from './node'
import { writeFile, commit } from './filewriter'
import fs from 'fs'

// берет файл из реальной fs
// записывает во временное хранилище
function parseTemplate(
  fileName: string,
  src: string,
  dest: string,
  compile: (
    content: Buffer | string,
  ) => string | Array<{ name: string; content: string }>,
  {
    typescript,
    format,
    pretty,
    minify,
  }: { typescript: boolean; format: boolean; pretty: boolean; minify: boolean },
) {
  const fn = path.resolve(fileName)
  if (fs.existsSync(fn)) {
    const content = fs.readFileSync(fn)
    const result = compile(content)
    if (typeof result == 'string') {
      path.relative(src, fileName)
      writeFile(
        path.join(
          dest,
          path.relative(src, fileName) + (typescript ? '.ts' : '.js'),
        ),
        result,
        {
          format,
          pretty,
          minify,
        },
      )
    } else {
      result.forEach((file) => {
        writeFile(
          path.join(
            dest,
            path.basename(file.name) + (typescript ? '.ts' : '.js'),
          ),
          file.content,
          {
            format,
            pretty,
            minify,
          },
        )
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
  callback: (err?: Error) => void,
) {
  debugger
  glob(`${src}/**/*${options.ext ? options.ext : '.njs'}`, (err, files) => {
    if (!err) {
      if (options.single) {
        const filelist = files.map((file) => {
          const name = path.relative(src, file)
          const content = fs.readFileSync(file)
          return { name, template: parseFile(content) }
        })
        const templateFile = run(
          filelist,
          options.typescript ? 'singlefile.es6.njs' : 'singlefile.njs',
        )
        if (typeof templateFile == 'string') {
          writeFile(
            `${dest}/${options.file}${options.typescript ? '.ts' : '.js'}`,
            templateFile,
            options,
          )
        } else {
          templateFile.forEach((file) => {
            writeFile(`${dest}/${file.name}`, file.content, options)
          })
        }
      } else {
        files.forEach((file) => {
          parseTemplate(
            file,
            src,
            dest,
            options.typescript ? compileTs : compileFull,
            options,
          )
        })
        const indexFile = run(
          files.map((f) => {
            return {
              name: path.relative(src, f),
              path: `./${path.relative(src, f)}${
                options.typescript ? '' : '.js'
              }`,
            }
          }),
          options.typescript
            ? options.standalone
              ? 'standalone.es6.njs'
              : 'standalone.index.es6.njs'
            : options.standalone
            ? 'standalone.njs'
            : 'standalone.index.njs',
        )
        if (typeof indexFile == 'string') {
          writeFile(
            `${dest}/${options.file}${options.typescript ? '.ts' : '.js'}`,
            indexFile,
            options,
          )
        } else {
          indexFile.forEach((file) => {
            writeFile(`${dest}/${file.name}`, file.content, options)
          })
        }
      }

      commit()
        .then((_) => callback())
        .catch((err) => callback(err))
    } else {
      callback(err)
    }
  })
}
