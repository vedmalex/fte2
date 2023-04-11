"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunction = void 0;
const safeEval_1 = require("./safeEval");
function makeFunction(fnDef, name) {
    let result;
    try {
        const fname = name.replace(/[\s,\\\/\.\-]/g, '_');
        result = (0, safeEval_1.safeEval)('function ' + fname + ' (' + fnDef.parameters + '){\n' + fnDef.body + '\n}');
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
//# sourceMappingURL=makeFunction.js.map