"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TSPrimitive = void 0;
const TSBaseType_1 = require("./utils/TSBaseType");
class TSPrimitive extends TSBaseType_1.TSBaseType {
    constructor(name) {
        super('primitive');
        this.name = name;
    }
    toString() {
        return `${this.name}: any`;
    }
}
exports.TSPrimitive = TSPrimitive;
//# sourceMappingURL=TSPrimitive.js.map