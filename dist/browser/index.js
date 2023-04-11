"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateBase = exports.Template = exports.Factory = void 0;
global.browser = true;
var TemplateFactoryBrowser_1 = require("./TemplateFactoryBrowser");
Object.defineProperty(exports, "Factory", { enumerable: true, get: function () { return TemplateFactoryBrowser_1.TemplateFactoryBrowser; } });
var TemplateBrowser_1 = require("./TemplateBrowser");
Object.defineProperty(exports, "Template", { enumerable: true, get: function () { return TemplateBrowser_1.TemplateBrowser; } });
var TemplateBase_1 = require("../common/types/TemplateBase");
Object.defineProperty(exports, "TemplateBase", { enumerable: true, get: function () { return TemplateBase_1.TemplateBase; } });
//# sourceMappingURL=index.js.map