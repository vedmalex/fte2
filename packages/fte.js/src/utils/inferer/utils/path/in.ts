import { parse } from '@babel/parser'
import * as t from '@babel/types'
import traverse, { NodePath } from '@babel/traverse'
import { buildExpression } from './buildExpressionNext'
import fs from 'fs'
import { makeAST } from '../../types/makeAST'
// const code = `const r = /some./ig`
const code = `r = -a ?? param?.some[(1n +1 + m(new Date())) > 10? 10: true].name?.(m(/some!/ig),e.name(a+1, new Regex('some','ig')))['super name']?.nice((++a + -1 + b++) * c + {name: 1, ...{name: some, code: 10}}, [some, [,some,],...other, some.go(true), ()=>{return 1}, ()=>true]);`
// const code = `some.go(some.name, some.true).can(some.thing, some.name.thing).do(some.name.other)`
// const code = `some['name string'][10][i]`
// const code = `param?.some[true].name?.(m(/some!/ig),e.name())['super name']?.nice();`
// const code = `param.some[true].name(m(/some!/ig),e.name())['super name'].nice();`
// const code = `name(m.name())`
// const code = `name(m.name)`
// const code = `name(...n.some)`
// const code = `some[(1n +1 + m(new Date())) > 10? 10: true].name`

// const code = `some.more.name(m?.(/some!/ig),e.name())`
// const code = `some[name].other[(1n +1 + m(new Date())) > 10? 10: true].name(m?.(/some!/ig),e.name())`
// const code = `some.more.name`
// const code = `some().more(n+1).name`

// const code = `m(/some!/ig, name(10))`
// const resCode = {
//   type: 'File',
//   children: [
//     {
//       type: 'Identifier',
//       children: [],
//       value: 'name',
//     },
//     {
//       type: 'OptionalCallExpression',
//       children: [
//         {
//           type: 'Identifier',
//           children: [],
//           value: 'm',
//           optional: true,
//         },
//         {
//           type: 'OptionalCallExpression',
//           children: [
//             {
//               type: 'RegExpLiteral',
//               children: [],
//               value: '/some!/ig',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }

// const code = '(/some./ig, b=10)'
// const code = 'm?.run({name: 1})'
//

// const code = `const r = /some./ig`

const ast = parse(code)

function getExpressionStatement(): NodePath<t.Program> {
  let expression: NodePath<t.Program> | null = null
  traverse(ast, {
    Program(path) {
      expression = path
      path.stop()
    },
  })
  return expression!
}

const expression = getExpressionStatement()
if (!expression) throw new Error('no expression')
fs.writeFileSync('ast0.json', JSON.stringify(expression.node, null, 2))

const dot = buildExpression(ast)
fs.writeFileSync('ast.dot', dot.join(''))

const astExpression = makeAST(ast)

console.log(JSON.stringify(astExpression, null, 2))
fs.writeFileSync('astExpr.json', JSON.stringify(astExpression, null, 2))
