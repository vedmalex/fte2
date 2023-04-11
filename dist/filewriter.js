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
exports.commit = exports.writeFile = void 0;
const memFs = __importStar(require("mem-fs"));
const editor = __importStar(require("mem-fs-editor"));
const node_path_1 = require("node:path");
const swc = __importStar(require("@swc/core"));
const store = memFs.create();
const fs = editor.create(store);
function parseFile(text, minify = false) {
    let result;
    try {
        if (minify) {
            result = swc.printSync(swc.parseSync(text, { syntax: 'typescript' }), { minify: true }).code;
        }
        else {
            result = swc.printSync(swc.parseSync(text, { syntax: 'typescript' }), { minify: false }).code;
        }
        return result;
    }
    catch (err) {
        console.error(text);
        throw err;
    }
}
function writeFile(fn, data, minify) {
    try {
        let result = parseFile(data, minify);
        fs.write(fn, result);
    }
    catch (err) {
        const parsedFn = (0, node_path_1.parse)(fn);
        fs.write((0, node_path_1.join)(parsedFn.dir, `${parsedFn.name}.err${parsedFn.ext}`), data);
        console.error(err);
    }
}
exports.writeFile = writeFile;
function commit() {
    return new Promise((res, rej) => {
        return fs.commit((err) => {
            if (err)
                return rej(err);
            else
                res(true);
        });
    });
}
exports.commit = commit;
//# sourceMappingURL=filewriter.js.map