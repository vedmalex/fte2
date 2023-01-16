"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.CodeBlock = exports.CodeBlockDirectives = void 0;
const detect_indent_1 = __importDefault(require("detect-indent"));
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
    'noEscape',
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
        this.escapeIt = true;
        this.requireAs = [];
    }
    push(init) {
        const { name, params } = detectDirective(init.data.trim());
        switch (name) {
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
            case 'noEscape':
                this.escapeIt = false;
                break;
            case 'requireAs':
                this.requireAs.push({ name: params[0], alias: params[1] });
                break;
            default:
                console.log('unknown directive: ' + name);
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
    if (str) {
        let res = str.trim();
        res = res.match(/['"`]([^`'"].*)[`'"]/)?.[1] ?? res;
        return res;
    }
    else {
        return '';
    }
};
const UNPARAM = (str) => {
    if (str) {
        let res = str?.trim();
        res = res.match(/\(?([^\)].*\))/)?.[1] ?? res;
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
        this.pos = 0;
        this.line = 1;
        this.column = 1;
        this.curlyAware = 0;
        this.curlyBalance = [];
        this.result = [];
        if (options.indent) {
            this.INDENT =
                typeof options.indent === 'string'
                    ? options.indent.length
                    : options.indent;
        }
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
        let state = null;
        for (let i = 0; i < resultSize; i += 1) {
            let r = this.result[i];
            let { type, pos, line, column, start, end, data, eol } = r;
            const trimStartLines = (lines) => {
                do {
                    if (curr.main.length > 0) {
                        let prev = curr.main[curr.main.length - 1];
                        if (prev.type == 'text') {
                            prev.content = prev.content.trimEnd();
                            if (!prev.content) {
                                curr.main.pop();
                                if (lines) {
                                    lines -= 1;
                                    if (!lines) {
                                        break;
                                    }
                                }
                            }
                            else {
                                prev.eol = false;
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    else {
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
                        if (next.type == 'text') {
                            next.data = next.data.trimStart();
                            if (!next.data) {
                                next.type = 'skip';
                                if (lines) {
                                    lines -= 1;
                                    if (!lines) {
                                        break;
                                    }
                                }
                            }
                            else {
                                next.eol = false;
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                } while (true);
            };
            const trimStartSpases = () => {
                if (curr.main.length > 0) {
                    let prev = curr.main[curr.main.length - 1];
                    if (prev.type == 'text') {
                        prev.content = prev.content.replaceAll(' ', '');
                        if (!prev.content) {
                            curr.main.pop();
                        }
                    }
                }
            };
            const trimEndSpaces = () => {
                if (i + 1 < resultSize) {
                    let next = this.result[i + 1];
                    if (next.type == 'text') {
                        next.data = next.data.replaceAll(' ', '');
                        if (!next.data) {
                            next.type = 'skip';
                        }
                    }
                }
            };
            if (curr.main.length > 0) {
                let prev = curr.main[curr.main.length - 1];
                if (prev.line != line) {
                    curr.main[curr.main.length - 1].eol = true;
                }
                else {
                    curr.main[curr.main.length - 1].eol = false;
                }
            }
            switch (type) {
                case 'directive':
                    state = 'directive';
                    trimStartLines();
                    trimEndLines();
                    curr.directives.push(r);
                    break;
                case 'blockStart':
                    state = 'blockStart';
                    trimStartLines();
                    trimEndLines();
                    curr = new CodeBlock(r);
                    content.addBlock(curr);
                    break;
                case 'slotStart':
                    state = 'slotStart';
                    trimStartLines();
                    trimEndLines();
                    curr = new CodeBlock(r);
                    content.addSlot(curr);
                    break;
                case 'blockEnd':
                    state = 'blockEnd';
                    trimStartLines();
                    curr = content;
                    trimEndLines();
                    break;
                case 'unknown':
                    let actual_type;
                    switch (r.start) {
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
                    switch (r.end) {
                        case '-%>':
                            trimEndLines(1);
                            break;
                        case '_%>':
                            trimEndSpaces();
                            break;
                    }
                    if (data) {
                        if (actual_type !== 'comments') {
                            curr.main.push({
                                content: data,
                                pos,
                                line,
                                column,
                                start,
                                end,
                                type: actual_type,
                                eol,
                            });
                        }
                        else {
                            curr.documentation.push({
                                content: data,
                                pos,
                                line,
                                column,
                                start,
                                end,
                                type: actual_type,
                                eol,
                            });
                        }
                    }
                    break;
                case 'code':
                    if (start == '<#-') {
                        trimStartLines();
                    }
                    if (end == '-#>') {
                        trimEndLines();
                    }
                    if (data) {
                        state = 'code';
                        curr.main.push({
                            content: data,
                            pos,
                            line,
                            column,
                            start,
                            end,
                            type,
                            eol,
                        });
                    }
                    break;
                case 'expression':
                case 'expression2':
                    if (data) {
                        curr.main.push({
                            content: data,
                            pos,
                            line,
                            column,
                            start,
                            end,
                            type: 'expression',
                            eol,
                        });
                    }
                    break;
                case 'uexpression':
                case 'uexpression2':
                    if (data) {
                        curr.main.push({
                            content: data,
                            pos,
                            line,
                            column,
                            start,
                            end,
                            type: 'uexpression',
                            eol,
                        });
                    }
                    break;
                case 'text': {
                    state = null;
                    let actualType = data || eol ? type : 'empty';
                    curr.main.push({
                        content: data,
                        pos,
                        line,
                        column,
                        start,
                        end,
                        type: actualType,
                        eol,
                    });
                    break;
                }
                case 'comments':
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
                            eol,
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
            if (term == '\n' ||
                term == '\r' ||
                term == '\u2028' ||
                term == '\u2029') {
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
        const { pos, line, column, globalState, actualState } = this;
        return {
            data: '',
            pos,
            line,
            column,
            type: actualState || globalState,
            ...extra,
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
}
exports.Parser = Parser;
Parser.INITIAL_STATE = 'text';
Parser.DEFAULT_TAB_SIZE = 2;
function SUB(buffer, str, pos = 0, size = 0) {
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
//# sourceMappingURL=parse.js.map