"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["typedefs.ts.njs"],
    script: function (typedefs, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null)
                ctx = typedefs;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        return out.join('');
    },
    blocks: {
        "info": function (info, _content, partial, slot, options) {
            var out = [];
            out.push((JSON.stringify()));
            out.push(info);
            out.push((_, value) => { });
            out.push();
            if (value instanceof Set) {
                ;
                out.push();
                return [...value];
                ;
                out.push();
            }
            ;
            out.push();
            return value;
            ;
            out.push();
        },
        out, : .push(2),
        out, : .push()
    } + "",
    return: out.join('')
};
compile: function () {
}
dependency: {
}
;
//# sourceMappingURL=typedefinitions.njs.err.js.map