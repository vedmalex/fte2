"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateBrowser = void 0;
const TemplateBase_1 = require("../common/types/TemplateBase");
class TemplateBrowser extends TemplateBase_1.TemplateBase {
    compile() {
        if (this.parent) {
            this.mergeParent(this.factory.ensure(this.parent));
        }
    }
}
exports.TemplateBrowser = TemplateBrowser;
//# sourceMappingURL=TemplateBrowser.js.map