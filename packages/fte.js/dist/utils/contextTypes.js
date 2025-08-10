"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContextTypes = void 0;
const tslib_1 = require("tslib");
const type_infer_1 = require("../inferer/type-infer");
const fte_js_templates_1 = tslib_1.__importDefault(require("fte.js-templates"));
const fte_js_standalone_1 = require("fte.js-standalone");
function buildAnalysisCode(template) {
    const F = new fte_js_standalone_1.TemplateFactoryStandalone(fte_js_templates_1.default);
    const parts = [];
    try {
        const mainRes = F.run(template.main, 'codeblock.njs');
        const mainCode = typeof mainRes === 'string' ? mainRes : mainRes === null || mainRes === void 0 ? void 0 : mainRes.code;
        if (mainCode)
            parts.push(String(mainCode));
        const blocks = (template === null || template === void 0 ? void 0 : template.blocks) ? Object.values(template.blocks) : [];
        for (const b of blocks) {
            const bres = F.run(b.main, 'codeblock.njs');
            const bcode = typeof bres === 'string' ? bres : bres === null || bres === void 0 ? void 0 : bres.code;
            if (bcode)
                parts.push(String(bcode));
        }
        const slots = (template === null || template === void 0 ? void 0 : template.slots) ? Object.values(template.slots) : [];
        for (const s of slots) {
            const sres = F.run(s.main, 'codeblock.njs');
            const scode = typeof sres === 'string' ? sres : sres === null || sres === void 0 ? void 0 : sres.code;
            if (scode)
                parts.push(String(scode));
        }
    }
    catch (_a) {
    }
    return parts.join('\n');
}
function generateContextTypes(template) {
    const name = ((template === null || template === void 0 ? void 0 : template.name) || 'Template').replace(/[^A-Za-z0-9_]/g, '_') + '_Context';
    const code = buildAnalysisCode(template);
    const fields = new Set();
    const types = {};
    if (code && code.trim().length) {
        const inferred = (0, type_infer_1.inferTypesInSource)(code, ['out', 'options', 'Array', 'Object']).variables;
        Object.keys(inferred).forEach(k => {
            fields.add(k);
            types[k] = inferred[k] || 'any';
        });
    }
    const entries = Array.from(fields)
        .sort()
        .map(k => `  ${JSON.stringify(k)}: ${types[k] || 'any'}`);
    const tsInterface = entries.length
        ? `interface ${name} {\n${entries.join('\n')}\n}`
        : `interface ${name} {}`;
    const jsTypedef = entries.length
        ? `/**\n * @typedef {object} ${name}\n${Array.from(fields).sort().map(k => ` * @property {${types[k] || '*'}} ${k}`).join('\n')}\n */`
        : `/**\n * @typedef {object} ${name}\n */`;
    return { tsInterface, jsTypedef, name };
}
exports.generateContextTypes = generateContextTypes;
//# sourceMappingURL=contextTypes.js.map