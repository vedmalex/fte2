"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyIndent = void 0;
function applyIndent(str, _indent) {
    let lines = Array.isArray(str) ? [...str] : String(str).split('\n');
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
    if (indent && lines) {
        let res = lines.map(s => indent + s);
        return Array.isArray(str) ? res : res.join('\n');
    }
    else {
        return lines;
    }
}
exports.applyIndent = applyIndent;
//# sourceMappingURL=applyIndent.js.map