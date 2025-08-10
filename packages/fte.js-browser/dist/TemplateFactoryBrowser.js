"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactoryBrowser = void 0;
const fte_js_base_1 = require("fte.js-base");
const TemplateBrowser_1 = require("./TemplateBrowser");
class TemplateFactoryBrowser extends fte_js_base_1.TemplateFactoryBase {
    resolveTemplateConfig(fileName) {
        const result = (globalThis.fte)(fileName);
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
    async runAsync(context, name) {
        const templ = this.ensure(name);
        const bc = this.blockContent(templ);
        return bc.runAsync(context, bc.content, bc.partial, bc.slot, this.options);
    }
    runPartial({ context, name, options, slots }) {
        const templ = this.ensure(name);
        if (!templ.chunks) {
            const bc = this.blockContent(templ, slots);
            return bc.run(context, bc.content, bc.partial, bc.slot, { ...this.options, ...(options !== null && options !== void 0 ? options : {}) });
        }
        else {
            throw new Error(`can't use chunked template as partial: ${name}`);
        }
    }
    async runPartialAsync({ context, name, options, slots }) {
        const templ = this.ensure(name);
        if (!templ.chunks) {
            const bc = this.blockContent(templ, slots);
            return (await bc.runAsync(context, bc.content, bc.partial, bc.slot, { ...this.options, ...(options !== null && options !== void 0 ? options : {}) }));
        }
        else {
            throw new Error(`can't use chunked template as partial: ${name}`);
        }
    }
}
exports.TemplateFactoryBrowser = TemplateFactoryBrowser;
//# sourceMappingURL=TemplateFactoryBrowser.js.map