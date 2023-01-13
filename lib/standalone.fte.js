var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/detect-indent/index.js
var require_detect_indent = __commonJS({
  "node_modules/detect-indent/index.js"(exports, module2) {
    "use strict";
    var INDENT_REGEX = /^(?:( )+|\t+)/;
    var INDENT_TYPE_SPACE = "space";
    var INDENT_TYPE_TAB = "tab";
    function makeIndentsMap(string, ignoreSingleSpaces) {
      const indents = /* @__PURE__ */ new Map();
      let previousSize = 0;
      let previousIndentType;
      let key;
      for (const line of string.split(/\n/g)) {
        if (!line) {
          continue;
        }
        let indent;
        let indentType;
        let weight;
        let entry;
        const matches = line.match(INDENT_REGEX);
        if (matches === null) {
          previousSize = 0;
          previousIndentType = "";
        } else {
          indent = matches[0].length;
          if (matches[1]) {
            indentType = INDENT_TYPE_SPACE;
          } else {
            indentType = INDENT_TYPE_TAB;
          }
          if (ignoreSingleSpaces && indentType === INDENT_TYPE_SPACE && indent === 1) {
            continue;
          }
          if (indentType !== previousIndentType) {
            previousSize = 0;
          }
          previousIndentType = indentType;
          weight = 0;
          const indentDifference = indent - previousSize;
          previousSize = indent;
          if (indentDifference === 0) {
            weight++;
          } else {
            const absoluteIndentDifference = indentDifference > 0 ? indentDifference : -indentDifference;
            key = encodeIndentsKey(indentType, absoluteIndentDifference);
          }
          entry = indents.get(key);
          if (entry === void 0) {
            entry = [1, 0];
          } else {
            entry = [++entry[0], entry[1] + weight];
          }
          indents.set(key, entry);
        }
      }
      return indents;
    }
    function encodeIndentsKey(indentType, indentAmount) {
      const typeCharacter = indentType === INDENT_TYPE_SPACE ? "s" : "t";
      return typeCharacter + String(indentAmount);
    }
    function decodeIndentsKey(indentsKey) {
      const keyHasTypeSpace = indentsKey[0] === "s";
      const type = keyHasTypeSpace ? INDENT_TYPE_SPACE : INDENT_TYPE_TAB;
      const amount = Number(indentsKey.slice(1));
      return { type, amount };
    }
    function getMostUsedKey(indents) {
      let result;
      let maxUsed = 0;
      let maxWeight = 0;
      for (const [key, [usedCount, weight]] of indents) {
        if (usedCount > maxUsed || usedCount === maxUsed && weight > maxWeight) {
          maxUsed = usedCount;
          maxWeight = weight;
          result = key;
        }
      }
      return result;
    }
    function makeIndentString(type, amount) {
      const indentCharacter = type === INDENT_TYPE_SPACE ? " " : "	";
      return indentCharacter.repeat(amount);
    }
    module2.exports = (string) => {
      if (typeof string !== "string") {
        throw new TypeError("Expected a string");
      }
      let indents = makeIndentsMap(string, true);
      if (indents.size === 0) {
        indents = makeIndentsMap(string, false);
      }
      const keyOfMostUsedIndent = getMostUsedKey(indents);
      let type;
      let amount = 0;
      let indent = "";
      if (keyOfMostUsedIndent !== void 0) {
        ({ type, amount } = decodeIndentsKey(keyOfMostUsedIndent));
        indent = makeIndentString(type, amount);
      }
      return {
        amount,
        type,
        indent
      };
    };
  }
});

