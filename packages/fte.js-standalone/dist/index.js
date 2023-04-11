'use strict';

var fte_jsBase = require('fte.js-base');
var templates = require('fte.js-templates');
var fte_jsParser = require('fte.js-parser');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var templates__default = /*#__PURE__*/_interopDefault(templates);

class StandaloneTemplate extends fte_jsBase.TemplateBase {
    compile() {
        if (this.parent) {
            this.mergeParent(this.factory.ensure(this.parent));
        }
    }
}

class TemplateFactoryStandalone extends fte_jsBase.TemplateFactoryBase {
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
        const templ = new StandaloneTemplate(template);
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
    runPartial({ context, name, slots, options, }) {
        const templ = this.ensure(name);
        if (!templ.chunks) {
            const bc = this.blockContent(templ, slots);
            return bc.run(context, bc.content, bc.partial, bc.slot, { ...this.options, ...options });
        }
        else {
            throw new Error("cant't use template with chunks as partial");
        }
    }
}

const F = new TemplateFactoryStandalone(templates__default.default);

function run(context, template) {
    return F.run(context, template);
}

function compileFull(content) {
    const compiled = fte_jsParser.Parser.parse(content.toString());
    return run(compiled, 'compiled.njs');
}

function compileLight(content) {
    const compiled = fte_jsParser.Parser.parse(content.toString());
    return run(compiled, 'raw.njs');
}

function compileTs(content) {
    const compiled = fte_jsParser.Parser.parse(content.toString());
    return run(compiled, 'es6module.ts.njs');
}

function parseFile(content) {
    return fte_jsParser.Parser.parse(content.toString());
}

exports.F = F;
exports.StandaloneTemplate = StandaloneTemplate;
exports.TemplateFactoryStandalone = TemplateFactoryStandalone;
exports.compileFull = compileFull;
exports.compileLight = compileLight;
exports.compileTs = compileTs;
exports.parseFile = parseFile;
exports.run = run;
//# sourceMappingURL=index.js.map
