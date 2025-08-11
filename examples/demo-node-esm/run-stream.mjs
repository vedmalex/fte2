import templates from './dist/index.js'
import { TemplateFactoryStandalone as Factory } from '../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js'
import { toNodeReadable } from '../../packages/fte.js-base/dist/index.js'

const F = new Factory(templates)
F.options = { ...F.options, stream: true, maxCoalesceChunkSize: 2048 }
const res = F.runStream({}, 'graphql.nhtml')
if (Symbol.asyncIterator in Object(res)) {
  console.log('STREAM\n')
  toNodeReadable(res).pipe(process.stdout)
} else {
  console.log('Template returned non-stream result (likely chunk array)')
}
