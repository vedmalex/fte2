import { merge } from './helpers'
import { TemplateFactoryBase } from './factory'
import {
  BlocksHash,
  HashTypeGeneric,
  BlockRunFunction,
  TemplateConfig,
  DefaultFactoryOption,
} from './interfaces'

export class TemplateBase<T extends DefaultFactoryOption> {
  public parent: string
  public blocks: BlocksHash<T>
  public slots: BlocksHash<T>
  public aliases: HashTypeGeneric<string>
  public alias: Array<string>
  public dependency: HashTypeGeneric<boolean>
  public absPath: string
  public name: string
  public chunks: string
  public srcCode: string
  public script: BlockRunFunction<T>
  public factory: TemplateFactoryBase<T>

  constructor(config: TemplateConfig<T>) {
    if (!(this instanceof TemplateBase)) {
      throw new Error('constructor is not a function')
    }
    this.srcCode = config.source ? config.source.toString() : ''
    this.name = config.name
    this.absPath = config.absPath
    this.script = config.script
    this.blocks = config.blocks
    this.slots = config.slots
    this.dependency = config.dependency
    this.parent = config.parent ? config.parent.trim() : ''
    this.aliases = config.aliases || {}
    this.alias = config.alias || [config.name]
    this.factory = config.factory
    if (config.compile) {
      this.compile = config.compile
    }
  }

  public mergeParent(src: TemplateBase<T>) {
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
