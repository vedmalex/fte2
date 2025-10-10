import type { TemplateFactoryBase } from './TemplateFactoryBase'
import type { BlockRunFunction } from './types/BlockRunFunction'
import type { BlocksHash } from './types/BlocksHash'
import type { DefaultFactoryOption } from './types/DefaultFactoryOption'
import type { HashTypeGeneric } from './types/HashTypeGeneric'
import type { TemplateConfig } from './types/TemplateConfig'
import { merge } from './utils/merge'

export class TemplateBase<
  OPTIONS extends DefaultFactoryOption = DefaultFactoryOption,
> {
  public parent?: string
  public blocks?: BlocksHash
  public slots?: BlocksHash
  public aliases: HashTypeGeneric<string>
  public alias: Array<string>
  public dependency?: HashTypeGeneric<boolean>
  public absPath?: string
  public name?: string
  public chunks!: string
  public srcCode: string
  public script!: BlockRunFunction
  public factory!: TemplateFactoryBase<OPTIONS>

  constructor(config: TemplateConfig<OPTIONS>) {
    if (!(this instanceof TemplateBase)) {
      throw new Error('constructor is not a function')
    }
    this.srcCode = config.source ? config.source.toString() : ''
    this.name = config.name
    this.absPath = config.absPath
    if (config.script) this.script = config.script
    this.blocks = config.blocks
    this.slots = config.slots
    this.dependency = config.dependency
    this.parent = config.parent ? config.parent.trim() : ''
    this.aliases = config.aliases || {}
    this.alias = config.alias || [config.name!]
    if (config.factory) this.factory = config.factory
    if (config.compile) {
      this.compile = config.compile
    }
  }

  public mergeParent(src: TemplateBase<OPTIONS>) {
    if (src) {
      merge(src, this, 'blocks')
      merge(src, this, 'aliases')
      merge(src, this, 'slots')
    }
  }

  public compile() {
    throw new Error('abstract method call')
  }
}
