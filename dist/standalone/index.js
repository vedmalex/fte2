"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileTs = exports.Parser = exports.parseFile = exports.compileLight = exports.compileFull = exports.run = exports.Template = exports.Factory = void 0;
const factory_1 = require("./factory");
Object.defineProperty(exports, "Factory", { enumerable: true, get: function () { return factory_1.TemplateFactoryStandalone; } });
const template_1 = require("./template");
Object.defineProperty(exports, "Template", { enumerable: true, get: function () { return template_1.TemplateBrowser; } });
const compile_1 = require("./compile");
Object.defineProperty(exports, "compileFull", { enumerable: true, get: function () { return compile_1.compileFull; } });
Object.defineProperty(exports, "compileLight", { enumerable: true, get: function () { return compile_1.compileLight; } });
Object.defineProperty(exports, "compileTs", { enumerable: true, get: function () { return compile_1.compileTs; } });
Object.defineProperty(exports, "Parser", { enumerable: true, get: function () { return compile_1.Parser; } });
Object.defineProperty(exports, "run", { enumerable: true, get: function () { return compile_1.run; } });
Object.defineProperty(exports, "parseFile", { enumerable: true, get: function () { return compile_1.parseFile; } });
//# sourceMappingURL=index.js.map