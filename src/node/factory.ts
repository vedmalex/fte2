import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import { Template } from './template';
import { TemplateFactoryBase } from './../common/factory';
import { safeEval } from './helpers';
import { HashType, SlotsHash } from './../common/interfaces';
import { Factory } from '../browser';

export class TemplateFactory extends TemplateFactoryBase {
  public load(fileName: string, absPath?: boolean) {
    let root;
    for (let i = 0, len = this.root.length; i < len; i++) {
      root = this.root[i];
      let fn = absPath
        ? path.resolve(fileName)
        : path.resolve(path.join(root, fileName));
      if (fs.existsSync(fn + '.js')) {
        let result;
        // if (this.debug) {
        // 	result = require(fn + '.js');
        // } else {
        let storedScript = fs.readFileSync(fn + '.js');
        result = safeEval(storedScript.toString());
        // }
        if (result instanceof Function) {
          result = { script: result, compile: new Function() };
        }
        result.absPath = fn;
        result.name = fileName;
        result.factory = this;
        let templ = new Template(result);
        this.register(templ, fileName);
        templ.compile();
        return templ;
      } else if (fs.existsSync(fn)) {
        let content = fs.readFileSync(fn);
        let tpl = new Template({
          source: content.toString(),
          name: fileName,
          absPath: fn,
          factory: this,
        });
        let hasException = true;
        try {
          tpl.compile();
          hasException = false;
        } finally {
          if (!hasException) {
            return this.register(new Template(tpl), fileName);
          }
        }
      }
    }
    throw new Error(`template ${fileName} not found (absPath= ${absPath} )`);
  }

  public preload() {
    let files = [];
    for (let i = 0, rLen = this.root.length; i < rLen; i++) {
      for (let j = 0, eLen = this.ext.length; j < eLen; j++) {
        files = files.concat(
          glob.sync('*.' + this.ext[j], {
            root: this.root[i],
            cwd: this.root[i],
            matchBase: true,
          }),
        );
      }
    }
    for (let i = 0, len = files.length; i < len; i++) {
      this.load(files[i]);
    }
  }

  // создает шаблон из текста
  public create(source: string, name?: string) {
    if (!name) {
      name = 'freegenerated' + Math.random().toString() + '.js';
    }
    const tpl = this.standalone(source);
    tpl.name = name;
    tpl.absPath = name;
    this.register(tpl);
    return name;
  }

  public standalone(source: string) {
    let tpl = new Template({
      source: source,
      factory: this,
    });
    return tpl.compile();
  }

  public run(
    context: HashType,
    name: string,
    absPath?: boolean,
  ): string | object[] {
    let templ = this.ensure(name, absPath);
    let bc = this.blockContent(templ, {});
    const result = bc.run(context, bc.content, bc.partial, bc.slot);
    if (Object.keys(bc.slots).length > 0) {
      if (Array.isArray(result)) {
        return result.map(r => {
          let tpl = this.standalone(r.content);
          const content = tpl.script(bc.slots, bc.content, bc.partial, bc.slot);
          return {
            name: r.name,
            content,
          };
        });
      } else {
        const res = this.standalone(result);
        return res.script(bc.slots, bc.content, bc.partial, bc.slot);
      }
    } else {
      return result;
    }
  }

  public runPartial(
    context: HashType,
    name: string,
    absPath?: boolean,
    slots?: SlotsHash,
  ): string {
    let templ = this.ensure(name, absPath);
    let bc = this.blockContent(templ, slots);
    return bc.run(context, bc.content, bc.partial, bc.slot);
  }

  public blocksToFiles(
    context: HashType,
    name: string,
    absPath?: boolean,
  ): { file: string; content: string }[] {
    let templ = this.ensure(name, absPath);
    let bc = this.blockContent(templ);
    return Object.keys(templ.blocks).map(curr => ({
      file: curr,
      content: bc.content(curr, context, bc.content, bc.partial, bc.slot),
    }));
  }

  public express() {
    let self = this;
    return function(fileName, context, callback) {
      let templ = self.ensure(fileName, true);
      let bc = self.blockContent(templ);
      let result, err;
      try {
        result = bc.run(context, bc.content, bc.partial, bc.slot);
      } catch (e) {
        err = e;
      } finally {
        callback(err, result);
      }
    };
  }

  public clearCache(fn, list) {
    for (let i = 0, keys = Object.keys(list), len = keys.length; i < len; i++) {
      delete this.cache[list[keys[i]].name];
      delete this.cache[list[keys[i]].absPath];
    }
  }

  public checkChanges(template, fileName: string, absPath: boolean) {
    let root;
    for (let i = 0, len = this.root.length; i < len; i++) {
      root = this.root[i];
      let fn = absPath
        ? path.resolve(fileName)
        : path.resolve(path.join(root, fileName));
      let fw = undefined;
      if (fs.existsSync(fn + '.js')) {
        fw = fn + '.js';
      } else if (fs.existsSync(fn)) {
        fw = fn;
      }
      if (fw) {
        if (!this.watchTree[fw]) {
          let templates: HashType = {};
          templates[template.absPath] = template;
          templates[template.name] = template;
          this.watchTree[fw] = {
            watcher: fs.watch(fw, { persistent: false }, (event, filename) => {
              if (event === 'change') {
                let list = this.watchTree[fw].templates;
                this.clearCache(fw, list);
              } else {
                this.watchTree[fw].close();
                delete this.watchTree[fw];
              }
            }),
            templates: templates,
          };
        }
        break;
      }
    }
  }
}
