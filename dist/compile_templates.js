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
const fs = __importStar(require("fs-extra"));
const prettier = __importStar(require("prettier"));
const path = __importStar(require("path"));
const glob_1 = __importDefault(require("glob"));
const compile_1 = require("./node/compile");
const src = 'templates';
function load(fileName, folder, compile) {
    fs.ensureDirSync(folder);
    const fn = path.resolve(fileName);
    if (fs.existsSync(fn)) {
        const content = fs.readFileSync(fn);
        const result = compile(content, { fileName, content });
        try {
            const prettified = prettier.format(result, {
                singleQuote: true,
                trailingComma: 'all',
                semi: false,
                arrowParens: 'always',
                bracketSpacing: true,
                jsxBracketSameLine: true,
                parser: 'typescript',
                proseWrap: 'never',
            });
            fs.writeFileSync(path.join(folder, path.basename(fileName) + '.js'), prettified);
        }
        catch (err) {
            console.log(fn);
            fs.writeFileSync(fn + '.err.js', result);
            throw err;
        }
    }
}
glob_1.default.sync('templates/codeblock.njs').forEach((file) => {
    console.log(file);
    load(file, src, compile_1.compileFull);
});
glob_1.default.sync('templates/MainTemplate.njs').forEach((file) => {
    console.log(file);
    load(file, src, compile_1.compileFull);
});
glob_1.default.sync('templates/compilationError.njs').forEach((file) => {
    console.log(file);
    load(file, src, compile_1.compileFull);
});
glob_1.default.sync('templates/compiled.njs').forEach((file) => {
    console.log(file);
    load(file, src, compile_1.compileFull);
});
glob_1.default.sync('templates/es6module.njs').forEach((file) => {
    console.log(file);
    load(file, src, compile_1.compileFull);
});
glob_1.default.sync('templates/raw.njs').forEach((file) => {
    console.log(file);
    load(file, src, compile_1.compileFull);
});
glob_1.default.sync('templates/test.njs').forEach((file) => {
    console.log(file);
    load(file, src, compile_1.compileFull);
});
//# sourceMappingURL=compile_templates.js.map