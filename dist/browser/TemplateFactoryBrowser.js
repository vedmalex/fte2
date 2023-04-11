"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactoryBrowser = void 0;
const TemplateFactoryBase_1 = require("../common/types/TemplateFactoryBase");
const TemplateBrowser_1 = require("./TemplateBrowser");
const factory_1 = require("./factory");
class TemplateFactoryBrowser extends TemplateFactoryBase_1.TemplateFactoryBase {
    resolveTemplateConfig(fileName) {
        const result = factory_1.global.fte(fileName);
        result.factory = this;
        result.name = fileName;
        return result;
    }
    load(fileName, absPath) {
        const template = this.resolveTemplateConfig(fileName);
        const templ = new TemplateBrowser_1.TemplateBrowser(template);
        this.register(templ, fileName);
        templ.compile();
        return templ;
    }
    run(context, name) {
        const templ = this.ensure(name);
        const bc = this.blockContent(templ);
        return bc.run(context, bc.content, bc.partial, bc.slot, this.options);
    }
    runPartial({ context, name, options, slots }) {
        const templ = this.ensure(name);
        if (!templ.chunks) {
            const bc = this.blockContent(templ, slots);
            return bc.run(context, bc.content, bc.partial, bc.slot, { ...this.options, ...(options ?? {}) });
        }
        else {
            throw new Error("cant't use template with chunks as partial");
        }
    }
}
exports.TemplateFactoryBrowser = TemplateFactoryBrowser;
//# sourceMappingURL=TemplateFactoryBrowser.js.map