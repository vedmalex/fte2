import { TemplateFactoryStandalone } from 'fte.js-standalone'
import templates from 'fte.js-templates'

export const F = new TemplateFactoryStandalone((templates as any).default || templates)
