"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TSObject = void 0;
const TSBaseType_1 = require("../types/TSBaseType");
class TSObject extends TSBaseType_1.TSBaseType {
    constructor(name, properties) {
        super('object');
        this.name = name;
        this.properties = properties;
    }
    toString() {
        return ` type ${this.name} = {${this.properties.map(p => `${p.toString()},`)}}`;
    }
}
exports.TSObject = TSObject;
//# sourceMappingURL=TSObject.js.map