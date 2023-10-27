"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInfo = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
function createInfo(props, name, typeName, parent, type, scope) {
    console.log('createInfo', name, typeName, parent, type);
    const parentInfo = props.get(parent);
    const info = {
        name,
        type,
        properties: new Map(),
        typeName: lodash_1.default.upperFirst(typeName),
        parent: parentInfo,
        children: new Map(),
        scope,
    };
    if (parentInfo) {
        parentInfo.children.set(lodash_1.default.upperFirst(typeName), info);
    }
    props.set(name, info);
    return info;
}
exports.createInfo = createInfo;
//# sourceMappingURL=createInfo.js.map