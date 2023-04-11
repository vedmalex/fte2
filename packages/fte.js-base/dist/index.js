'use strict';

function applyDeindent(str, numChars) {
    if (!str)
        return str;
    let lines = Array.isArray(str) ? [...str] : String(str).split('\n');
    if (typeof numChars == 'string') {
        numChars = numChars.length;
    }
    if (numChars != 0) {
        let i = 0;
        do {
            if (lines[i].trim().length !== 0)
                break;
            i += 1;
            if (i >= lines.length - 1)
                break;
        } while (true);
        if (i < lines.length) {
            numChars = lines[i].length - lines[i].trimStart().length;
        }
    }
    if (numChars > 0) {
        for (let i = 0; i < lines.length; i++) {
            let spaceCount = 0;
            for (let j = 0; j < lines[i].length; j++) {
                if (lines[i][j] === ' ') {
                    spaceCount++;
                }
                else {
                    break;
                }
            }
            if (spaceCount > 0) {
                if (spaceCount <= numChars) {
                    lines[i] = lines[i].trimStart();
                }
                else {
                    lines[i] = lines[i].substring(numChars);
                }
            }
        }
    }
    return Array.isArray(str) ? lines : lines.join('\n');
}

function applyIndent(str, _indent) {
    let lines = Array.isArray(str) ? [...str] : String(str).split('\n');
    var indent = '';
    if (typeof _indent == 'number' && _indent > 0) {
        var res = '';
        for (var i = 0; i < _indent; i++) {
            res += ' ';
        }
        indent = res;
    }
    if (typeof _indent == 'string' && _indent.length > 0) {
        indent = _indent;
    }
    if (indent && lines) {
        let res = lines.map(s => indent + s);
        return Array.isArray(str) ? res : res.join('\n');
    }
    else {
        return lines;
    }
}

var escapeExp = /[&<>"]/, escapeAmpExp = /&/g, escapeLtExp = /</g, escapeGtExp = />/g, escapeQuotExp = /"/g;
function escapeIt(text) {
    if (text == null) {
        return '';
    }
    var result = text.toString();
    if (!escapeExp.test(result)) {
        return result;
    }
    return result
        .replace(escapeAmpExp, '&amp;')
        .replace(escapeLtExp, '&lt;')
        .replace(escapeGtExp, '&gt;')
        .replace(escapeQuotExp, '&quot;');
}

const DefaultFactoryOptions = {
    applyIndent,
    escapeIt,
    applyDeindent,
};

function merge(a, b, property) {
    let prop;
    const aProp = a[property];
    if (aProp !== undefined) {
        let bProp = b[property];
        if (bProp === undefined) {
            bProp = b[property] = {};
        }
        const propList = Object.keys(aProp);
        for (let i = 0, pLen = propList.length; i < pLen; i++) {
            prop = propList[i];
            if (!(prop in bProp)) {
                bProp[prop] = aProp[prop];
            }
        }
    }
}

class TemplateBase {
    constructor(config) {
        if (!(this instanceof TemplateBase)) {
            throw new Error('constructor is not a function');
        }
        this.srcCode = config.source ? config.source.toString() : '';
        this.name = config.name;
        this.absPath = config.absPath;
        if (config.script)
            this.script = config.script;
        this.blocks = config.blocks;
        this.slots = config.slots;
        this.dependency = config.dependency;
        this.parent = config.parent ? config.parent.trim() : '';
        this.aliases = config.aliases || {};
        this.alias = config.alias || [config.name];
        if (config.factory)
            this.factory = config.factory;
        if (config.compile) {
            this.compile = config.compile;
        }
    }
    mergeParent(src) {
        if (src) {
            merge(src, this, 'blocks');
            merge(src, this, 'aliases');
            merge(src, this, 'slots');
        }
    }
    compile() {
        throw new Error('abstract method call');
    }
}

class TemplateFactoryBase {
    constructor(config) {
        var _a;
        this.ext = [];
        this.root = undefined;
        this.watch = false;
        if (config === null || config === void 0 ? void 0 : config.options) {
            this.options = { ...config.options, ...DefaultFactoryOptions };
        }
        else {
            this.options = { ...DefaultFactoryOptions };
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

exports.DefaultFactoryOptions = DefaultFactoryOptions;
exports.TemplateBase = TemplateBase;
exports.TemplateFactoryBase = TemplateFactoryBase;
exports.applyDeindent = applyDeindent;
exports.applyIndent = applyIndent;
exports.escapeIt = escapeIt;
exports.merge = merge;
//# sourceMappingURL=index.js.map
