var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/browser/index.ts
var browser_exports = {};
__export(browser_exports, {
  Factory: () => TemplateFactoryBrowser,
  Template: () => TemplateBrowser
});
module.exports = __toCommonJS(browser_exports);

// src/common/helpers.ts
var escapeExp = /[&<>"]/;
var escapeAmpExp = /&/g;
var escapeLtExp = /</g;
var escapeGtExp = />/g;
var escapeQuotExp = /"/g;
function escapeIt(text) {
  if (text == null) {
    return "";
  }
  var result = text.toString();
  if (!escapeExp.test(result)) {
    return result;
  }
  return result.replace(escapeAmpExp, "&amp;").replace(escapeLtExp, "&lt;").replace(escapeGtExp, "&gt;").replace(escapeQuotExp, "&quot;");
}
function applyDeindent(str, numChars) {
  if (!str)
    return str;
  let lines = Array.isArray(str) ? [...str] : String(str).split("\n");
  if (typeof numChars == "string") {
    numChars = numChars.length;
  }
  if (numChars != 0) {
    let i = 0;
    do {
      if (lines[i].trim().length !== 0)
        break;
      i += 1;
      if (i >= lines.length - 1)
        break;
    } while (true);
    if (i < lines.length) {
      numChars = lines[i].length - lines[i].trimStart().length;
    }
  }
  if (numChars > 0) {
    for (let i = 0; i < lines.length; i++) {
      let spaceCount = 0;
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] === " ") {
          spaceCount++;
        } else {
          break;
        }
      }
      if (spaceCount > 0) {
        if (spaceCount <= numChars) {
          lines[i] = lines[i].trimStart();
        } else {
          lines[i] = lines[i].substring(numChars);
        }
      }
    }
  }
  return Array.isArray(str) ? lines : lines.join("\n");
}
function applyIndent(str, _indent) {
  let lines = Array.isArray(str) ? [...str] : String(str).split("\n");
  var indent = "";
  if (typeof _indent == "number" && _indent > 0) {
    var res = "";
    for (var i = 0; i < _indent; i++) {
      res += " ";
    }
    indent = res;
  }
  if (typeof _indent == "string" && _indent.length > 0) {
    indent = _indent;
  }
  if (indent && lines) {
    let res2 = lines.map((s) => indent + s);
    return Array.isArray(str) ? res2 : res2.join("\n");
  } else {
    return lines;
  }
}
function merge(a, b, property) {
  let prop;
  const aProp = a[property];
  if (aProp !== void 0) {
    let bProp = b[property];
    if (bProp === void 0) {
      bProp = b[property] = {};
    }
    const propList = Object.keys(aProp);
    for (let i = 0, pLen = propList.length; i < pLen; i++) {
      prop = propList[i];
      if (!(prop in bProp)) {
        bProp[prop] = aProp[prop];
      }
    }
  }
}

// src/common/template.ts
var TemplateBase = class {
  constructor(config) {
    if (!(this instanceof TemplateBase)) {
      throw new Error("constructor is not a function");
    }
    this.srcCode = config.source ? config.source.toString() : "";
    this.name = config.name;
    this.absPath = config.absPath;
    this.script = config.script;
    this.blocks = config.blocks;
    this.slots = config.slots;
    this.dependency = config.dependency;
    this.parent = config.parent ? config.parent.trim() : "";
    this.aliases = config.aliases || {};
    this.alias = config.alias || [config.name];
    this.factory = config.factory;
    if (config.compile) {
      this.compile = config.compile;
    }
  }
  mergeParent(src) {
    if (src) {
      merge(src, this, "blocks");
      merge(src, this, "aliases");
      merge(src, this, "slots");
    }
  }
  compile() {
    throw new Error("abstract method call");
  }
};

// src/browser/template.ts
var TemplateBrowser = class extends TemplateBase {
  compile() {
    if (this.parent) {
      this.mergeParent(this.factory.ensure(this.parent));
    }
  }
};

