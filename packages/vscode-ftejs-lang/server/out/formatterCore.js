"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTemplateCodeView = extractTemplateCodeView;
exports.extractInstructionCodeView = extractInstructionCodeView;
function getHostAdapter(host) {
    const resolved = host || 'html';
    if (resolved === 'html' || resolved === 'markdown') {
        return { commentStart: '<!--', commentEnd: '-->', stringQuote: '"' };
    }
    return { commentStart: '/*', commentEnd: '*/', stringQuote: '"' };
}
function escapeForStringLiteral(text, quote) {
    const q = quote || '"';
    return text
        .replace(/\\/g, '\\\\')
        .replace(new RegExp(q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\\\$&'), 'g'), `\\${q}`)
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n');
}
function extractTemplateCodeView(originalText, ast, options = {}) {
    const tokens = Array.isArray(ast?.tokens) ? ast.tokens : [];
    if (!tokens.length)
        return { code: originalText };
    const { commentStart, commentEnd } = getHostAdapter(options.hostLanguage || 'html');
    const PLACEHOLDER = '⟦expr⟧';
    const out = [];
    for (const t of tokens) {
        const raw = (t.start || '') + (t.content || '') + (t.end || '');
        switch (t.type) {
            case 'text': {
                out.push(raw);
                if (t.eol)
                    out.push('\n');
                break;
            }
            case 'expression': {
                out.push(PLACEHOLDER);
                if (t.eol)
                    out.push('\n');
                break;
            }
            case 'directive':
            case 'code':
            case 'blockStart':
            case 'blockEnd':
            case 'slotStart':
            case 'comments': {
                out.push(`${commentStart} ${raw.trim()} ${commentEnd}`);
                if (t.eol)
                    out.push('\n');
                break;
            }
            default: {
                out.push(raw);
                if (t.eol)
                    out.push('\n');
                break;
            }
        }
    }
    return { code: out.join('') };
}
function extractInstructionCodeView(originalText, ast, options = {}) {
    const tokens = Array.isArray(ast?.tokens) ? ast.tokens : [];
    if (!tokens.length)
        return { code: '' };
    const quote = getHostAdapter(options.hostLanguage === 'typescript'
        ? 'javascript'
        : options.hostLanguage || 'javascript').stringQuote;
    const out = [];
    for (const t of tokens) {
        const raw = (t.start || '') + (t.content || '') + (t.end || '');
        if (t.type === 'text') {
            const text = t.content + (t.eol ? '\n' : '');
            out.push(`${quote}${escapeForStringLiteral(text || '', quote)}${quote}`);
            continue;
        }
        if (t.type === 'expression') {
            const inner = String(t.content || '').trim();
            out.push(`(${inner})`);
            continue;
        }
        if (t.type === 'code') {
            const inner = String(t.content || '').trim();
            if (inner)
                out.push(inner);
            continue;
        }
        if (t.type === 'directive' ||
            t.type === 'blockStart' ||
            t.type === 'blockEnd' ||
            t.type === 'slotStart' ||
            t.type === 'comments') {
            out.push(`/* ${raw.trim()} */`);
            continue;
        }
        out.push(raw);
    }
    return { code: out.join('\n') };
}
//# sourceMappingURL=formatterCore.js.map