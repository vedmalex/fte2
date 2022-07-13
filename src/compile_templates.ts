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
      })

      fs.writeFileSync(
        path.join(folder, path.basename(fileName) + '.js'),
        prettified,
      )
    } catch (err) {
      console.log(fn)
      fs.writeFileSync(fn + '.err.js', result)
      throw err
    }
  }
}

glob('templates/codeblock.njs', (err, files) => {
  if (err) {
    throw err
  } else {
    files.forEach((file) => {
      console.log(file)
      load(file, src, compileFull)
    })
  }
})
