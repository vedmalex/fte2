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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
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
  "deindent",
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
      case "deindent":
        this.deindent = params.length > 0 ? parseInt(params[0]) : true;
        break;
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
        let newLine = false;
        do {
          if (curr.main.length > 0) {
            let prev = curr.main[curr.main.length - 1];
            if (prev?.type == "text" || prev?.type == "empty" && type === "code") {
              prev.content = prev.content.trimEnd();
              if (!prev.content) {
                if (prev.eol)
                  newLine = true;
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
              if (newLine && prev.type === "code")
                prev.eol = true;
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
          break;
        case "code":
          if (start == "<#-") {
            trimStartLines();
          }
          if (end == "-#>") {
            trimEndLines();
          }
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
          break;
        case "expression":
        case "expression2":
          {
            const current2 = {
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type: "expression",
              eol
            };
            const prev2 = curr.main.pop();
            if (prev2?.type !== "text" || prev2?.type === "text" && prev2?.content.trim().length > 0 || prev2?.type === "text" && prev2?.eol) {
              curr.main.push(prev2);
            } else {
              current2.indent = prev2.content;
            }
            curr.main.push(current2);
          }
          break;
        case "uexpression":
        case "uexpression2":
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
          break;
        case "text": {
          state = null;
          let actualType = data || eol ? type : "empty";
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
          break;
        }
        case "comments":
          trimStartLines();
          trimEndLines();
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
var esbuild = __toESM(require("esbuild"));

// src/templates/codeblock.njs.ts
var codeblock_njs_default = {
  alias: ["codeblock.njs"],
  script: function(blockList, _content, partial, slot, options) {
    var out = [];
    var textQuote = false;
    do {
      const cur = blockList.shift();
      if (cur.type !== "empty" || cur.type === "text" && cur.content.trim()) {
        blockList.unshift(cur);
        break;
      }
      if (blockList.length == 0)
        break;
    } while (true);
    do {
      const cur = blockList.pop();
      if (cur.type !== "empty" || cur.type === "text" && cur.content.trim()) {
        blockList.push(cur);
        break;
      }
      if (blockList.length == 0)
        break;
    } while (true);
    blockList[blockList.length - 1].eol = false;
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
    out.push("module.exports = " + partial(context, "core") + ";");
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
    out.push("export default " + partial(context, "core") + ";");
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
    out.push("{");
    if (directives2.chunks) {
      out.push("\n");
      out.push("chunks: " + JSON.stringify(directives2.chunks) + ",");
    }
    if (directives2.alias) {
      out.push("\n");
      out.push("alias: " + JSON.stringify(directives2.alias) + ",");
    }
    out.push("\n");
    out.push("\n");
    out.push("script: function (" + directives2.context + ", _content, partial, slot, options){\n");
    out.push(options.applyIndent(content("maincontent", directives2), "    ") + "\n");
    out.push("    var out = []\n");
    out.push(options.applyIndent(content("chunks-start", directives2), "    ") + "\n");
    out.push(options.applyIndent(partial(context.main, "codeblock"), "    ") + "\n");
    out.push(options.applyIndent(content("chunks-finish", directives2), "    "));
    if (directives2.chunks) {
      out.push("\n");
      out.push("    if(out.some(t=>typeof t == 'object')){\n");
      out.push("      return out.map(chunk=>(\n");
      out.push("          {...chunk,\n");
      out.push("            content:");
      if (directives2.deindent) {
        out.push(" options.applyDeindent(");
      }
      out.push("\n");
      out.push("            Array.isArray(chunk.content)\n");
      out.push("              ? chunk.content.join('')\n");
      out.push("              : chunk.content");
      if (directives2.deindent) {
        out.push(")");
      }
      out.push("\n");
      out.push("          }\n");
      out.push("        )\n");
      out.push("      )\n");
      out.push("    } else {\n");
      out.push("      return ");
      if (directives2.deindent) {
        out.push(" options.applyDeindent(");
      }
      out.push("out");
      if (directives2.deindent) {
        out.push(")");
      }
      out.push(".join('')\n");
      out.push("    }");
    } else {
      out.push("\n");
      out.push("      return ");
      if (directives2.deindent) {
        out.push(" options.applyDeindent(");
      }
      out.push("out");
      if (directives2.deindent) {
        out.push(")");
      }
      out.push(".join('')");
    }
    out.push("\n");
    out.push("  },");
    const blockNames = Object.keys(context.blocks);
    if (blockNames.length > 0) {
      out.push("\n");
      out.push("  blocks : {");
      for (let i2 = 0; i2 < blockNames.length; i2 += 1) {
        const block = context.blocks[blockNames[i2]];
        out.push("\n");
        out.push('    "' + blockNames[i2] + '": function(' + block.directives.context + ",  _content, partial, slot, options) {\n");
        out.push(options.applyIndent(content("maincontent", block.directives), "      ") + "\n");
        out.push("      var out = []\n");
        out.push(options.applyIndent(partial(block.main, "codeblock"), "      "));
        if (directives2.chunks) {
          out.push("\n");
          out.push("      if(out.some(t=>typeof t == 'object')){\n");
          out.push("        return out.map(chunk=>(\n");
          out.push("            {...chunk,\n");
          out.push("              content:");
          if (directives2.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("\n");
          out.push("              Array.isArray(chunk.content)\n");
          out.push("                ? chunk.content.join('')\n");
          out.push("                : chunk.content");
          if (directives2.deindent) {
            out.push(")");
          }
          out.push("\n");
          out.push("            }\n");
          out.push("          )\n");
          out.push("        )\n");
          out.push("      } else {\n");
          out.push("        return ");
          if (directives2.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("out");
          if (directives2.deindent) {
            out.push(")");
          }
          out.push(".join('')\n");
          out.push("      }");
        } else {
          out.push("\n");
          out.push("        return ");
          if (directives2.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("out");
          if (directives2.deindent) {
            out.push(")");
          }
          out.push(".join('')");
        }
        out.push("\n");
        out.push("    },");
      }
      out.push("\n");
      out.push("  },");
    }
    const slotNames = Object.keys(context.slots);
    if (slotNames.length > 0) {
      out.push("\n");
      out.push("  slots : {");
      for (let i2 = 0; i2 < slotNames.length; i2 += 1) {
        const slot2 = context.blocks[slotNames[i2]];
        out.push("\n");
        out.push('    "' + slotNames[i2] + '": function(' + slot2.directives.context + ",  _content, partial, slot, options){\n");
        out.push(options.applyIndent(content("maincontent", slot2.directives), "      ") + "\n");
        out.push("      var out = []\n");
        out.push(options.applyIndent(partial(slot2.main, "codeblock"), "      "));
        if (directives2.chunks) {
          out.push("\n");
          out.push("      if(out.some(t=>typeof t == 'object')){\n");
          out.push("        return out.map(chunk=>(\n");
          out.push("            {...chunk,\n");
          out.push("              content:");
          if (directives2.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("\n");
          out.push("              Array.isArray(chunk.content)\n");
          out.push("                ? chunk.content.join('')\n");
          out.push("                : chunk.content");
          if (directives2.deindent) {
            out.push(")");
          }
          out.push("\n");
          out.push("            }\n");
          out.push("          )\n");
          out.push("        )\n");
          out.push("      } else {\n");
          out.push("        return ");
          if (directives2.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("out");
          if (directives2.deindent) {
            out.push(")");
          }
          out.push(".join('')\n");
          out.push("      }");
        } else {
          out.push("\n");
          out.push("        return ");
          if (directives2.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("out");
          if (directives2.deindent) {
            out.push(")");
          }
          out.push(".join('')");
        }
        out.push("\n");
        out.push("    },");
      }
      out.push("\n");
      out.push("  },");
    }
    out.push("\n");
    out.push("  compile: function() {");
    if (directives2.alias) {
      out.push("\n");
      out.push("    this.alias = " + JSON.stringify(directives2.alias));
    }
    if (directives2.requireAs.length > 0) {
      out.push("\n");
      out.push("    this.aliases={}");
      var rq;
      for (var i = 0, len = directives2.requireAs.length; i < len; i++) {
        rq = directives2.requireAs[i];
        out.push("\n");
        out.push('    this.aliases["' + rq.alias + '"] = "' + rq.name + '"\n');
        out.push('    this.factory.ensure("' + rq.name + '")');
      }
    }
    if (directives2.extend) {
      out.push("\n");
      out.push("    this.parent = " + JSON.stringify(directives2.extend) + "\n");
      out.push("    this.mergeParent(this.factory.ensure(this.parent))");
    }
    out.push("\n");
    out.push("  },\n");
    out.push("  dependency: {");
    if (directives2.extend) {
      out.push("\n");
      out.push(options.applyIndent(JSON.stringify(directives2.extend), "    ") + ": true,");
    }
    if (directives2.requireAs.length > 0) {
      for (var i = 0, len = directives2.requireAs.length; i < len; i++) {
        rq = directives2.requireAs[i];
        out.push("\n");
        out.push('    "' + rq.name + '": true,\n');
        out.push('    "' + rq.alias + '": true,');
      }
    }
    out.push("\n");
    out.push("  }\n");
    out.push("}");
    return out.join("");
  },
  blocks: {
    "maincontent": function(directives2, _content, partial, slot, options) {
      var out = [];
      if (directives2?.content) {
        out.push("function content(blockName, ctx) {\n");
        out.push("  if(ctx === undefined || ctx === null) ctx = " + directives2.context + "\n");
        out.push("  return _content(blockName, ctx, content, partial, slot)\n");
        out.push("}");
      }
      out.push("");
      return out.join("");
    },
    "chunks-start": function(directives2, _content, partial, slot, options) {
      var out = [];
      if (directives2.chunks) {
        out.push("\n");
        out.push("const _partial = partial\n");
        out.push("partial = function(obj, template) {\n");
        out.push("  const result = _partial(obj, template)\n");
        out.push("  if(Array.isArray(result)){\n");
        out.push("    result.forEach(r => {\n");
        out.push("      chunkEnsure(r.name, r.content)\n");
        out.push("    })\n");
        out.push("    return ''\n");
        out.push("  } else {\n");
        out.push("    return result\n");
        out.push("  }\n");
        out.push("}\n");
        out.push("const main = '" + directives2.chunks + "'\n");
        out.push("var current = main\n");
        out.push("let outStack = [current]\n");
        out.push("let result\n");
        out.push("\n");
        out.push("function chunkEnsure(name, content) {\n");
        out.push("  if (!result) {\n");
        out.push("    result = {}\n");
        out.push("  }\n");
        out.push("  if (!result.hasOwnProperty(name)) {\n");
        out.push("    result[name] = content ? content : []\n");
        out.push("  }\n");
        out.push("}\n");
        out.push("function chunkStart(name) {\n");
        out.push("  chunkEnsure(name)\n");
        out.push("  chunkEnd()\n");
        out.push("  current = name\n");
        out.push("  out = []\n");
        out.push("}\n");
        out.push("function chunkEnd() {\n");
        out.push("  result[current].push(...out)\n");
        out.push("  out = []\n");
        out.push("  current = outStack.pop() || main\n");
        out.push("}\n");
        out.push("chunkStart(main)");
      }
      out.push("");
      return out.join("");
    },
    "chunks-finish": function(directives2, _content, partial, slot, options) {
      var out = [];
      if (directives2.chunks) {
        out.push("\n");
        out.push("    chunkEnd()");
        if (!directives2.useHash) {
          out.push("\n");
          out.push("    out = Object.keys(result)");
          if (!directives2.includeMainChunk) {
            out.push("\n");
            out.push("      .filter(i => i !== '" + directives2.chunks + "')");
          }
          out.push("\n");
          out.push("      .map(curr => ({ name: curr, content: result[curr] }))");
        } else {
          out.push("\n");
          out.push("    out = result");
          if (!directives2.includeMainChunk) {
            out.push("\n");
            out.push("    delete out['" + directives2.chunks + "']");
          }
        }
      }
      out.push("");
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
    out.push("export const templates = {");
    files.forEach((file) => {
      out.push("\n");
      out.push("  ['" + (file.template.alias || file.name) + "']: " + partial(file.template, "core") + ",");
    });
    out.push("\n");
    out.push("}\n");
    out.push("\n");
    out.push("const F = new Factory(templates)\n");
    out.push("\n");
    out.push("export function run (context, name) {\n");
    out.push("  return F.run(context, name)\n");
    out.push("}\n");
    out.push("");
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
    out.push("const templates = {");
    files.forEach((file) => {
      out.push("\n");
      out.push("  ['" + (file.template.alias || file.name) + "']: " + partial(file.template, "core") + ",");
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
    out.push("exports.run = run");
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
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'");
    for (let i = 0; i < files.length; i += 1) {
      out.push("\n");
      out.push("  import " + files[i].name.replaceAll(/[\s\.]/g, "_") + " from '" + files[i].path + "'");
    }
    out.push("\n");
    out.push("\n");
    out.push("const templates = {");
    for (let i = 0; i < files.length; i += 1) {
      out.push("\n");
      out.push("  '" + files[i].name + "': " + files[i].name.replaceAll(/[\s\.]/g, "_") + ",");
    }
    out.push("\n");
    out.push("}\n");
    out.push("\n");
    out.push("const F = new Factory(templates)\n");
    out.push("\n");
    out.push("module.exports = (context, name) => {\n");
    out.push("  return F.run( context, name )\n");
    out.push("}");
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
      out.push("\n");
      out.push("  import " + files[i].name.replaceAll(/[\s\.]/g, "_") + " from '" + files[i].path + "'");
    }
    out.push("\n");
    out.push("\n");
    out.push("const templates = {");
    for (let i = 0; i < files.length; i += 1) {
      out.push("\n");
      out.push("  '" + files[i].name + "': " + files[i].name.replaceAll(/[\s\.]/g, "_") + ",");
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
    out.push("const templates = {");
    for (let i = 0; i < files.length; i += 1) {
      out.push("\n");
      out.push("  '" + files[i].name + "': require('" + files[i].path + "'),");
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
    out.push("const templates = {");
    for (let i = 0; i < files.length; i += 1) {
      out.push("\n");
      out.push("  '" + files[i].name + "': require('" + files[i].path + "'),");
    }
    out.push("\n");
    out.push("}\n");
    out.push("\n");
    out.push("const F = new Factory(templates)\n");
    out.push("\n");
    out.push("module.exports = (context, name) => {\n");
    out.push("  return F.run( context, name )\n");
    out.push("}");
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
function prepareCode(text) {
  const result = esbuild.transformSync(text, {
    minify: false
    // treeShaking: true,
    // minifySyntax: true,
  });
  return result.code;
}
var F = new TemplateFactoryStandalone(templates_default);
function run(context, template) {
  return F.run(context, template);
}
function compileLight(content, optimize) {
  const compiled = Parser.parse(content.toString());
  const text = run(compiled, "raw.njs");
  return optimize ? prepareCode(text) : text;
}
function compileFull(content, optimize) {
  const compiled = Parser.parse(content.toString());
  const text = run(compiled, "compiled.njs");
  return optimize ? prepareCode(text) : text;
}
function compileTs(content, optimize) {
  const compiled = Parser.parse(content.toString());
  const text = run(compiled, "es6module.njs");
  return optimize ? prepareCode(text) : text;
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
function makeTemplate(src2, optimize = true) {
  let result;
  const compiled = compileLight(src2, optimize);
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
      const result = makeTemplate(this.srcCode, false);
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
var import_chokidar = require("chokidar");
var TemplateFactory = class extends TemplateFactoryBase {
  constructor() {
    super(...arguments);
    // подумать нужно ли делать один общий для все список watchTree
    this.watchList = [];
    this.watcher = void 0;
  }
  load(fileName, absPath) {
    let root;
    for (let i = 0, len = this.root.length; i < len; i++) {
      root = this.root[i];
      const fn = absPath ? path.resolve(fileName) : path.resolve(path.join(root, fileName));
      const compiledJS = fn + ".js";
      if (fs2.existsSync(compiledJS)) {
        let result;
        try {
          result = require(compiledJS);
        } catch (error) {
          const storedScript = fs2.readFileSync(compiledJS);
          result = safeEval(storedScript.toString());
        }
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
  standalone(source) {
    const tpl = new Template({
      source,
      factory: this
    });
    return tpl.compile();
  }
  // создает шаблон из текста
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
  clearCache(template) {
    delete this.cache[template.name];
    delete this.cache[template.absPath];
    template.alias.forEach((alias) => {
      delete this.cache[alias];
    });
  }
  ensure(fileName, absPath) {
    const template = super.ensure(fileName, absPath);
    if (this.watch) {
      if (!this.watchList)
        this.watchList = [];
      if (!this.watcher) {
        this.watcher = (0, import_chokidar.watch)(this.watchList);
        this.watcher.on("change", (fn) => {
          const template2 = this.cache[fn];
          this.clearCache(template2);
          this.ensure(template2.absPath, true);
          delete require.cache[fn];
        });
        this.watcher.on("unlink", (fn) => {
          this.clearCache(this.cache[fn]);
          const index = this.watchList.indexOf(fn);
          delete require.cache[fn];
          const temp = [...this.watchList];
          this.watcher.unwatch(temp);
          this.watchList = this.watchList.splice(index, 1);
          if (this.watchList.length > 0) {
            this.watcher.add(temp);
          }
        });
      }
      if (this.watchList.indexOf(template.absPath) == -1) {
        this.watchList.push(template.absPath);
        this.watcher.add(template.absPath);
      }
    }
    return template;
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
