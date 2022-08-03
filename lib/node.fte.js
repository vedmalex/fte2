var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/node/index.ts
var node_exports = {};
__export(node_exports, {
  Factory: () => TemplateFactory,
  Parser: () => Parser,
  Template: () => Template,
  compileFull: () => compileFull,
  compileLight: () => compileLight,
  compileTs: () => compileTs,
  parse: () => parse,
  parseFile: () => parseFile,
  run: () => run
});
module.exports = __toCommonJS(node_exports);

// src/node/factory.ts
var fs2 = __toESM(require("fs"));
var path = __toESM(require("path"));
var glob = __toESM(require("glob"));

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
  mergeParent(src2) {
    if (src2) {
      merge(src2, this, "blocks");
      merge(src2, this, "aliases");
      merge(src2, this, "slots");
    }
  }
  compile() {
    throw new Error("abstract method call");
  }
};

// src/node/helpers.ts
var fs = __toESM(require("fs"));

// src/parser/parse.ts
var import_detect_indent = __toESM(require("detect-indent"));
var globalStates = {
  text: {
    states: [
      "unknown",
      "expression",
      "uexpression",
      "expression2",
      "uexpression2",
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
  expression2: {
    start: ["{{"],
    end: ["}}"],
    curly: 2,
    skip: {
      start: ["{{&"]
    }
  },
  uexpression: {
    start: ["!{"],
    end: ["}"],
    curly: 1
  },
  uexpression2: {
    start: ["{{&"],
    end: ["}}"],
    curly: 2
  },
  code: {
    start: ["<#", "<#-"],
    end: ["#>", "-#>"],
    skip: {
      start: ["<#@", "<# block", "<# slot", "<# end #>"]
    }
  },
  directive: {
    start: ["<#@"],
    end: ["#>"]
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
  "noEscape",
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
        params = UNPARAM(input.split(directive)[1]);
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
    this.escapeIt = true;
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
      case "noEscape":
        this.escapeIt = false;
        break;
      case "requireAs":
        this.requireAs.push({ name: params[0], alias: params[1] });
        break;
      default:
        console.log("unknown directive: " + name);
    }
  }
};
var CodeBlock = class {
  constructor(init) {
    this.main = [];
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
            if (prev.type == "text") {
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
            curr.main.push({
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type: "expression",
              eol
            });
          }
          break;
        case "uexpression":
        case "uexpression2":
          if (data) {
            curr.main.push({
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type: "uexpression",
              eol
            });
          }
          break;
        case "text":
          state = null;
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
          break;
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

// src/node/compile.ts
var ts = __toESM(require("typescript"));

// src/templates/codeblock.njs.ts
var codeblock_njs_default = {
  alias: ["codeblock.njs"],
  script: function(blockList, _content, partial, slot, options) {
    var out = [];
    var textQuote = false;
    for (var i = 0, len = blockList.length; i < len; i++) {
      var block = blockList[i];
      var cont = block.content;
      switch (block.type) {
        case "text":
          {
            let res = "";
            if (!textQuote) {
              textQuote = true;
              res = ";out.push(\n";
            } else {
              let lasItem = out.pop();
              res = `${lasItem} + `;
            }
            if (block.eol) {
              res += JSON.stringify(cont + "\n");
              res += "\n";
            } else {
              res += JSON.stringify(cont);
            }
            out.push(res);
          }
          break;
        case "uexpression":
          {
            let res = "";
            if (!textQuote) {
              textQuote = true;
              res = ";out.push(\n";
            } else {
              let lasItem = out.pop();
              res = `${lasItem} + `;
            }
            res += `escapeIt(${cont})`;
            if (textQuote && !block.eol) {
              out.push(res);
            } else {
              out.push(`${res}
`);
            }
          }
          break;
        case "expression":
          {
            let res = "";
            if (!textQuote) {
              textQuote = true;
              res = ";out.push(\n";
            } else {
              let lasItem = out.pop();
              res = `${lasItem} + `;
            }
            res += `(${cont})`;
            if (textQuote && !block.eol) {
              out.push(res);
            } else {
              out.push(`${res}
`);
            }
          }
          break;
        case "code":
          if (textQuote) {
            let item = out.pop();
            out.push(`${item});
`);
            textQuote = false;
          }
          out.push(`${cont}${block.eol ? "\n" : ""}`);
          break;
      }
    }
    if (textQuote) {
      let lasItem = out.pop();
      out.push(`${lasItem});
`);
    }
    ;
    out.push("");
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
    out.push(context.error.message + ";\n" + context.compiledFile + ";");
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
      ;
      out.push("\nchinks: " + directives2.chunks + "\n");
    }
    ;
    out.push("\n");
    if (directives2.alias) {
      ;
      out.push("\nalias: " + JSON.stringify(directives2.alias) + ",\n");
    }
    ;
    out.push("script: function (" + directives2.context + ", _content, partial, slot, options){\n    " + content("maincontent", directives2) + "\n    var out = []\n    " + content("chunks-start", directives2) + "\n    " + partial(context.main, "codeblock") + "\n    " + content("chunks-finish", directives2) + "\n     return out.join('')\n  },\n\n");
    const blockNames = Object.keys(context.blocks);
    if (blockNames.length > 0) {
      ;
      out.push("blocks : {\n\n");
      for (let i2 = 0; i2 < blockNames.length; i2 += 1) {
        const block = context.blocks[blockNames[i2]];
        out.push('"' + blockNames[i2] + '": function(' + block.directives.context + ",  _content, partial, slot, options) {\n      " + content("maincontent", block.directives) + "\n      var out = []\n      " + partial(block.main, "codeblock") + "\n      return out.join('')\n    },\n");
      }
      ;
      out.push("\n  },");
    }
    const slotNames = Object.keys(context.slots);
    if (slotNames.length > 0) {
      ;
      out.push("slots : {\n\n");
      for (let i2 = 0; i2 < slotNames.length; i2 += 1) {
        const slot2 = context.blocks[slotNames[i2]];
        out.push('"' + slotNames[i2] + '": function(' + slot2.directives.context + ",  _content, partial, slot, options){\n      " + content("maincontent", slot2.directives) + "\n      var out = []\n      " + partial(slot2.main, "codeblock") + "\n      return out.join('')\n    },\n");
      }
      ;
      out.push("\n  },\n");
    }
    ;
    out.push("\n  compile: function() {\n");
    if (directives2.alias) {
      ;
      out.push("\n    this.alias = " + JSON.stringify(directives2.alias) + "\n");
    }
    ;
    out.push("\n");
    if (directives2.requireAs.length > 0) {
      ;
      out.push("\n    this.aliases={}\n");
      var rq;
      for (var i = 0, len = directives2.requireAs.length; i < len; i++) {
        rq = directives2.requireAs[i];
        out.push('\n    this.aliases["' + rq.alias + '"] = "' + rq.name + '"\n    this.factory.ensure("' + rq.name + '")\n\n');
      }
    }
    ;
    out.push("\n\n");
    if (directives2.extend) {
      ;
      out.push("\n    this.parent = " + JSON.stringify(directives2.extend) + "\n    this.mergeParent(this.factory.ensure(this.parent))\n");
    }
    ;
    out.push("\n  },\n  dependency: {\n  ");
    if (directives2.extend) {
      ;
      out.push(JSON.stringify(directives2.extend) + ": true,\n  ");
    }
    if (directives2.requireAs.length > 0) {
      for (var i = 0, len = directives2.requireAs.length; i < len; i++) {
        rq = directives2.requireAs[i];
        out.push('\n    "' + rq.name + '": true,\n    "' + rq.alias + '": true,\n\n');
      }
    }
    ;
    out.push("\n  }\n}\n");
    return out.join("");
  },
  blocks: {
    "maincontent": function(directives2, _content, partial, slot, options) {
      var out = [];
      if (directives2.escapeIt) {
        ;
        out.push("\n    const {escapeIt} = options\n  ");
      }
      if (directives2.content) {
        ;
        out.push("\n    function content(blockName, ctx) {\n      if(ctx === undefined || ctx === null) ctx = " + directives2.context + "\n      return _content(blockName, ctx, content, partial, slot)\n    }\n  ");
      }
      return out.join("");
    },
    "chunks-start": function(directives2, _content, partial, slot, options) {
      var out = [];
      if (directives2.chunks) {
        ;
        out.push("\n    const _partial = partial\n    partial = function(obj, template) {\n      const result = _partial(obj, template)\n      if(Array.isArray(result)){\n        result.forEach(r => {\n          chunkEnsure(r.name, r.content)\n        })\n        return ''\n      } else {\n        return result\n      }\n    }\n    const main = '" + directives2.chunks + "'\n    var current = main\n    let outStack = [current]\n    let result\n\n    function chunkEnsure(name, content) {\n      if (!result) {\n        result = {}\n      }\n      if (!result.hasOwnProperty(name)) {\n        result[name] = content ? content : []\n      }\n    }\n    function chunkStart(name) {\n      chunkEnsure(name)\n      chunkEnd()\n      current = name\n      out = []\n    }\n    function chunkEnd() {\n      result[current].push(out)\n      out = []\n      current = outStack.pop() || main\n    }\n    chunkStart(main)\n  ");
      }
      return out.join("");
    },
    "chunks-finish": function(directives2, _content, partial, slot, options) {
      var out = [];
      if (directives2.chunks) {
        ;
        out.push("\n    chunkEnd()\n    ");
        if (!directives2.useHash) {
          ;
          out.push("\n    out = Object.keys(result)\n      ");
          if (!directives2.includeMainChunk) {
            ;
            out.push("\n      .filter(i => i !== '" + directives2.chunks + "')\n      ");
          }
          ;
          out.push("\n      .map(curr => ({ name: curr, content: result[curr] }))\n      ");
        } else {
          ;
          out.push("\n    out = result\n      ");
          if (!directives2.includeMainChunk) {
            ;
            out.push("\n    delete out['" + directives2.chunks + "']\n      ");
          }
          ;
          out.push("\n    ");
        }
        ;
        out.push("\n  ");
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
    out.push("(function(){\n  return " + partial(context, "core") + ";\n})();");
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
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n\nexport const templates = {\n");
    files.forEach((file) => {
      ;
      out.push("\n  ['" + (file.template.alias || file.name) + "']: " + partial(file.template, "core") + ",\n");
    });
    out.push("\n}\n\nconst F = new Factory(templates)\n\nexport function run (context, name) {\n  return F.run(context, name)\n}\n\n");
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
    out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n\nconst templates = {\n");
    files.forEach((file) => {
      ;
      out.push("\n  ['" + (file.template.alias || file.name) + "']: " + partial(file.template, "core") + ",\n");
    });
    out.push("\n}\n\nexports.templates = templates\nconst F = new Factory(templates)\n\nfunction run(context, name){\n  return F.run( context, name )\n}\n\nexports.run = run\n");
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
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n\n");
    for (let i = 0; i < files.length; i += 1) {
      ;
      out.push("\n  import " + files[i].name.replaceAll(/[\s\.]/g, "_") + " from '" + files[i].path + "'\n");
    }
    ;
    out.push("\n\nconst templates = {\n");
    for (let i = 0; i < files.length; i += 1) {
      ;
      out.push("\n  '" + files[i].name + "': " + files[i].name.replaceAll(/[\s\.]/g, "_") + ",\n");
    }
    ;
    out.push("\n}\n\nconst F = new Factory(templates)\n\nmodule.exports = (context, name) => {\n  return F.run( context, name )\n}\n");
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
      ;
      out.push("\n  import " + files[i].name.replaceAll(/[\s\.]/g, "_") + " from '" + files[i].path + "'\n");
    }
    ;
    out.push("\n\nconst templates = {\n");
    for (let i = 0; i < files.length; i += 1) {
      ;
      out.push("\n  '" + files[i].name + "': " + files[i].name.replaceAll(/[\s\.]/g, "_") + ",\n");
    }
    ;
    out.push("\n}\nexport default templates");
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
      ;
      out.push("\n  '" + files[i].name + "': require('" + files[i].path + "'),\n");
    }
    ;
    out.push("\n}\nmodule.exports = templates");
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
    out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n\nconst templates = {\n");
    for (let i = 0; i < files.length; i += 1) {
      ;
      out.push("\n  '" + files[i].name + "': require('" + files[i].path + "'),\n");
    }
    ;
    out.push("\n}\n\nconst F = new Factory(templates)\n\nmodule.exports = (context, name) => {\n  return F.run( context, name )\n}\n");
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
    this.debug = false;
    this.watch = false;
    this.watchTree = void 0;
    this.root = void 0;
    config.options = { ...config.options, ...DefaultFactoryOptions };
    this.options = config.options;
    if (!process.browser) {
      this.root = config ? config.root ? Array.isArray(config.root) ? config.root : [config.root] : [process.cwd()] : [process.cwd()];
      this.debug = config && config.debug || false;
      this.watch = config && config.watch;
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
      const template = this.load(fileName, absPath);
      if (this.watch) {
        this.checkChanges(template, fileName, absPath);
        const depList = Object.keys(template.dependency);
        for (let i = 0, len = depList.length; i < len; i++) {
          const templates2 = this.watchTree[this.cache[depList[i]].absPath].templates;
          templates2[template.absPath] = template;
        }
      }
      return template;
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
  checkChanges(template, fileName, absPath) {
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

// src/node/compile.ts
function prepareCode(src2) {
  const result = ts.transpileModule(src2, {
    compilerOptions: {
      allowJs: true,
      strict: false,
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ES2022
    }
  });
  return result.outputText;
}
var F = new TemplateFactoryStandalone(templates_default);
function run(context, template) {
  return F.run(context, template);
}
function compileLight(content) {
  const compiled = Parser.parse(content.toString());
  return prepareCode(run(compiled, "raw.njs"));
}
function compileFull(content) {
  const compiled = Parser.parse(content.toString());
  return prepareCode(run(compiled, "compiled.njs"));
}
function compileTs(content) {
  const compiled = Parser.parse(content.toString());
  return prepareCode(run(compiled, "es6module.njs"));
}
function parseFile(content) {
  return Parser.parse(content.toString());
}

// src/node/helpers.ts
function safeEval(src) {
  let retval;
  try {
    retval = eval(src);
  } catch (err) {
    fs.writeFileSync("failed.js", src);
    console.log("	 \x1B[34m" + err.message + "\x1B[0m");
    console.log("for mode debug information see 'failed.js' ");
  }
  return retval;
}
function makeFunction(fnDef, name) {
  let result;
  try {
    const fname = name.replace(/[\s,\\\/\.\-]/g, "_");
    result = safeEval(
      "function " + fname + " (" + fnDef.parameters + "){\n" + fnDef.body + "\n}"
    );
  } catch (error) {
    result = {
      err: error,
      code: fnDef.body
    };
  } finally {
    return result;
  }
}
function makeTemplate(src2) {
  let result;
  const compiled = compileLight(src2);
  try {
    result = safeEval(compiled);
  } catch (error) {
    result = {
      error,
      code: src2
    };
  } finally {
    return result;
  }
}

// src/node/template.ts
var Template = class extends TemplateBase {
  compile() {
    if (this.srcCode) {
      const result = makeTemplate(this.srcCode);
      if (!result.error) {
        this.script = result.script;
        this.blocks = result.blocks;
        this.slots = result.slots;
        this.compile = result.compile;
        this.dependency = result.dependency;
        if (result.alias) {
          this.alias = result.alias;
        }
        this.compile();
      } else {
        throw result.error;
      }
    }
    return this;
  }
};

// src/node/factory.ts
var TemplateFactory = class extends TemplateFactoryBase {
  load(fileName, absPath) {
    let root;
    for (let i = 0, len = this.root.length; i < len; i++) {
      root = this.root[i];
      const fn = absPath ? path.resolve(fileName) : path.resolve(path.join(root, fileName));
      const compiledJS = fn + ".js";
      if (fs2.existsSync(compiledJS)) {
        let result;
        const storedScript = fs2.readFileSync(compiledJS);
        result = safeEval(storedScript.toString());
        if (result instanceof Function) {
          result = {
            script: result,
            compile: new Function()
          };
        }
        result.absPath = fn;
        result.name = fileName;
        result.factory = this;
        const templ = new Template(result);
        this.register(templ, fileName);
        templ.compile();
        return templ;
      } else if (fs2.existsSync(fn)) {
        const content = fs2.readFileSync(fn);
        const tpl = new Template({
          source: content.toString(),
          name: fileName,
          absPath: fn,
          factory: this
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
  preload() {
    let files = [];
    for (let i = 0, rLen = this.root.length; i < rLen; i++) {
      for (let j = 0, eLen = this.ext.length; j < eLen; j++) {
        files = files.concat(
          glob.sync("*." + this.ext[j], {
            root: this.root[i],
            cwd: this.root[i],
            matchBase: true
          })
        );
      }
    }
    for (let i = 0, len = files.length; i < len; i++) {
      this.load(files[i]);
    }
  }
  create(source, name) {
    if (!name) {
      name = "freegenerated" + Math.random().toString() + ".js";
    }
    const tpl = this.standalone(source);
    tpl.name = name;
    tpl.absPath = name;
    this.register(tpl);
    return name;
  }
  standalone(source) {
    const tpl = new Template({
      source,
      factory: this
    });
    return tpl.compile();
  }
  run(context, name, absPath) {
    const templ = this.ensure(name, absPath);
    const bc = this.blockContent(templ, {});
    const result = bc.run(
      context,
      bc.content,
      bc.partial,
      bc.slot,
      this.options
    );
    if (Object.keys(bc.slots).length > 0) {
      if (Array.isArray(result)) {
        return result.map((r) => {
          const tpl = this.standalone(r.content);
          const content = tpl.script(
            bc.slots,
            bc.content,
            bc.partial,
            bc.slot,
            this.options
          );
          return {
            name: r.name,
            content
          };
        });
      } else {
        const res = this.standalone(result);
        return res.script(
          bc.slots,
          bc.content,
          bc.partial,
          bc.slot,
          this.options
        );
      }
    } else {
      return result;
    }
  }
  runPartial({
    context,
    name,
    absPath,
    options,
    slots
  }) {
    const templ = this.ensure(name, absPath);
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
  blocksToFiles(context, name, absPath) {
    const templ = this.ensure(name, absPath);
    const bc = this.blockContent(templ);
    return Object.keys(templ.blocks).map((curr) => ({
      file: curr,
      content: bc.content(curr, context, bc.content, bc.partial, bc.slot)
    }));
  }
  express() {
    const self = this;
    return (fileName, context, callback) => {
      const templ = self.ensure(fileName, true);
      const bc = self.blockContent(templ);
      let result, err;
      try {
        result = bc.run(context, bc.content, bc.partial, bc.slot, this.options);
      } catch (e) {
        err = e;
      } finally {
        callback(err, result);
      }
    };
  }
  clearCache(fn, list) {
    for (let i = 0, keys = Object.keys(list), len = keys.length; i < len; i++) {
      delete this.cache[list[keys[i]].name];
      delete this.cache[list[keys[i]].absPath];
    }
  }
  checkChanges(template, fileName, absPath) {
    let root;
    for (let i = 0, len = this.root.length; i < len; i++) {
      root = this.root[i];
      const fn = absPath ? path.resolve(fileName) : path.resolve(path.join(root, fileName));
      let fw = void 0;
      if (fs2.existsSync(fn + ".js")) {
        fw = fn + ".js";
      } else if (fs2.existsSync(fn)) {
        fw = fn;
      }
      if (fw) {
        if (!this.watchTree[fw]) {
          const templates2 = {};
          templates2[template.absPath] = template;
          templates2[template.name] = template;
          this.watchTree[fw] = {
            watcher: fs2.watch(fw, { persistent: false }, (event, filename) => {
              if (event === "change") {
                const list = this.watchTree[fw].templates;
                this.clearCache(fw, list);
              } else {
                this.watchTree[fw].close();
                delete this.watchTree[fw];
              }
            }),
            templates: templates2
          };
        }
        break;
      }
    }
  }
};

// src/node/index.ts
function parse(source, context) {
  const ONLY_ONE = "ONLY_ONE";
  const factory = new TemplateFactory({});
  const tpl = new Template({
    source,
    name: ONLY_ONE,
    factory
  });
  tpl.compile();
  factory.cache[ONLY_ONE] = tpl;
  return tpl.factory.run(context, ONLY_ONE);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Factory,
  Parser,
  Template,
  compileFull,
  compileLight,
  compileTs,
  parse,
  parseFile,
  run
});
