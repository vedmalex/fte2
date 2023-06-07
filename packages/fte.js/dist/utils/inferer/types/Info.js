"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMinInfo = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
function createMinInfo({ name, typeName, type }) {
    return {
        name,
        type: type !== null && type !== void 0 ? type : 'min',
        properties: new Map(),
        children: new Map(),
        typeName: typeName !== null && typeName !== void 0 ? typeName : lodash_1.default.upperFirst(name),
    };
}
exports.createMinInfo = createMinInfo;
//# sourceMappingURL=Info.js.map