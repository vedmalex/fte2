"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactory = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const glob = __importStar(require("glob"));
const template_1 = require("./template");
const factory_1 = require("./../common/factory");
const helpers_1 = require("./helpers");
class TemplateFactory extends factory_1.TemplateFactoryBase {
    load(fileName, absPath) {
        let root;
        for (let i = 0, len = this.root.length; i < len; i++) {
            root = this.root[i];
            const fn = absPath
                ? path.resolve(fileName)
                : path.resolve(path.join(root, fileName));
            const compiledJS = fn + '.js';
            if (fs.existsSync(compiledJS)) {
                let result;
                const storedScript = fs.readFileSync(compiledJS);
                result = (0, helpers_1.safeEval)(storedScript.toString());
                if (result instanceof Function) {
                    result = {
                        script: result,
                        compile: new Function(),
                    };
                }
                result.absPath = fn;
                result.name = fileName;
                result.factory = this;
                const templ = new template_1.Template(result);
                this.register(templ, fileName);
                templ.compile();
                return templ;
            }
            else if (fs.existsSync(fn)) {
                const content = fs.readFileSync(fn);
                const tpl = new template_1.Template({
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
                        return this.register(new template_1.Template(tpl), fileName);
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
    standalone(source) {
        const tpl = new template_1.Template({
            source: source,
            factory: this,
        });
        return tpl.compile();
    }
    run(context, name, absPath) {
        const templ = this.ensure(name, absPath);
        const bc = this.blockContent(templ, {});
        const result = bc.run(context, bc.content, bc.partial, bc.slot, this.options);
        if (Object.keys(bc.slots).length > 0) {
            if (Array.isArray(result)) {
                return result.map((r) => {
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
            return bc.run(context, bc.content, bc.partial, bc.slot, this.options);
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
    clearCache(fn, list) {
        for (let i = 0, keys = Object.keys(list), len = keys.length; i < len; i++) {
            delete this.cache[list[keys[i]].name];
            delete this.cache[list[keys[i]].absPath];
        }
    }
    checkChanges(template, fileName, absPath) {
        let root;
        for (let i = 0, len = this.root.length; i < len; i++) {
            root = this.root[i];
            const fn = absPath
                ? path.resolve(fileName)
                : path.resolve(path.join(root, fileName));
            let fw = undefined;
            if (fs.existsSync(fn + '.js')) {
                fw = fn + '.js';
            }
            else if (fs.existsSync(fn)) {
                fw = fn;
            }
            if (fw) {
                if (!this.watchTree[fw]) {
                    const templates = {};
                    templates[template.absPath] = template;
                    templates[template.name] = template;
                    this.watchTree[fw] = {
                        watcher: fs.watch(fw, { persistent: false }, (event, filename) => {
                            if (event === 'change') {
                                const list = this.watchTree[fw].templates;
                                this.clearCache(fw, list);
                            }
                            else {
                                this.watchTree[fw].close();
                                delete this.watchTree[fw];
                            }
                        }),
                        templates: templates,
                    };
                }
                break;
            }
        }
    }
}
exports.TemplateFactory = TemplateFactory;
//# sourceMappingURL=factory.js.map