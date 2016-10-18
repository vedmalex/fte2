"use strict";
class TemplateFactoryBase {
    constructor(config) {
        this.ext = [];
        this.debug = false;
        this.watch = false;
        this.watchTree = undefined;
        this.root = undefined;
        if (!(this instanceof TemplateFactoryBase)) {
            throw new Error('constructor is not a function');
        }
        if (!process.browser) {
            this.root = config ? (config.root ? (Array.isArray(config.root) ? config.root : [config.root]) : [process.cwd()]) : [process.cwd()];
            this.debug = (config && config.debug) || false;
            this.watch = (config && config.watch);
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
            if (tpl.alias && tpl.alias !== tpl.name) {
                this.cache[tpl.alias] = tpl;
            }
            this.cache[tpl.absPath] = tpl;
        }
        return tpl;
    }
    ensure(fileName, absPath) {
        if (!(fileName in this.cache)) {
            let template = this.load(fileName, absPath);
            if (this.watch) {
                this.checkChanges(template, fileName, absPath);
                let depList = Object.keys(template.dependency);
                for (let i = 0, len = depList.length; i < len; i++) {
                    let templates = this.watchTree[this.cache[depList[i]].absPath].templates;
                    templates[template.absPath] = template;
                }
            }
            return template;
        }
        return this.cache[fileName];
    }
    blockContent(tpl) {
        let scripts = [];
        let self = this;
        return {
            partial: (obj, name) => {
                if (tpl.aliases.hasOwnProperty(name)) {
                    return self.run(obj, tpl.aliases[name], true);
                }
                else {
                    return self.run(obj, name);
                }
            },
            content: (name, context, content, partial) => {
                if (name) {
                    return tpl.blocks[name](context, content, partial);
                }
                else {
                    let fn = scripts.pop();
                    if (typeof fn === 'function') {
                        return fn(context, content, partial);
                    }
                    else {
                        return '';
                    }
                }
            },
            run: ($context, $content, $partial) => {
                function go(context, content, partial) {
                    let $this = this;
                    if ($this.parent) {
                        let parent = self.ensure($this.parent);
                        scripts.push($this.script);
                        return go.call(parent, context, content, partial);
                    }
                    else {
                        return $this.script(context, content, partial);
                    }
                }
                return go.call(tpl, $context, $content, $partial);
            },
        };
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
    run(ctx, name, absPath) {
        throw new Error('abstract method call');
    }
}
exports.TemplateFactoryBase = TemplateFactoryBase;
;
//# sourceMappingURL=factory.js.map