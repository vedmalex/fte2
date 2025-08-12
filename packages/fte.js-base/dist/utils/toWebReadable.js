"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWebReadable = void 0;
function toWebReadable(source) {
    const encoder = new TextEncoder();
    const iterator = source[Symbol.asyncIterator]();
    return new ReadableStream({
        async pull(controller) {
            try {
                const { value, done } = await iterator.next();
                if (done) {
                    controller.close();
                    return;
                }
                controller.enqueue(encoder.encode(String(value)));
            }
            catch (e) {
                controller.error(e);
            }
        },
        cancel() {
            if (typeof iterator.return === 'function') {
                try {
                    ;
                    iterator.return();
                }
                catch (_a) { }
            }
        },
    });
}
exports.toWebReadable = toWebReadable;
//# sourceMappingURL=toWebReadable.js.map