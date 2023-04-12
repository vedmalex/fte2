"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateBrowser = void 0;
const fte_js_base_1 = require("fte.js-base");
class TemplateBrowser extends fte_js_base_1.TemplateBase {
    compile() {
        if (this.parent) {
            this.mergeParent(this.factory.ensure(this.parent));
        }
    }
}
exports.TemplateBrowser = TemplateBrowser;
//# sourceMappingURL=TemplateBrowser.js.map