module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        let properties = [
            ...context.gridviewProps
        ].sort((a, b)=>a.property.propertyName > b.property.propertyName ? 1 : -1);
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Grainjs.renderstore." + (context.$namespace) + "." + (context.$name) + "', {\n");
        out.push("  override: 'Grainjs.metadata',\n");
        out.push("  statics:{\n");
        out.push("    'renderstore." + (context.$namespace) + "." + (context.$name) + "': {");
        for(let i = 0; i < properties.length; i++){
            let property = properties[i].property;
            const props = context.formPropsHash[property.propertyName].filter((f)=>f.generated && f.comboForcePreload);
            if (props.length === 0) {
                out.push("\n");
                out.push("          " + (JSON.stringify(property.propertyName)) + ": {},\n");
                out.push("          ");
            } else {
                for(let j = 0; j < props.length; j++){
                    const f = props[j];
                    out.push("\n");
                    out.push("          " + (JSON.stringify(property.propertyName)) + ":Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions['" + (property.propertyName) + "']?.store?.(),");
                }
            }
        }
        out.push("\n");
        out.push("    },\n");
        out.push("  },\n");
        out.push("})");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.thing.renderstore.njs.js.map