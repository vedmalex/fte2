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
exports.commit = exports.readFile = exports.writeFile = void 0;
const memFs = __importStar(require("mem-fs"));
const editor = __importStar(require("mem-fs-editor"));
const path_1 = require("path");
const esbuild = __importStar(require("esbuild"));
const store = memFs.create();
const fs = editor.create(store);
function parseFile(text, minify = false, pretty = false, parser = 'babel') {
    let code, result;
    try {
        if (minify) {
            result = esbuild.transformSync(text, {
                minify: true,
            }).code;
        }
        else {
            if (parser == 'babel') {
                result = esbuild.transformSync(text, {
                    minify: false,
                }).code;
            }
            else {
                result = text;
            }
        }
        return result;
    }
    catch (err) {
        console.error(text);
        throw err;
    }
}
function getParserForFileName(fileName) {
    let parser;
    switch ((0, path_1.extname)(fileName)) {
        case '.jsx':
        case '.js':
        case '.mjs':
            parser = 'babel';
            break;
        case '.tsx':
        case '.ts':
            parser = 'typescript';
            break;
        case '.json':
            parser = 'json-stringify';
            break;
        case '.css':
            parser = 'css';
            break;
        case '.htm':
        case '.html':
        case '.xhtml':
            parser = 'html';
            break;
        default:
            parser = 'babel';
    }
    return parser;
}
function writeFile(fn, data, { format, minify, pretty, } = {}) {
    if (format) {
        try {
            const fType = fn.match(/\.js?$/);
            let result;
            if (fType) {
                result = parseFile(data, minify, pretty, getParserForFileName(fn));
            }
            else {
                result = data;
            }
            fs.write(fn, result);
        }
        catch (err) {
            fs.write('err.' + fn, data);
            console.error(err);
        }
    }
    else {
        fs.write(fn, data);
    }
}
exports.writeFile = writeFile;
function readFile(fn) {
    fs.read(fn);
}
exports.readFile = readFile;
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