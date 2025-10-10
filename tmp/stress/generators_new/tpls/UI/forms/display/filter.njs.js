module.exports = {
    alias: [
        "display-filter-entity"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("\n");
        out.push("\n");
        const { entity, f, source, label } = ctx;
        out.push("\n");
        if (!f) {
            entity.props.forEach((f)=>{
                const _ctx = {
                    ...ctx,
                    f
                };
                out.push("\n");
                out.push((partial(_ctx, 'display-filter-entity')) + "\n");
            });
            out.push("\n");
        } else if (!f.ref) {
            out.push("\n");
            if (!f.calculated && f.name !== 'id') {
                out.push("\n");
                switch(f.filterType){
                    case "Number":
                        out.push("\n");
                        out.push("    <uix.NumberInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate(\"uix.filter.eq\", { name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
                        out.push("      source={`" + (source) + (f.name) + "-eq`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        out.push("    <uix.NumberInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate(\"uix.filter.lte\",{ name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
                        out.push("      source={`" + (source) + (f.name) + "-lte`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        out.push("    <uix.NumberInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate(\"uix.filter.gte\", { name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
                        out.push("      source={`" + (source) + (f.name) + "-gte`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        out.push("    <uix.NumberInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate(\"uix.filter.lt\", { name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
                        out.push("      source={`" + (source) + (f.name) + "-lt`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        out.push("    <uix.NumberInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate(\"uix.filter.gt\",{ name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
                        out.push("      source={`" + (source) + (f.name) + "-gt`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        break;
                    case "Text":
                        out.push("\n");
                        out.push("    <uix." + (f.filterType) + "Input\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate(\"uix.filter.imatch\",{ name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
                        out.push("      source={`" + (source) + (f.name) + "-imatch`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        break;
                    case "ID":
                        out.push("\n");
                        out.push("    <uix.TextInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate(\"uix.filter.eq\",{ name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
                        out.push("      source={`" + (source) + (f.name) + "-eq`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        break;
                    case "Date":
                        out.push("\n");
                        out.push("    <uix.DateInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate(\"uix.filter.lte\",{ name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
                        out.push("      source={`" + (source) + (f.name) + "-lte`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        out.push("    <uix.DateInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate(\"uix.filter.gte\",{ name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
                        out.push("      source={`" + (source) + (f.name) + "-gte`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        break;
                    case "Boolean":
                        out.push("\n");
                        out.push("    <uix.BooleanInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate(\"uix.filter.eq\",{ name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
                        out.push("      source={`" + (source) + (f.name) + "-eq`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        out.push("    <uix.NullableBooleanInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate(\"uix.filter.exists\",{ name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
                        out.push("      source={`" + (source) + (f.name) + "-exists`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        break;
                    case "Enum":
                        out.push("\n");
                        out.push("      <uix.SelectInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate('uix.filter.eq', {\n");
                        out.push("        name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "'),\n");
                        out.push("      })}`}\n");
                        out.push("      choices={uix.primitive." + (f.type) + ".choices}\n");
                        out.push("      source={`" + (source) + (f.name) + "-eq`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        out.push("    <uix.SelectInput\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate('uix.filter.ne', {\n");
                        out.push("        name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "'),\n");
                        out.push("      })}`}\n");
                        out.push("      choices={uix.primitive." + (f.type) + ".choices}\n");
                        out.push("      source={`" + (source) + (f.name) + "-ne`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        out.push("    <uix.SelectArrayInput\n");
                        out.push("    className={classes.formControl}\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate('uix.filter.in', {\n");
                        out.push("        name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "'),\n");
                        out.push("      })}`}\n");
                        out.push("      options={{ fullWidth: true }}\n");
                        out.push("      choices={uix.primitive." + (f.type) + ".choices}\n");
                        out.push("      source={`" + (source) + (f.name) + "-in`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                        out.push("    <uix.SelectArrayInput\n");
                        out.push("    className={classes.formControl}\n");
                        out.push("      label={`");
                        if (label) {
                            out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
                        }
                        out.push("${translate('uix.filter.nin', {\n");
                        out.push("        name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "'),\n");
                        out.push("      })}`}\n");
                        out.push("      options={{ fullWidth: true }}\n");
                        out.push("      choices={uix.primitive." + (f.type) + ".choices}\n");
                        out.push("      source={`" + (source) + (f.name) + "-nin`}\n");
                        out.push("      allowEmpty\n");
                        out.push("    />\n");
                }
                out.push("\n");
            }
            out.push("\n");
        } else if (f.embedded) {
            const eEntity = entity.model.entities.find((e)=>e.name === f.ref.entity);
            const ctx = {
                entity: {
                    ...eEntity,
                    props: eEntity.lists.all
                },
                source: source ? `${source}${f.name}.` : `${f.name}.`,
                label: `resources.${f.inheritedFrom || entity.name}.fields.${f.name}`
            };
            out.push("\n");
            out.push("  " + (partial(ctx, 'display-filter-entity')) + "\n");
        } else if (!f.emdedeb && f.verb === 'BelongsTo') {
            debugger;
            out.push("\n");
            out.push("  <uix.NullableBooleanInput\n");
            out.push("    label={`");
            if (label) {
                out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
            }
            out.push("${translate(\"uix.filter.exists\",{ name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "')})}`}\n");
            out.push("    source=\"" + (source) + (f.name) + "-exists\" />\n");
            out.push("\n");
            out.push("    <uix.ReferenceInput\n");
            out.push("      className={classes.formControl}\n");
            out.push("      label={`");
            if (label) {
                out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
            }
            out.push("${translate('uix.filter.eq', {\n");
            out.push("        name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "'),\n");
            out.push("      })}`}\n");
            out.push("      source=\"" + (source) + (f.name) + "-eq\"\n");
            out.push("      reference=\"" + (entity.model.entityPathMapper[f.ref.entity]) + "\"\n");
            out.push("      perPage={10000}\n");
            out.push("      allowEmpty\n");
            out.push("    >\n");
            out.push("    ");
            if (f.ref.autocomplete) {
                out.push("\n");
                out.push("      <uix.AutocompleteInput optionText={uix." + (f.ref.entity) + ".inputText} />\n");
                out.push("    ");
            } else {
                out.push("\n");
                out.push("      <uix.SelectInput optionText={<uix." + (f.ref.entity) + ".SelectTitle />} />\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    </uix.ReferenceInput>\n");
            out.push("\n");
            out.push("    <uix.ReferenceInput\n");
            out.push("    className={classes.formControl}\n");
            out.push("      label={`");
            if (label) {
                out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
            }
            out.push("${translate('uix.filter.ne', {\n");
            out.push("        name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "'),\n");
            out.push("      })}`}\n");
            out.push("      source=\"" + (source) + (f.name) + "-ne\"\n");
            out.push("      reference=\"" + (entity.model.entityPathMapper[f.ref.entity]) + "\"\n");
            out.push("      perPage={10000}\n");
            out.push("      allowEmpty\n");
            out.push("    >\n");
            out.push("    ");
            if (f.ref.autocomplete) {
                out.push("\n");
                out.push("      <uix.AutocompleteInput optionText={uix." + (f.ref.entity) + ".inputText} />\n");
                out.push("    ");
            } else {
                out.push("\n");
                out.push("      <uix.SelectInput optionText={<uix." + (f.ref.entity) + ".SelectTitle />} />\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    </uix.ReferenceInput>\n");
            out.push("\n");
            out.push("    <uix.ReferenceInput\n");
            out.push("      className={classes.formControl}\n");
            out.push("      label={`");
            if (label) {
                out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
            }
            out.push("${translate('uix.filter.in', {\n");
            out.push("        name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "'),\n");
            out.push("      })}`}\n");
            out.push("      source=\"" + (source) + (f.name) + "-in\"\n");
            out.push("      reference=\"" + (entity.model.entityPathMapper[f.ref.entity]) + "\"\n");
            out.push("      perPage={10000}\n");
            out.push("      allowEmpty\n");
            out.push("    >\n");
            out.push("    ");
            if (f.ref.autocomplete) {
                out.push("\n");
                out.push("      <uix.AutocompleteArrayInput optionText={uix." + (f.ref.entity) + ".inputText } />\n");
                out.push("    ");
            } else {
                out.push("\n");
                out.push("      <uix.SelectArrayInput optionText={<uix." + (f.ref.entity) + ".SelectTitle />} />\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    </uix.ReferenceInput>\n");
            out.push("    <uix.ReferenceInput\n");
            out.push("    className={classes.formControl}\n");
            out.push("      label={`");
            if (label) {
                out.push("${'" + (label) + "'.split(' ').map(translate).join(' ')} ");
            }
            out.push("${translate('uix.filter.nin', {\n");
            out.push("        name: translate('resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "'),\n");
            out.push("      })}`}\n");
            out.push("      source=\"" + (source) + (f.name) + "-nin\"\n");
            out.push("      reference=\"" + (entity.model.entityPathMapper[f.ref.entity]) + "\"\n");
            out.push("      perPage={10000}\n");
            out.push("      allowEmpty\n");
            out.push("    >\n");
            out.push("    ");
            if (f.ref.autocomplete) {
                out.push("\n");
                out.push("      <uix.AutocompleteArrayInput optionText={uix." + (f.ref.entity) + ".inputText } />\n");
                out.push("    ");
            } else {
                out.push("\n");
                out.push("      <uix.SelectArrayInput optionText={<uix." + (f.ref.entity) + ".SelectTitle />} />\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    </uix.ReferenceInput>\n");
        }
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-filter-entity"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/filter.njs.js.map