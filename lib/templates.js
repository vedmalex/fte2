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
  alias: [
    "codeblock.njs"
  ],
  script: function(blockList, _content, partial, slot, options) {
    var out = [];
    var textQuote = false;
    for (var i = 0, len = blockList.length; i < len; i++) {
      var block = blockList[i];
      var cont = block.content;
      switch (block.type) {
        case "text":
          var res = "";
          if (textQuote) {
            var lasItem = out.pop();
            res = "".concat(lasItem, " + ");
          } else {
            textQuote = true;
            res = ";out.push(\n";
          }
          if (block.eol) {
            res += JSON.stringify(cont + "\n");
            res += "\n";
          } else
            res += JSON.stringify(cont);
          out.push(res);
          break;
        case "uexpression":
          var res1 = "";
          if (textQuote) {
            var lasItem1 = out.pop();
            res1 = "".concat(lasItem1, " + ");
          } else {
            textQuote = true;
            res1 = ";out.push(\n";
          }
          res1 += "escapeIt(".concat(cont, ")");
          if (textQuote && !block.eol)
            out.push(res1);
          else
            out.push("".concat(res1, "\n"));
          break;
        case "expression":
          var res2 = "";
          if (textQuote) {
            if (block.start) {
              var lasItem2 = out.pop();
              res2 = "".concat(lasItem2, " + ");
            }
          } else {
            textQuote = true;
            res2 = ";out.push(\n";
          }
          if (block.start && block.end)
            res2 += "(".concat(cont, ")");
          else if (block.start)
            res2 += "(".concat(cont);
          else if (block.end)
            res2 += "".concat(cont, ")");
          else
            res2 += "".concat(cont);
          if (textQuote && !block.eol)
            out.push(res2);
          else
            out.push("".concat(res2, "\n"));
          break;
        case "code":
          if (textQuote) {
            var item = out.pop();
            out.push("".concat(item, ");\n"));
            textQuote = false;
          }
          out.push("".concat(cont).concat(block.eol ? "\n" : ""));
          break;
      }
    }
    if (textQuote) {
      var lasItem3 = out.pop();
      out.push("".concat(lasItem3, ");\n"));
    }
    out.push("");
    return out.join("");
  },
  compile: function() {
    this.alias = [
      "codeblock.njs"
    ];
  },
  dependency: {}
};

// src/templates/compilationError.njs.ts
var compilationError_njs_default = {
  alias: [
    "compilationError.njs"
  ],
  script: function(context, _content, partial, slot, options) {
    var out = [];
    out.push(context.error.message + ";\n" + context.compiledFile + ";");
    return out.join("");
  },
  compile: function() {
    this.alias = [
      "compilationError.njs"
    ];
  },
  dependency: {}
};

// src/templates/compiled.njs.ts
var compiled_njs_default = {
  alias: [
    "compiled.njs"
  ],
  script: function(context, _content, partial, slot, options) {
    var out = [];
    out.push("module.exports = " + partial(context, "core") + ";\n");
    return out.join("");
  },
  compile: function() {
    this.alias = [
      "compiled.njs"
    ];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    core: true
  }
};

// src/templates/es6module.njs.ts
var es6module_njs_default = {
  alias: [
    "es6module.njs"
  ],
  script: function(context, _content, partial, slot, options) {
    var out = [];
    out.push("export default " + partial(context, "core") + ";\n");
    return out.join("");
  },
  compile: function() {
    this.alias = [
      "es6module.njs"
    ];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    core: true
  }
};

