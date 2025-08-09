"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fte = exports.Template = exports.Factory = void 0;
global.browser = false;
var TemplateFactory_1 = require("./TemplateFactory");
Object.defineProperty(exports, "Factory", { enumerable: true, get: function () { return TemplateFactory_1.TemplateFactory; } });
var Template_1 = require("./Template");
Object.defineProperty(exports, "Template", { enumerable: true, get: function () { return Template_1.Template; } });
var tag_1 = require("./tag");
Object.defineProperty(exports, "fte", { enumerable: true, get: function () { return tag_1.fte; } });
//# sourceMappingURL=index.js.map