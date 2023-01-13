"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFile = exports.compileTs = exports.compileFull = exports.compileLight = exports.run = exports.F = exports.Parser = void 0;
const parse_1 = require("../parser/parse");
Object.defineProperty(exports, "Parser", { enumerable: true, get: function () { return parse_1.Parser; } });
const factory_1 = require("./factory");
const templates_1 = __importDefault(require("../templates"));
exports.F = new factory_1.TemplateFactoryStandalone(templates_1.default);
function run(context, template) {
    return exports.F.run(context, template);
}
exports.run = run;
function compileLight(content) {
    const compiled = parse_1.Parser.parse(content.toString());
    return run(compiled, 'raw.njs');
}
exports.compileLight = compileLight;
function compileFull(content) {
    const compiled = parse_1.Parser.parse(content.toString());
    return run(compiled, 'compiled.njs');
}
exports.compileFull = compileFull;
function compileTs(content) {
    const compiled = parse_1.Parser.parse(content.toString());
    return run(compiled, 'es6module.njs');
}
exports.compileTs = compileTs;
function parseFile(content) {
    return parse_1.Parser.parse(content.toString());
}
exports.parseFile = parseFile;
//# sourceMappingURL=compile.js.map