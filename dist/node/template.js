"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const template_1 = require("./../common/template");
const helpers_1 = require("./helpers");
class Template extends template_1.TemplateBase {
    compile() {
        if (this.srcCode) {
            const result = helpers_1.makeTemplate(this.srcCode);
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
//# sourceMappingURL=template.js.map