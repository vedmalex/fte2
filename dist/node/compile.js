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
exports.parseFile = exports.compileTs = exports.compileFull = exports.compileLight = exports.run = exports.F = void 0;
const parse_1 = require("../parser/parse");
const ts = __importStar(require("typescript"));
function prepareCode(src) {
    const result = ts.transpileModule(src, {
        compilerOptions: {
            allowJs: true,
            strict: false,
            target: ts.ScriptTarget.ES2020,
            module: ts.ModuleKind.ES2022,
        },
    });
    return result.outputText;
}
const templates_1 = __importDefault(require("../templates"));
const factory_1 = require("../standalone/factory");
exports.F = new factory_1.TemplateFactoryStandalone(templates_1.default);
function run(context, template) {
    return exports.F.run(context, template);
}
exports.run = run;
function compileLight(content) {
    const compiled = parse_1.Parser.parse(content.toString());
    return prepareCode(run(compiled, 'raw.njs'));
}
exports.compileLight = compileLight;
function compileFull(content) {
    const compiled = parse_1.Parser.parse(content.toString());
    return prepareCode(run(compiled, 'compiled.njs'));
}
exports.compileFull = compileFull;
function compileTs(content) {
    const compiled = parse_1.Parser.parse(content.toString());
    return prepareCode(run(compiled, 'es6module.njs'));
}
exports.compileTs = compileTs;
function parseFile(content) {
    return parse_1.Parser.parse(content.toString());
}
exports.parseFile = parseFile;
//# sourceMappingURL=compile.js.map