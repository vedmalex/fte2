"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNodeReadable = void 0;
const node_stream_1 = require("node:stream");
function toNodeReadable(source) {
    const readable = new node_stream_1.Readable({
        read() { },
        objectMode: false,
    });
    (async () => {
        try {
            for await (const chunk of source) {
                if (!readable.push(chunk)) {
                    await new Promise(resolve => readable.once('drain', resolve));
                }
            }
            readable.push(null);
        }
        catch (err) {
            readable.destroy(err);
        }
    })();
    return readable;
}
exports.toNodeReadable = toNodeReadable;
//# sourceMappingURL=toNodeReadable.js.map