import { format } from 'fte.js-formatter';
export function formatText(input, opts) {
    const options = {
        indent: typeof opts?.indentSize === 'number'
            ? opts?.indentSize
            : opts?.indent === 'tab'
                ? 'tab'
                : 2,
        ensureFinalNewline: true,
        trimTrailingWhitespace: true,
    };
    return format(String(input ?? ''), options);
}
//# sourceMappingURL=format.js.map