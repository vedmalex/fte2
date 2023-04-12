"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTemplate = void 0;
const compileLight_1 = require("./compileLight");
const safeEval_1 = require("./safeEval");
function makeTemplate(src, optimize = true) {
    let result;
    const compiled = (0, compileLight_1.compileLight)(src, optimize);
    try {
        result = (0, safeEval_1.safeEval)(compiled);
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
//# sourceMappingURL=makeTemplate.js.map