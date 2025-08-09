"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: [
        "singlefile.njs"
    ],
    aliases: {
        "core": "MainTemplate.njs"
    },
    script: function (files, _content, partial, slot, options) {
        var out = [];
        out.push('const Factory = require("fte.js-standalone").TemplateFactoryStandalone;\n');
        out.push("\n");
        {
            let injected = false;
            for (let i = 0; i < files.length; i += 1) {
                const t = (files[i].template && files[i].template.directives && files[i].template.directives.contextTypes);
                if (t && t.jsTypedef && !injected) {
                    out.push((t.jsTypedef) + "\n");
                    injected = true;
                }
            }
        }
        out.push("const templates = {");
        files.forEach((file) => {
            out.push("\n");
            const core = partial(file.template, "core");
            const coreCode = (typeof core === 'string') ? core : (core && core.code);
            if (typeof coreCode !== 'string') {
                throw new Error('singlefile.njs: core template returned invalid result for ' + (file.name));
            }
            out.push("  ['" + ((file.template.alias || file.name)) + "']: " + (coreCode) + ",");
        });
        out.push("\n");
        out.push("}\n");
        out.push("\n");
        out.push("exports.templates = templates\n");
        out.push("const F = new Factory(templates)\n");
        out.push("\n");
        out.push("function run(context, name){\n");
        out.push("  return F.run( context, name )\n");
        out.push("}\n");
        out.push("\n");
        out.push("exports.run = run");
        return out.join("");
    },
    blocks: {},
    compile: function () {
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true
    }
};
//# sourceMappingURL=singlefile.njs.js.map