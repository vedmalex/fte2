"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFull = exports.compileLight = exports.Template = exports.Factory = void 0;
const factory_1 = require("./factory");
Object.defineProperty(exports, "Factory", { enumerable: true, get: function () { return factory_1.TemplateFactory; } });
const template_1 = require("./template");
Object.defineProperty(exports, "Template", { enumerable: true, get: function () { return template_1.Template; } });
const compile_1 = require("./compile");
Object.defineProperty(exports, "compileLight", { enumerable: true, get: function () { return compile_1.compileLight; } });
Object.defineProperty(exports, "compileFull", { enumerable: true, get: function () { return compile_1.compileFull; } });
//# sourceMappingURL=index.js.map