import * as fs from 'fs-extra'
import * as prettier from 'prettier'
import * as path from 'path'
import glob from 'glob'
import { compileFull /*, compileLight*/ } from './node/compile'

const src = 'templates'
// сделать gulp
function load(fileName, folder, compile) {
  fs.ensureDirSync(folder)
  const fn = path.resolve(fileName)
  if (fs.existsSync(fn)) {
    const content = fs.readFileSync(fn)
    const result = compile(content, { fileName, content })
    try {
      const prettified = prettier.format(result, {
        singleQuote: true,
        trailingComma: 'all',
        semi: false,
        arrowParens: 'always',
        bracketSpacing: true,
        jsxBracketSameLine: true,
        parser: 'typescript',
        proseWrap: 'never',
      })

      fs.writeFileSync(
        path.join(folder, path.basename(fileName) + '.js'),
        prettified,
      )
      // fs.writeFileSync(fn + '.err.js', result)
    } catch (err) {
      console.log(fn)
      fs.writeFileSync(fn + '.err.js', result)
      throw err
    }
  }
}

glob.sync('templates/codeblock.njs').forEach((file) => {
  console.log(file)
  load(file, src, compileFull)
})

glob.sync('templates/MainTemplate.njs').forEach((file) => {
  console.log(file)
  load(file, src, compileFull)
})

glob.sync('templates/compilationError.njs').forEach((file) => {
  console.log(file)
  load(file, src, compileFull)
})
glob.sync('templates/compiled.njs').forEach((file) => {
  console.log(file)
  load(file, src, compileFull)
})

glob.sync('templates/es6module.njs').forEach((file) => {
  console.log(file)
  load(file, src, compileFull)
})

glob.sync('templates/raw.njs').forEach((file) => {
  console.log(file)
  load(file, src, compileFull)
})

glob.sync('templates/test.njs').forEach((file) => {
  console.log(file)
  load(file, src, compileFull)
})
