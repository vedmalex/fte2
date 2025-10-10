global.browser = false

export * as Inferer from './inferer/type-infer'
export { Template } from './Template'
export { TemplateFactory as Factory } from './TemplateFactory'
export { fte } from './tag'
export type { BuildOptions } from './utils/build'
export { build } from './utils/build'
export { generateContextTypes } from './utils/contextTypes'
