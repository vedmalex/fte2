import * as fs from 'fs-extra'
import * as prettier from 'prettier'
import * as path from 'path'
import { compileFull /*, compileLight*/ } from './node/compile'

const src = 'templates'
// сделать gulp
function load(fileName, folder, compile, optimize) {
  fs.ensureDirSync(folder)
  const fn = path.resolve(fileName)
  if (fs.existsSync(fn)) {
    const content = fs.readFileSync(fn)
    const result = compile(content, optimize)

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
  }
}

const files = fs.readdirSync(src)
if (files.length > 0) {
  let rec, stat, ext
  for (let i = 0, len = files.length; i < len; i++) {
    rec = path.join(src, files[i])
    stat = fs.statSync(rec)
    if (stat.isFile()) {
      ext = path.extname(rec)
      if (ext === '.nhtml' || ext === '.njs') {
        load(rec, src, compileFull, true)
      }
    }
  }
}
