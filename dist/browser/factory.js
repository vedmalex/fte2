"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactoryBrowser = void 0;
const template_1 = require("./template");
const factory_1 = require("./../common/factory");
class TemplateFactoryBrowser extends factory_1.TemplateFactoryBase {
    resolveTemplateConfig(fileName) {
        const result = global.fte(fileName);
        result.factory = this;
        result.name = fileName;
        return result;
    }
    load(fileName, absPath) {
        const template = this.resolveTemplateConfig(fileName);
        const templ = new template_1.TemplateBrowser(template);
        this.register(templ, fileName);
        templ.compile();
        return templ;
    }
    run({ context, name, absPath, options, slots, }) {
        const templ = this.ensure(name);
        const bc = this.blockContent(templ, slots);
        return bc.run(context, bc.content, bc.partial, bc.slot, this.options);
    }
    runPartial({ context, name, absPath, options, slots, }) {
        const templ = this.ensure(name);
        const bc = this.blockContent(templ, slots);
        return bc.run(context, bc.content, bc.partial, bc.slot, this.options);
    }
}
exports.TemplateFactoryBrowser = TemplateFactoryBrowser;
//# sourceMappingURL=factory.js.map