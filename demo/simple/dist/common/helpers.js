"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.get = exports.set = exports.applyIndent = exports.escapeIt = void 0;
var escapeExp = /[&<>"]/, escapeAmpExp = /&/g, escapeLtExp = /</g, escapeGtExp = />/g, escapeQuotExp = /"/g;
function escapeIt(text) {
    if (text == null) {
        return '';
    }
    var result = text.toString();
    if (!escapeExp.test(result)) {
        return result;
    }
    return result
        .replace(escapeAmpExp, '&amp;')
        .replace(escapeLtExp, '&lt;')
        .replace(escapeGtExp, '&gt;')
        .replace(escapeQuotExp, '&quot;');
}
exports.escapeIt = escapeIt;
function applyIndent(_str, _indent) {
    var str = String(_str);
    var indent = '';
    if (typeof _indent == 'number' && _indent > 0) {
        var res = '';
        for (var i = 0; i < _indent; i++) {
            res += ' ';
        }
        indent = res;
    }
    if (typeof _indent == 'string' && _indent.length > 0) {
        indent = _indent;
    }
    if (indent && str) {
        return str
            .split('\n')
            .map((s) => indent + s)
            .join('\n');
    }
    else {
        return str;
    }
}
exports.applyIndent = applyIndent;
function set(data, path, value) {
    if ('object' === typeof data) {
        const parts = path.split('.');
        if (Array.isArray(parts)) {
            const curr = parts.shift();
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
            const parts = path.split('.');
            if (Array.isArray(parts)) {
                const curr = parts.shift();
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
//# sourceMappingURL=helpers.js.map