// src/standalone/index.ts
var standalone_exports = {};
__export(standalone_exports, {
  Factory: () => TemplateFactoryStandalone,
  Parser: () => Parser,
  Template: () => TemplateBrowser,
  compileFull: () => compileFull,
  compileLight: () => compileLight,
  compileTs: () => compileTs,
  parseFile: () => parseFile,
  run: () => run
});
module.exports = __toCommonJS(standalone_exports);

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
function applyIndent(_str, _indent) {
  var str = String(_str);
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
  if (indent && str) {
    return str.split("\n").map((s) => indent + s).join("\n");
  } else {
    return str;
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

// src/standalone/template.ts
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
  escapeIt
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

// src/standalone/factory.ts
var TemplateFactoryStandalone = class extends TemplateFactoryBase {
  constructor(templates2) {
    super();
    this.templates = templates2;
    this.preload();
  }
  resolveTemplateConfig(fileName) {
    const result = this.templates[fileName];
    if (result) {
      result.factory = this;
      result.name = fileName;
      return result;
    } else {
      throw new Error(`template ${fileName} not found`);
    }
  }
  load(fileName) {
    const template = this.resolveTemplateConfig(fileName);
    const templ = new TemplateBrowser(template);
    this.register(templ, fileName);
    templ.compile();
    return templ;
  }
  preload() {
    Object.keys(this.templates).forEach((t) => this.load(t));
  }
  run(context, name) {
    const templ = this.ensure(name);
    const bc = this.blockContent(templ);
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options);
  }
  runPartial({
    context,
    name,
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

// src/parser/parse.ts
var import_detect_indent = __toESM(require_detect_indent());
var globalStates = {
  /*
  has chunks
  has slots
  has blocks
  has ?? все что угодно можно получить просто анализируя соответствующий контент, и выставлять значения в соответствующий блок
  в некоторых директивах не будет нужны
  можно автоматически определять, просто анализируя текст
  */
  text: {
    // обратный порядок для ускорения цикла
    states: [
      "unknown",
      "expression",
      "uexpression",
      "code",
      "directive",
      "slotStart",
      "blockStart",
      "blockEnd",
      "comments"
    ]
  },
  unknown: {
    start: ["<%", "<%=", "<%-", "<%_", "<%#"],
    end: ["%>", "-%>", "_%>"],
    skip: {
      start: ["<%%"],
      end: ["%%>"]
    },
    type: {
      "<%": "code",
      "<%=": "uexpression",
      "<%-": "expression",
      "<%#": "comments",
      "<%_": "code"
    }
  },
  expression: {
    start: ["#{"],
    end: ["}"],
    curly: 1
  },
  uexpression: {
    start: ["!{"],
    end: ["}"],
    curly: 1
  },
  code: {
    start: ["<#", "<#-"],
    end: ["#>", "-#>"],
    skip: {
      start: ["<#@", "<# block", "<# slot", "<# end #>", "<#{"]
    }
  },
  directive: {
    start: ["<#@"],
    end: ["#>", "-#>"]
  },
  comments: {
    start: ["<*"],
    end: ["*>"]
  },
  blockStart: {
    start: ["<# block", "<#- block"],
    end: [": #>", ": -#>"]
  },
  slotStart: {
    start: ["<# slot", "<#- slot"],
    end: [": #>", ": -#>"]
  },
  blockEnd: {
    start: ["<# end #>", "<#- end #>", "<# end -#>", "<#- end -#>"]
  }
};
var directives = [
  "extend",
  "context",
  "alias",
  "chunks",
  "includeMainChunk",
  "useHash",
  "noContent",
  "noSlots",
  "noBlocks",
  "noPartial",
  "noOptions",
  "promise",
  "callback",
  "requireAs"
];
function detectDirective(input) {
  let name;
  let params;
  if (input) {
    input = input.trim();
    for (let i = 0; i < directives.length; i += 1) {
      const directive = directives[i];
      if (SUB(input.trim(), directive) == directive) {
        name = directive;
        params = UNPARAM(input.slice(directive.length));
        break;
      }
    }
  }
  return {
    name: name ? name : input,
    params
  };
}
var CodeBlockDirectives = class {
  constructor() {
    this.context = "context";
    this.content = true;
    this.slots = true;
    this.blocks = true;
    this.partial = true;
    this.options = true;
    this.requireAs = [];
  }
  push(init) {
    const { name, params } = detectDirective(init.data.trim());
    switch (name) {
      case "extend":
        this.extend = params[0];
        break;
      case "context":
        this.context = params[0];
        break;
      case "alias":
        this.alias = params;
        break;
      case "chunks":
        this.chunks = params[0];
        break;
      case "includeMainChunk":
        this.includeMainChunk = true;
        break;
      case "useHash":
        this.useHash = true;
        break;
      case "noContent":
        this.content = false;
        break;
      case "noSlots":
        this.slots = false;
        break;
      case "noBlocks":
        this.blocks = false;
        break;
      case "noPartial":
        this.partial = false;
        break;
      case "noOptions":
        this.options = false;
        break;
      case "promise":
        this.promise = true;
        break;
      case "callback":
        this.callback = true;
        break;
      case "requireAs":
        this.requireAs.push({ name: params[0], alias: params[1] });
        break;
      default:
    }
  }
};
var CodeBlock = class {
  constructor(init) {
    this.main = [];
    // сделать все необходимые проверки для более чистого кода
    //
    this.directives = new CodeBlockDirectives();
    this.documentation = [];
    this.slots = {};
    this.blocks = {};
    if (init) {
      this.name = UNQUOTE(init.data);
    }
  }
  addBlock(block) {
    this.directives.blocks = true;
    this.blocks[block.name] = block;
  }
  addSlot(slot) {
    this.directives.slots = true;
    this.blocks[slot.name] = slot;
  }
};
var UNQUOTE = (str) => {
  if (str) {
    let res = str.trim();
    res = res.match(/['"`]([^`'"].*)[`'"]/)?.[1] ?? res;
    return res;
  } else {
    return "";
  }
};
var UNPARAM = (str) => {
  if (str) {
    let res = str?.trim();
    res = res.match(/\(?([^\)].*\))/)?.[1] ?? res;
    return res.split(",").map(UNQUOTE);
  } else {
    return [];
  }
};
var _Parser = class {
  constructor(value, options) {
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.curlyAware = 0;
    this.curlyBalance = [];
    this.result = [];
    if (options.indent) {
      this.INDENT = typeof options.indent === "string" ? options.indent.length : options.indent;
    }
    this.globalState = _Parser.INITIAL_STATE;
    this.buffer = value.toString();
    this.size = this.buffer.length;
  }
  static parse(text, options = {}) {
    const parser = new _Parser(
      typeof text == "string" ? text : text.toString(),
      options
    );
    parser.parse();
    return parser.process();
  }
  collect() {
    const { term, eol } = this.SYMBOL();
    if (eol) {
      this.globalToken.eol = true;
      this.term();
    } else {
      this.globalToken.data += term;
    }
  }
  run(currentState) {
    const init_pos = this.pos;
    const state = globalStates[currentState];
    this.curlyAware = state.curly;
    if (state.start) {
      if (state.skip?.start) {
        for (let i = 0; i < state.skip.start.length; i += 1) {
          if (this.SUB(state.skip.start[i]) == state.skip.start[i]) {
            return false;
          }
        }
      }
      let foundStart = false;
      let foundEnd = false;
      for (let i = state.start.length - 1; i >= 0; i -= 1) {
        const p = state.start[i];
        const subs = this.SUB(p).toLowerCase();
        if (subs == p) {
          foundStart = true;
          this.globalState = currentState;
          this.actualState = state.type?.[p] ?? currentState;
          this.term({ start: p });
          this.SKIP(p);
          break;
        }
      }
      if (foundStart)
        do {
          if (state.end) {
            let i;
            for (i = state.end.length - 1; i >= 0; i -= 1) {
              const p = state.end[i];
              if (state.curly == 1 && p.indexOf("}") > -1) {
                if (this.curlyBalance.length > 0) {
                  break;
                }
              }
              if (state.curly == 2 && p.indexOf("}}") > -1) {
                if (this.curlyBalance.length > 0) {
                  break;
                }
              }
              const subs = this.SUB(p).toLowerCase();
              if (subs == p) {
                this.SKIP(p);
                foundEnd = true;
                break;
              }
            }
            if (!foundEnd) {
              this.collect();
            } else {
              this.globalToken.end = state.end[i];
              this.actualState = null;
            }
          } else {
            foundEnd = true;
          }
        } while (!foundEnd && this.pos < this.size);
    } else if (state.states) {
      let found = false;
      for (let i = state.states.length - 1; i >= 0; i -= 1) {
        const name = state.states[i];
        found = this.run(name);
        if (found) {
          this.globalState = currentState;
          this.actualState = null;
          this.term();
          break;
        }
      }
      if (!found) {
        this.collect();
      }
    }
    return init_pos != this.pos;
  }
  parse() {
    if (this.size > 0) {
      this.term();
      do {
        this.run(this.globalState);
      } while (this.pos < this.size);
      this.term();
    }
  }
  process() {
    const content = new CodeBlock();
    const resultSize = this.result.length;
    let curr = content;
    let state = null;
    for (let i = 0; i < resultSize; i += 1) {
      let r = this.result[i];
      let { type, pos, line, column, start, end, data, eol } = r;
      const trimStartLines = (lines) => {
        do {
          if (curr.main.length > 0) {
            let prev = curr.main[curr.main.length - 1];
            if (prev?.type == "text") {
              prev.content = prev.content.trimEnd();
              if (!prev.content) {
                curr.main.pop();
                if (lines) {
                  lines -= 1;
                  if (!lines) {
                    break;
                  }
                }
              } else {
                prev.eol = false;
                break;
              }
            } else {
              break;
            }
          } else {
            break;
          }
        } while (true);
      };
      const trimEndLines = (lines) => {
        let nextline = 0;
        do {
          nextline += 1;
          if (i + nextline < resultSize) {
            let next = this.result[i + nextline];
            if (next.type == "text") {
              next.data = next.data.trimStart();
              if (!next.data) {
                next.type = "skip";
                if (lines) {
                  lines -= 1;
                  if (!lines) {
                    break;
                  }
                }
              } else {
                next.eol = false;
                break;
              }
            } else {
              break;
            }
          } else {
            break;
          }
        } while (true);
      };
      const trimStartSpases = () => {
        if (curr.main.length > 0) {
          let prev = curr.main[curr.main.length - 1];
          if (prev.type == "text") {
            prev.content = prev.content.replaceAll(" ", "");
            if (!prev.content) {
              curr.main.pop();
            }
          }
        }
      };
      const trimEndSpaces = () => {
        if (i + 1 < resultSize) {
          let next = this.result[i + 1];
          if (next.type == "text") {
            next.data = next.data.replaceAll(" ", "");
            if (!next.data) {
              next.type = "skip";
            }
          }
        }
      };
      if (curr.main.length > 0) {
        let prev = curr.main[curr.main.length - 1];
        if (prev.line != line) {
          curr.main[curr.main.length - 1].eol = true;
        } else {
          curr.main[curr.main.length - 1].eol = false;
        }
      }
      switch (type) {
        case "directive":
          state = "directive";
          trimStartLines();
          trimEndLines();
          curr.directives.push(r);
          break;
        case "blockStart":
          state = "blockStart";
          trimStartLines();
          trimEndLines();
          curr = new CodeBlock(r);
          content.addBlock(curr);
          break;
        case "slotStart":
          state = "slotStart";
          trimStartLines();
          trimEndLines();
          curr = new CodeBlock(r);
          content.addSlot(curr);
          break;
        case "blockEnd":
          state = "blockEnd";
          trimStartLines();
          curr = content;
          trimEndLines();
          break;
        case "unknown":
          let actual_type;
          switch (r.start) {
            case "<%":
              actual_type = "code";
              break;
            case "<%_":
              actual_type = "code";
              trimStartSpases();
              break;
            case "<%-":
              actual_type = "expression";
              break;
            case "<%=":
              actual_type = "uexpression";
              break;
            case "<%#":
              actual_type = "comments";
              break;
          }
          switch (r.end) {
            case "-%>":
              trimEndLines(1);
              break;
            case "_%>":
              trimEndSpaces();
              break;
          }
          if (data) {
            if (actual_type !== "comments") {
              curr.main.push({
                content: data,
                pos,
                line,
                column,
                start,
                end,
                type: actual_type,
                eol
              });
            } else {
              curr.documentation.push({
                content: data,
                pos,
                line,
                column,
                start,
                end,
                type: actual_type,
                eol
              });
            }
          }
          break;
        case "code":
          if (start == "<#-") {
            trimStartLines();
          }
          if (end == "-#>") {
            trimEndLines();
          }
          if (data) {
            state = "code";
            curr.main.push({
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type,
              eol
            });
          }
          break;
        case "expression":
        case "expression2":
          if (data) {
            const current = {
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type: "expression",
              eol
            };
            const prev = curr.main.pop();
            if (prev?.type !== "text" || prev?.type === "text" && prev?.content.trim().length > 0 || prev?.type === "text" && prev?.eol) {
              curr.main.push(prev);
            } else {
              current.indent = prev.content;
            }
            curr.main.push(current);
          }
          break;
        case "uexpression":
        case "uexpression2":
          if (data) {
            const current = {
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type: "uexpression",
              eol
            };
            const prev = curr.main.pop();
            if (prev?.type !== "text" || prev?.type === "text" && prev?.eol) {
              curr.main.push(prev);
            } else {
              current.indent = prev.content;
            }
            curr.main.push(current);
          }
          break;
        case "text": {
          state = null;
          let actualType = data || eol ? type : "empty";
          if (actualType !== "empty") {
            curr.main.push({
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type: actualType,
              eol
            });
          }
          break;
        }
        case "comments":
          trimStartLines();
          trimEndLines();
          if (data) {
            curr.documentation.push({
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type,
              eol
            });
          }
          break;
      }
    }
    return content;
  }
  SYMBOL() {
    const res = this.buffer[this.pos];
    if (this.curlyAware == 1) {
      if (~res.indexOf("{")) {
        this.curlyBalance.push(this.pos);
      } else if (~res.indexOf("}")) {
        this.curlyBalance.pop();
      }
    }
    if (this.curlyAware == 2) {
      if (~res.indexOf("{{")) {
        this.curlyBalance.push(this.pos);
      } else if (~res.indexOf("}}")) {
        this.curlyBalance.pop();
      }
    }
    return this.SKIP(res);
  }
  DETECT_INDENT() {
    const { buffer } = this;
    const indent = (0, import_detect_indent.default)(buffer).indent;
    if (~indent.indexOf("	")) {
      this.INDENT = _Parser.DEFAULT_TAB_SIZE;
    } else {
      this.INDENT = indent.length;
    }
  }
  SKIP(term) {
    const { INDENT } = this;
    let eol = false;
    if (term.length == 1) {
      if (term == "\n" || term == "\r" || term == "\u2028" || term == "\u2029") {
        if (term == "\r" && this.SUB("\r\n") == "\r\n") {
          term = "\r\n";
        }
        this.column = 1;
        this.line += 1;
        eol = true;
      } else if (term == "	") {
        if (!INDENT)
          this.DETECT_INDENT();
        this.column += this.INDENT;
      } else {
        this.column += 1;
      }
      this.pos += term.length;
    } else {
      const startPos = this.pos;
      let nTerm = "";
      do {
        nTerm += this.SKIP(this.buffer[this.pos]);
      } while (this.pos < startPos + term.length);
      term = nTerm;
    }
    return { term, eol };
  }
  block(extra = {}) {
    const { pos, line, column, globalState, actualState } = this;
    return {
      data: "",
      pos,
      line,
      column,
      type: actualState || globalState,
      ...extra
    };
  }
  SUB(str) {
    const { pos, size, buffer } = this;
    return SUB(buffer, str, pos, size);
  }
  term(extra = {}) {
    this.globalToken = this.block(extra);
    this.result.push(this.globalToken);
  }
};
var Parser = _Parser;
Parser.INITIAL_STATE = "text";
Parser.DEFAULT_TAB_SIZE = 2;
function SUB(buffer, str, pos = 0, size = 0) {
  if (!size) {
    size = buffer.length;
  }
  const len = str.length;
  const from = pos;
  const to = pos + len;
  if (to <= size) {
    let res = "";
    for (let i = from; i < to; i += 1) {
      res += buffer[i];
    }
    return res;
  } else {
    return "";
  }
}

// src/templates/codeblock.njs.ts
var codeblock_njs_default = {
  alias: ["codeblock.njs"],
  script: function(blockList, _content, partial, slot, options) {
    var out = [];
    var textQuote = false;
    blockList = blockList.filter((block2) => block2);
    for (var i = 0, len = blockList.length; i < len; i++) {
      var last = i === blockList.length - 1;
      var block = blockList[i];
      var next = i + 1 < len ? blockList[i + 1] : null;
      var cont = block?.content;
      switch (block.type) {
        case "text":
          {
            let res = "";
            if (!textQuote) {
              textQuote = true;
              res = "out.push(";
            } else {
              let lasItem = out.pop();
              res = lasItem + " + ";
            }
            if (!block.eol) {
              res += JSON.stringify(cont);
            } else {
              res += JSON.stringify(cont + "\n");
              res += ");" + (last ? "" : "\n");
              textQuote = false;
            }
            out.push(res);
          }
          break;
        case "uexpression":
          {
            let res = "";
            if (!textQuote) {
              textQuote = true;
              res = "out.push(";
            } else {
              let lasItem = out.pop();
              res = lasItem + " + ";
            }
            let lcont = "options.escapeIt(" + cont + ")";
            if (block.indent) {
              lcont = "options.applyIndent(" + lcont + ", '" + block.indent + "')";
            }
            if (block.start && block.end) {
              res += "(" + lcont + ")";
            } else if (block.start) {
              res += "(" + lcont;
            } else if (block.end) {
              res += lcont + ")";
            } else {
              res += lcont;
            }
            if (!block.eol) {
              out.push(res);
            } else {
              out.push(res + ");" + (last ? "" : "\n"));
              textQuote = false;
            }
          }
          break;
        case "expression":
          {
            let res = "";
            if (!textQuote) {
              textQuote = true;
              res = "out.push(";
            } else {
              if (block.start) {
                let lasItem = out.pop();
                res = lasItem + " + ";
              }
            }
            if (block.indent) {
              cont = "options.applyIndent(" + cont + ", '" + block.indent + "')";
            }
            if (block.start && block.end) {
              res += "(" + cont + ")";
            } else if (block.start) {
              res += "(" + cont;
            } else if (block.end) {
              res += cont + ")";
            } else {
              res += cont;
            }
            if (!block.eol) {
              out.push(res);
            } else {
              out.push(res + ");" + (last ? "" : "\n"));
              textQuote = false;
            }
          }
          break;
        case "code":
          if (textQuote) {
            let item = out.pop();
            out.push(item + ");\n");
            textQuote = false;
          }
          out.push(cont + (block.eol || next?.type != "code" ? "\n" : ""));
          break;
      }
    }
    if (textQuote) {
      let lasItem = out.pop();
      out.push(lasItem + ");");
    }
    return out.join("");
  },
  compile: function() {
    this.alias = ["codeblock.njs"];
  },
  dependency: {}
};

// src/templates/compilationError.njs.ts
var compilationError_njs_default = {
  alias: ["compilationError.njs"],
  script: function(context, _content, partial, slot, options) {
    var out = [];
    out.push(context.error.message + ";\n");
    out.push(context.compiledFile + ";");
    return out.join("");
  },
  compile: function() {
    this.alias = ["compilationError.njs"];
  },
  dependency: {}
};

// src/templates/compiled.njs.ts
var compiled_njs_default = {
  alias: ["compiled.njs"],
  script: function(context, _content, partial, slot, options) {
    var out = [];
    out.push("module.exports = " + partial(context, "core") + ";\n");
    return out.join("");
  },
  compile: function() {
    this.alias = ["compiled.njs"];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    "core": true
  }
};

// src/templates/es6module.njs.ts
var es6module_njs_default = {
  alias: ["es6module.njs"],
  script: function(context, _content, partial, slot, options) {
    var out = [];
    out.push("export default " + partial(context, "core") + ";\n");
    return out.join("");
  },
  compile: function() {
    this.alias = ["es6module.njs"];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    "core": true
  }
};

// src/templates/MainTemplate.njs.ts
var MainTemplate_njs_default = {
  alias: ["MainTemplate.njs"],
  script: function(context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === void 0 || ctx === null)
        ctx = context;
      return _content(blockName, ctx, content, partial, slot);
    }
    var out = [];
    const { directives: directives2 } = context;
    out.push("{\n");
    if (directives2.chunks) {
      out.push("\n");
      out.push("chunks: " + JSON.stringify(directives2.chunks) + ",\n");
    }
    out.push("\n");
    if (directives2.alias) {
      out.push("\n");
      out.push("alias: " + JSON.stringify(directives2.alias) + ",\n");
    }
    out.push("script: function (" + directives2.context + ", _content, partial, slot, options){\n");
    out.push(options.applyIndent(content("maincontent", directives2), "    ") + "\n");
    out.push("    var out = []\n");
    out.push(options.applyIndent(content("chunks-start", directives2), "    ") + "\n");
    out.push(options.applyIndent(partial(context.main, "codeblock"), "    ") + "\n");
    out.push(options.applyIndent(content("chunks-finish", directives2), "    ") + "\n");
    out.push("    ");
    if (directives2.chunks) {
      out.push("\n");
      out.push("    if(out.some(t=>typeof t == 'object')){\n");
      out.push("      return out.map(chunk=>({...chunk, content:Array.isArray(chunk.content)?chunk.content.join(''):chunk.content}))\n");
      out.push("    } else {\n");
      out.push("      return out.join('')\n");
      out.push("    }\n");
      out.push("    ");
    } else {
      out.push("\n");
      out.push("      return out.join('')\n");
      out.push("    ");
    }
    out.push("\n");
    out.push("  },\n");
    const blockNames = Object.keys(context.blocks);
    if (blockNames.length > 0) {
      out.push("blocks : {\n");
      for (let i2 = 0; i2 < blockNames.length; i2 += 1) {
        const block = context.blocks[blockNames[i2]];
        out.push('"' + blockNames[i2] + '": function(' + block.directives.context + ",  _content, partial, slot, options) {\n");
        out.push(options.applyIndent(content("maincontent", block.directives), "      ") + "\n");
        out.push("      var out = []\n");
        out.push(options.applyIndent(partial(block.main, "codeblock"), "      "));
        if (directives2.chunks) {
          out.push("\n");
          out.push("      if(out.some(t=>typeof t == 'object')){\n");
          out.push("        return out.map(chunk=>({...chunk, content:Array.isArray(chunk.content)?chunk.content.join(''):chunk.content}))\n");
          out.push("      } else {\n");
          out.push("        return out.join('')\n");
          out.push("      }\n");
          out.push("      ");
        } else {
          out.push("\n");
          out.push("        return out.join('')\n");
          out.push("      ");
        }
        out.push("\n");
        out.push("    },\n");
      }
      out.push("\n");
      out.push("  },");
    }
    const slotNames = Object.keys(context.slots);
    if (slotNames.length > 0) {
      out.push("slots : {\n");
      for (let i2 = 0; i2 < slotNames.length; i2 += 1) {
        const slot2 = context.blocks[slotNames[i2]];
        out.push('"' + slotNames[i2] + '": function(' + slot2.directives.context + ",  _content, partial, slot, options){\n");
        out.push(options.applyIndent(content("maincontent", slot2.directives), "      ") + "\n");
        out.push("      var out = []\n");
        out.push(options.applyIndent(partial(slot2.main, "codeblock"), "      "));
        if (directives2.chunks) {
          out.push("\n");
          out.push("      if(out.some(t=>typeof t == 'object')){\n");
          out.push("        return out.map(chunk=>({...chunk, content:Array.isArray(chunk.content)?chunk.content.join(''):chunk.content}))\n");
          out.push("      } else {\n");
          out.push("        return out.join('')\n");
          out.push("      }\n");
          out.push("      ");
        } else {
          out.push("\n");
          out.push("        return out.join('')\n");
          out.push("      ");
        }
        out.push("\n");
        out.push("    },\n");
      }
      out.push("\n");
      out.push("  },\n");
    }
    out.push("\n");
    out.push("  compile: function() {\n");
    if (directives2.alias) {
      out.push("\n");
      out.push("    this.alias = " + JSON.stringify(directives2.alias) + "\n");
    }
    out.push("\n");
    if (directives2.requireAs.length > 0) {
      out.push("\n");
      out.push("    this.aliases={}\n");
      var rq;
      for (var i = 0, len = directives2.requireAs.length; i < len; i++) {
        rq = directives2.requireAs[i];
        out.push("\n");
        out.push('    this.aliases["' + rq.alias + '"] = "' + rq.name + '"\n');
        out.push('    this.factory.ensure("' + rq.name + '")\n');
      }
    }
    out.push("\n");
    out.push("\n");
    if (directives2.extend) {
      out.push("\n");
      out.push("    this.parent = " + JSON.stringify(directives2.extend) + "\n");
      out.push("    this.mergeParent(this.factory.ensure(this.parent))\n");
    }
    out.push("\n");
    out.push("  },\n");
    out.push("  dependency: {\n");
    out.push("  ");
    if (directives2.extend) {
      out.push(JSON.stringify(directives2.extend) + ": true,\n");
      out.push("  ");
    }
    if (directives2.requireAs.length > 0) {
      for (var i = 0, len = directives2.requireAs.length; i < len; i++) {
        rq = directives2.requireAs[i];
        out.push("\n");
        out.push('    "' + rq.name + '": true,\n');
        out.push('    "' + rq.alias + '": true,\n');
      }
    }
    out.push("\n");
    out.push("  }\n");
    out.push("}\n");
    return out.join("");
  },
  blocks: {
    "maincontent": function(directives2, _content, partial, slot, options) {
      var out = [];
      if (directives2?.content) {
        out.push("\n");
        out.push("    function content(blockName, ctx) {\n");
        out.push("      if(ctx === undefined || ctx === null) ctx = " + directives2.context + "\n");
        out.push("      return _content(blockName, ctx, content, partial, slot)\n");
        out.push("    }\n");
        out.push("  ");
      }
      return out.join("");
    },
    "chunks-start": function(directives2, _content, partial, slot, options) {
      var out = [];
      if (directives2.chunks) {
        out.push("\n");
        out.push("    const _partial = partial\n");
        out.push("    partial = function(obj, template) {\n");
        out.push("      const result = _partial(obj, template)\n");
        out.push("      if(Array.isArray(result)){\n");
        out.push("        result.forEach(r => {\n");
        out.push("          chunkEnsure(r.name, r.content)\n");
        out.push("        })\n");
        out.push("        return ''\n");
        out.push("      } else {\n");
        out.push("        return result\n");
        out.push("      }\n");
        out.push("    }\n");
        out.push("    const main = '" + directives2.chunks + "'\n");
        out.push("    var current = main\n");
        out.push("    let outStack = [current]\n");
        out.push("    let result\n");
        out.push("\n");
        out.push("    function chunkEnsure(name, content) {\n");
        out.push("      if (!result) {\n");
        out.push("        result = {}\n");
        out.push("      }\n");
        out.push("      if (!result.hasOwnProperty(name)) {\n");
        out.push("        result[name] = content ? content : []\n");
        out.push("      }\n");
        out.push("    }\n");
        out.push("    function chunkStart(name) {\n");
        out.push("      chunkEnsure(name)\n");
        out.push("      chunkEnd()\n");
        out.push("      current = name\n");
        out.push("      out = []\n");
        out.push("    }\n");
        out.push("    function chunkEnd() {\n");
        out.push("      result[current].push(...out)\n");
        out.push("      out = []\n");
        out.push("      current = outStack.pop() || main\n");
        out.push("    }\n");
        out.push("    chunkStart(main)\n");
        out.push("  ");
      }
      return out.join("");
    },
    "chunks-finish": function(directives2, _content, partial, slot, options) {
      var out = [];
      if (directives2.chunks) {
        out.push("\n");
        out.push("    chunkEnd()\n");
        out.push("    ");
        if (!directives2.useHash) {
          out.push("\n");
          out.push("    out = Object.keys(result)\n");
          out.push("      ");
          if (!directives2.includeMainChunk) {
            out.push("\n");
            out.push("      .filter(i => i !== '" + directives2.chunks + "')\n");
            out.push("      ");
          }
          out.push("\n");
          out.push("      .map(curr => ({ name: curr, content: result[curr] }))\n");
          out.push("      ");
        } else {
          out.push("\n");
          out.push("    out = result\n");
          out.push("      ");
          if (!directives2.includeMainChunk) {
            out.push("\n");
            out.push("    delete out['" + directives2.chunks + "']\n");
            out.push("      ");
          }
          out.push("\n");
          out.push("    ");
        }
        out.push("\n");
        out.push("  ");
      }
      return out.join("");
    }
  },
  compile: function() {
    this.alias = ["MainTemplate.njs"];
    this.aliases = {};
    this.aliases["codeblock"] = "codeblock.njs";
    this.factory.ensure("codeblock.njs");
  },
  dependency: {
    "codeblock.njs": true,
    "codeblock": true
  }
};

// src/templates/raw.njs.ts
var raw_njs_default = {
  alias: ["raw.njs"],
  script: function(context, _content, partial, slot, options) {
    var out = [];
    out.push("(function(){\n");
    out.push("  return " + partial(context, "core") + ";\n");
    out.push("})();");
    return out.join("");
  },
  compile: function() {
    this.alias = ["raw.njs"];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    "core": true
  }
};

// src/templates/singlefile.es6.njs.ts
var singlefile_es6_njs_default = {
  alias: ["singlefile.es6.njs"],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n");
    out.push("\n");
    out.push("export const templates = {\n");
    files.forEach((file) => {
      out.push("['" + (file.template.alias || file.name) + "']: " + partial(file.template, "core") + ",\n");
    });
    out.push("\n");
    out.push("}\n");
    out.push("\n");
    out.push("const F = new Factory(templates)\n");
    out.push("\n");
    out.push("export function run (context, name) {\n");
    out.push("  return F.run(context, name)\n");
    out.push("}\n");
    out.push("\n");
    return out.join("");
  },
  compile: function() {
    this.alias = ["singlefile.es6.njs"];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    "core": true
  }
};

