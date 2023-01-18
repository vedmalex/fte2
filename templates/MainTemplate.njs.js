module.exports = {
  alias: ["MainTemplate.njs"],
  script: function(context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === void 0 || ctx === null)
        ctx = context;
      return _content(blockName, ctx, content, partial, slot);
    }
    var out = [];
    const { directives } = context;
    out.push("{");
    if (directives.chunks) {
      out.push("\n");
      out.push("chunks: " + JSON.stringify(directives.chunks) + ",");
    }
    if (directives.alias) {
      out.push("\n");
      out.push("alias: " + JSON.stringify(directives.alias) + ",");
    }
    out.push("\n");
    out.push("\n");
    out.push("script: function (" + directives.context + ", _content, partial, slot, options){\n");
    out.push(options.applyIndent(content("maincontent", directives), "    ") + "\n");
    out.push("    var out = []\n");
    out.push(options.applyIndent(content("chunks-start", directives), "    ") + "\n");
    out.push(options.applyIndent(partial(context.main, "codeblock"), "    ") + "\n");
    out.push(options.applyIndent(content("chunks-finish", directives), "    "));
    if (directives.chunks) {
      out.push("\n");
      out.push("    if(out.some(t=>typeof t == 'object')){\n");
      out.push("      return out.map(chunk=>(\n");
      out.push("          {...chunk,\n");
      out.push("            content:");
      if (directives.deindent) {
        out.push(" options.applyDeindent(");
      }
      out.push("\n");
      out.push("            Array.isArray(chunk.content)\n");
      out.push("              ? chunk.content.join('')\n");
      out.push("              : chunk.content");
      if (directives.deindent) {
        out.push(")");
      }
      out.push("\n");
      out.push("          }\n");
      out.push("        )\n");
      out.push("      )\n");
      out.push("    } else {\n");
      out.push("      return ");
      if (directives.deindent) {
        out.push(" options.applyDeindent(");
      }
      out.push("out");
      if (directives.deindent) {
        out.push(")");
      }
      out.push(".join('')\n");
      out.push("    }");
    } else {
      out.push("\n");
      out.push("      return ");
      if (directives.deindent) {
        out.push(" options.applyDeindent(");
      }
      out.push("out");
      if (directives.deindent) {
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
        if (directives.chunks) {
          out.push("\n");
          out.push("      if(out.some(t=>typeof t == 'object')){\n");
          out.push("        return out.map(chunk=>(\n");
          out.push("            {...chunk,\n");
          out.push("              content:");
          if (directives.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("\n");
          out.push("              Array.isArray(chunk.content)\n");
          out.push("                ? chunk.content.join('')\n");
          out.push("                : chunk.content");
          if (directives.deindent) {
            out.push(")");
          }
          out.push("\n");
          out.push("            }\n");
          out.push("          )\n");
          out.push("        )\n");
          out.push("      } else {\n");
          out.push("        return ");
          if (directives.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("out");
          if (directives.deindent) {
            out.push(")");
          }
          out.push(".join('')\n");
          out.push("      }");
        } else {
          out.push("\n");
          out.push("        return ");
          if (directives.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("out");
          if (directives.deindent) {
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
        if (directives.chunks) {
          out.push("\n");
          out.push("      if(out.some(t=>typeof t == 'object')){\n");
          out.push("        return out.map(chunk=>(\n");
          out.push("            {...chunk,\n");
          out.push("              content:");
          if (directives.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("\n");
          out.push("              Array.isArray(chunk.content)\n");
          out.push("                ? chunk.content.join('')\n");
          out.push("                : chunk.content");
          if (directives.deindent) {
            out.push(")");
          }
          out.push("\n");
          out.push("            }\n");
          out.push("          )\n");
          out.push("        )\n");
          out.push("      } else {\n");
          out.push("        return ");
          if (directives.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("out");
          if (directives.deindent) {
            out.push(")");
          }
          out.push(".join('')\n");
          out.push("      }");
        } else {
          out.push("\n");
          out.push("        return ");
          if (directives.deindent) {
            out.push(" options.applyDeindent(");
          }
          out.push("out");
          if (directives.deindent) {
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
        out.push('    this.factory.ensure("' + rq.name + '")');
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
        out.push('    "' + rq.alias + '": true,');
      }
    }
    out.push("\n");
    out.push("  }\n");
    out.push("}");
    return out.join("");
  },
  blocks: {
    "maincontent": function(directives, _content, partial, slot, options) {
      var out = [];
      if (directives?.content) {
        out.push("function content(blockName, ctx) {\n");
        out.push("  if(ctx === undefined || ctx === null) ctx = " + directives.context + "\n");
        out.push("  return _content(blockName, ctx, content, partial, slot)\n");
        out.push("}");
      }
      out.push("");
      return out.join("");
    },
    "chunks-start": function(directives, _content, partial, slot, options) {
      var out = [];
      if (directives.chunks) {
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
        out.push("const main = '" + directives.chunks + "'\n");
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
