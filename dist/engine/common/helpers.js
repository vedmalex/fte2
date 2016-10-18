"use strict";
function set(data, path, value) {
    if ('object' === typeof data) {
        let parts = path.split('.');
        if (Array.isArray(parts)) {
            let curr = parts.shift();
            if (parts.length > 0) {
                if (!data[curr]) {
                    if (isNaN(parseInt(parts[0], 10))) {
                        data[curr] = {};
                    }
                    else {
                        data[curr] = [];
                    }
                }
                set(data[curr], parts.join('.'), value);
            }
            else {
                data[path] = value;
            }
        }
        else {
            data[path] = value;
        }
    }
}
exports.set = set;
function get(data, path) {
    if ('object' === typeof data) {
        if (data[path] === undefined) {
            let parts = path.split('.');
            if (Array.isArray(parts)) {
                let curr = parts.shift();
                if (parts.length > 0) {
                    return get(data[curr], parts.join('.'));
                }
                return data[curr];
            }
        }
        return data[path];
    }
    return data;
}
exports.get = get;
;
function merge(a, b, property) {
    let prop;
    let aProp = a[property];
    if (aProp !== undefined) {
        let bProp = b[property];
        if (bProp === undefined) {
            bProp = b[property] = {};
        }
        let propList = Object.keys(aProp);
        for (let i = 0, pLen = propList.length; i < pLen; i++) {
            prop = propList[i];
            if (!(prop in bProp)) {
                bProp[prop] = aProp[prop];
            }
        }
    }
}
exports.merge = merge;
//# sourceMappingURL=helpers.js.map