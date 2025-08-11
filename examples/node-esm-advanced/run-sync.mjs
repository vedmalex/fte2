import templates from './dist/index.js'
import { TemplateFactoryStandalone as Factory } from '../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js'

const F = new Factory(templates)
console.log('SYNC:\n' + F.run({ name: 'world' }, 'pages/index.njs'))
