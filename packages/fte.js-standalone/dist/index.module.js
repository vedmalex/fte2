import { TemplateBase, TemplateFactoryBase } from 'fte.js-base';
import templates from 'fte.js-templates';
import { Parser } from 'fte.js-parser';

class StandaloneTemplate extends TemplateBase {
    compile() {
        if (this.parent) {
            this.mergeParent(this.factory.ensure(this.parent));
        }
    }
}

class TemplateFactoryStandalone extends TemplateFactoryBase {
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

const F = new TemplateFactoryStandalone(templates);

function run(context, template) {
    return F.run(context, template);
}

function compileFull(content) {
    const compiled = Parser.parse(content.toString());
    return run(compiled, 'compiled.njs');
}

function compileLight(content) {
    const compiled = Parser.parse(content.toString());
    return run(compiled, 'raw.njs');
}

function compileTs(content) {
    const compiled = Parser.parse(content.toString());
    return run(compiled, 'es6module.ts.njs');
}

function parseFile(content) {
    return Parser.parse(content.toString());
}

export { F, StandaloneTemplate, TemplateFactoryStandalone, compileFull, compileLight, compileTs, parseFile, run };
//# sourceMappingURL=index.module.js.map
