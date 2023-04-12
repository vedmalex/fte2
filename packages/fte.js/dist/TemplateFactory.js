"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactory = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const glob = tslib_1.__importStar(require("glob"));
const Template_1 = require("./Template");
const chokidar_1 = require("chokidar");
const fte_js_base_1 = require("fte.js-base");
const safeEval_1 = require("./safeEval");
class TemplateFactory extends fte_js_base_1.TemplateFactoryBase {
    constructor() {
        super(...arguments);
        this.watchList = [];
    }
    load(fileName, absPath) {
        let root;
        for (let i = 0, len = this.root.length; i < len; i++) {
            root = this.root[i];
            const fn = absPath ? path.resolve(fileName) : path.resolve(path.join(root, fileName));
            const compiledJS = fn + '.js';
            if (fs.existsSync(compiledJS)) {
                let result;
                try {
                    result = require(compiledJS);
                }
                catch (error) {
                    const storedScript = fs.readFileSync(compiledJS);
                    result = (0, safeEval_1.safeEval)(storedScript.toString());
                }
                if (result instanceof Function) {
                    result = {
                        script: result,
                        compile: new Function(),
                    };
                }
                result.absPath = fn;
                result.name = fileName;
                result.factory = this;
                const templ = new Template_1.Template(result);
                this.register(templ, fileName);
                templ.compile();
                return templ;
            }
            else if (fs.existsSync(fn)) {
                const content = fs.readFileSync(fn);
                const tpl = new Template_1.Template({
                    source: content.toString(),
                    name: fileName,
                    absPath: fn,
                    factory: this,
                });
                let hasException = true;
                try {
                    tpl.compile();
                    hasException = false;
                }
                finally {
                    if (!hasException) {
                        return this.register(new Template_1.Template(tpl), fileName);
                    }
                }
            }
        }
        throw new Error(`template ${fileName} not found (absPath= ${absPath} )`);
    }
    preload() {
        let files = [];
        for (let i = 0, rLen = this.root.length; i < rLen; i++) {
            for (let j = 0, eLen = this.ext.length; j < eLen; j++) {
                files = files.concat(glob.sync('*.' + this.ext[j], {
                    root: this.root[i],
                    cwd: this.root[i],
                    matchBase: true,
                }));
            }
        }
        for (let i = 0, len = files.length; i < len; i++) {
            this.load(files[i]);
        }
    }
    standalone(source) {
        const tpl = new Template_1.Template({
            source: source,
            factory: this,
        });
        return tpl.compile();
    }
    create(source, name) {
        if (!name) {
            name = 'freegenerated' + Math.random().toString() + '.js';
        }
        const tpl = this.standalone(source);
        tpl.name = name;
        tpl.absPath = name;
        this.register(tpl);
        return name;
    }
    run(context, name, absPath) {
        const templ = this.ensure(name, absPath);
        const bc = this.blockContent(templ, {});
        const result = bc.run(context, bc.content, bc.partial, bc.slot, this.options);
        if (Object.keys(bc.slots).length > 0) {
            if (Array.isArray(result)) {
                return result.map(r => {
                    const tpl = this.standalone(r.content);
                    const content = tpl.script(bc.slots, bc.content, bc.partial, bc.slot, this.options);
                    return {
                        name: r.name,
                        content,
                    };
                });
            }
            else {
                const res = this.standalone(result);
                return res.script(bc.slots, bc.content, bc.partial, bc.slot, this.options);
            }
        }
        else {
            return result;
        }
    }
    runPartial({ context, name, absPath, options, slots, }) {
        const templ = this.ensure(name, absPath);
        if (!templ.chunks) {
            const bc = this.blockContent(templ, slots);
            return bc.run(context, bc.content, bc.partial, bc.slot, { ...this.options, ...(options !== null && options !== void 0 ? options : {}) });
        }
        else {
            throw new Error("cant't use template with chunks as partial");
        }
    }
    express() {
        const self = this;
        return (fileName, context, callback) => {
            const templ = self.ensure(fileName, true);
            const bc = self.blockContent(templ);
            let result, err;
            try {
                result = bc.run(context, bc.content, bc.partial, bc.slot, this.options);
            }
            catch (e) {
                err = e;
            }
            finally {
                callback(err, result);
            }
        };
    }
    clearCache(template) {
        delete this.cache[template.name];
        delete this.cache[template.absPath];
        template.alias.forEach(alias => {
            delete this.cache[alias];
        });
    }
    ensure(fileName, absPath) {
        const template = super.ensure(fileName, absPath);
        if (this.watch) {
            if (!this.watchList)
                this.watchList = [];
            if (!this.watcher) {
                const watcher = (this.watcher = (0, chokidar_1.watch)(this.watchList));
                watcher.on('change', (fn) => {
                    const template = this.cache[fn];
                    this.clearCache(template);
                    this.ensure(template.absPath, true);
                    delete require.cache[fn];
                });
                watcher.on('unlink', (fn) => {
                    this.clearCache(this.cache[fn]);
                    const index = this.watchList.indexOf(fn);
                    delete require.cache[fn];
                    const temp = [...this.watchList];
                    watcher.unwatch(temp);
                    this.watchList = this.watchList.splice(index, 1);
                    if (this.watchList.length > 0) {
                        watcher.add(temp);
                    }
                });
            }
            if (this.watchList.indexOf(template.absPath) == -1) {
                this.watchList.push(template.absPath);
                this.watcher.add(template.absPath);
            }
        }
        return template;
    }
}
exports.TemplateFactory = TemplateFactory;
//# sourceMappingURL=TemplateFactory.js.map