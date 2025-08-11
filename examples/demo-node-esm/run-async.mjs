import templates from './dist/index.js'
import { TemplateFactoryStandalone as Factory } from '../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js'

const F = new Factory(templates)
F.options = { ...F.options, promise: true }
console.log('ASYNC\n' + (await F.runAsync({}, 'graphql.nhtml')))
