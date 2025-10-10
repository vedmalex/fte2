const {
  TemplateFactoryStandalone: Factory,
} = require('../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js')
const templates = require('./dist/index.js')

const F = new Factory(templates)
console.log('SYNC:\n' + F.run({ name: 'world' }, 'pages/index.njs'))
