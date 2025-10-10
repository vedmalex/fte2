import fs from 'fs'
import { globSync } from 'glob'
import path from 'path'
import { compileFull } from '../compileFull'
import { compileTs } from '../compileTs'
import { commit, writeFile, writeRaw } from '../filewriter'
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
  ) =>
    | string
    | { code: string; map?: any }
    | Array<{ name: string; content: string }>,
  {
    typescript,
    format,
    pretty,
    minify,
    sourcemap,
    inlineMap,
  }: {
    typescript: boolean
    format: boolean
    pretty: boolean
    minify: boolean
    sourcemap?: boolean
    inlineMap?: boolean
  },
) {
  const fn = path.resolve(fileName)
  if (fs.existsSync(fn)) {
    const content = fs.readFileSync(fn)
    const relativeName =
      path.relative(src, fileName) + (typescript ? '.ts' : '.js')
    const result = compile(
      content,
      false,
      relativeName,
      src,
      inlineMap,
      sourcemap,
    )
    const outPath = path.join(dest, relativeName)
    if (typeof result === 'string') {
      try {
        writeFile(outPath, result, minify)
      } catch (err) {
        // Save error file when compilation fails
        const errPath = outPath.replace(/\.(ts|js)$/, '.err$&')
        try {
          fs.writeFileSync(errPath, result)
          console.error(`Compilation error saved to: ${errPath}`)
        } catch (writeErr) {
          console.error(`Failed to save error file: ${writeErr}`)
        }
        throw err
      }
    } else if (Array.isArray(result)) {
      result.forEach((file) => {
        try {
          writeFile(
            path.join(
              dest,
              path.basename(file.name) + (typescript ? '.ts' : '.js'),
            ),
            file.content,
            minify,
          )
        } catch (err) {
          // Save error file when compilation fails
          const filePath = path.join(
            dest,
            path.basename(file.name) + (typescript ? '.ts' : '.js'),
          )
          const errPath = filePath.replace(/\.(ts|js)$/, '.err$&')
          try {
            fs.writeFileSync(errPath, file.content)
            console.error(`Compilation error saved to: ${errPath}`)
          } catch (writeErr) {
            console.error(`Failed to save error file: ${writeErr}`)
          }
          throw err
        }
      })
    } else if (result && typeof result === 'object' && 'code' in result) {
      try {
        writeFile(outPath, result.code, minify)
        if (sourcemap && inlineMap === false && result.map) {
          const mapPath = outPath + '.map'
          writeRaw(mapPath, JSON.stringify(result.map))
        }
      } catch (err) {
        // Save error file when compilation fails
        const errPath = outPath.replace(/\.(ts|js)$/, '.err$&')
        try {
          fs.writeFileSync(errPath, result.code)
          console.error(`Compilation error saved to: ${errPath}`)
        } catch (writeErr) {
          console.error(`Failed to save error file: ${writeErr}`)
        }
        throw err
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
    const files = globSync(`${src}/**/*${options.ext ? options.ext : '.njs'}`, {
      nodir: true,
    })

    const moduleFormat: 'cjs' | 'esm' =
      (options as any).format === 'esm' ? 'esm' : 'cjs'

    if (options.single) {
      const filelist = files.map((file) => {
        const name = path.relative(src, file)
        const content = fs.readFileSync(file)
        const template: any = parseFile(content)
        try {
          const ctxTypes = generateContextTypes(template)
          template.directives = template.directives || {}
            ; (template.directives as any).contextTypes = ctxTypes
        } catch { }
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
        const desiredExt = options.typescript ? '.ts' : '.js'
        const outName =
          options.file && options.file.endsWith(desiredExt)
            ? options.file
            : `${options.file}${desiredExt}`
        // Ensure typedef for context present in CJS singlefile bundle for DX
        let header = ''
        if (!options.typescript && moduleFormat === 'cjs') {
          const withTypes = filelist.find(
            (f) => (f as any).template?.directives?.contextTypes,
          )
          const typedef: string | undefined =
            withTypes?.template?.directives?.contextTypes?.jsTypedef
          if (
            typedef &&
            typeof typedef === 'string' &&
            typedef.trim().length > 0
          ) {
            header = typedef + '\n'
          } else {
            header = '/**\n * @typedef {object} Template_Context\n */\n'
          }
        }
        writeFile(`${dest}/${outName}`, header + templateFile, options.minify)
      } else {
        templateFile.forEach((file) => {
          writeFile(`${dest}/${file.name}`, file.content, options.minify)
        })
      }
    } else {
      files.forEach((file) => {
        try {
          parseTemplate(
            file,
            src,
            dest,
            (
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
        } catch (err) {
          // Save error file when compilation fails
          const relativeName = path.relative(src, file) + (options.typescript ? '.ts' : '.js')
          const errPath = path.join(dest, relativeName.replace(/\.(ts|js)$/, '.err$&'))
          try {
            const content = fs.readFileSync(file)
            fs.writeFileSync(errPath, content)
            console.error(`Compilation error saved to: ${errPath}`)
          } catch (writeErr) {
            console.error(`Failed to save error file: ${writeErr}`)
          }
          throw err
        }
      })
      const indexFile = run(
        files.map((f) => {
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
        const desiredExt = options.typescript ? '.ts' : '.js'
        const outName =
          options.file && options.file.endsWith(desiredExt)
            ? options.file
            : `${options.file}${desiredExt}`
        writeFile(`${dest}/${outName}`, indexFile, options.minify)
      } else {
        indexFile.forEach((file) => {
          writeFile(`${dest}/${file.name}`, file.content, options.minify)
        })
      }
    }

    commit()
      .then((_) => callback())
      .catch((err) => callback(err))
  } catch (err) {
    callback(err)
  }
}
