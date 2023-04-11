"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateBase = void 0;
const utils_1 = require("../utils");
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
        this.factory = config.factory;
        if (config.compile) {
            this.compile = config.compile;
        }
    }
    mergeParent(src) {
        if (src) {
            (0, utils_1.merge)(src, this, 'blocks');
            (0, utils_1.merge)(src, this, 'aliases');
            (0, utils_1.merge)(src, this, 'slots');
        }
    }
    compile() {
        throw new Error('abstract method call');
    }
}
exports.TemplateBase = TemplateBase;
//# sourceMappingURL=TemplateBase.js.map