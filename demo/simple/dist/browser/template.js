"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateBrowser = void 0;
const template_1 = require("../common/template");
class TemplateBrowser extends template_1.TemplateBase {
    compile() {
        if (this.parent) {
            this.mergeParent(this.factory.ensure(this.parent));
        }
    }
}
exports.TemplateBrowser = TemplateBrowser;
//# sourceMappingURL=template.js.map