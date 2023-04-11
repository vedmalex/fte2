"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
function get(data, path) {
    if ('object' === typeof data) {
        if (data[path] === undefined) {
            const parts = path.split('.');
            if (Array.isArray(parts) && parts.length > 1) {
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
//# sourceMappingURL=get.js.map