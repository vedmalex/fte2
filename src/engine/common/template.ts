import { merge } from './helpers';
import { TemplateFactoryBase } from './factory';
import { HashType, BlocksHash, BlockContent, HashTypeGeneric } from './interfaces';

export class TemplateBase {
  public parent: string;
  public blocks: BlocksHash;
  public aliases: HashTypeGeneric<string>;
  public alias: string;
  public dependency: HashTypeGeneric<boolean>;
  public absPath: string;
  public name: string;
  public srcCode: string;
  public script: (context: any, content: BlockContent, partial: (obj: HashType, name: string) => string) => string;
  public factory: TemplateFactoryBase;

  constructor(config) {
    if (!(this instanceof TemplateBase)) {
      throw new Error('constructor is not a function');
    }
    this.srcCode = config.source ? config.source.toString() : '';
    this.name = config.name;
    this.absPath = config.absPath;
    this.script = config.script;
    this.blocks = config.blocks;
    this.dependency = config.dependency;
    this.parent = config.parent ? config.parent.trim() : false;
    this.aliases = config.aliases || {};
    this.alias = config.alias || config.name;
    this.factory = config.factory;
    if (config.compile) {
      this.compile = config.compile;
    }
  }

  public mergeParent(src: TemplateBase) {
    if (src) {
      merge(src, this, 'blocks');
      merge(src, this, 'aliases');
    }
  }

  public compile() {
    throw new Error('abstract method call');
  };
}
