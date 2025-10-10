module.exports = {
    alias: [
        "display-show-entity"
    ],
    script: function(context, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = context;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const { source, entity, grid, embedded, sectionLabel, customizable } = context;
        out.push("\n");
        entity.props.forEach((f, index)=>{
            const ctx = {
                entity,
                f,
                source,
                grid,
                embedded,
                sectionLabel,
                customizable
            };
            const useForEmbeding = f.single && entity?.UI?.embedded?.hasOwnProperty(f.name);
            out.push("\n");
            if (customizable && !useForEmbeding) {
                out.push("\n");
                out.push("{ !excludedField.hasOwnProperty('" + (source) + (f.name) + "') && \n");
                out.push("\n");
            }
            out.push("\n");
            if (!f.ref || f.isFile) {
                if (f.isFile) {
                    if (f.isImage) {
                        ctx.f.type = 'Image';
                    } else {
                        ctx.f.type = 'File';
                    }
                }
                out.push("\n");
                out.push("    " + (partial(ctx, "display-show-field")) + "\n");
            } else {
                const embedded = entity?.UI?.embedded?.hasOwnProperty(f.name);
                out.push("\n");
                out.push("  ");
                if (f.single) {
                    out.push("\n");
                    out.push("    ");
                    if (embedded) {
                        out.push("\n");
                        out.push("  \n");
                        out.push("      " + (partial(ctx, "display-show-rel-single-embed")) + "\n");
                        out.push("    ");
                    } else {
                        out.push("\n");
                        out.push("      ");
                        if (f.ref.stored) {
                            out.push("\n");
                            out.push("        " + (partial(ctx, "display-show-rel-single-not-embed")) + "\n");
                            out.push("      ");
                        } else {
                            out.push("\n");
                            out.push("        " + (partial(ctx, "display-show-rel-single-not-embed")) + "\n");
                            out.push("      ");
                        }
                        out.push("\n");
                        out.push("    ");
                    }
                    out.push("\n");
                    out.push("  ");
                } else {
                    out.push("\n");
                    out.push("    ");
                    if (embedded) {
                        out.push("\n");
                        out.push("      " + (partial(ctx, "display-show-rel-multiple-embed")) + "\n");
                        out.push("      ");
                    } else {
                        out.push("\n");
                        out.push("      ");
                        if (f.verb !== 'BelongsToMany' || (f.verb === 'BelongsToMany' && f.ref.using)) {
                            out.push("\n");
                            out.push("        " + (partial(ctx, "display-show-rel-multiple-not-embed")) + "\n");
                            out.push("        ");
                        } else {
                            out.push("\n");
                            out.push("        " + (partial(ctx, "display-show-rel-multiple-not-embed-stored")) + "\n");
                            out.push("      ");
                        }
                        out.push("\n");
                        out.push("    ");
                    }
                    out.push("\n");
                    out.push("  ");
                }
                out.push("\n");
            }
            out.push("\n");
            if (customizable && !useForEmbeding) {
                out.push("\n");
                out.push("}\n");
            }
            out.push("\n");
        });
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-show-entity"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/show/entity.njs.js.map