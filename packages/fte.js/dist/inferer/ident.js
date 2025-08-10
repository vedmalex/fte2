"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUnusedAndGlobalVariables = exports.findUnusedAndGlobalVariables = void 0;
const core_1 = require("@swc/core");
const Visitor_js_1 = require("@swc/core/Visitor.js");
function register(identifier, array) {
    switch (identifier.type) {
        case 'Identifier':
            if (!array.has(identifier.value)) {
                return array.set(identifier.value, 1);
            }
            else {
                let count = array.get(identifier.value);
                return array.set(identifier.value, count + 1);
            }
        case 'KeyValuePatternProperty':
            return register(identifier.value, array);
        case 'RestElement':
            return register(identifier.argument, array);
        case 'AssignmentPatternProperty':
            if (!array.has(identifier.key.value)) {
                return array.set(identifier.key.value, 1);
            }
            else {
                let count = array.get(identifier.key.value);
                return array.set(identifier.key.value, count + 1);
            }
        case 'ObjectPattern':
            return identifier.properties.forEach(x => register(x, array));
        case 'ArrayPattern':
            return identifier.elements.forEach(x => register(x, array));
    }
}
function findUnusedAndGlobalVariables(code, options) {
    const ast = (0, core_1.parseSync)(code, { syntax: 'typescript' });
    return processUnusedAndGlobalVariables(ast, options);
}
exports.findUnusedAndGlobalVariables = findUnusedAndGlobalVariables;
function processUnusedAndGlobalVariables(code, options) {
    var _a;
    const referencedVariables = new Map();
    const globalVariables = new Map();
    const declaredVariables = new Map();
    const knownGlobals = new Set(['Object', ...((_a = options === null || options === void 0 ? void 0 : options.knownGlobals) !== null && _a !== void 0 ? _a : [])]);
    function registerReference(path) {
        if (path) {
            register(path, referencedVariables);
        }
    }
    function registerDeclaration(path) {
        if (path) {
            register(path, declaredVariables);
        }
    }
    function registerGlobal(path) {
        if (path) {
            if (path.type === 'Identifier' && knownGlobals.has(path.value))
                return;
            register(path, globalVariables);
        }
    }
    class DeclarationVisitor extends Visitor_js_1.Visitor {
        visitTsType(n) {
            if (n.type === 'TsTypeReference') {
                registerGlobal(n.typeName);
            }
            return n;
        }
        visitFunctionDeclaration(decl) {
            registerDeclaration(decl.identifier);
            decl.params.forEach(p => registerDeclaration(p.pat));
            return super.visitFunctionDeclaration(decl);
        }
        visitClassDeclaration(decl) {
            registerDeclaration(decl.identifier);
            decl.body.forEach(member => {
                if (member.type === 'ClassProperty' && member.key.type === 'Identifier') {
                    registerDeclaration(member.key);
                }
            });
            return super.visitClassDeclaration(decl);
        }
        visitVariableDeclarator(path) {
            registerDeclaration(path.id);
            return super.visitVariableDeclarator(path);
        }
        visitArrowFunctionExpression(e) {
            e.params.forEach(p => registerDeclaration(p));
            return super.visitArrowFunctionExpression(e);
        }
        visitParameter(n) {
            registerDeclaration(n.pat);
            return super.visitParameter(n);
        }
        visitKeyValueProperty(n) {
            if (n.value.type === 'FunctionExpression' && n.value.body) {
                this.visitBlockStatement(n.value.body);
            }
            return n;
        }
    }
    class ReferenceVisitor extends Visitor_js_1.Visitor {
        visitVariableDeclarator(path) {
            const init = path.init;
            if (init)
                this.visitExpression(init);
            return path;
        }
        visitFunctionDeclaration(decl) {
            if (decl.body)
                this.visitBlockStatement(decl.body);
            return decl;
        }
        visitClassDeclaration(decl) {
            return decl;
        }
        visitParameter(n) {
            return n;
        }
        visitTsType(n) {
            if (n.type === 'TsTypeReference') {
                registerGlobal(n.typeName);
            }
            return n;
        }
        visitCallExpression(n) {
            if (n.callee.type === 'Identifier') {
                registerReference(n.callee);
            }
            else if (n.callee.type === 'MemberExpression') {
                this.visitMemberExpression(n.callee);
            }
            n.arguments.forEach(arg => {
                if (arg.expression.type === 'Identifier') {
                    registerReference(arg.expression);
                }
            });
            return super.visitCallExpression(n);
        }
        visitIdentifier(path) {
            if (!declaredVariables.has(path.value)) {
                registerGlobal(path);
            }
            registerReference(path);
            return path;
        }
        visitMemberExpression(member) {
            if (member.object.type === 'Identifier') {
                if (member.object.value === 'global' || member.object.value === 'globalThis') {
                    if (member.property.type === 'Identifier') {
                        registerGlobal(member.property);
                    }
                }
                else {
                    registerReference(member.object);
                    if (!declaredVariables.has(member.object.value) && member.object.value !== 'Object') {
                        registerGlobal(member.object);
                    }
                }
            }
            else if (member.object.type === 'MemberExpression') {
                this.visitMemberExpression(member.object);
            }
            if (member.computed) {
                if (member.property.type === 'Identifier') {
                    registerReference(member.property);
                }
                else {
                    return super.visitMemberExpression(member);
                }
                return member;
            }
            return member;
        }
        visitObjectExpression(n) {
            n.properties.forEach(prop => {
                if (prop.type === 'KeyValueProperty') {
                    this.visitKeyValueProperty(prop);
                }
            });
            return super.visitObjectExpression(n);
        }
        visitKeyValueProperty(n) {
            if (n.key.type === 'Computed' && n.key.expression.type === 'Identifier') {
                registerReference(n.key.expression);
            }
            if (n.value.type === 'Identifier') {
                registerReference(n.value);
            }
            else if (n.value.type === 'FunctionExpression') {
                if (n.value.body) {
                    this.visitBlockStatement(n.value.body);
                }
            }
            else if (n.value.type === 'ObjectExpression') {
                n.value.properties.forEach(prop => {
                    if (prop.type === 'KeyValueProperty')
                        this.visitKeyValueProperty(prop);
                });
            }
            return n;
        }
    }
    const declarationVisitor = new DeclarationVisitor();
    declarationVisitor.visitProgram(code);
    const referenceVisitor = new ReferenceVisitor();
    referenceVisitor.visitProgram(code);
    const unusedVariables = new Set();
    declaredVariables.forEach((_, key) => {
        if (!referencedVariables.has(key)) {
            unusedVariables.add(key);
        }
    });
    globalVariables.forEach((_, key) => {
        if (declaredVariables.has(key)) {
            globalVariables.delete(key);
        }
    });
    return {
        unusedVariables,
        globalVariables,
        referencedVariables,
        declaredVariables,
    };
}
exports.processUnusedAndGlobalVariables = processUnusedAndGlobalVariables;
//# sourceMappingURL=ident.js.map