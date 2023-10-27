"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFunction = void 0;
const createInfo_1 = require("./createInfo");
const processPattern_1 = require("./processPattern");
function createFunction(context, name, func, scope) {
    const info = (0, createInfo_1.createInfo)(context, name, name, '', 'function', scope);
    context.set(info.name, info);
    func.params.forEach((p, index) => {
        (0, processPattern_1.processArgument)(index, p, context, info, scope);
    });
}
exports.createFunction = createFunction;
//# sourceMappingURL=createFunction.js.map