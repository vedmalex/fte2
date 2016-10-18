"use strict";
const template_1 = require('./template');
const factory_1 = require('./../common/factory');
class TemplateFactoryBrowser extends factory_1.TemplateFactoryBase {
    resolveTemplateConfig(fileName) {
        let result = global.fte[fileName];
        result.factory = this;
        result.name = fileName;
        return result;
    }
    load(fileName, absPath) {
        let template = this.resolveTemplateConfig(fileName);
        let templ = new template_1.TemplateBrowser(template);
        this.register(templ, fileName);
        templ.compile();
        return templ;
    }
    run(context, name, absPath) {
        let templ = this.ensure(name);
        let bc = this.blockContent(templ);
        return bc.run(context, bc.content, bc.partial);
    }
}
exports.TemplateFactoryBrowser = TemplateFactoryBrowser;
//# sourceMappingURL=factory.js.map