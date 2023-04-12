"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = void 0;
function set(data, path, value) {
    if ('object' === typeof data) {
        const parts = path.split('.');
        if (Array.isArray(parts) && parts.length > 1) {
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
//# sourceMappingURL=set.js.map