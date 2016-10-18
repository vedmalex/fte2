"use strict";
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const template_js_1 = require('./template.js');
const factory_1 = require('./../common/factory');
const helpers_1 = require('./helpers');
class TemplateFactory extends factory_1.TemplateFactoryBase {
    load(fileName, absPath) {
        let root;
        for (let i = 0, len = this.root.length; i < len; i++) {
            root = this.root[i];
            let fn = absPath ? path.resolve(fileName) : path.resolve(path.join(root, fileName));
            if (fs.existsSync(fn + '.js')) {
                let result;
                let storedScript = fs.readFileSync(fn + '.js');
                result = helpers_1.safeEval(storedScript);
                if (result instanceof Function) {
                    result = { script: result, compile: new Function() };
                }
                result.absPath = fn;
                result.name = fileName;
                result.factory = this;
                let templ = new template_js_1.Template(result);
                this.register(templ, fileName);
                templ.compile();
                return templ;
            }
            else if (fs.existsSync(fn)) {
                let content = fs.readFileSync(fn);
                let tpl = new template_js_1.Template({
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
                        return this.register(new template_js_1.Template(tpl), fileName);
                    }
                }
            }
        }
        throw new Error('template ' + fileName + ' not found (absPath= ' + absPath + ')');
    }
    ;
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
    ;
    create(source, name) {
        if (!name) {
            name = 'freegenerated' + Math.random().toString() + '.js';
        }
        let tpl = new template_js_1.Template({
            source: source,
            name: name,
            absPath: name,
            factory: this,
        });
        tpl.compile();
        this.register(tpl);
        return name;
    }
    ;
    run(context, name, absPath) {
        let templ = this.ensure(name, absPath);
        let bc = this.blockContent(templ);
        return bc.run(context, bc.content, bc.partial);
    }
    ;
    express() {
        let self = this;
        return function (fileName, context, callback) {
            let templ = self.ensure(fileName, true);
            let bc = self.blockContent(templ);
            let result, err;
            try {
                result = bc.run(context, bc.content, bc.partial);
            }
            catch (e) {
                err = e;
            }
            finally {
                callback(err, result);
            }
        };
    }
    ;
    clearCache(fn, list) {
        for (let i = 0, keys = Object.keys(list), len = keys.length; i < len; i++) {
            delete this.cache[list[keys[i]].name];
            delete this.cache[list[keys[i]].absPath];
        }
    }
    ;
    checkChanges(template, fileName, absPath) {
        let root;
        for (let i = 0, len = this.root.length; i < len; i++) {
            root = this.root[i];
            let fn = absPath ? path.resolve(fileName) : path.resolve(path.join(root, fileName));
            let fw = undefined;
            if (fs.existsSync(fn + '.js')) {
                fw = fn + '.js';
            }
            else if (fs.existsSync(fn)) {
                fw = fn;
            }
            if (fw) {
                if (!this.watchTree[fw]) {
                    let templates = {};
                    templates[template.absPath] = template;
                    templates[template.name] = template;
                    this.watchTree[fw] = {
                        watcher: fs.watch(fw, { persistent: false }, (event, filename) => {
                            if (event === 'change') {
                                let list = this.watchTree[fw].templates;
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