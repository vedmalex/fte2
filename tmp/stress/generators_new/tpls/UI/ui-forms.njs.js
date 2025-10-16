module.exports = {
    chunks: "$$$main$$$",
    alias: [
        "ui-forms"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const _partial = partial;
        partial = function(obj, template) {
            const result = _partial(obj, template);
            if (Array.isArray(result)) {
                result.forEach((r)=>{
                    chunkEnsure(r.name, r.content);
                });
                return '';
            } else {
                return result;
            }
        };
        const main = '$$$main$$$';
        var current = main;
        let outStack = [
            current
        ];
        let result;
        function chunkEnsure(name, content) {
            if (!result) {
                result = {};
            }
            if (!result.hasOwnProperty(name)) {
                result[name] = content ? content : [];
            }
        }
        function chunkStart(name) {
            chunkEnsure(name);
            chunkEnd();
            current = name;
            out = [];
        }
        function chunkEnd() {
            result[current].push(...out);
            out = [];
            current = outStack.pop() || main;
        }
        chunkStart(main);
        if (!entity.embedded) {
            chunkStart(`${entity.name}/index.js`);
            out.push((partial(entity, 'forms-index')));
            chunkStart(`${entity.name}/title.js`);
            out.push((partial(entity, 'forms-title')));
            chunkStart(`${entity.name}/selectTitle.js`);
            out.push((partial(entity, 'forms-select-title')));
            chunkStart(`${entity.name}/list.js`);
            out.push((partial(entity, 'forms-list')));
            chunkStart(`${entity.name}/grid.js`);
            out.push((partial(entity, 'forms-grid')));
            chunkStart(`${entity.name}/filter.js`);
            out.push((partial(entity, 'forms-filter')));
            chunkStart(`${entity.name}/form.js`);
            out.push((partial(entity, 'forms-form')));
            chunkStart(`${entity.name}/preview.js`);
            out.push((partial(entity, 'forms-preview')));
            chunkStart(`${entity.name}/fragments.js`);
            out.push((partial(entity, 'forms-form-fragments')));
            chunkStart(`${entity.name}/cardView.js`);
            out.push((partial(entity, 'grid-card')));
            chunkStart(`${entity.name}/listView.js`);
            out.push((partial(entity, 'forms-grid-list')));
            chunkStart(`${entity.name}/gridView.js`);
            out.push((partial(entity, 'forms-grid-view')));
            chunkStart(`${entity.name}/styles.js`);
            out.push("const styles = theme => ({" + "  formControl: {\n");
            out.push("    // margin: theme.spacing(1),\n");
            out.push("    minWidth: 120,\n");
            out.push("  },\n");
            out.push("});\n");
            out.push("\n");
            out.push("export default styles;\n");
        }
        chunkStart(`i18n/${entity.name}.js`);
        out.push((partial(entity, 'forms-i18n')));
        chunkEnd();
        out = Object.keys(result).filter((i)=>i !== '$$$main$$$').map((curr)=>({
                name: curr,
                content: result[curr]
            }));
        if (out.some((t)=>typeof t == 'object')) {
            return out.map(chunk = ({
                ...chunk,
                content: Array.isArray(chunk.content) ? chunk.content.join('') : chunk.content
            }));
        } else {
            return out.join('');
        }
    },
    compile: function() {
        this.chunks = "$$$main$$$";
        this.alias = [
            "ui-forms"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/ui-forms.njs.js.map