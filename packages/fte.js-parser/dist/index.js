"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUB = exports.Parser = exports.CodeBlock = exports.CodeBlockDirectives = void 0;
const tslib_1 = require("tslib");
const detect_indent_1 = tslib_1.__importDefault(require("detect-indent"));
const globalStates = {
    text: {
        states: [
            'unknown',
            'expression',
            'uexpression',
            'code',
            'directive',
            'slotStart',
            'blockStart',
            'blockEnd',
            'comments',
        ],
    },
    unknown: {
        start: ['<%', '<%=', '<%-', '<%_', '<%#'],
        end: ['%>', '-%>', '_%>'],
        skip: {
            start: ['<%%'],
            end: ['%%>'],
        },
        type: {
            '<%': 'code',
            '<%=': 'uexpression',
            '<%-': 'expression',
            '<%#': 'comments',
            '<%_': 'code',
        },
    },
    expression: {
        start: ['#{'],
        end: ['}'],
        curly: 1,
    },
    uexpression: {
        start: ['!{'],
        end: ['}'],
        curly: 1,
    },
    code: {
        start: ['<#', '<#-'],
        end: ['#>', '-#>'],
        skip: {
            start: ['<#@', '<# block', '<# slot', '<# end #>', '<#{'],
        },
    },
    directive: {
        start: ['<#@'],
        end: ['#>', '-#>'],
    },
    comments: {
        start: ['<*'],
        end: ['*>'],
    },
    blockStart: {
        start: ['<# block', '<#- block'],
        end: [': #>', ': -#>'],
    },
    slotStart: {
        start: ['<# slot', '<#- slot'],
        end: [': #>', ': -#>'],
    },
    blockEnd: {
        start: ['<# end #>', '<#- end #>', '<# end -#>', '<#- end -#>'],
    },
};
exports.default = globalStates;
const directives = [
    'extend',
    'context',
    'alias',
    'deindent',
    'chunks',
    'includeMainChunk',
    'useHash',
    'noContent',
    'noSlots',
    'noBlocks',
    'noPartial',
    'noOptions',
    'promise',
    'callback',
    'requireAs',
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
        params,
    };
}
class CodeBlockDirectives {
    constructor() {
        this.context = 'context';
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
            case 'deindent':
                this.deindent = params.length > 0 ? Number.parseInt(params[0]) : true;
                break;
            case 'extend':
                this.extend = params[0];
                break;
            case 'context':
                this.context = params[0];
                break;
            case 'alias':
                this.alias = params;
                break;
            case 'chunks':
                this.chunks = params[0];
                break;
            case 'includeMainChunk':
                this.includeMainChunk = true;
                break;
            case 'useHash':
                this.useHash = true;
                break;
            case 'noContent':
                this.content = false;
                break;
            case 'noSlots':
                this.slots = false;
                break;
            case 'noBlocks':
                this.blocks = false;
                break;
            case 'noPartial':
                this.partial = false;
                break;
            case 'noOptions':
                this.options = false;
                break;
            case 'promise':
                this.promise = true;
                break;
            case 'callback':
                this.callback = true;
                break;
            case 'requireAs':
                this.requireAs.push({ name: params[0], alias: params[1] });
                break;
            default:
        }
    }
}
exports.CodeBlockDirectives = CodeBlockDirectives;
class CodeBlock {
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
}
exports.CodeBlock = CodeBlock;
const UNQUOTE = (str) => {
    var _a, _b;
    if (str) {
        let res = str.trim();
        res = (_b = (_a = res.match(/['"`]([^`'"].*)[`'"]/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : res;
        return res;
    }
    else {
        return '';
    }
};
const UNPARAM = (str) => {
    var _a, _b;
    if (str) {
        let res = str === null || str === void 0 ? void 0 : str.trim();
        res = (_b = (_a = res.match(/\(?([^\)].*\))/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : res;
        return res.split(',').map(UNQUOTE);
    }
    else {
        return [];
    }
};
class Parser {
    static parse(text, options = {}) {
        const parser = new Parser(typeof text == 'string' ? text : text.toString(), options);
        parser.parse();
        return parser.process();
    }
    constructor(value, options) {
        var _a;
        this.pos = 0;
        this.line = 1;
        this.column = 1;
        this.curlyAware = 0;
        this.curlyBalance = [];
        this.result = [];
        this.sourceMapEnabled = false;
        if (options.indent) {
            this.INDENT = typeof options.indent === 'string' ? options.indent.length : options.indent;
        }
        this.sourceMapEnabled = (_a = options.sourceMap) !== null && _a !== void 0 ? _a : false;
        this.sourceFile = options.sourceFile;
        this.sourceContent = options.sourceContent;
        this.sourceRoot = options.sourceRoot;
        this.globalState = Parser.INITIAL_STATE;
        this.buffer = value.toString();
        this.size = this.buffer.length;
    }
    collect() {
        const { term, eol } = this.SYMBOL();
        if (eol) {
            this.globalToken.eol = true;
            this.term();
        }
        else {
            this.globalToken.data += term;
        }
    }
    run(currentState) {
        var _a, _b, _c;
        const init_pos = this.pos;
        const state = globalStates[currentState];
        this.curlyAware = state.curly;
        if (state.start) {
            if ((_a = state.skip) === null || _a === void 0 ? void 0 : _a.start) {
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
                    this.actualState = (_c = (_b = state.type) === null || _b === void 0 ? void 0 : _b[p]) !== null && _c !== void 0 ? _c : currentState;
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
                            if (state.curly == 1 && p.indexOf('}') > -1) {
                                if (this.curlyBalance.length > 0) {
                                    break;
                                }
                            }
                            if (state.curly == 2 && p.indexOf('}}') > -1) {
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
                        }
                        else {
                            this.globalToken.end = state.end[i];
                            this.actualState = null;
                        }
                    }
                    else {
                        foundEnd = true;
                    }
                } while (!foundEnd && this.pos < this.size);
        }
        else if (state.states) {
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
        let data = '';
        let pos = 0;
        let line = 1;
        let column = 1;
        let start = '';
        let end = '';
        let eol = false;
        let type = 'unknown';
        const updateSourceMap = (item) => {
            if (this.sourceMapEnabled && item.sourceFile && item.originalStart) {
                item.originalEnd = {
                    source: item.sourceFile,
                    line: this.line,
                    column: this.column
                };
            }
        };
        for (let i = 0; i < resultSize; i += 1) {
            let r = this.result[i];
            data = r.data;
            pos = r.pos;
            line = r.line;
            column = r.column;
            start = r.start;
            end = r.end;
            eol = r.eol;
            type = r.type;
            const trimStartSpases = () => {
                data = data.replace(/^\s+/, '');
            };
            const trimEndSpaces = () => {
                data = data.replace(/\s+$/, '');
            };
            const trimStartLines = () => {
                data = data.replace(/^[\r\n]+/, '');
            };
            const trimEndLines = (count = 0) => {
                if (count > 0) {
                    const lines = data.match(/[\r\n]/g);
                    if (lines && lines.length > count) {
                        data = data.replace(/[\r\n]+$/, '');
                    }
                }
                else {
                    data = data.replace(/[\r\n]+$/, '');
                }
            };
            switch (type) {
                case 'directive':
                    trimStartLines();
                    trimEndLines();
                    curr.directives.push(r);
                    break;
                case 'blockStart':
                    trimStartLines();
                    trimEndLines();
                    curr = new CodeBlock(r);
                    content.addBlock(curr);
                    break;
                case 'slotStart':
                    trimStartLines();
                    trimEndLines();
                    curr = new CodeBlock(r);
                    content.addSlot(curr);
                    break;
                case 'blockEnd':
                    trimStartLines();
                    curr = content;
                    trimEndLines();
                    break;
                case 'unknown':
                    let actual_type = 'unknown';
                    switch (start) {
                        case '<%':
                            actual_type = 'code';
                            break;
                        case '<%_':
                            actual_type = 'code';
                            trimStartSpases();
                            break;
                        case '<%-':
                            actual_type = 'expression';
                            break;
                        case '<%=':
                            actual_type = 'uexpression';
                            break;
                        case '<%#':
                            actual_type = 'comments';
                            break;
                    }
                    switch (end) {
                        case '-%>':
                            trimEndLines(1);
                            break;
                        case '_%>':
                            trimEndSpaces();
                            break;
                    }
                    if (actual_type !== 'comments') {
                        const item = {
                            content: data,
                            pos,
                            line,
                            column,
                            start,
                            end,
                            type: actual_type,
                            eol,
                            sourceFile: r.sourceFile,
                            originalStart: r.originalStart,
                            sourceContent: r.sourceContent
                        };
                        updateSourceMap(item);
                        curr.main.push(item);
                    }
                    else {
                        const item = {
                            content: data,
                            pos,
                            line,
                            column,
                            start,
                            end,
                            type: actual_type,
                            eol,
                            sourceFile: r.sourceFile,
                            originalStart: r.originalStart,
                            sourceContent: r.sourceContent
                        };
                        updateSourceMap(item);
                        curr.documentation.push(item);
                    }
                    break;
                case 'code':
                    if (start === '<%_') {
                        trimStartSpases();
                    }
                    if (end === '_%>') {
                        trimEndSpaces();
                    }
                    if (end === '-%>') {
                        trimEndLines();
                    }
                    const codeItem = {
                        content: data,
                        pos,
                        line,
                        column,
                        start,
                        end,
                        type,
                        eol,
                        sourceFile: r.sourceFile,
                        originalStart: r.originalStart,
                        sourceContent: r.sourceContent
                    };
                    updateSourceMap(codeItem);
                    curr.main.push(codeItem);
                    break;
                case 'expression':
                case 'expression2':
                    {
                        const expressionItem = {
                            content: data,
                            pos,
                            line,
                            column,
                            start,
                            end,
                            type: 'expression',
                            eol,
                            sourceFile: r.sourceFile,
                            originalStart: r.originalStart,
                            sourceContent: r.sourceContent
                        };
                        updateSourceMap(expressionItem);
                        curr.main.push(expressionItem);
                    }
                    break;
                case 'uexpression':
                case 'uexpression2':
                    {
                        const uexpressionItem = {
                            content: data,
                            pos,
                            line,
                            column,
                            start,
                            end,
                            type: 'uexpression',
                            eol,
                            sourceFile: r.sourceFile,
                            originalStart: r.originalStart,
                            sourceContent: r.sourceContent
                        };
                        updateSourceMap(uexpressionItem);
                        const prev = curr.main.pop();
                        if (prev) {
                            if (prev.type !== 'text' || (prev.type === 'text' && prev.eol)) {
                                curr.main.push(prev);
                            }
                            else {
                                uexpressionItem.indent = prev.content;
                            }
                        }
                        curr.main.push(uexpressionItem);
                    }
                    break;
                case 'text': {
                    const actualType = data || eol ? type : 'empty';
                    if (actualType === 'empty' &&
                        curr.main.length > 0 &&
                        curr.main[curr.main.length - 1].type === 'empty') {
                        break;
                    }
                    const textItem = {
                        content: data,
                        pos,
                        line,
                        column,
                        start,
                        end,
                        type: actualType,
                        eol,
                        sourceFile: r.sourceFile,
                        originalStart: r.originalStart,
                        sourceContent: r.sourceContent
                    };
                    updateSourceMap(textItem);
                    curr.main.push(textItem);
                    break;
                }
                case 'comments':
                    trimStartLines();
                    trimEndLines();
                    const commentItem = {
                        content: data,
                        pos,
                        line,
                        column,
                        start,
                        end,
                        type,
                        eol,
                        sourceFile: r.sourceFile,
                        originalStart: r.originalStart,
                        sourceContent: r.sourceContent
                    };
                    updateSourceMap(commentItem);
                    curr.documentation.push(commentItem);
                    break;
            }
        }
        return content;
    }
    SYMBOL() {
        const res = this.buffer[this.pos];
        if (this.curlyAware == 1) {
            if (~res.indexOf('{')) {
                this.curlyBalance.push(this.pos);
            }
            else if (~res.indexOf('}')) {
                this.curlyBalance.pop();
            }
        }
        if (this.curlyAware == 2) {
            if (~res.indexOf('{{')) {
                this.curlyBalance.push(this.pos);
            }
            else if (~res.indexOf('}}')) {
                this.curlyBalance.pop();
            }
        }
        return this.SKIP(res);
    }
    DETECT_INDENT() {
        const { buffer } = this;
        const indent = (0, detect_indent_1.default)(buffer).indent;
        if (~indent.indexOf('\t')) {
            this.INDENT = Parser.DEFAULT_TAB_SIZE;
        }
        else {
            this.INDENT = indent.length;
        }
    }
    SKIP(term) {
        const { INDENT } = this;
        let eol = false;
        if (term.length == 1) {
            if (term == '\n' || term == '\r' || term == '\u2028' || term == '\u2029') {
                if (term == '\r' && this.SUB('\r\n') == '\r\n') {
                    term = '\r\n';
                }
                this.column = 1;
                this.line += 1;
                eol = true;
            }
            else if (term == '\t') {
                if (!INDENT)
                    this.DETECT_INDENT();
                this.column += this.INDENT;
            }
            else {
                this.column += 1;
            }
            this.pos += term.length;
        }
        else {
            const startPos = this.pos;
            let nTerm = '';
            do {
                nTerm += this.SKIP(this.buffer[this.pos]);
            } while (this.pos < startPos + term.length);
            term = nTerm;
        }
        return { term, eol };
    }
    block(extra = {}) {
        const { pos, line, column, globalState, actualState, sourceFile, sourceMapEnabled } = this;
        const result = {
            data: '',
            pos,
            line,
            column,
            type: actualState || globalState,
            start: '',
            end: '',
            eol: false,
            ...extra,
        };
        if (sourceMapEnabled && sourceFile) {
            result.sourceFile = sourceFile;
            result.sourceContent = this.sourceContent;
            result.originalStart = {
                source: sourceFile,
                line,
                column
            };
        }
        return result;
    }
    SUB(str) {
        const { pos, size, buffer } = this;
        return SUB(buffer, str, pos, size);
    }
    term(extra = {}) {
        this.globalToken = this.block(extra);
        this.result.push(this.globalToken);
    }
}
exports.Parser = Parser;
Parser.INITIAL_STATE = 'text';
Parser.DEFAULT_TAB_SIZE = 2;
function SUB(buffer, str, pos = 0, size) {
    if (!size) {
        size = buffer.length;
    }
    const len = str.length;
    const from = pos;
    const to = pos + len;
    if (to <= size) {
        let res = '';
        for (let i = from; i < to; i += 1) {
            res += buffer[i];
        }
        return res;
    }
    else {
        return '';
    }
}
exports.SUB = SUB;
//# sourceMappingURL=index.js.map