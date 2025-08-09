import { TemplateBase } from "fte.js-base";
export default {
    alias: [
        "singlefile.ts.njs"
    ],
    aliases: {
        "core": "MainTemplate.ts.njs"
    },
    script: function(files, _content, partial, slot, options) {
        var out: Array<string> = [];
        out.push("import { TemplateBase } from 'fte.js-base'\n");
        out.push('import { TemplateFactoryStandalone as Factory } from "fte.js-standalone";\n');
        out.push("\n");
        // TS interface for context if provided by analyzer
        {
            let injected = false;
            for(let i = 0; i < files.length; i += 1){
                const t = (files[i].template && files[i].template.directives && (files[i].template.directives as any).contextTypes);
                if (t && t.tsInterface && !injected) {
                    out.push((t.tsInterface) + "\n");
                    out.push("type inferContext = () => " + (t.name) + "\n");
                    injected = true;
                }
            }
        }
        out.push("export const templates = {");
        files.forEach((file)=>{
            out.push("\n");
            const core: any = partial(file.template, "core") as any;
            const coreCode: any = (typeof core === 'string') ? core : (core && core.code);
            if (typeof coreCode !== 'string') {
                throw new Error('singlefile.ts.njs: core template returned invalid result for ' + (file.name));
            }
            out.push("  ['" + ((file.template.alias || file.name)) + "']: " + (coreCode) + ",");
        });
        out.push("\n");
        out.push("}\n");
        out.push("\n");
        out.push("const F = new Factory(templates)\n");
        out.push("\n");
        out.push("export function run(context: ReturnType<typeof inferContext>, name) {\n");
        out.push("  return F.run(context, name)\n");
        out.push("}\n");
        out.push("");
        return out.join("");
    },
    blocks: {},
    compile: function(this: TemplateBase) {
        this.factory.ensure("MainTemplate.ts.njs");
    },
    dependency: {
        "MainTemplate.ts.njs": true,
        "core": true
    }
};
