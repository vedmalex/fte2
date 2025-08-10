import { TemplateBase } from "fte.js-base";
import { TemplateSourceMapGenerator } from "fte.js-base";

export interface MainTemplateOptions {
    escapeIt: (str: string) => string;
    applyIndent: (str: string, indent: string) => string;
    applyDeindent: (str: string) => string;
    sourceMap?: boolean;
    sourceFile?: string;
    sourceRoot?: string;
    inline?: boolean;
    promise?: boolean;
    stream?: boolean;
}

export interface MainTemplateResult {
    code: string;
    map?: any;
}

export default {
    alias: [
        "MainTemplate.njs"
    ],
    aliases: {
        "codeblock": "codeblock.njs"
    },
    script: function(context, _content, partial, slot, options: MainTemplateOptions): MainTemplateResult {
        function content<T>(blockName: string, ctx: T) {
            if (ctx === undefined || ctx === null) ctx = context;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out: Array<string> = [];
        const { directives } = context;

        // Передаем опции source map в partial
        const partialOptions = {
            ...options,
            sourceMap: options.sourceMap,
            sourceFile: options.sourceFile,
            sourceRoot: options.sourceRoot,
            inline: options.inline
        };

        // Обрабатываем результат из partial, который теперь может содержать source map
        const mainResult = partial(context.main, "codeblock", partialOptions);
        const mainCode = typeof mainResult === 'string' ? mainResult : mainResult.code;
        if (typeof mainCode !== 'string') {
            throw new Error("MainTemplate.njs: codeblock returned non-string for main");
        }
        const mainMap = typeof mainResult === 'string' ? undefined : mainResult.map;

        out.push("{");
        if (directives.chunks) {
            out.push("\n");
            out.push("chunks: " + (JSON.stringify(directives.chunks)) + ",");
        }
        if (directives.alias) {
            out.push("\n");
            out.push("alias: " + (JSON.stringify(directives.alias)) + ",");
        }
        out.push("\n");
        out.push("\n");
        const asyncMode = !!(options as any)?.promise;
        const streamMode = !!(options as any)?.stream;
        out.push("script: function (" + (directives.context) + ", _content, partial, slot, options){\n");
        out.push((options.applyIndent(content("maincontent", directives), "    ")) + "\n");
        if (streamMode && !directives.chunks) {
            out.push("    const __isThenable = v => v && typeof v.then==='function'\n");
            out.push("    const __makeQ = ()=>{ const buf=[]; let res; let done=false; return { push: v=>{ buf.push(v); if(res){ res(); res=undefined } }, end:()=>{ done=true; if(res){res()} }, async *iter(){ while(true){ if(buf.length){ yield buf.shift(); continue } if(done) return; await new Promise(r=>res=r) } } }\n");
            out.push("    const __q = __makeQ()\n");
            out.push("    var out = { push: v => __isThenable(v) ? v.then(v2=>__q.push(v2)) : __q.push(v) }\n");
        } else {
            out.push("    var out = []\n");
            if (asyncMode) {
                out.push("    const __isThenable = v => v && typeof v.then==='function'\n");
                out.push("    const __aj = async arr => { const a = await Promise.all(Array.from(arr, v => __isThenable(v)? v : Promise.resolve(v))); return Array.isArray(a) ? a.join('') : String(a) }\n");
            }
        }
        out.push((options.applyIndent(content("chunks-start", directives), "    ")) + "\n");
        out.push("/*__MAIN_START__*/\n");
        if (asyncMode) {
            out.push((options.applyIndent("(async ()=>{\n" + String(mainCode) + "\n})().then(v=>{ if(typeof v==='string') out.push(v) })", "    ")) + "\n");
        } else {
            out.push((options.applyIndent(String(mainCode), "    ")) + "\n");
        }
        out.push("/*__MAIN_END__*/");
        out.push((options.applyIndent(content("chunks-finish", directives), "    ")));
        if (directives.chunks) {
            out.push("\n");
            out.push("    if(out.some(t=>typeof t == 'object')){\n");
            out.push(asyncMode
              ? "      return Promise.all(out.map(async chunk => (\n"
              : "      return out.map(chunk=(\n");
            out.push("          {...chunk,\n");
            out.push("            content:");
            if (directives.deindent) {
                out.push(" options.applyDeindent(");
            }
            out.push("\n");
            out.push(asyncMode
              ? "            Array.isArray(chunk.content)\n              ? await __aj(chunk.content)\n              : chunk.content"
              : "            Array.isArray(chunk.content)\n              ? chunk.content.join('')\n              : chunk.content");
            if (directives.deindent) {
                out.push(")");
            }
            out.push("\n");
            out.push("          }\n");
            out.push("        )\n");
            out.push(asyncMode ? "      ))\n" : "      )\n");
            out.push("    } else {\n");
            if (asyncMode) {
                out.push("      return __aj(out)\n");
            } else {
                out.push("      return ");
                if (directives.deindent) {
                    out.push(" options.applyDeindent(");
                }
                out.push("out");
                if (directives.deindent) {
                    out.push(")");
                }
                out.push(".join('')\n");
            }
            out.push("    }");
        } else {
            out.push("\n");
            if (streamMode) {
                out.push("      __q.end(); return __q.iter()");
            } else if (asyncMode) {
                out.push("      return __aj(out)");
            } else {
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
        }
        out.push("\n");
        out.push("  },");
        const blockNames = Object.keys(context.blocks);
        if (blockNames.length > 0) {
            out.push("\n");
            out.push("  blocks : {");
            for(let i = 0; i < blockNames.length; i += 1){
                const block = context.blocks[blockNames[i]];
                out.push("\n");
                out.push('    "' + (blockNames[i]) + '": function(' + (block.directives.context) + ",  _content, partial, slot, options) {\n");
                out.push((options.applyIndent(content("maincontent", block.directives), "      ")) + "\n");
                out.push("      var out = []\n");

                // Обрабатываем результат из partial для блока
                const blockResult = partial(block.main, "codeblock", partialOptions);
                const blockCode = typeof blockResult === 'string' ? blockResult : blockResult.code;
                if (typeof blockCode !== 'string') { throw new Error("MainTemplate.njs: codeblock returned non-string for block '" + (blockNames[i]) + "'"); }
                out.push((options.applyIndent(String(blockCode), "      ")));

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
                    if (asyncMode) {
                        out.push("        return __aj(out)\n");
                    } else {
                        out.push("        return ");
                        if (directives.deindent) {
                            out.push(" options.applyDeindent(");
                        }
                        out.push("out");
                        if (directives.deindent) {
                            out.push(")");
                        }
                        out.push(".join('')\n");
                    }
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
            for(let i = 0; i < slotNames.length; i += 1){
                const slot = context.slots[slotNames[i]];
                out.push("\n");
                out.push('    "' + (slotNames[i]) + '": function(' + (slot.directives.context) + ",  _content, partial, slot, options){\n");
                out.push((options.applyIndent(content("maincontent", slot.directives), "      ")) + "\n");
                out.push("      var out = []\n");

                // Обрабатываем результат из partial для слота
                const slotResult = partial(slot.main, "codeblock", partialOptions);
                const slotCode = typeof slotResult === 'string' ? slotResult : slotResult.code;
                if (typeof slotCode !== 'string') { throw new Error("MainTemplate.njs: codeblock returned non-string for slot '" + (slotNames[i]) + "'"); }
                out.push((options.applyIndent(String(slotCode), "      ")));

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
                    if (asyncMode) {
                        out.push("        return __aj(out)\n");
                    } else {
                        out.push("        return ");
                        if (directives.deindent) {
                            out.push(" options.applyDeindent(");
                        }
                        out.push("out");
                        if (directives.deindent) {
                            out.push(")");
                        }
                        out.push(".join('')\n");
                    }
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
        if (directives.chunks) {
            out.push("\n");
            out.push("    this.chunks = " + (JSON.stringify(directives.chunks)));
        }
        if (directives.alias) {
            out.push("\n");
            out.push("    this.alias = " + (JSON.stringify(directives.alias)));
        }
        if (directives.requireAs.length > 0) {
            out.push("\n");
            out.push("    this.aliases={}");
            var rq;
            for(var i = 0, len = directives.requireAs.length; i < len; i++){
                rq = directives.requireAs[i];
                out.push("\n");
                out.push('    this.aliases["' + (rq.alias) + '"] = "' + (rq.name) + '"\n');
                out.push('    this.factory.ensure("' + (rq.name) + '")');
            }
        }
        if (directives.extend) {
            out.push("\n");
            out.push("    this.parent = " + (JSON.stringify(directives.extend)) + "\n");
            out.push("    this.mergeParent(this.factory.ensure(this.parent))");
        }
        out.push("\n");
        out.push("  },\n");
        out.push("  dependency: {");
        if (directives.extend) {
            out.push("\n");
            out.push((options.applyIndent(JSON.stringify(directives.extend), "    ")) + ": true,");
        }
        if (directives.requireAs.length > 0) {
            for(var i = 0, len = directives.requireAs.length; i < len; i++){
                rq = directives.requireAs[i];
                out.push("\n");
                out.push('    "' + (rq.name) + '": true,\n');
                out.push('    "' + (rq.alias) + '": true,');
            }
        }
        out.push("\n");
        out.push("  }\n");
        out.push("}");

        let result = out.join("");

        // Если у нас есть source map от основного контента, расширяем его до всего результата
        if (mainMap) {
            const startMarker = "/*__MAIN_START__*/\n";
            const endMarker = "/*__MAIN_END__*/";
            const startIdx = result.indexOf(startMarker);
            const endIdx = result.indexOf(endMarker);
            const totalLines = result.split(/\r?\n/).length;
            const prefixLines = startIdx >= 0 ? result.slice(0, startIdx).split(/\r?\n/).length : 0;
            const indentColumns = 4; // we applyIndent with 4 spaces

            // Remove markers from code
            result = result.replace(startMarker, "").replace(endMarker, "");

            const gen = new TemplateSourceMapGenerator({
                file: options.sourceFile,
                sourceRoot: options.sourceRoot,
            });

            const primarySource = Array.isArray((mainMap as any).sources) && (mainMap as any).sources.length
                ? (mainMap as any).sources[0]
                : 'template.njs';

            // Map every line start to ensure dense mapping lines
            for (let i = 1; i <= totalLines; i += 1) {
                gen.addSegment({
                    generatedLine: i,
                    generatedColumn: 0,
                    originalLine: 1,
                    originalColumn: 0,
                    source: primarySource,
                    name: undefined,
                    content: undefined as any,
                } as any);
            }

            // Re-emit specific segments from inner main map with line/column shift
            const segs = (mainMap as any)?.template?.segments || [];
            if (Array.isArray(segs)) {
                for (const s of segs) {
                    gen.addSegment({
                        generatedLine: prefixLines + s.generatedLine,
                        generatedColumn: indentColumns + (s.generatedColumn || 0),
                        originalLine: s.originalLine,
                        originalColumn: s.originalColumn,
                        source: s.source,
                        name: s.name,
                        content: s.content,
                    });
                }
            }

            return {
                code: result,
                map: gen.toJSON(),
            };
        }

        return {
            code: result
        };
    },
    blocks: {
        "maincontent": function(directives, _content, partial, slot, options) {
            var out: Array<string> = [];
            if (directives?.content) {
                out.push("function content(blockName, ctx) {\n");
                out.push("  if(ctx === undefined || ctx === null) ctx = " + (directives.context) + "\n");
                out.push("  return _content(blockName, ctx, content, partial, slot)\n");
                out.push("}");
            }
            out.push("");
            return out.join("");
        },
        "chunks-start": function(directives, _content, partial, slot, options) {
            var out: Array<string> = [];
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
                out.push("const main = '" + (directives.chunks) + "'\n");
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
            var out: Array<string> = [];
            if (directives.chunks) {
                out.push("\n");
                out.push("    chunkEnd()");
                if (!directives.useHash) {
                    out.push("\n");
                    out.push("    out = Object.keys(result)");
                    if (!directives.includeMainChunk) {
                        out.push("\n");
                        out.push("      .filter(i => i !== '" + (directives.chunks) + "')");
                    }
                    out.push("\n");
                    out.push("      .map(curr => ({ name: curr, content: result[curr] }))");
                } else {
                    out.push("\n");
                    out.push("    out = result");
                    if (!directives.includeMainChunk) {
                        out.push("\n");
                        out.push("    delete out['" + (directives.chunks) + "']");
                    }
                }
            }
            out.push("");
            return out.join("");
        }
    },
    compile: function(this: TemplateBase) {
        this.factory.ensure("codeblock.njs");
    },
    dependency: {
        "codeblock.njs": true,
        "codeblock": true
    }
};
