"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTemplate = exports.makeFunction = exports.safeEval = void 0;
const fs = __importStar(require("fs"));
const compile_1 = require("./compile");
function safeEval(src) {
    let retval;
    try {
        retval = (0, eval)(src);
    }
    catch (err) {
        fs.writeFileSync('failed.js', src);
        console.log('\t \x1b[34m' + err.message + '\x1b[0m');
        console.log("for mode debug information see 'failed.js' ");
    }
    return retval;
}
exports.safeEval = safeEval;
function makeFunction(fnDef, name) {
    let result;
    try {
        const fname = name.replace(/[\s,\\\/\.\-]/g, '_');
        result = safeEval('function ' +
            fname +
            ' (' +
            fnDef.parameters +
            '){\n' +
            fnDef.body +
            '\n}');
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
    const compiled = (0, compile_1.compileLight)(src);
    try {
        result = safeEval(compiled);
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