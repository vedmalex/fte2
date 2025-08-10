"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const compile_1 = require("./compile");
function run(context, template) {
    const payload = Array.isArray(context)
        ? context
        : {
            ...context,
        };
    return compile_1.F.run(payload, template);
}
exports.run = run;
//# sourceMappingURL=run.js.map