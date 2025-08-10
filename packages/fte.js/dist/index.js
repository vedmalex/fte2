"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContextTypes = exports.Inferer = exports.fte = exports.Template = exports.Factory = void 0;
const tslib_1 = require("tslib");
global.browser = false;
var TemplateFactory_1 = require("./TemplateFactory");
Object.defineProperty(exports, "Factory", { enumerable: true, get: function () { return TemplateFactory_1.TemplateFactory; } });
var Template_1 = require("./Template");
Object.defineProperty(exports, "Template", { enumerable: true, get: function () { return Template_1.Template; } });
var tag_1 = require("./tag");
Object.defineProperty(exports, "fte", { enumerable: true, get: function () { return tag_1.fte; } });
exports.Inferer = tslib_1.__importStar(require("./inferer/type-infer"));
var contextTypes_1 = require("./utils/contextTypes");
Object.defineProperty(exports, "generateContextTypes", { enumerable: true, get: function () { return contextTypes_1.generateContextTypes; } });
//# sourceMappingURL=index.js.map