// src/common/factory.ts
var DefaultFactoryOptions = {
  applyIndent,
  escapeIt,
  applyDeindent
};
var TemplateFactoryBase = class {
  constructor(config = {}) {
    this.ext = [];
    this.root = void 0;
    this.watch = false;
    config.options = { ...config.options, ...DefaultFactoryOptions };
    this.options = config.options;
    this.watch = config && config.watch;
    if (!process.browser) {
      this.root = config ? config.root ? Array.isArray(config.root) ? config.root : [config.root] : [process.cwd()] : [process.cwd()];
      if (config && config.ext) {
        if (Array.isArray(config.ext)) {
          this.ext = config.ext;
        } else {
          this.ext = [config.ext];
        }
      }
    }
    this.cache = {};
    if (config && config.preload) {
      this.preload();
    }
  }
  register(tpl, fileName) {
    if (!(tpl.name in this.cache)) {
      this.cache[tpl.name] = tpl;
      if (tpl.alias && Array.isArray(tpl.alias)) {
        tpl.alias.filter((a) => a !== tpl.name).forEach((a) => {
          this.cache[a] = tpl;
        });
      }
      this.cache[tpl.absPath] = tpl;
    }
    return tpl;
  }
  ensure(fileName, absPath) {
    if (!(fileName in this.cache)) {
      return this.load(fileName, absPath);
    }
    return this.cache[fileName];
  }
  blockContent(tpl, slots) {
    const scripts = [];
    const self = this;
    const bc = {
      slots: slots ? slots : {},
      slot(name, content) {
        if (name) {
          if (!this.slots.hasOwnProperty(name)) {
            this.slots[name] = [];
          }
          if (content) {
            if (Array.isArray(content)) {
              content.forEach((c) => this.slot(name, c));
            } else {
              if (this.slots[name].indexOf(content) === -1) {
                this.slots[name].push(content);
              }
            }
          } else {
            return `#{partial(context['${name}'] || [], '${name}')}`;
          }
        }
      },
      partial(obj, name) {
        if (tpl.aliases.hasOwnProperty(name)) {
          return self.runPartial({
            context: obj,
            name: tpl.aliases[name],
            absPath: true,
            slots: this.slots,
            options: this.options
          });
        } else {
          return self.runPartial({
            context: obj,
            name,
            absPath: false,
            slots: this.slots,
            options: this.options
          });
        }
      },
      content(name, context, content, partial, slot) {
        if (name) {
          return tpl.blocks && tpl.blocks.hasOwnProperty(name) ? tpl.blocks[name](context, content, partial, slot, self.options) : "";
        } else {
          const fn = scripts.pop();
          if (typeof fn === "function") {
            return fn(context, content, partial, slot, self.options);
          } else {
            return "";
          }
        }
      },
      run($context, $content, $partial) {
        function go(context, content, partial, slot) {
          const $this = this;
          if ($this.parent) {
            const parent = self.ensure($this.parent);
            scripts.push($this.script);
            return go.call(parent, context, content, partial, slot);
          } else {
            try {
              return $this.script(context, content, partial, slot, self.options);
            } catch (e) {
              throw new Error(
                `template ${$this.name} failed to execute with error
                  '${e.message}
                  ${e.stack}'`
              );
            }
          }
        }
        return go.call(tpl, $context, $content, $partial, this.slot);
      }
    };
    bc.content = bc.content.bind(bc);
    bc.partial = bc.partial.bind(bc);
    bc.run = bc.run.bind(bc);
    bc.slot = bc.slot.bind(bc);
    return bc;
  }
  preload(fileName) {
    throw new Error("abstract method call");
  }
  load(fileName, absPath) {
    throw new Error("abstract method call");
  }
  run(context, name) {
    throw new Error("abstract method call");
  }
  runPartial({
    context,
    name,
    absPath,
    options,
    slots
  }) {
    throw new Error("abstract method call");
  }
};

// src/browser/factory.ts
var TemplateFactoryBrowser = class extends TemplateFactoryBase {
  resolveTemplateConfig(fileName) {
    const result = global.fte(fileName);
    result.factory = this;
    result.name = fileName;
    return result;
  }
  load(fileName, absPath) {
    const template = this.resolveTemplateConfig(fileName);
    const templ = new TemplateBrowser(template);
    this.register(templ, fileName);
    templ.compile();
    return templ;
  }
  run(context, name) {
    const templ = this.ensure(name);
    const bc = this.blockContent(templ);
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options);
  }
  runPartial({
    context,
    name,
    absPath,
    options,
    slots
  }) {
    const templ = this.ensure(name);
    if (!templ.chunks) {
      const bc = this.blockContent(templ, slots);
      return bc.run(
        context,
        bc.content,
        bc.partial,
        bc.slot,
        this.options
      );
    } else {
      throw new Error("cant't use template with chunks as partial");
    }
  }
};
