"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const codeblock_njs_1 = __importDefault(require("./codeblock.njs"));
const compilationError_njs_1 = __importDefault(require("./compilationError.njs"));
const compiled_njs_1 = __importDefault(require("./compiled.njs"));
const es6module_njs_1 = __importDefault(require("./es6module.njs"));
const MainTemplate_njs_1 = __importDefault(require("./MainTemplate.njs"));
const raw_njs_1 = __importDefault(require("./raw.njs"));
const singlefile_es6_njs_1 = __importDefault(require("./singlefile.es6.njs"));
const singlefile_njs_1 = __importDefault(require("./singlefile.njs"));
const standalone_es6_njs_1 = __importDefault(require("./standalone.es6.njs"));
const standalone_index_es6_njs_1 = __importDefault(require("./standalone.index.es6.njs"));
const standalone_index_njs_1 = __importDefault(require("./standalone.index.njs"));
const standalone_njs_1 = __importDefault(require("./standalone.njs"));
const templates = {
    "codeblock.njs": codeblock_njs_1.default,
    "compilationError.njs": compilationError_njs_1.default,
    "compiled.njs": compiled_njs_1.default,
    "es6module.njs": es6module_njs_1.default,
    "MainTemplate.njs": MainTemplate_njs_1.default,
    "raw.njs": raw_njs_1.default,
    "singlefile.es6.njs": singlefile_es6_njs_1.default,
    "singlefile.njs": singlefile_njs_1.default,
    "standalone.es6.njs": standalone_es6_njs_1.default,
    "standalone.index.es6.njs": standalone_index_es6_njs_1.default,
    "standalone.index.njs": standalone_index_njs_1.default,
    "standalone.njs": standalone_njs_1.default
};
exports.default = templates;
//# sourceMappingURL=index.js.map