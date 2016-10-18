"use strict";
const _1 = require('../common/template/');
class TemplateBrowser extends _1.TemplateBase {
    compile() {
        if (this.parent) {
            this.mergeParent(this.factory.ensure(this.parent));
        }
    }
}
exports.TemplateBrowser = TemplateBrowser;
//# sourceMappingURL=template.js.map