// src/templates/singlefile.njs.ts
var singlefile_njs_default = {
  alias: ["singlefile.njs"],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n");
    out.push("\n");
    out.push("const templates = {\n");
    files.forEach((file) => {
      out.push("['" + (file.template.alias || file.name) + "']: " + partial(file.template, "core") + ",\n");
    });
    out.push("\n");
    out.push("}\n");
    out.push("\n");
    out.push("exports.templates = templates\n");
    out.push("const F = new Factory(templates)\n");
    out.push("\n");
    out.push("function run(context, name){\n");
    out.push("  return F.run( context, name )\n");
    out.push("}\n");
    out.push("\n");
    out.push("exports.run = run\n");
    return out.join("");
  },
  compile: function() {
    this.alias = ["singlefile.njs"];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    "core": true
  }
};

// src/templates/standalone.es6.njs.ts
var standalone_es6_njs_default = {
  alias: ["standalone.es6.njs"],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n");
    out.push("\n");
    for (let i = 0; i < files.length; i += 1) {
      out.push("import " + files[i].name.replaceAll(/[\s\.]/g, "_") + " from '" + files[i].path + "'\n");
    }
    out.push("\n");
    out.push("\n");
    out.push("const templates = {\n");
    for (let i = 0; i < files.length; i += 1) {
      out.push("'" + files[i].name + "': " + files[i].name.replaceAll(/[\s\.]/g, "_") + ",\n");
    }
    out.push("\n");
    out.push("}\n");
    out.push("\n");
    out.push("const F = new Factory(templates)\n");
    out.push("\n");
    out.push("module.exports = (context, name) => {\n");
    out.push("  return F.run( context, name )\n");
    out.push("}\n");
    return out.join("");
  },
  compile: function() {
    this.alias = ["standalone.es6.njs"];
  },
  dependency: {}
};

