import { BlockRunFunction } from './BlockRunFunction'
import { DefaultFactoryOption } from './DefaultFactoryOption'
import { HashTypeGeneric } from './HashTypeGeneric'
import { TemplateFactoryBase } from '../TemplateFactoryBase'
import { BlocksHash } from './BlocksHash'

export type TemplateConfig<OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> = {
  source?: string
  name?: string
  absPath?: string
  parent?: string
  options?: Record<string, any>
  blocks?: BlocksHash
  slots?: BlocksHash
  aliases?: HashTypeGeneric<string>
  alias?: Array<string>
  dependency?: HashTypeGeneric<boolean>
  srcCode?: string
  script?: BlockRunFunction
  factory?: TemplateFactoryBase<OPTIONS>
  compile?: () => void
}