// src/templates/MainTemplate.njs.ts
var MainTemplate_njs_default = {
  alias: [
    "MainTemplate.njs"
  ],
  script: function(context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (null == ctx)
        ctx = context;
      return _content(blockName, ctx, content, partial, slot);
    }
    var out = [];
    var directives = context.directives;
    out.push("{\n");
    if (directives.chunks)
      out.push("\nchunks: " + JSON.stringify(directives.chunks) + ",\n");
    out.push("\n");
    if (directives.alias)
      out.push("\nalias: " + JSON.stringify(directives.alias) + ",\n");
    out.push("script: function (" + directives.context + ", _content, partial, slot, options){\n    " + content("maincontent", directives) + "\n    var out = []\n    " + content("chunks-start", directives) + "\n    " + partial(context.main, "codeblock") + "\n    " + content("chunks-finish", directives) + "\n     return out.join('')\n  },\n\n");
    var blockNames = Object.keys(context.blocks);
    if (blockNames.length > 0) {
      out.push("blocks : {\n\n");
      for (var i = 0; i < blockNames.length; i += 1) {
        var block = context.blocks[blockNames[i]];
        out.push('"' + blockNames[i] + '": function(' + block.directives.context + ",  _content, partial, slot, options) {\n      " + content("maincontent", block.directives) + "\n      var out = []\n      " + partial(block.main, "codeblock") + "\n      return out.join('')\n    },\n");
      }
      out.push("\n  },");
    }
    var slotNames = Object.keys(context.slots);
    if (slotNames.length > 0) {
      out.push("slots : {\n\n");
      for (var i1 = 0; i1 < slotNames.length; i1 += 1) {
        var slot1 = context.blocks[slotNames[i1]];
        out.push('"' + slotNames[i1] + '": function(' + slot1.directives.context + ",  _content, partial, slot, options){\n      " + content("maincontent", slot1.directives) + "\n      var out = []\n      " + partial(slot1.main, "codeblock") + "\n      return out.join('')\n    },\n");
      }
      out.push("\n  },\n");
    }
    out.push("\n  compile: function() {\n");
    if (directives.alias)
      out.push("\n    this.alias = " + JSON.stringify(directives.alias) + "\n");
    out.push("\n");
    if (directives.requireAs.length > 0) {
      out.push("\n    this.aliases={}\n");
      var rq;
      for (var i2 = 0, len = directives.requireAs.length; i2 < len; i2++) {
        rq = directives.requireAs[i2];
        out.push('\n    this.aliases["' + rq.alias + '"] = "' + rq.name + '"\n    this.factory.ensure("' + rq.name + '")\n\n');
      }
    }
    out.push("\n\n");
    if (directives.extend)
      out.push("\n    this.parent = " + JSON.stringify(directives.extend) + "\n    this.mergeParent(this.factory.ensure(this.parent))\n");
    out.push("\n  },\n  dependency: {\n  ");
    if (directives.extend)
      out.push(JSON.stringify(directives.extend) + ": true,\n  ");
    if (directives.requireAs.length > 0)
      for (var i2 = 0, len = directives.requireAs.length; i2 < len; i2++) {
        rq = directives.requireAs[i2];
        out.push('\n    "' + rq.name + '": true,\n    "' + rq.alias + '": true,\n\n');
      }
    out.push("\n  }\n}\n");
    return out.join("");
  },
  blocks: {
    maincontent: function(directives, _content, partial, slot, options) {
      var out = [];
      if (directives.escapeIt)
        out.push("\n    const {escapeIt} = options\n  ");
      if (directives.content)
        out.push("\n    function content(blockName, ctx) {\n      if(ctx === undefined || ctx === null) ctx = " + directives.context + "\n      return _content(blockName, ctx, content, partial, slot)\n    }\n  ");
      return out.join("");
    },
    "chunks-start": function(directives, _content, partial, slot, options) {
      var out = [];
      if (directives.chunks)
        out.push("\n    const _partial = partial\n    partial = function(obj, template) {\n      const result = _partial(obj, template)\n      if(Array.isArray(result)){\n        result.forEach(r => {\n          chunkEnsure(r.name, r.content)\n        })\n        return ''\n      } else {\n        return result\n      }\n    }\n    const main = '" + directives.chunks + "'\n    var current = main\n    let outStack = [current]\n    let result\n\n    function chunkEnsure(name, content) {\n      if (!result) {\n        result = {}\n      }\n      if (!result.hasOwnProperty(name)) {\n        result[name] = content ? content : []\n      }\n    }\n    function chunkStart(name) {\n      chunkEnsure(name)\n      chunkEnd()\n      current = name\n      out = []\n    }\n    function chunkEnd() {\n      result[current].push(out)\n      out = []\n      current = outStack.pop() || main\n    }\n    chunkStart(main)\n  ");
      return out.join("");
    },
    "chunks-finish": function(directives, _content, partial, slot, options) {
      var out = [];
      if (directives.chunks) {
        out.push("\n    chunkEnd()\n    ");
        if (directives.useHash) {
          out.push("\n    out = result\n      ");
          if (!directives.includeMainChunk)
            out.push("\n    delete out['" + directives.chunks + "']\n      ");
          out.push("\n    ");
        } else {
          out.push("\n    out = Object.keys(result)\n      ");
          if (!directives.includeMainChunk)
            out.push("\n      .filter(i => i !== '" + directives.chunks + "')\n      ");
          out.push("\n      .map(curr => ({ name: curr, content: result[curr] }))\n      ");
        }
        out.push("\n  ");
      }
      return out.join("");
    }
  },
  compile: function() {
    this.alias = [
      "MainTemplate.njs"
    ];
    this.aliases = {};
    this.aliases["codeblock"] = "codeblock.njs";
    this.factory.ensure("codeblock.njs");
  },
  dependency: {
    "codeblock.njs": true,
    codeblock: true
  }
};