// src/templates/standalone.index.es6.njs.ts
var standalone_index_es6_njs_default = {
  alias: ["standalone.index.es6.njs"],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    for (let i = 0; i < files.length; i += 1) {
      out.push("import " + files[i].name.replaceAll(/[\s\.]/g, "_") + " from '" + files[i].path + "'\n");
    }
    out.push("\n");
    out.push("\n");
    out.push("const templates = {\n");
    for (let i = 0; i < files.length; i += 1) {
      out.push("'" + files[i].name + "': " + files[i].name.replaceAll(/[\s\.]/g, "_") + ",\n");
    }
    out.push("\n");
    out.push("}\n");
    out.push("export default templates");
    return out.join("");
  },
  compile: function() {
    this.alias = ["standalone.index.es6.njs"];
  },
  dependency: {}
};

// src/templates/standalone.index.njs.ts
var standalone_index_njs_default = {
  alias: ["standalone.index.njs"],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("const templates = {\n");
    for (let i = 0; i < files.length; i += 1) {
      out.push("'" + files[i].name + "': require('" + files[i].path + "'),\n");
    }
    out.push("\n");
    out.push("}\n");
    out.push("module.exports = templates");
    return out.join("");
  },
  compile: function() {
    this.alias = ["standalone.index.njs"];
  },
  dependency: {}
};

