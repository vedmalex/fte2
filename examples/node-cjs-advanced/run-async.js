const { TemplateFactoryStandalone: Factory } = require('../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js')
const templates = require('./dist/index.js')

const F = new Factory(templates)
F.options = { ...F.options, promise: true }
;(async () => {
  const html = await F.runAsync({ name: Promise.resolve('async') }, 'pages/index.njs')
  console.log('ASYNC:\n' + html)
})().catch(e => { console.error(e); process.exit(1) })
