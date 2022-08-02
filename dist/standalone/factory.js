"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactoryStandalone = void 0;
const template_1 = require("./template");
const factory_1 = require("../common/factory");
class TemplateFactoryStandalone extends factory_1.TemplateFactoryBase {
    constructor(templates) {
        super();
        this.templates = templates;
        this.preload();
    }
    resolveTemplateConfig(fileName) {
        const result = this.templates[fileName];
        if (result) {
            result.factory = this;
            result.name = fileName;
            return result;
        }
        else {
            throw new Error(`template ${fileName} not found`);
        }
    }
    load(fileName) {
        const template = this.resolveTemplateConfig(fileName);
        const templ = new template_1.TemplateBrowser(template);
        this.register(templ, fileName);
        templ.compile();
        return templ;
    }
    preload() {
        Object.keys(this.templates).forEach((t) => this.load(t));
    }
    run(context, name) {
        const templ = this.ensure(name);
        const bc = this.blockContent(templ);
        return bc.run(context, bc.content, bc.partial, bc.slot, this.options);
    }
    runPartial({ context, name, slots, }) {
        const templ = this.ensure(name);
        if (!templ.chunks) {
            const bc = this.blockContent(templ, slots);
            return bc.run(context, bc.content, bc.partial, bc.slot, this.options);
        }
        else {
            throw new Error("cant't use template with chunks as partial");
        }
    }
}
exports.TemplateFactoryStandalone = TemplateFactoryStandalone;
//# sourceMappingURL=factory.js.map