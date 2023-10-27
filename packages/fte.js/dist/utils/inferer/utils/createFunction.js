"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFucntion = void 0;
const createInfo_1 = require("./createInfo");
const processArgument_1 = require("./processArgument");
function processFucntion(context, name, func, scope, anonynmous) {
    const info = (0, createInfo_1.createInfo)(context, name, name, '', 'function', scope);
    context.set(info.name, info);
    let result = new Map();
    func.params.forEach((p, index) => {
        (0, processArgument_1.processArgument)(index, p, result, info, scope, anonynmous);
    });
}
exports.processFucntion = processFucntion;
//# sourceMappingURL=createFunction.js.map