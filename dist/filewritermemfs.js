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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commit = exports.readFile = exports.readFileTemp = exports.writeFile = exports.writeFileTemp = exports.read = exports.write = exports.result = exports.temp = void 0;
const memFs = __importStar(require("mem-fs"));
const editor = __importStar(require("mem-fs-editor"));
const astring = __importStar(require("astring"));
const acorn = __importStar(require("acorn"));
const prettier_1 = __importDefault(require("prettier"));
const path_1 = require("path");
const swc = __importStar(require("@swc/core"));
const memfs_1 = require("memfs");
exports.temp = new memfs_1.Volume({});
exports.result = new memfs_1.Volume({});
const store = memFs.create();
const memfs_store = editor.create(store);
function parseFile(text, minify = true, pretty = false, parser = 'babel') {
    let code, result;
    try {
        if (minify) {
            result = swc.minifySync(text, {
                sourceMap: true,
                compress: true,
                mangle: true,
            }).code;
        }
        else {
            if (parser == 'babel') {
                code = text;
                const ast = acorn.parse(code, { ecmaVersion: 'latest' });
                result = astring.generate(ast, { comments: true });
            }
            else {
                result = text;
            }
            if (pretty) {
                result = prettier_1.default.format(result, {
                    semi: false,
                    trailingComma: 'all',
                    singleQuote: true,
                    printWidth: 80,
                    tabWidth: 2,
                    arrowParens: 'avoid',
                    parser,
                });
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
const ensureDirBase = (fs) => (file) => {
    const dir = (0, path_1.parse)(file).dir;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};
const write = (fs) => {
    const ensureDir = ensureDirBase(fs);
    return (fn, data, { format, minify, pretty, } = {}) => {
        ensureDir(fn);
        const file = (0, path_1.parse)(fn);
        if (format) {
            try {
                const fType = file.ext.match(/\.js?$/);
                let result;
                if (fType) {
                    result = parseFile(data, minify, pretty, getParserForFileName(fn));
                }
                else {
                    result = data;
                }
                fs.writeFileSync(fn, result);
            }
            catch (err) {
                fs.writeFileSync('err.' + fn, data);
                console.error(err);
            }
        }
        else {
            fs.writeFileSync(fn, data);
        }
    };
};
exports.write = write;
const read = (fs) => (fn) => {
    fs.readFileSync(fn);
};
exports.read = read;
exports.writeFileTemp = (0, exports.write)(exports.temp);
exports.writeFile = (0, exports.write)(exports.result);
exports.readFileTemp = (0, exports.read)(exports.temp);
exports.readFile = (0, exports.read)(exports.result);
function commit() {
    const files = exports.result.toJSON();
    return new Promise((res, rej) => {
        Object.keys(files).forEach((current) => {
            memfs_store.write(current, files[current]);
        });
        return memfs_store.commit((err) => {
            if (err)
                return rej(err);
            else
                res(true);
        });
    });
}
exports.commit = commit;
//# sourceMappingURL=filewritermemfs.js.map