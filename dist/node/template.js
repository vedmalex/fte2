"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const TemplateBase_1 = require("../common/types/TemplateBase");
const makeTemplate_1 = require("../common/utils/makeTemplate");
class Template extends TemplateBase_1.TemplateBase {
    compile() {
        if (this.srcCode) {
            const result = (0, makeTemplate_1.makeTemplate)(this.srcCode, false);
            if (!result.error) {
                this.script = result.script;
                this.blocks = result.blocks;
                this.slots = result.slots;
                this.compile = result.compile;
                this.dependency = result.dependency;
                if (result.alias) {
                    this.alias = result.alias;
                }
                this.compile();
            }
            else {
                throw result.error;
            }
        }
        return this;
    }
}
exports.Template = Template;
//# sourceMappingURL=Template.js.map