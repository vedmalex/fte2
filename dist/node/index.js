"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.parseFile = exports.compileTs = exports.run = exports.Parser = exports.compileFull = exports.compileLight = exports.Template = exports.Factory = void 0;
const factory_1 = require("./factory");
Object.defineProperty(exports, "Factory", { enumerable: true, get: function () { return factory_1.TemplateFactory; } });
const template_1 = require("./template");
Object.defineProperty(exports, "Template", { enumerable: true, get: function () { return template_1.Template; } });
const compile_1 = require("./compile");
Object.defineProperty(exports, "compileFull", { enumerable: true, get: function () { return compile_1.compileFull; } });
Object.defineProperty(exports, "compileLight", { enumerable: true, get: function () { return compile_1.compileLight; } });
Object.defineProperty(exports, "compileTs", { enumerable: true, get: function () { return compile_1.compileTs; } });
Object.defineProperty(exports, "run", { enumerable: true, get: function () { return compile_1.run; } });
Object.defineProperty(exports, "parseFile", { enumerable: true, get: function () { return compile_1.parseFile; } });
const parse_1 = require("../parser/parse");
Object.defineProperty(exports, "Parser", { enumerable: true, get: function () { return parse_1.Parser; } });
function parse(source, context) {
    const ONLY_ONE = 'ONLY_ONE';
    const factory = new factory_1.TemplateFactory({});
    const tpl = new template_1.Template({
        source: source,
        name: ONLY_ONE,
        factory,
    });
    tpl.compile();
    factory.cache[ONLY_ONE] = tpl;
    return tpl.factory.run(context, ONLY_ONE);
}
exports.parse = parse;
//# sourceMappingURL=index.js.map