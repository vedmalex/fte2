"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferTypesInSource = exports.inferTypesInFiles = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@swc/core");
const Visitor_js_1 = require("@swc/core/Visitor.js");
const node_fs_1 = tslib_1.__importDefault(require("node:fs"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const glob_1 = require("glob");
const ident_1 = require("./ident");
function listFiles(config) {
    var _a, _b, _c, _d, _e, _f;
    const search = (_b = (_a = config.include) === null || _a === void 0 ? void 0 : _a.map(ig => `${ig}.@(${config.allowed.join('|')})`)) !== null && _b !== void 0 ? _b : [`**/*.@(${config.allowed.join('|')})`];
    const ignore = [
        ...(config.notallowed
            ? (_d = (_c = config.include) === null || _c === void 0 ? void 0 : _c.map(ig => { var _a; return `${ig}.@(${(_a = config.notallowed) === null || _a === void 0 ? void 0 : _a.join('|')})`; })) !== null && _d !== void 0 ? _d : [`**/*.@(${(_e = config.notallowed) === null || _e === void 0 ? void 0 : _e.join('|')})`]
            : []),
        ...((_f = config.ignore) !== null && _f !== void 0 ? _f : []),
    ];
    const files = [];
    search.forEach(pattern => {
        var _a;
        const list = (0, glob_1.globSync)(pattern, { cwd: (_a = config.cwd) !== null && _a !== void 0 ? _a : './', ignore });
        files.push(...list.map(f => { var _a; return node_path_1.default.join((_a = config.cwd) !== null && _a !== void 0 ? _a : './', f); }));
    });
    return files;
}
function prim(t) { return t; }
function mergeTypes(types) {
    if (types.size === 0)
        return 'any';
    const arr = [...types];
    const uniq = Array.from(new Set(arr));
    return uniq.join(' | ');
}
function arrayOf(elem) {
    if (!elem.includes('|') && !elem.includes(','))
        return `${elem}[]`;
    return `Array<${elem}>`;
}
function objectOf(shape) {
    const entries = Object.entries(shape).map(([k, v]) => `${JSON.stringify(k)}: ${v}`);
    return `{ ${entries.join('; ')} }`;
}
class InferVisitor extends Visitor_js_1.Visitor {
    constructor(varTypes, funcStack, functionsByName) {
        super();
        this.varTypes = varTypes;
        this.funcStack = funcStack;
        this.functionsByName = functionsByName;
    }
    recordVar(name, t) {
        if (!this.varTypes.has(name))
            this.varTypes.set(name, { names: new Set([name]), inferred: new Set() });
        this.varTypes.get(name).inferred.add(t);
    }
    visitTsType(n) { return n; }
    visitTsTypeAnnotation(n) { return n; }
    recordParamIfMatches(identName, t) {
        const top = this.funcStack[this.funcStack.length - 1];
        if (!top)
            return;
        if (!top.params[identName])
            return;
        top.params[identName].add(t);
    }
    inferExpr(expr) {
        var _a, _b;
        if (!expr)
            return 'any';
        switch (expr.type) {
            case 'StringLiteral': return prim('string');
            case 'NumericLiteral': return prim('number');
            case 'BooleanLiteral': return prim('boolean');
            case 'NullLiteral': return prim('null');
            case 'RegExpLiteral': return prim('RegExp');
            case 'NewExpression': {
                const ne = expr;
                if (((_a = ne.callee) === null || _a === void 0 ? void 0 : _a.type) === 'Identifier') {
                    return ne.callee.value;
                }
                return 'any';
            }
            case 'ArrayExpression': {
                const elems = (_b = expr.elements) === null || _b === void 0 ? void 0 : _b.map(e => (e === null || e === void 0 ? void 0 : e.expression) && this.inferExpr(e.expression)).filter(Boolean);
                const elemType = mergeTypes(new Set(elems.length ? elems : ['any']));
                return arrayOf(elemType);
            }
            case 'ObjectExpression': {
                const shape = {};
                for (const p of expr.properties) {
                    if (p.type === 'KeyValueProperty' && p.key.type === 'Identifier') {
                        shape[p.key.value] = this.inferExpr(p.value);
                    }
                }
                return objectOf(shape);
            }
            case 'ArrowFunctionExpression':
            case 'FunctionExpression':
            case 'FunctionDeclaration':
                return 'Function';
            case 'CallExpression': {
                const ce = expr;
                if (ce.callee.type === 'MemberExpression' && ce.callee.property.type === 'Identifier' && ce.callee.property.value === 'then') {
                    return 'Promise<any>';
                }
                if (ce.callee.type === 'Identifier') {
                    const n = ce.callee.value;
                    if (n === 'String')
                        return 'string';
                    if (n === 'Number')
                        return 'number';
                    if (n === 'Boolean')
                        return 'boolean';
                }
                return 'any';
            }
            case 'Identifier': return 'any';
            case 'BinaryExpression': {
                const be = expr;
                const op = be.operator;
                if (['+', '-', '*', '/', '%', '**', '|', '&', '^', '<<', '>>', '>>>'].includes(op))
                    return 'number';
                if (op === '||' || op === '??' || op === '&&') {
                    const lt = this.inferExpr(be.left);
                    const rt = this.inferExpr(be.right);
                    return mergeTypes(new Set([lt, rt]));
                }
                return 'any';
            }
            default:
                return 'any';
        }
    }
    visitVariableDeclarator(n) {
        var _a, _b, _c, _d, _e;
        const init = n.init;
        const id = n.id;
        if ((id === null || id === void 0 ? void 0 : id.type) === 'Identifier') {
            const name = id.value;
            if (init) {
                const t = this.inferExpr(init);
                this.recordVar(name, t);
                if (init.type === 'ObjectExpression') {
                    const shape = {};
                    for (const p of init.properties) {
                        if (p.type === 'KeyValueProperty' && p.key.type === 'Identifier') {
                            shape[p.key.value] = this.inferExpr(p.value);
                        }
                    }
                    if (!this.varTypes.has(name))
                        this.varTypes.set(name, { names: new Set([name]), inferred: new Set() });
                    const info = this.varTypes.get(name);
                    info.objectShape = { ...((_a = info.objectShape) !== null && _a !== void 0 ? _a : {}), ...shape };
                    info.inferred.add(objectOf(info.objectShape));
                }
                if (init.type === 'FunctionExpression' || init.type === 'ArrowFunctionExpression') {
                    if (!this.functionsByName.has(name))
                        this.functionsByName.set(name, { name, params: {}, returns: new Set(), spanStart: (_c = (_b = n.span) === null || _b === void 0 ? void 0 : _b.start) !== null && _c !== void 0 ? _c : 0 });
                    const finfo = this.functionsByName.get(name);
                    const params = ((_d = init.params) !== null && _d !== void 0 ? _d : []);
                    for (const p of params) {
                        const pat = p;
                        if ((pat === null || pat === void 0 ? void 0 : pat.type) === 'Identifier')
                            finfo.params[pat.value] = finfo.params[pat.value] || new Set();
                        else if (((_e = pat === null || pat === void 0 ? void 0 : pat.pat) === null || _e === void 0 ? void 0 : _e.type) === 'Identifier')
                            finfo.params[pat.pat.value] = finfo.params[pat.pat.value] || new Set();
                    }
                    if (init.type === 'ArrowFunctionExpression' && init.body && init.body.type !== 'BlockStatement') {
                        finfo.returns.add(this.inferExpr(init.body));
                    }
                }
            }
        }
        return super.visitVariableDeclarator(n);
    }
    visitBinaryExpression(n) {
        const be = n;
        const l = be.left, r = be.right;
        if (be.operator === '+') {
            if ((l === null || l === void 0 ? void 0 : l.type) === 'StringLiteral' || (r === null || r === void 0 ? void 0 : r.type) === 'StringLiteral') {
                if ((l === null || l === void 0 ? void 0 : l.type) === 'Identifier') {
                    this.recordVar(l.value, 'string');
                    this.recordParamIfMatches(l.value, 'string');
                }
                if ((r === null || r === void 0 ? void 0 : r.type) === 'Identifier') {
                    this.recordVar(r.value, 'string');
                    this.recordParamIfMatches(r.value, 'string');
                }
            }
            else {
                if ((l === null || l === void 0 ? void 0 : l.type) === 'Identifier') {
                    this.recordVar(l.value, 'number');
                    this.recordParamIfMatches(l.value, 'number');
                }
                if ((r === null || r === void 0 ? void 0 : r.type) === 'Identifier') {
                    this.recordVar(r.value, 'number');
                    this.recordParamIfMatches(r.value, 'number');
                }
            }
        }
        else if (['-', '*', '/', '%', '**', '|', '&', '^', '<<', '>>', '>>>'].includes(be.operator)) {
            if ((l === null || l === void 0 ? void 0 : l.type) === 'Identifier') {
                this.recordVar(l.value, 'number');
                this.recordParamIfMatches(l.value, 'number');
            }
            if ((r === null || r === void 0 ? void 0 : r.type) === 'Identifier') {
                this.recordVar(r.value, 'number');
                this.recordParamIfMatches(r.value, 'number');
            }
        }
        else if (be.operator === 'instanceof') {
            if ((l === null || l === void 0 ? void 0 : l.type) === 'Identifier' && (r === null || r === void 0 ? void 0 : r.type) === 'Identifier') {
                const typeName = r.value;
                this.recordVar(l.value, typeName);
                this.recordParamIfMatches(l.value, typeName);
            }
        }
        else if (be.operator === 'in') {
            if ((r === null || r === void 0 ? void 0 : r.type) === 'Identifier')
                this.recordVar(r.value, 'Record<string, any>');
        }
        else if (be.operator === '===') {
            const leftIsTypeof = (l === null || l === void 0 ? void 0 : l.type) === 'UnaryExpression' && l.operator === 'typeof';
            const rightIsString = (r === null || r === void 0 ? void 0 : r.type) === 'StringLiteral';
            const rightIsTypeof = (r === null || r === void 0 ? void 0 : r.type) === 'UnaryExpression' && r.operator === 'typeof';
            const leftIsString = (l === null || l === void 0 ? void 0 : l.type) === 'StringLiteral';
            const mapTypeof = (s) => {
                switch (s) {
                    case 'string': return 'string';
                    case 'number': return 'number';
                    case 'boolean': return 'boolean';
                    case 'undefined': return 'undefined';
                    case 'object': return 'Record<string, any>';
                    case 'function': return 'Function';
                    case 'bigint': return 'bigint';
                    case 'symbol': return 'symbol';
                    default: return 'any';
                }
            };
            if (leftIsTypeof && rightIsString) {
                const arg = l.argument;
                if ((arg === null || arg === void 0 ? void 0 : arg.type) === 'Identifier') {
                    const t = mapTypeof(r.value);
                    this.recordVar(arg.value, t);
                    this.recordParamIfMatches(arg.value, t);
                }
            }
            else if (rightIsTypeof && leftIsString) {
                const arg = r.argument;
                if ((arg === null || arg === void 0 ? void 0 : arg.type) === 'Identifier') {
                    const t = mapTypeof(l.value);
                    this.recordVar(arg.value, t);
                    this.recordParamIfMatches(arg.value, t);
                }
            }
        }
        return super.visitBinaryExpression(n);
    }
    visitMemberExpression(n) {
        var _a;
        const me = n;
        if (((_a = me.object) === null || _a === void 0 ? void 0 : _a.type) === 'Identifier') {
            const name = me.object.value;
            if (me.computed) {
                const idx = me.property;
                if ((idx === null || idx === void 0 ? void 0 : idx.type) === 'NumericLiteral') {
                    this.recordVar(name, arrayOf('any'));
                }
            }
            else {
                this.recordVar(name, 'Record<string, any>');
            }
        }
        return super.visitMemberExpression(n);
    }
    visitAssignmentExpression(n) {
        var _a, _b;
        const asn = n;
        const left = asn.left;
        const right = asn.right;
        if ((left === null || left === void 0 ? void 0 : left.type) === 'MemberExpression' && ((_a = left.object) === null || _a === void 0 ? void 0 : _a.type) === 'Identifier') {
            const objName = left.object.value;
            const prop = left.property;
            if (!left.computed && (prop === null || prop === void 0 ? void 0 : prop.type) === 'Identifier') {
                const t = this.inferExpr(right);
                if (!this.varTypes.has(objName))
                    this.varTypes.set(objName, { names: new Set([objName]), inferred: new Set() });
                const info = this.varTypes.get(objName);
                info.objectShape = { ...((_b = info.objectShape) !== null && _b !== void 0 ? _b : {}), [prop.value]: t };
                info.inferred.add(objectOf(info.objectShape));
            }
            else if (left.computed && (prop === null || prop === void 0 ? void 0 : prop.type) === 'NumericLiteral') {
                const t = this.inferExpr(right);
                this.recordVar(objName, arrayOf(t));
            }
        }
        return super.visitAssignmentExpression(n);
    }
    visitCallExpression(n) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const ce = n;
        if (((_a = ce.callee) === null || _a === void 0 ? void 0 : _a.type) === 'MemberExpression') {
            const obj = ce.callee.object;
            const prop = ce.callee.property;
            if ((obj === null || obj === void 0 ? void 0 : obj.type) === 'Identifier' && (prop === null || prop === void 0 ? void 0 : prop.type) === 'Identifier') {
                if (prop.value === 'push' && ((_b = ce.arguments) === null || _b === void 0 ? void 0 : _b[0])) {
                    this.recordVar(obj.value, arrayOf(this.inferExpr(ce.arguments[0].expression)));
                }
                if ((obj === null || obj === void 0 ? void 0 : obj.type) === 'Identifier' && obj.value === 'Array' && prop.value === 'isArray' && ((_c = ce.arguments) === null || _c === void 0 ? void 0 : _c[0])) {
                    const arg = ce.arguments[0];
                    const ex = (_d = arg.expression) !== null && _d !== void 0 ? _d : arg;
                    if ((ex === null || ex === void 0 ? void 0 : ex.type) === 'Identifier') {
                        this.recordVar(ex.value, arrayOf('any'));
                        this.recordParamIfMatches(ex.value, arrayOf('any'));
                    }
                }
                if ((obj === null || obj === void 0 ? void 0 : obj.type) === 'Identifier' && obj.value === 'Object' && prop.value === 'assign' && ((_e = ce.arguments) === null || _e === void 0 ? void 0 : _e.length)) {
                    const [target, ...sources] = ce.arguments;
                    const targ = (_f = target.expression) !== null && _f !== void 0 ? _f : target;
                    if ((targ === null || targ === void 0 ? void 0 : targ.type) === 'Identifier') {
                        const tname = targ.value;
                        let shape = {};
                        for (const s of sources) {
                            const se = (_g = s.expression) !== null && _g !== void 0 ? _g : s;
                            if ((se === null || se === void 0 ? void 0 : se.type) === 'ObjectExpression') {
                                for (const p of se.properties) {
                                    if (p.type === 'KeyValueProperty' && p.key.type === 'Identifier') {
                                        shape[p.key.value] = this.inferExpr(p.value);
                                    }
                                }
                            }
                        }
                        if (Object.keys(shape).length) {
                            if (!this.varTypes.has(tname))
                                this.varTypes.set(tname, { names: new Set([tname]), inferred: new Set() });
                            const info = this.varTypes.get(tname);
                            info.objectShape = { ...((_h = info.objectShape) !== null && _h !== void 0 ? _h : {}), ...shape };
                            info.inferred.add(objectOf(info.objectShape));
                        }
                    }
                }
            }
        }
        if (((_j = ce.callee) === null || _j === void 0 ? void 0 : _j.type) === 'Identifier') {
            const fnName = ce.callee.value;
            if (!this.functionsByName.has(fnName))
                this.functionsByName.set(fnName, { name: fnName, params: {}, returns: new Set(), spanStart: 0 });
            const finfo = this.functionsByName.get(fnName);
            (_k = ce.arguments) === null || _k === void 0 ? void 0 : _k.forEach((arg, idx) => {
                var _a;
                const t = this.inferExpr((_a = arg.expression) !== null && _a !== void 0 ? _a : arg);
                const pname = Object.keys(finfo.params)[idx];
                if (pname) {
                    finfo.params[pname].add(t);
                }
                else {
                    const synthetic = `arg${idx}`;
                    finfo.params[synthetic] = finfo.params[synthetic] || new Set();
                    finfo.params[synthetic].add(t);
                }
            });
        }
        return super.visitCallExpression(n);
    }
    visitFunctionDeclaration(n) {
        var _a;
        const finfo = { name: (_a = n.identifier) === null || _a === void 0 ? void 0 : _a.value, params: {}, returns: new Set(), spanStart: n.span.start };
        (n.params || []).forEach((p, idx) => {
            const pat = p.pat;
            if ((pat === null || pat === void 0 ? void 0 : pat.type) === 'Identifier')
                finfo.params[pat.value] = finfo.params[pat.value] || new Set();
            else {
                const syn = `arg${idx}`;
                finfo.params[syn] = finfo.params[syn] || new Set();
            }
        });
        if (finfo.name && !this.functionsByName.has(finfo.name))
            this.functionsByName.set(finfo.name, finfo);
        this.funcStack.push(finfo);
        if (n.body)
            this.visitBlockStatement(n.body);
        this.funcStack.pop();
        return n;
    }
    visitReturnStatement(n) {
        const top = this.funcStack[this.funcStack.length - 1];
        if (top && n.argument) {
            top.returns.add(this.inferExpr(n.argument));
        }
        return super.visitReturnStatement(n);
    }
}
function inferTypesInFiles(config) {
    var _a, _b, _c, _d, _e, _f;
    const files = listFiles(config);
    const globalsAgg = new Map();
    const funcsByFile = new Map();
    const report = { files: {}, globals: {} };
    for (const file of files) {
        const source = node_fs_1.default.readFileSync(file).toString();
        const program = (0, core_1.parseSync)(source, { syntax: file.match(/.ts?$/) ? 'typescript' : 'ecmascript', tsx: file.endsWith('.tsx') });
        const varTypes = new Map();
        const funcStack = [];
        const functionsByName = new Map();
        const v = new InferVisitor(varTypes, funcStack, functionsByName);
        v.visitProgram(program);
        const { globalVariables } = (0, ident_1.processUnusedAndGlobalVariables)(program, { knownGlobals: config.knownGlobals });
        for (const name of globalVariables.keys()) {
            const info = (_a = varTypes.get(name)) !== null && _a !== void 0 ? _a : { names: new Set([name]), inferred: new Set(['any']) };
            if (!globalsAgg.has(name))
                globalsAgg.set(name, { names: new Set([name]), inferred: new Set() });
            const gi = globalsAgg.get(name);
            info.inferred.forEach(t => gi.inferred.add(t));
            if (info.objectShape) {
                gi.objectShape = { ...((_b = gi.objectShape) !== null && _b !== void 0 ? _b : {}), ...info.objectShape };
                gi.inferred.add(objectOf(gi.objectShape));
            }
        }
        funcsByFile.set(file, Array.from(functionsByName.values()));
        if (config.exportFunctions && config.exportFunctions.length > 0) {
            let updatedSource = source;
            const decls = [];
            program.body.forEach((stmt) => { if (stmt.type === 'FunctionDeclaration')
                decls.push(stmt); });
            const sorted = decls.sort((a, b) => b.span.start - a.span.start);
            for (const fn of sorted) {
                const name = (_c = fn.identifier) === null || _c === void 0 ? void 0 : _c.value;
                if (!name)
                    continue;
                if (!config.exportFunctions.includes(name))
                    continue;
                const srcStart = fn.span.start - program.span.start;
                let lineStart = updatedSource.lastIndexOf('\n', srcStart - 1) + 1;
                while (lineStart > 0) {
                    const nextLineStart = updatedSource.lastIndexOf('\n', lineStart - 2) + 1;
                    const seg = updatedSource.slice(nextLineStart, lineStart);
                    if (/^\s*\/\/.|^\s*\/*/.test(seg)) {
                        lineStart = nextLineStart;
                    }
                    else {
                        break;
                    }
                }
                const before = updatedSource.slice(lineStart, srcStart);
                if (/^\s*export\b/.test(before))
                    continue;
                updatedSource = updatedSource.slice(0, lineStart) + 'export ' + updatedSource.slice(lineStart);
            }
            if (updatedSource !== source) {
                node_fs_1.default.writeFileSync(file, updatedSource);
            }
        }
        const isTS = file.endsWith('.ts') || file.endsWith('.tsx');
        const dtsPath = file.replace(/\.(tsx|ts|jsx|js)$/i, '.d.ts');
        const fnLines = [];
        const fileFuncs = funcsByFile.get(file) || [];
        const funcNames = new Set(fileFuncs.filter(f => f.name).map(f => f.name));
        for (const finfo of fileFuncs) {
            const name = finfo.name;
            if (!name)
                continue;
            const exportIt = !!((_d = config.exportFunctions) === null || _d === void 0 ? void 0 : _d.includes(name));
            const genForTS = true;
            if (!isTS || genForTS) {
                const paramNames = Object.keys(finfo.params);
                const paramsText = paramNames.map(pn => { var _a; return `${pn}: ${mergeTypes((_a = finfo.params[pn]) !== null && _a !== void 0 ? _a : new Set(['any']))}`; }).join(', ');
                const retType = mergeTypes((_e = finfo.returns) !== null && _e !== void 0 ? _e : new Set(['any'])) || 'any';
                fnLines.push(`${exportIt ? 'export ' : 'declare '}function ${name}(${paramsText}): ${retType};`);
            }
        }
        for (const [vname, vinfo] of varTypes.entries()) {
            if (funcNames.has(vname))
                continue;
            const vtype = vinfo.objectShape ? objectOf(vinfo.objectShape) : mergeTypes(vinfo.inferred);
            const finalType = vtype || 'any';
            fnLines.push(`declare const ${vname}: ${finalType};`);
        }
        if (fnLines.length > 0)
            node_fs_1.default.writeFileSync(dtsPath, fnLines.join('\n') + '\n');
        report.files[file] = {
            functions: (funcsByFile.get(file) || []).map(f => ({ name: f.name, params: Object.fromEntries(Object.entries(f.params).map(([k, v]) => [k, Array.from(v)])), returns: Array.from(f.returns) })),
            variables: Array.from(varTypes.entries()).map(([name, info]) => ({ name, type: info.objectShape ? objectOf(info.objectShape) : mergeTypes(info.inferred) })),
        };
    }
    const lines = [];
    for (const [name, info] of globalsAgg.entries()) {
        const typeStr = info.objectShape ? objectOf(info.objectShape) : mergeTypes(info.inferred);
        const finalType = typeStr || 'any';
        lines.push(`declare const ${name}: ${finalType};`);
        report.globals[name] = finalType;
    }
    const out = ((_f = config.globalsFile) !== null && _f !== void 0 ? _f : 'globals.d.ts');
    node_fs_1.default.writeFileSync(out, lines.join('\n') + (lines.length ? '\n' : ''));
    if (config.applyJsdoc) {
        for (const file of files) {
            const isTS = file.endsWith('.ts') || file.endsWith('.tsx');
            const source = node_fs_1.default.readFileSync(file).toString();
            const program = (0, core_1.parseSync)(source, { syntax: isTS ? 'typescript' : 'ecmascript', tsx: file.endsWith('.tsx') });
            const funcDecls = [];
            program.body.forEach((stmt) => {
                var _a;
                if (stmt.type === 'FunctionDeclaration') {
                    const name = ((_a = stmt.identifier) === null || _a === void 0 ? void 0 : _a.value) || '';
                    let hasTypes = false;
                    if (isTS) {
                        const hasAnyParam = (stmt.params || []).some((p) => { var _a; return ((_a = p.pat) === null || _a === void 0 ? void 0 : _a.typeAnnotation) ? (p.pat.typeAnnotation.typeAnnotation.type !== 'TsAnyKeyword') : false; });
                        const hasRet = !!stmt.returnType;
                        hasTypes = hasAnyParam && hasRet;
                    }
                    const finfos = funcsByFile.get(file) || [];
                    const fI = finfos.find(f => f.name === name);
                    const params = fI ? Object.keys(fI.params).map(pn => `${pn}: ${mergeTypes(fI.params[pn]) || 'any'}`) : [];
                    const returns = fI ? (mergeTypes(fI.returns) || 'any') : 'any';
                    funcDecls.push({ name, start: stmt.span.start, hasTypes, params, returns });
                }
            });
            program.body.forEach((stmt) => {
                if (stmt.type === 'VariableDeclaration') {
                    (stmt.declarations || []).forEach((d) => {
                        var _a;
                        if (((_a = d.id) === null || _a === void 0 ? void 0 : _a.type) === 'Identifier' && d.init && (d.init.type === 'FunctionExpression' || d.init.type === 'ArrowFunctionExpression')) {
                            const name = d.id.value;
                            const finfos = funcsByFile.get(file) || [];
                            const fI = finfos.find(f => f.name === name);
                            const params = fI ? Object.keys(fI.params).map(pn => `${pn}: ${mergeTypes(fI.params[pn]) || 'any'}`) : [];
                            const returns = fI ? (mergeTypes(fI.returns) || 'any') : 'any';
                            funcDecls.push({ name, start: d.span.start, hasTypes: false, params, returns });
                        }
                    });
                }
            });
            if (funcDecls.length === 0)
                continue;
            let augmented = source;
            const sorted = funcDecls.sort((a, b) => b.start - a.start);
            for (const fn of sorted) {
                const before = augmented.slice(Math.max(0, fn.start - program.span.start - 4), fn.start - program.span.start);
                const alreadyHas = before.includes('/**');
                const shouldAnnotate = !alreadyHas;
                if (!shouldAnnotate)
                    continue;
                const paramsLines = fn.params.map(p => ` * @param ${p}`).join('\n');
                const retLine = ` * @returns ${fn.returns}`;
                const jsdoc = `/**\n * @function ${fn.name}\n${paramsLines ? paramsLines + '\n' : ''}${retLine}\n */\n`;
                const insertPos = fn.start - program.span.start;
                augmented = augmented.slice(0, insertPos) + jsdoc + augmented.slice(insertPos);
            }
            if (augmented !== source)
                node_fs_1.default.writeFileSync(file, augmented);
        }
    }
    if (config.reportFile) {
        const json = JSON.stringify(report, null, 2);
        node_fs_1.default.writeFileSync(config.reportFile, json);
    }
    return { globalsFile: out, report };
}
exports.inferTypesInFiles = inferTypesInFiles;
function inferTypesInSource(source, knownGlobals = []) {
    var _a;
    try {
        const program = (0, core_1.parseSync)(source, { syntax: 'ecmascript' });
        const varTypes = new Map();
        const funcStack = [];
        const functionsByName = new Map();
        const v = new InferVisitor(varTypes, funcStack, functionsByName);
        v.visitProgram(program);
        const { globalVariables } = require('./ident').processUnusedAndGlobalVariables(program, { knownGlobals });
        const result = {};
        for (const name of globalVariables.keys()) {
            const info = varTypes.get(name);
            const t = (info === null || info === void 0 ? void 0 : info.objectShape) ? objectOf(info.objectShape) : mergeTypes((_a = info === null || info === void 0 ? void 0 : info.inferred) !== null && _a !== void 0 ? _a : new Set());
            result[name] = t || 'any';
        }
        return { variables: result };
    }
    catch (_b) {
        return { variables: {} };
    }
}
exports.inferTypesInSource = inferTypesInSource;
//# sourceMappingURL=type-infer.js.map