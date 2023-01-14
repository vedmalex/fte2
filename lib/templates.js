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

// src/templates/index.ts
var templates_exports = {};
__export(templates_exports, {
  default: () => templates_default
});
module.exports = __toCommonJS(templates_exports);

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
    const { directives } = context;
    out.push("\n");
    out.push("{\n");
    if (directives.chunks) {
      out.push("\n");
      out.push("chunks: " + JSON.stringify(directives.chunks) + ",\n");
    }
    out.push("\n");
    if (directives.alias) {
      out.push("\n");
      out.push("alias: " + JSON.stringify(directives.alias) + ",\n");
    }
    out.push("script: function (" + directives.context + ", _content, partial, slot, options){\n");
    out.push(options.applyIndent(content("maincontent", directives), "    ") + "\n");
    out.push("    var out = []\n");
    out.push(options.applyIndent(content("chunks-start", directives), "    ") + "\n");
    out.push(options.applyIndent(partial(context.main, "codeblock"), "    ") + "\n");
    out.push(options.applyIndent(content("chunks-finish", directives), "    "));
    if (directives.chunks) {
      out.push("\n");
      out.push("    if(out.some(t=>typeof t == 'object')){\n");
      out.push("      return out.map(chunk=>({...chunk, content:Array.isArray(chunk.content)?chunk.content.join(''):chunk.content}))\n");
      out.push("    } else {\n");
      out.push("      return out.join('')\n");
      out.push("    }");
    } else {
      out.push("\n");
      out.push("      return out.join('')");
    }
    out.push("\n");
    out.push("  },\n");
    const blockNames = Object.keys(context.blocks);
    if (blockNames.length > 0) {
      out.push("\n");
      out.push("  blocks : {\n");
      for (let i2 = 0; i2 < blockNames.length; i2 += 1) {
        const block = context.blocks[blockNames[i2]];
        out.push("\n");
        out.push('    "' + blockNames[i2] + '": function(' + block.directives.context + ",  _content, partial, slot, options) {\n");
        out.push(options.applyIndent(content("maincontent", block.directives), "      ") + "\n");
        out.push("      var out = []\n");
        out.push(options.applyIndent(partial(block.main, "codeblock"), "      "));
        if (directives.chunks) {
          out.push("\n");
          out.push("      if(out.some(t=>typeof t == 'object')){\n");
          out.push("        return out.map(chunk=>({...chunk, content:Array.isArray(chunk.content)?chunk.content.join(''):chunk.content}))\n");
          out.push("      } else {\n");
          out.push("        return out.join('')\n");
          out.push("      }");
        } else {
          out.push("\n");
          out.push("        return out.join('')");
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
      out.push("  slots : {\n");
      for (let i2 = 0; i2 < slotNames.length; i2 += 1) {
        const slot2 = context.blocks[slotNames[i2]];
        out.push("\n");
        out.push('    "' + slotNames[i2] + '": function(' + slot2.directives.context + ",  _content, partial, slot, options){\n");
        out.push(options.applyIndent(content("maincontent", slot2.directives), "      ") + "\n");
        out.push("      var out = []\n");
        out.push(options.applyIndent(partial(slot2.main, "codeblock"), "      "));
        if (directives.chunks) {
          out.push("\n");
          out.push("      if(out.some(t=>typeof t == 'object')){\n");
          out.push("        return out.map(chunk=>({...chunk, content:Array.isArray(chunk.content)?chunk.content.join(''):chunk.content}))\n");
          out.push("      } else {\n");
          out.push("        return out.join('')\n");
          out.push("      }");
        } else {
          out.push("\n");
          out.push("        return out.join('')");
        }
        out.push("\n");
        out.push("    },");
      }
      out.push("\n");
      out.push("  },");
    }
    out.push("\n");
    out.push("  compile: function() {");
    if (directives.alias) {
      out.push("\n");
      out.push("    this.alias = " + JSON.stringify(directives.alias));
    }
    if (directives.requireAs.length > 0) {
      out.push("\n");
      out.push("    this.aliases={}");
      var rq;
      for (var i = 0, len = directives.requireAs.length; i < len; i++) {
        rq = directives.requireAs[i];
        out.push("\n");
        out.push('    this.aliases["' + rq.alias + '"] = "' + rq.name + '"\n');
        out.push('    this.factory.ensure("' + rq.name + '")\n');
      }
    }
    if (directives.extend) {
      out.push("\n");
      out.push("    this.parent = " + JSON.stringify(directives.extend) + "\n");
      out.push("    this.mergeParent(this.factory.ensure(this.parent))");
    }
    out.push("\n");
    out.push("  },\n");
    out.push("  dependency: {");
    if (directives.extend) {
      out.push("\n");
      out.push(options.applyIndent(JSON.stringify(directives.extend), "    ") + ": true,");
    }
    if (directives.requireAs.length > 0) {
      for (var i = 0, len = directives.requireAs.length; i < len; i++) {
        rq = directives.requireAs[i];
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
    "maincontent": function(directives, _content, partial, slot, options) {
      var out = [];
      if (directives?.content) {
        out.push("\n");
        out.push("    function content(blockName, ctx) {\n");
        out.push("      if(ctx === undefined || ctx === null) ctx = " + directives.context + "\n");
        out.push("      return _content(blockName, ctx, content, partial, slot)\n");
        out.push("    }");
      }
      return out.join("");
    },
    "chunks-start": function(directives, _content, partial, slot, options) {
      var out = [];
      if (directives.chunks) {
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
        out.push("    const main = '" + directives.chunks + "'\n");
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
        out.push("    chunkStart(main)");
      }
      return out.join("");
    },
    "chunks-finish": function(directives, _content, partial, slot, options) {
      var out = [];
      if (directives.chunks) {
        out.push("\n");
        out.push("    chunkEnd()");
        if (!directives.useHash) {
          out.push("\n");
          out.push("    out = Object.keys(result)");
          if (!directives.includeMainChunk) {
            out.push("\n");
            out.push("      .filter(i => i !== '" + directives.chunks + "')");
          }
          out.push("\n");
          out.push("      .map(curr => ({ name: curr, content: result[curr] }))");
        } else {
          out.push("\n");
          out.push("    out = result");
          if (!directives.includeMainChunk) {
            out.push("\n");
            out.push("    delete out['" + directives.chunks + "']");
          }
        }
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
