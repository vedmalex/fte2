'use strict';

var fte_jsBase = require('fte.js-base');

class TemplateBrowser extends fte_jsBase.TemplateBase {
    compile() {
        if (this.parent) {
            this.mergeParent(this.factory.ensure(this.parent));
        }
    }
}

class TemplateFactoryBrowser extends fte_jsBase.TemplateFactoryBase {
    resolveTemplateConfig(fileName) {
        const result = global.fte(fileName);
        result.factory = this;
        result.name = fileName;
        return result;
    }
    load(fileName, absPath) {
        const template = this.resolveTemplateConfig(fileName);
        const templ = new TemplateBrowser(template);
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
            return bc.run(context, bc.content, bc.partial, bc.slot, { ...this.options, ...(options !== null && options !== void 0 ? options : {}) });
        }
        else {
            throw new Error("cant't use template with chunks as partial");
        }
    }
}

Object.defineProperty(exports, 'TemplateBase', {
  enumerable: true,
  get: function () { return fte_jsBase.TemplateBase; }
});
exports.Factory = TemplateFactoryBrowser;
exports.Template = TemplateBrowser;
//# sourceMappingURL=index.js.map
