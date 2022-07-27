import fs from 'fs'
import { Parser } from '../dist/parser/parse.js'

//'/Users/vedmalex/work/fte.js/templates/MainTemplate.njs',
// '/Users/vedmalex/work/test/grainjs/apps/grainjs/generators/server/Meta.Thing/ext.grid-thing.List.njs',
// /Users/vedmalex/work/fte.js/demo/complexSample/views/template.nhtml
// /Users/vedmalex/work/fte.js/demo/chunks/raw/index.njs
// /Users/vedmalex/work/fte.js/templates/codeblock.njs
// template.txt
// /Users/vedmalex/work/fte.js/templates/MainTemplate.njs

const text = fs.readFileSync('/Users/vedmalex/work/fte.js/demo/template.nhtml')

// const result = parse(`  abc#{ array }of mutable`)
console.time('parse')
// const result = parse('console.log()\r\ndone()')
const result = Parser.parse(text.toString())
console.timeEnd('parse')

fs.writeFileSync('res.json', JSON.stringify(result, undefined, 2))
// console.log(result)
// console.log(result1)

//TODO: оформить парсер
//TODO: вынести процедуру определение indent в отдельный метод, чтобы дать возможность самим отработать и не терять в производительности
//TODO: сделать тесты для parser
