"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commit = exports.writeRaw = exports.writeFile = void 0;
const tslib_1 = require("tslib");
const memFs = tslib_1.__importStar(require("mem-fs"));
const editor = tslib_1.__importStar(require("mem-fs-editor"));
const path_1 = require("path");
const swc = tslib_1.__importStar(require("@swc/core"));
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
        const inlineMatch = data.match(/\/\/\#\s*sourceMappingURL=data:application\/json;base64,[^\n\r]+/);
        const externalMatch = data.match(/\/\/\#\s*sourceMappingURL=[^\n\r]+\.map/);
        let result = parseFile(data, minify);
        const hasAnyMapComment = /\/\/\#\s*sourceMappingURL=/.test(result);
        if (!hasAnyMapComment) {
            if (inlineMatch) {
                result += `\n${inlineMatch[0]}`;
            }
            else if (externalMatch) {
                result += `\n${externalMatch[0]}`;
            }
        }
        fs.write(fn, result);
    }
    catch (err) {
        const parsedFn = (0, path_1.parse)(fn);
        fs.write((0, path_1.join)(parsedFn.dir, `${parsedFn.name}.err${parsedFn.ext}`), data);
        console.error(err);
    }
}
exports.writeFile = writeFile;
function writeRaw(fn, data) {
    fs.write(fn, data);
}
exports.writeRaw = writeRaw;
function commit() {
    return new Promise((res, rej) => {
        return fs.commit(err => {
            if (err)
                return rej(err);
            else
                res(true);
        });
    });
}
exports.commit = commit;
//# sourceMappingURL=filewriter.js.map