"use strict";
const template_1 = require('./../common/template');
const helpers_1 = require('./helpers');
class Template extends template_1.TemplateBase {
    compile() {
        if (this.srcCode) {
            let result = helpers_1.makeTemplate(this.srcCode);
            if (!result.error) {
                this.script = result.script;
                this.blocks = result.blocks;
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