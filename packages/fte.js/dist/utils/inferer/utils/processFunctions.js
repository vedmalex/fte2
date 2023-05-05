"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFunctions = void 0;
const processFunction_1 = require("./processFunction");
function processFunctions(result, context) {
    let anonymousCount = 0;
    const anonynmous = () => `anonymous${anonymousCount++}`;
    result.forEach(path => {
        (0, processFunction_1.processFucntion)(context, path, anonynmous);
    });
}
exports.processFunctions = processFunctions;
//# sourceMappingURL=processFunctions.js.map