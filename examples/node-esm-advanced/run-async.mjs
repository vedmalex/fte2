import templates from './dist/index.js'
import { TemplateFactoryStandalone as Factory } from '../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js'

const F = new Factory(templates)
F.options = { ...F.options, promise: true }
const html = await F.runAsync({ name: Promise.resolve('async') }, 'pages/index.njs')
console.log('ASYNC:\n' + html)
