"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactoryBase = void 0;
const DefaultFactoryOptions_1 = require("./types/DefaultFactoryOptions");
class TemplateFactoryBase {
    constructor(config) {
        var _a;
        this.ext = [];
        this.root = undefined;
        this.watch = false;
        if (config === null || config === void 0 ? void 0 : config.options) {
            this.options = { ...DefaultFactoryOptions_1.DefaultFactoryOptions, ...config.options };
        }
        else {
            this.options = { ...DefaultFactoryOptions_1.DefaultFactoryOptions };
        }
        this.watch = (_a = config === null || config === void 0 ? void 0 : config.watch) !== null && _a !== void 0 ? _a : false;
        if (!global.browser) {
            this.root = config
                ? config.root
                    ? Array.isArray(config.root)
                        ? config.root
                        : [config.root]
                    : [process.cwd()]
                : [process.cwd()];
            if (config && config.ext) {
                if (Array.isArray(config.ext)) {
                    this.ext = config.ext;
                }
                else {
                    this.ext = [config.ext];
                }
            }
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
                    .filter(a => a !== tpl.name)
                    .forEach(a => {
                    this.cache[a] = tpl;
                });
            }
            this.cache[tpl.absPath] = tpl;
        }
        return tpl;
    }
    ensure(fileName, absPath) {
        if (!(fileName in this.cache)) {
            return this.load(fileName, absPath);
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
                            content.forEach(c => this.slot(name, c));
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
            options: { ...this.options },
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
    load(fileName, absPath) {
        throw new Error('abstract method call');
    }
    run(context, name) {
        throw new Error('abstract method call');
    }
    runPartial(_) {
        throw new Error('abstract method call');
    }
}
exports.TemplateFactoryBase = TemplateFactoryBase;
//# sourceMappingURL=TemplateFactoryBase.js.map