import templates from './dist/index.js'
import { TemplateFactoryStandalone as Factory } from '../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js'
import { toNodeReadable } from '../../packages/fte.js-base/dist/index.js'

const F = new Factory(templates)
F.options = { ...F.options, stream: true, maxCoalesceChunkSize: 1024, highWaterMark: 16 }
const it = F.runStream({ name: 'stream' }, 'pages/index.njs')
const readable = toNodeReadable(it)
console.log('STREAM:\n')
readable.pipe(process.stdout)
