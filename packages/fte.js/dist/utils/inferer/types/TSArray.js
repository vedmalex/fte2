"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TSArray = void 0;
const TSBaseType_1 = require("./TSBaseType");
class TSArray extends TSBaseType_1.TSBaseType {
    constructor(name, children) {
        super('array');
        this.name = name;
        this.children = children;
    }
    toString() {
        return `${this.name}: Array<${this.children.toString()}>`;
    }
}
exports.TSArray = TSArray;
//# sourceMappingURL=TSArray.js.map