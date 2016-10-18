declare var process: { browser: boolean, cwd: () => string };

import { TemplateBase } from './template';
import {
  HashType,
  BlockContent,
  HashTypeGeneric,
  PartialFunction,
  ContentFunction,
} from './../common/interfaces';

/**
 * template factory -- it instatntiate the templates
 */
export abstract class TemplateFactoryBase {
  public ext = [];
  public cache: HashTypeGeneric<TemplateBase>;
  public debug = false;
  public watch = false;
  // подумать нужно ли делать один общий для все список watchTree
  public watchTree = undefined;
  public root = undefined;

  constructor(config) {
    if (!(this instanceof TemplateFactoryBase)) {
      throw new Error('constructor is not a function');
    }
    if (!process.browser) {
      // this only need in serverside code with server load code
      this.root = config ? (config.root ? (Array.isArray(config.root) ? config.root : [config.root]) : [process.cwd()]) : [process.cwd()];
      this.debug = (config && config.debug) || false;
      this.watch = (config && config.watch);

      if (config && config.ext) {
        if (Array.isArray(config.ext)) {
          this.ext = config.ext;
        } else {
          this.ext = [config.ext];
        }
      }
      this.watchTree = {};
    }
    this.cache = {};
    if (config && config.preload) {
      this.preload();
    }
  }
  public register(tpl: TemplateBase, fileName?: string) {
    if (!(tpl.name in this.cache)) {
      this.cache[tpl.name] = tpl;
      if (tpl.alias && tpl.alias !== tpl.name) {
        this.cache[tpl.alias] = tpl;
      }
      this.cache[tpl.absPath] = tpl;
    }
    return tpl;
  }

  public ensure(fileName: string, absPath?: boolean): TemplateBase {
    if (!(fileName in this.cache)) {
      let template = this.load(fileName, absPath);
      if (this.watch) {
        this.checkChanges(template, fileName, absPath);
        let depList = Object.keys(template.dependency);
        for (let i = 0, len = depList.length; i < len; i++) {
          let templates = this.watchTree[this.cache[depList[i]].absPath].templates;
          templates[template.absPath] = template;
        }
      }
      return template;
    }
    return this.cache[fileName];
  }
  public blockContent(tpl: TemplateBase): BlockContent {
    let scripts = [];
    let self = this;
    return {
      partial: (obj: HashType, name: string): string => {
        if (tpl.aliases.hasOwnProperty(name)) {
          return self.run(obj, tpl.aliases[name], true);
        } else {
          return self.run(obj, name);
        }
      },
      content: (name: string, context: HashType, content: ContentFunction, partial: PartialFunction) => {
        if (name) {
          return tpl.blocks[name](context, content, partial);
        } else {
          let fn = scripts.pop();
          if (typeof fn === 'function') {
            return fn(context, content, partial);
          } else {
            return '';
          }
        }
      },
      run: (
        $context: HashType,
        $content: ContentFunction,
        $partial: PartialFunction): string => {
        function go(context, content, partial): string {
          let $this = this as TemplateBase;
          if ($this.parent) {
            let parent = self.ensure($this.parent);
            // tpl.mergeParent(parent); moved to compile.
            scripts.push($this.script);
            return go.call(parent, context, content, partial);
          } else {
            return $this.script(context, content, partial);
          }
        }
        return go.call(tpl, $context, $content, $partial);
      },
    };
  }

  public preload(fileName?: string) {
    throw new Error('abstract method call');
  }

  public checkChanges(template?: any, fileName?: any, absPath?: boolean) {
    throw new Error('abstract method call');
  }

  public load(fileName: string, absPath: boolean): TemplateBase {
    throw new Error('abstract method call');
  }

  public run(ctx: HashType, name: string, absPath?: boolean): string {
    throw new Error('abstract method call');
  }
};

// надо удалить так же все wather Зависимости обновляемого шаблона,
// в случае его удаления из кэша, и так же не испльзовать массиа, а
