"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const TemplateFactory_1 = require("./TemplateFactory");
const Template_1 = require("./Template");
function parse(source, context) {
    const ONLY_ONE = 'ONLY_ONE';
    const factory = new TemplateFactory_1.TemplateFactory({});
    const tpl = new Template_1.Template({
        source: source,
        name: ONLY_ONE,
        factory,
    });
    tpl.compile();
    factory.cache[ONLY_ONE] = tpl;
    return tpl.factory.run(context, ONLY_ONE);
}
exports.parse = parse;
//# sourceMappingURL=parse.js.map