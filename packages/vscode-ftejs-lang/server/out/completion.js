import * as fs from 'fs';
import { CompletionItemKind, InsertTextFormat, } from 'vscode-languageserver/node.js';
export function getCompletions(docText, docUri, position, deps) {
    const text = docText;
    const offset = (() => {
        const lines = text.split(/\r?\n/);
        let acc = 0;
        for (let i = 0; i < position.line; i++)
            (acc += lines[i]?.length ?? 0), (acc += 1);
        acc += position.character;
        return acc;
    })();
    const prefix = text.slice(Math.max(0, offset - 50), offset);
    const before = text.slice(0, offset);
    const items = [];
    const { usageDocs, parseContent, getExtendTargetFrom, fileIndex } = deps;
    if (/<#@\s+[\w-]*$/.test(prefix)) {
        items.push(...Object.keys(usageDocs.directives).map((d) => ({
            label: d,
            kind: CompletionItemKind.Keyword,
            documentation: usageDocs.directives[d] || undefined,
        })));
    }
    if (/<#-?\s*(block|slot)\s+['"`][^'"`]*$/.test(prefix)) {
        items.push({ label: 'end', kind: CompletionItemKind.Keyword });
    }
    if (/<#-?\s*$/.test(prefix)) {
        const snippets = [
            {
                label: 'block (with end)',
                kind: CompletionItemKind.Snippet,
                insertTextFormat: InsertTextFormat.Snippet,
                insertText: "<# block '${1:name}' : #>\n\t$0\n<# end #>",
            },
            {
                label: 'block trimmed (with end)',
                kind: CompletionItemKind.Snippet,
                insertTextFormat: InsertTextFormat.Snippet,
                insertText: "<#- block '${1:name}' : -#>\n\t$0\n<#- end -#>",
            },
            {
                label: 'slot (with end)',
                kind: CompletionItemKind.Snippet,
                insertTextFormat: InsertTextFormat.Snippet,
                insertText: "<# slot '${1:name}' : #>\n\t$0\n<# end #>",
            },
            {
                label: 'slot trimmed (with end)',
                kind: CompletionItemKind.Snippet,
                insertTextFormat: InsertTextFormat.Snippet,
                insertText: "<#- slot '${1:name}' : -#>\n\t$0\n<#- end -#>",
            },
        ];
        items.push(...snippets);
    }
    if (/#\{\s*[\w$]*$/.test(prefix)) {
        const f = (name) => ({
            label: name,
            kind: CompletionItemKind.Function,
            documentation: usageDocs.functions[name] || undefined,
        });
        items.push(f('content'), f('partial'), f('slot'), f('chunkStart'), f('chunkEnd'));
        const argPrefix = before.match(/content\(\s*(["'`])([^"'`]*)$/) ||
            before.match(/slot\(\s*(["'`])([^"'`]*)$/);
        if (argPrefix) {
            const ast = parseContent(text);
            const seen = new Set(Object.keys(ast?.blocks || {}));
            const parentAbs = getExtendTargetFrom(text, docUri);
            if (parentAbs) {
                try {
                    const src = fs.readFileSync(parentAbs, 'utf8');
                    const pAst = parseContent(src);
                    for (const k of Object.keys(pAst?.blocks || {}))
                        seen.add(k);
                }
                catch { }
            }
            for (const [, info] of fileIndex) {
                for (const k of info.blocks.keys())
                    seen.add(k);
            }
            for (const name of seen) {
                items.push({ label: name, kind: CompletionItemKind.Text });
            }
        }
    }
    return items;
}
//# sourceMappingURL=completion.js.map