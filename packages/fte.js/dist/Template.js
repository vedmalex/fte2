"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const fte_js_base_1 = require("fte.js-base");
const makeTemplate_1 = require("./makeTemplate");
class Template extends fte_js_base_1.TemplateBase {
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