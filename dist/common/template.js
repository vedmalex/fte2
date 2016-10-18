"use strict";
const helpers_1 = require('./helpers');
class TemplateBase {
    constructor(config) {
        if (!(this instanceof TemplateBase)) {
            throw new Error('constructor is not a function');
        }
        this.srcCode = config.source ? config.source.toString() : '';
        this.name = config.name;
        this.absPath = config.absPath;
        this.script = config.script;
        this.blocks = config.blocks;
        this.dependency = config.dependency;
        this.parent = config.parent ? config.parent.trim() : '';
        this.aliases = config.aliases || {};
        this.alias = config.alias || config.name;
        this.factory = config.factory;
        if (config.compile) {
            this.compile = config.compile;
        }
    }
    mergeParent(src) {
        if (src) {
            helpers_1.merge(src, this, 'blocks');
            helpers_1.merge(src, this, 'aliases');
        }
    }
    compile() {
        throw new Error('abstract method call');
    }
    ;
}
exports.TemplateBase = TemplateBase;
//# sourceMappingURL=template.js.map