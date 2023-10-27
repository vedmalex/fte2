"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TSFunction = void 0;
const TSBaseType_1 = require("./utils/TSBaseType");
class TSFunction extends TSBaseType_1.TSBaseType {
    constructor(name, params) {
        super('function');
        this.name = name;
        this.params = params;
    }
    toString() {
        return `${this.name}: ((${this.params.map(p => p.toString())})=> any)`;
    }
}
exports.TSFunction = TSFunction;
//# sourceMappingURL=TSFunction.js.map