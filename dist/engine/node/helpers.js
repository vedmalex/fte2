"use strict";
const fs = require('fs-extra');
const compile_1 = require('./compile');
const esprima = require('esprima');
const esmangle = require('esmangle');
const escodegen = require('escodegen');
function safeEval(src) {
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
        fs.writeFileSync('failed.js', src);
        console.log('\t \x1b[34m' + err.message + '\x1b[0m');
        console.log("for mode debug information see 'failed.js' ");
        hasError = err;
    }
    finally {
        if (!hasError) {
            let optimized = esmangle.optimize(ast, [
                [esmangle.pass.Registry.pass['remove-empty-statement']],
            ]);
            let output = escodegen.generate(optimized);
            let result;
            try {
                result = eval(output);
            }
            catch (err) {
                fs.writeFileSync('failed.js', output);
                console.log('\t \x1b[34m' + err.message + '\x1b[0m');
                console.log("for mode debug information see 'failed.js' ");
                hasError = err;
            }
            return result;
        }
        else {
            throw hasError;
        }
    }
}
exports.safeEval = safeEval;
function makeFunction(fnDef, name) {
    let result;
    try {
        let fname = name.replace(/[\s,\\\/\.\-]/g, '_');
        result = safeEval('result = function ' + fname + ' (' + fnDef.parameters + '){\n' + fnDef.body + '\n}');
    }
    catch (error) {
        result = {
            err: error,
            code: fnDef.body,
        };
    }
    finally {
        return result;
    }
}
exports.makeFunction = makeFunction;
function makeTemplate(src) {
    let result;
    let compiled = compile_1.compileLight(src);
    try {
        result = safeEval('result = ' + compiled);
    }
    catch (error) {
        result = {
            error: error,
            code: src,
        };
    }
    finally {
        return result;
    }
}
exports.makeTemplate = makeTemplate;
//# sourceMappingURL=helpers.js.map