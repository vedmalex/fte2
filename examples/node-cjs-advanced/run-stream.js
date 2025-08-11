const { TemplateFactoryStandalone: Factory } = require('../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js')
const { toNodeReadable } = require('../../packages/fte.js-base/dist')
const templates = require('./dist/index.js')

const F = new Factory(templates)
F.options = { ...F.options, stream: true, maxCoalesceChunkSize: 1024, highWaterMark: 16 }
;(async () => {
  const it = F.runStream({ name: 'stream' }, 'pages/index.njs')
  const readable = toNodeReadable(it)
  console.log('STREAM:\n')
  readable.pipe(process.stdout)
})().catch(e => { console.error(e); process.exit(1) })
