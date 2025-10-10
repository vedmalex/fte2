const {
  TemplateFactoryStandalone: F,
} = require('../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js')
const { toNodeReadable } = require('../../packages/fte.js-base/dist')
const templates = require('./dist/index.js')

const f = new F(templates)
f.options = { ...f.options, stream: true, maxCoalesceChunkSize: 2048 }
;(async () => {
  const res = f.runStream({}, 'graphql.nhtml')
  if (Symbol.asyncIterator in Object(res)) {
    const readable = toNodeReadable(res)
    readable.pipe(process.stdout)
  } else {
    console.log('Template returned non-stream result (likely chunk array)')
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
