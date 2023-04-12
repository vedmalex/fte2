"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeEval = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
function safeEval(src) {
    let retval;
    try {
        retval = eval(src);
    }
    catch (err) {
        fs.writeFileSync('failed.js', src);
        console.log('\t \x1b[34m' + err.message + '\x1b[0m');
        console.log("for mode debug information see 'failed.js' ");
    }
    return retval;
}
exports.safeEval = safeEval;
//# sourceMappingURL=safeEval.js.map