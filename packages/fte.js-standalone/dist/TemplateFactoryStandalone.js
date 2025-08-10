"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactoryStandalone = void 0;
const fte_js_base_1 = require("fte.js-base");
const StandaloneTemplate_1 = require("./StandaloneTemplate");
class TemplateFactoryStandalone extends fte_js_base_1.TemplateFactoryBase {
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
        const templ = new StandaloneTemplate_1.StandaloneTemplate(template);
        this.register(templ, fileName);
        templ.compile();
        return templ;
    }
    preload() {
        Object.keys(this.templates).forEach(t => this.load(t));
    }
    run(context, name) {
        const templ = this.ensure(name);
        const bc = this.blockContent(templ);
        return bc.run(context, bc.content, bc.partial, bc.slot, this.options);
    }
    async runAsync(context, name) {
        const templ = this.ensure(name);
        const bc = this.blockContent(templ);
        if (typeof bc.runAsync === 'function') {
            return bc.runAsync(context, bc.content, bc.partial, bc.slot, this.options);
        }
        return bc.run(context, bc.content, bc.partial, bc.slot, this.options);
    }
    runPartial({ context, name, slots, options, }) {
        const templ = this.ensure(name);
        if (!templ.chunks) {
            const bc = this.blockContent(templ, slots);
            return bc.run(context, bc.content, bc.partial, bc.slot, { ...this.options, ...options });
        }
        else {
            throw new Error(`can't use chunked template as partial: ${name}`);
        }
    }
    async runPartialAsync({ context, name, slots, options, }) {
        const templ = this.ensure(name);
        if (!templ.chunks) {
            const bc = this.blockContent(templ, slots);
            if (typeof bc.runAsync === 'function') {
                return (await bc.runAsync(context, bc.content, bc.partial, bc.slot, { ...this.options, ...options }));
            }
            return bc.run(context, bc.content, bc.partial, bc.slot, { ...this.options, ...options });
        }
        else {
            throw new Error(`can't use chunked template as partial: ${name}`);
        }
    }
}
exports.TemplateFactoryStandalone = TemplateFactoryStandalone;
//# sourceMappingURL=TemplateFactoryStandalone.js.map