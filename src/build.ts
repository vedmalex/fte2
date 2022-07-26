import * as fs from 'fs-extra'
import * as path from 'path'
import glob from 'glob'
import { Parser } from './parser/parse'

import { writeFile, commit } from './filewriter'
import { TemplateFactory } from './node/factory'

const templateRoot = path.join(__dirname, './../templates')

export function compileFull(content: Buffer | string) {
  const compiled = Parser.parse(content)
  const F = new TemplateFactory({
    root: templateRoot,
  })
  return F.run({ context: compiled, name: 'compiled.njs' })
}

function parseTemplate(fileName, dest, compile) {
  const fn = path.resolve(fileName)
  if (fs.existsSync(fn)) {
    const content = fs.readFileSync(fn)
    const result = compile(content, { fileName, content })
    writeFile(path.join(dest, path.basename(fileName) + '.js'), result, {
      minify: true,
      format: true,
      pretty: true,
    })
  }
}

const dest = 'standalone/templates'
glob.sync('templates/*.njs').forEach((file) => {
  fs.ensureDirSync(dest)
  console.log(file)
  parseTemplate(file, dest, compileFull)
})

commit().then((_) => console.log('success'))