// src/templates/raw.njs.ts
var raw_njs_default = {
  alias: [
    "raw.njs"
  ],
  script: function(context, _content, partial, slot, options) {
    var out = [];
    out.push("(function(){\n  return " + partial(context, "core") + ";\n})();");
    return out.join("");
  },
  compile: function() {
    this.alias = [
      "raw.njs"
    ];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    core: true
  }
};

// src/templates/singlefile.es6.njs.ts
var singlefile_es6_njs_default = {
  alias: [
    "singlefile.es6.njs"
  ],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n\nexport const templates = {\n");
    files.forEach(function(file) {
      out.push("['" + (file.template.alias || file.name) + "']: " + partial(file.template, "core") + ",\n");
    });
    out.push("\n}\n\nconst F = new Factory(templates)\n\nexport function run (context, name) {\n  return F.run(context, name)\n}\n\n");
    return out.join("");
  },
  compile: function() {
    this.alias = [
      "singlefile.es6.njs"
    ];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    core: true
  }
};

// src/templates/singlefile.njs.ts
var singlefile_njs_default = {
  alias: [
    "singlefile.njs"
  ],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n\nconst templates = {\n");
    files.forEach(function(file) {
      out.push("['" + (file.template.alias || file.name) + "']: " + partial(file.template, "core") + ",\n");
    });
    out.push("\n}\n\nexports.templates = templates\nconst F = new Factory(templates)\n\nfunction run(context, name){\n  return F.run( context, name )\n}\n\nexports.run = run\n");
    return out.join("");
  },
  compile: function() {
    this.alias = [
      "singlefile.njs"
    ];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    core: true
  }
};

// src/templates/standalone.es6.njs.ts
var standalone_es6_njs_default = {
  alias: [
    "standalone.es6.njs"
  ],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n\n");
    for (var i = 0; i < files.length; i += 1)
      out.push("import " + files[i].name.replaceAll(/[\s\.]/g, "_") + " from '" + files[i].path + "'\n");
    out.push("\n\nconst templates = {\n");
    for (var i1 = 0; i1 < files.length; i1 += 1)
      out.push("'" + files[i1].name + "': " + files[i1].name.replaceAll(/[\s\.]/g, "_") + ",\n");
    out.push("\n}\n\nconst F = new Factory(templates)\n\nmodule.exports = (context, name) => {\n  return F.run( context, name )\n}\n");
    return out.join("");
  },
  compile: function() {
    this.alias = [
      "standalone.es6.njs"
    ];
  },
  dependency: {}
};

// src/templates/standalone.index.es6.njs.ts
var standalone_index_es6_njs_default = {
  alias: [
    "standalone.index.es6.njs"
  ],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    for (var i = 0; i < files.length; i += 1)
      out.push("import " + files[i].name.replaceAll(/[\s\.]/g, "_") + " from '" + files[i].path + "'\n");
    out.push("\n\nconst templates = {\n");
    for (var i1 = 0; i1 < files.length; i1 += 1)
      out.push("'" + files[i1].name + "': " + files[i1].name.replaceAll(/[\s\.]/g, "_") + ",\n");
    out.push("\n}\nexport default templates");
    return out.join("");
  },
  compile: function() {
    this.alias = [
      "standalone.index.es6.njs"
    ];
  },
  dependency: {}
};

// src/templates/standalone.index.njs.ts
var standalone_index_njs_default = {
  alias: [
    "standalone.index.njs"
  ],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("const templates = {\n");
    for (var i = 0; i < files.length; i += 1)
      out.push("'" + files[i].name + "': require('" + files[i].path + "'),\n");
    out.push("\n}\nmodule.exports = templates");
    return out.join("");
  },
  compile: function() {
    this.alias = [
      "standalone.index.njs"
    ];
  },
  dependency: {}
};

// src/templates/standalone.njs.ts
var standalone_njs_default = {
  alias: [
    "standalone.njs"
  ],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n\nconst templates = {\n");
    for (var i = 0; i < files.length; i += 1)
      out.push("'" + files[i].name + "': require('" + files[i].path + "'),\n");
    out.push("\n}\n\nconst F = new Factory(templates)\n\nmodule.exports = (context, name) => {\n  return F.run( context, name )\n}\n");
    return out.join("");
  },
  compile: function() {
    this.alias = [
      "standalone.njs"
    ];
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
