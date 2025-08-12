"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDeindentStream = void 0;
function applyDeindentStream(source, numChars) {
    const iterator = async function* () {
        var _a;
        let buffer = '';
        let indentChars;
        if (typeof numChars === 'number') {
            indentChars = numChars;
        }
        else if (typeof numChars === 'string') {
            indentChars = numChars.length;
        }
        const processLine = (line) => {
            if (!line)
                return '';
            if (indentChars === undefined) {
                if (line.trim().length === 0) {
                    return '';
                }
                indentChars = line.length - line.trimStart().length;
            }
            if (indentChars <= 0)
                return line;
            let spaceCount = 0;
            for (let j = 0; j < line.length; j++) {
                if (line[j] === ' ')
                    spaceCount++;
                else
                    break;
            }
            if (spaceCount === 0)
                return line;
            if (spaceCount <= indentChars)
                return line.trimStart();
            return line.substring(indentChars);
        };
        for await (const chunk of source) {
            if (chunk == null)
                continue;
            buffer += String(chunk);
            const parts = buffer.split('\n');
            buffer = (_a = parts.pop()) !== null && _a !== void 0 ? _a : '';
            for (let part of parts) {
                if (part.endsWith('\r'))
                    part = part.slice(0, -1);
                const trimmed = processLine(part);
                yield trimmed + '\n';
            }
        }
        if (buffer.length > 0) {
            if (buffer.endsWith('\r'))
                buffer = buffer.slice(0, -1);
            const trimmed = (() => {
                if (indentChars === undefined) {
                    if (typeof numChars === 'number')
                        indentChars = numChars;
                    else if (typeof numChars === 'string')
                        indentChars = numChars.length;
                    else
                        indentChars = 0;
                }
                return processLine(buffer);
            })();
            if (trimmed.length > 0)
                yield trimmed;
        }
    };
    return iterator();
}
exports.applyDeindentStream = applyDeindentStream;
//# sourceMappingURL=applyDeindentStream.js.map