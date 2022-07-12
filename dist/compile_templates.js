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
const fs = __importStar(require("fs-extra"));
const prettier = __importStar(require("prettier"));
const path = __importStar(require("path"));
const compile_1 = require("./node/compile");
const src = 'templates';
function load(fileName, folder, compile, optimize) {
    fs.ensureDirSync(folder);
    const fn = path.resolve(fileName);
    if (fs.existsSync(fn)) {
        const content = fs.readFileSync(fn);
        const result = compile(content, optimize);
        const prettified = prettier.format(result, {
            singleQuote: true,
            trailingComma: 'all',
            semi: false,
            arrowParens: 'always',
            bracketSpacing: true,
            jsxBracketSameLine: true,
            parser: 'typescript',
        });
        fs.writeFileSync(path.join(folder, path.basename(fileName) + '.js'), prettified);
    }
}
const files = fs.readdirSync(src);
if (files.length > 0) {
    let rec, stat, ext;
    for (let i = 0, len = files.length; i < len; i++) {
        rec = path.join(src, files[i]);
        stat = fs.statSync(rec);
        if (stat.isFile()) {
            ext = path.extname(rec);
            if (ext === '.nhtml' || ext === '.njs') {
                load(rec, src, compile_1.compileFull, true);
            }
        }
    }
}
//# sourceMappingURL=compile_templates.js.map