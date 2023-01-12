"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactoryBase = exports.DefaultFactoryOptions = void 0;
const helpers_1 = require("./helpers");
exports.DefaultFactoryOptions = {
    applyIndent: helpers_1.applyIndent,
    escapeIt: helpers_1.escapeIt,
};
class TemplateFactoryBase {
    constructor(config = {}) {
        this.ext = [];
        this.debug = false;
        this.watch = false;
        this.watchTree = undefined;
        this.root = undefined;
        config.options = { ...config.options, ...exports.DefaultFactoryOptions };
        this.options = config.options;
        if (!process.browser) {
            this.root = config
                ? config.root
                    ? Array.isArray(config.root)
                        ? config.root
                        : [config.root]
                    : [process.cwd()]
                : [process.cwd()];
            this.debug = (config && config.debug) || false;
            this.watch = config && config.watch;
            if (config && config.ext) {
                if (Array.isArray(config.ext)) {
                    this.ext = config.ext;
                }
                else {
                    this.ext = [config.ext];
                }
            }
            this.watchTree = {};
        }
        this.cache = {};
        if (config && config.preload) {
            this.preload();
        }
    }
    register(tpl, fileName) {
        if (!(tpl.name in this.cache)) {
            this.cache[tpl.name] = tpl;
            if (tpl.alias && Array.isArray(tpl.alias)) {
                tpl.alias
                    .filter((a) => a !== tpl.name)
                    .forEach((a) => {
                    this.cache[a] = tpl;
                });
            }
            this.cache[tpl.absPath] = tpl;
        }
        return tpl;
    }
    ensure(fileName, absPath) {
        if (!(fileName in this.cache)) {
            const template = this.load(fileName, absPath);
            if (this.watch) {
                this.checkChanges(template, fileName, absPath);
                const depList = Object.keys(template.dependency);
                for (let i = 0, len = depList.length; i < len; i++) {
                    const templates = this.watchTree[this.cache[depList[i]].absPath].templates;
                    templates[template.absPath] = template;
                }
            }
            return template;
        }
        return this.cache[fileName];
    }
    blockContent(tpl, slots) {
        const scripts = [];
        const self = this;
        const bc = {
            slots: slots ? slots : {},
            slot(name, content) {
                if (name) {
                    if (!this.slots.hasOwnProperty(name)) {
                        this.slots[name] = [];
                    }
                    if (content) {
                        if (Array.isArray(content)) {
                            content.forEach((c) => this.slot(name, c));
                        }
                        else {
                            if (this.slots[name].indexOf(content) === -1) {
                                this.slots[name].push(content);
                            }
                        }
                    }
                    else {
                        return `#{partial(context['${name}'] || [], '${name}')}`;
                    }
                }
            },
            partial(obj, name) {
                if (tpl.aliases.hasOwnProperty(name)) {
                    return self.runPartial({
                        context: obj,
                        name: tpl.aliases[name],
                        absPath: true,
                        slots: this.slots,
                        options: this.options,
                    });
                }
                else {
                    return self.runPartial({
                        context: obj,
                        name,
                        absPath: false,
                        slots: this.slots,
                        options: this.options,
                    });
                }
            },
            content(name, context, content, partial, slot) {
                if (name) {
                    return tpl.blocks && tpl.blocks.hasOwnProperty(name)
                        ? tpl.blocks[name](context, content, partial, slot, self.options)
                        : '';
                }
                else {
                    const fn = scripts.pop();
                    if (typeof fn === 'function') {
                        return fn(context, content, partial, slot, self.options);
                    }
                    else {
                        return '';
                    }
                }
            },
            run($context, $content, $partial) {
                function go(context, content, partial, slot) {
                    const $this = this;
                    if ($this.parent) {
                        const parent = self.ensure($this.parent);
                        scripts.push($this.script);
                        return go.call(parent, context, content, partial, slot);
                    }
                    else {
                        try {
                            return $this.script(context, content, partial, slot, self.options);
                        }
                        catch (e) {
                            throw new Error(`template ${$this.name} failed to execute with error
                  '${e.message}
                  ${e.stack}'`);
                        }
                    }
                }
                return go.call(tpl, $context, $content, $partial, this.slot);
            },
        };
        bc.content = bc.content.bind(bc);
        bc.partial = bc.partial.bind(bc);
        bc.run = bc.run.bind(bc);
        bc.slot = bc.slot.bind(bc);
        return bc;
    }
    preload(fileName) {
        throw new Error('abstract method call');
    }
    checkChanges(template, fileName, absPath) {
        throw new Error('abstract method call');
    }
    load(fileName, absPath) {
        throw new Error('abstract method call');
    }
    run(context, name) {
        throw new Error('abstract method call');
    }
    runPartial({ context, name, absPath, options, slots, }) {
        throw new Error('abstract method call');
    }
}
exports.TemplateFactoryBase = TemplateFactoryBase;
//# sourceMappingURL=factory.js.map