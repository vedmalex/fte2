"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lint = exports.format = void 0;
const DEFAULT_OPTIONS = {
    ensureFinalNewline: true,
    trimTrailingWhitespace: true,
};
function format(input, options = {}) {
    const cfg = { ...DEFAULT_OPTIONS, ...options };
    const lines = input.split(/\r?\n/);
    const processed = [];
    for (let i = 0; i < lines.length; i += 1) {
        let line = lines[i];
        if (cfg.trimTrailingWhitespace) {
            line = line.replace(/\s+$/g, '');
        }
        const HEAVY = /^(.*?)(<#@[^]*?#>|<#[\-]?\s+(?:block|slot)[\s\S]*?:\s+#>|<#[\-]?\s+end\s+[\-]?#>|<%_?[\s\S]*?(?:-%>|_%>|%>)|<\*[\s\S]*?\*>)(.*)$/;
        let rest = line;
        let matched = false;
        while (true) {
            const m = rest.match(HEAVY);
            if (!m)
                break;
            matched = true;
            const [, before, token, after] = m;
            const beforeTrimmed = before.replace(/\s+$/g, '');
            const afterTrimmed = after.replace(/^\s+/g, '');
            if (beforeTrimmed)
                processed.push(beforeTrimmed);
            processed.push(token);
            rest = afterTrimmed;
        }
        if (matched) {
            if (rest)
                processed.push(rest);
            continue;
        }
        processed.push(line);
    }
    const detectIndentStyle = (arr) => {
        let tabCount = 0;
        let spaceCount = 0;
        for (const l of arr) {
            const m = l.match(/^(\s+)/);
            if (!m)
                continue;
            const ws = m[1];
            if (ws.includes('\t'))
                tabCount += 1;
            else
                spaceCount += 1;
        }
        if (cfg.indent === 'tab')
            return '\t';
        if (typeof cfg.indent === 'number' && cfg.indent > 0)
            return ' '.repeat(cfg.indent);
        if (tabCount > spaceCount)
            return '\t';
        return '  ';
    };
    const indentUnit = detectIndentStyle(processed);
    const indented = [];
    let depth = 0;
    for (let i = 0; i < processed.length; i += 1) {
        const ln = processed[i];
        const isStart = /<#[\-]?\s+(?:block|slot)\b[\s\S]*?:\s+#>/.test(ln);
        const isEnd = /<#[\-]?\s+end\s+[\-]?#>/.test(ln);
        const baseDepth = isEnd ? Math.max(depth - 1, 0) : depth;
        const shouldIndent = ln.trim().length > 0;
        const newLine = shouldIndent ? indentUnit.repeat(baseDepth) + ln.trim() : '';
        indented.push(newLine);
        if (isStart)
            depth += 1;
        if (isEnd && depth > 0)
            depth -= 1;
    }
    const collapsed = [];
    let blankRun = 0;
    for (let i = 0; i < indented.length; i += 1) {
        const ln = indented[i];
        const isBlank = ln.trim().length === 0;
        if (isBlank) {
            blankRun += 1;
            if (blankRun === 1)
                collapsed.push('');
        }
        else {
            blankRun = 0;
            collapsed.push(ln);
        }
    }
    let output = collapsed.join('\n');
    if (cfg.ensureFinalNewline && output.length > 0 && !output.endsWith('\n')) {
        output += '\n';
    }
    return output;
}
exports.format = format;
function lint(input) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const issues = [];
    if (input.length > 0 && !input.endsWith('\n') && !input.endsWith('\r\n')) {
        issues.push({
            ruleId: 'final-newline',
            message: 'File should end with a newline',
            line: input.split(/\r?\n/).length,
            column: 1,
            severity: 'warning',
            fix: { description: 'Add a trailing newline' },
        });
    }
    const lines = input.split(/\r?\n/);
    for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        if (/\s+$/.test(line)) {
            issues.push({
                ruleId: 'no-trailing-whitespace',
                message: 'Trailing whitespace is not allowed',
                line: i + 1,
                column: line.length,
                severity: 'warning',
                fix: { description: 'Trim trailing spaces' },
            });
        }
        const mDir = line.match(/^(.*?)(<#@[^]*?#>)(.*)$/);
        if (mDir) {
            const before = mDir[1].trim();
            const after = mDir[3].trim();
            if (before || after) {
                issues.push({
                    ruleId: 'directive-on-own-line',
                    message: 'Directive must be the only content on its line',
                    line: i + 1,
                    column: ((_a = mDir.index) !== null && _a !== void 0 ? _a : 0) + 1,
                    severity: 'error',
                    fix: { description: 'Place directive on its own line' },
                });
            }
        }
        const mStart = line.match(/^(.*?)(<#[\-]?\s+(?:block|slot)[\s\S]*?:\s+#>)(.*)$/);
        if (mStart) {
            const before = mStart[1].trim();
            const after = mStart[3].trim();
            if (before || after) {
                issues.push({
                    ruleId: 'block-or-slot-on-own-line',
                    message: 'Block/slot declaration must be the only content on its line',
                    line: i + 1,
                    column: ((_b = mStart.index) !== null && _b !== void 0 ? _b : 0) + 1,
                    severity: 'error',
                    fix: { description: 'Place block/slot declaration on its own line' },
                });
            }
        }
        const mEnd = line.match(/^(.*?)(<#[\-]?\s+end\s+[\-]?#>)(.*)$/);
        if (mEnd) {
            const before = mEnd[1].trim();
            const after = mEnd[3].trim();
            if (before || after) {
                issues.push({
                    ruleId: 'end-on-own-line',
                    message: 'End tag must be the only content on its line',
                    line: i + 1,
                    column: ((_c = mEnd.index) !== null && _c !== void 0 ? _c : 0) + 1,
                    severity: 'error',
                    fix: { description: 'Place end tag on its own line' },
                });
            }
        }
        const HEAVY_GLOBAL = /(<#@[^]*?#>|<#[\-]?\s+(?:block|slot)[\s\S]*?:\s+#>|<#[\-]?\s+end\s+[\-]?#>|<%_?[\s\S]*?(?:-%>|_%>|%>)|<\*[\s\S]*?\*>)/g;
        const tokens = line.match(HEAVY_GLOBAL);
        if (tokens && tokens.length > 1) {
            issues.push({
                ruleId: 'one-construct-per-line',
                message: 'Only one template construct is allowed per line',
                line: i + 1,
                column: 1,
                severity: 'warning',
                fix: { description: 'Split constructs across lines' },
            });
        }
        const mEmptyCurly = line.match(/(#\{|!\{)\s*\}/);
        if (mEmptyCurly) {
            issues.push({
                ruleId: 'no-empty-expression',
                message: 'Empty expression is not allowed',
                line: i + 1,
                column: ((_d = mEmptyCurly.index) !== null && _d !== void 0 ? _d : 0) + 1,
                severity: 'error',
                fix: { description: 'Remove it or provide content' },
            });
        }
        if (/(<%_?)\s*(?:-%>|_%>|%>)/.test(line) || /(<#-?)\s*(?:-#>|#>)/.test(line)) {
            const emptyPercent = line.match(/<%_?\s*(?:-%>|_%>|%>)/);
            const emptyHash = line.match(/<#-?\s*(?:-#>|#>)/);
            if (emptyPercent || emptyHash) {
                issues.push({
                    ruleId: 'no-empty-code',
                    message: 'Empty code tag is not allowed',
                    line: i + 1,
                    column: ((_f = (_e = (emptyPercent || emptyHash)) === null || _e === void 0 ? void 0 : _e.index) !== null && _f !== void 0 ? _f : 0) + 1,
                    severity: 'warning',
                    fix: { description: 'Remove it' },
                });
            }
        }
    }
    try {
        let ParserMod;
        try {
            ParserMod = require('fte.js-parser');
        }
        catch (_j) {
            try {
                ParserMod = require('../fte.js-parser/dist/index.js');
            }
            catch (_k) {
                ParserMod = undefined;
            }
        }
        const Parser = ParserMod === null || ParserMod === void 0 ? void 0 : ParserMod.Parser;
        if (Parser) {
            const root = Parser.parse(input);
            const blockEntries = Object.entries((_g = root.blocks) !== null && _g !== void 0 ? _g : {});
            for (const [blockName, block] of blockEntries) {
                const nested = Object.keys((_h = block.blocks) !== null && _h !== void 0 ? _h : {}).length > 0;
                if (nested) {
                    issues.push({
                        ruleId: 'no-nested-blocks',
                        message: `Block "${blockName}" must not contain nested blocks`,
                        line: 1,
                        column: 1,
                        severity: 'error',
                    });
                }
            }
        }
    }
    catch (_l) {
    }
    {
        const lines2 = input.split(/\r?\n/);
        let blockDepth = 0;
        for (let i = 0; i < lines2.length; i += 1) {
            const line = lines2[i];
            const isBlockStart = /<#[\-]?\s+block\b[\s\S]*?:\s+#>/.test(line);
            const isEnd = /<#[\-]?\s+end\s+[\-]?#>/.test(line);
            if (isBlockStart) {
                if (blockDepth > 0) {
                    issues.push({
                        ruleId: 'no-nested-blocks',
                        message: 'Nested blocks are not allowed',
                        line: i + 1,
                        column: 1,
                        severity: 'error',
                    });
                }
                blockDepth += 1;
            }
            if (isEnd && blockDepth > 0) {
                blockDepth -= 1;
            }
        }
    }
    return issues;
}
exports.lint = lint;
//# sourceMappingURL=index.js.map