// src/templates/standalone.njs.ts
var standalone_njs_default = {
  alias: ["standalone.njs"],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n");
    out.push("\n");
    out.push("const templates = {\n");
    for (let i = 0; i < files.length; i += 1) {
      out.push("'" + files[i].name + "': require('" + files[i].path + "'),\n");
    }
    out.push("\n");
    out.push("}\n");
    out.push("\n");
    out.push("const F = new Factory(templates)\n");
    out.push("\n");
    out.push("module.exports = (context, name) => {\n");
    out.push("  return F.run( context, name )\n");
    out.push("}\n");
    return out.join("");
  },
  compile: function() {
    this.alias = ["standalone.njs"];
  },
  dependency: {}
};

// src/templates/index.ts
var templates = {
  "codeblock.njs": codeblock_njs_default,
  "compilationError.njs": compilationError_njs_default,
  "compiled.njs": compiled_njs_default,
  "es6module.njs": es6module_njs_default,
  "MainTemplate.njs": MainTemplate_njs_default,
  "raw.njs": raw_njs_default,
  "singlefile.es6.njs": singlefile_es6_njs_default,
  "singlefile.njs": singlefile_njs_default,
  "standalone.es6.njs": standalone_es6_njs_default,
  "standalone.index.es6.njs": standalone_index_es6_njs_default,
  "standalone.index.njs": standalone_index_njs_default,
  "standalone.njs": standalone_njs_default
};
var templates_default = templates;

// src/standalone/compile.ts
var F = new TemplateFactoryStandalone(templates_default);
function run(context, template) {
  return F.run(context, template);
}
function compileLight(content) {
  const compiled = Parser.parse(content.toString());
  return run(compiled, "raw.njs");
}
function compileFull(content) {
  const compiled = Parser.parse(content.toString());
  return run(compiled, "compiled.njs");
}
function compileTs(content) {
  const compiled = Parser.parse(content.toString());
  return run(compiled, "es6module.njs");
}
function parseFile(content) {
  return Parser.parse(content.toString());
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Factory,
  Parser,
  Template,
  compileFull,
  compileLight,
  compileTs,
  parseFile,
  run
});
