"use strict";
const raw = require('../../grammar/raw.pegjs.js');
const path = require('path');
const esprima = require('esprima');
const esmangle = require('esmangle');
const escodegen = require('escodegen');
const Gte = require('./factory');
let F = new Gte.TemplateFactory({
    root: path.join(__dirname, '..', 'templates'),
});
function prepareCode(src, optimize) {
    let errorMessage = '';
    let ast;
    try {
        ast = esprima.parse(src, {
            sourceType: 'module',
            ecmaVersion: 6,
            comment: true,
        });
    }
    catch (err) {
        errorMessage = F.run({
            error: err,
            compiledFile: src,
        }, 'compilationError.njs');
    }
    finally {
        if (!errorMessage) {
            if (optimize) {
                let optimized = esmangle.optimize(ast, [
                    [esmangle.pass.Registry.pass['remove-empty-statement'],
                        esmangle.pass.Registry.pass['remove-unreachable-branch']],
                ]);
                let output = escodegen.generate(optimized, {
                    format: {
                        indent: {
                            style: '  ',
                            base: 0,
                        },
                        renumber: true,
                        hexadecimal: true,
                        escapeless: true,
                        compact: false,
                        semicolons: false,
                        parentheses: false,
                    },
                });
                return output;
            }
            else {
                return src;
            }
        }
        else {
            return errorMessage;
        }
    }
}
function compileLight(content, optimize) {
    let compiled = raw.parse(content);
    return prepareCode(F.run(compiled, 'raw.njs'), optimize);
}
exports.compileLight = compileLight;
function validate(content) {
    let src = F.run(raw.parse(content.toString()), 'compiled.njs');
    let hasError = false;
    let ast;
    try {
        ast = esprima.parse(src, {
            sourceType: 'module',
            ecmaVersion: 6,
            comment: true,
        });
    }
    catch (err) {
        hasError = err;
    }
    finally {
        if (!hasError) {
            return true;
        }
        else {
            return hasError;
        }
    }
}
exports.validate = validate;
function compileFull(content, optimize) {
    let compiled = raw.parse(content.toString());
    return prepareCode(F.run(compiled, 'compiled.njs'), optimize);
}
exports.compileFull = compileFull;
//# sourceMappingURL=compile.js.map