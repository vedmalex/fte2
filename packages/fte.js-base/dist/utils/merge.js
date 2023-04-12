"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = void 0;
function merge(a, b, property) {
    let prop;
    const aProp = a[property];
    if (aProp !== undefined) {
        let bProp = b[property];
        if (bProp === undefined) {
            bProp = b[property] = {};
        }
        const propList = Object.keys(aProp);
        for (let i = 0, pLen = propList.length; i < pLen; i++) {
            prop = propList[i];
            if (!(prop in bProp)) {
                bProp[prop] = aProp[prop];
            }
        }
    }
}
exports.merge = merge;
//# sourceMappingURL=merge.js.map