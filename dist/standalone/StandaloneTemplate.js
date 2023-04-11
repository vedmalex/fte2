"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandaloneTemplate = void 0;
const TemplateBase_1 = require("../common/types/TemplateBase");
class StandaloneTemplate extends TemplateBase_1.TemplateBase {
    compile() {
        if (this.parent) {
            this.mergeParent(this.factory.ensure(this.parent));
        }
    }
}
exports.StandaloneTemplate = StandaloneTemplate;
//# sourceMappingURL=StandaloneTemplate.js.map