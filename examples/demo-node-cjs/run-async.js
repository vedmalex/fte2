const { TemplateFactoryStandalone: F } = require('../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js')
const templates = require('./dist/index.js')

const f = new F(templates)
f.options = { ...f.options, promise: true }
;(async () => {
  const html = await f.runAsync({}, 'graphql.nhtml')
  console.log('ASYNC\n' + html)
})().catch(e => { console.error(e); process.exit(1) })
