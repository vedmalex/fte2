const { lint } = require('fte.js-formatter');
export function lintText(input) {
    return lint(String(input ?? ''));
}
//# sourceMappingURL=lint.js.map