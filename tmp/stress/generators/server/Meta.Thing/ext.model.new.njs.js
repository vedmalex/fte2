module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("Ext.define('Modeleditor.model." + (context.namespace) + "." + (context.$name) + "', {\n");
        out.push("  extend: \"Ext.data.ActiveModel\",\n");
        out.push("  idgen: {\n");
        out.push("    type: 'mongoIdgen',\n");
        out.push("    model: '" + (context.namespace) + "." + (context.$name) + "',\n");
        out.push("    location: 'db'\n");
        out.push("  },\n");
        out.push("  alternateClassName:'Workspace.model." + (context.namespace) + "." + (context.$name) + "',\n");
        out.push("  widget: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].widget,\n");
        out.push("  queryResult: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].queryResult,\n");
        out.push("  refreshMethod: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].refreshMethod,");
        if (context.cal_mapping) {
            out.push("\n");
            out.push("  statics: {\n");
            out.push("    calendarMapping : Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].statics?.calendarMapping,\n");
            out.push("  },");
        }
        out.push("\n");
        out.push("  serverModel:'" + (context.$normalizedName) + "',\n");
        out.push("  relNames: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].relNames,\n");
        out.push("  groupedRels: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].groupedRels,\n");
        out.push("  fields: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].fields?.(),\n");
        out.push("  validations: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].validations?.(),\n");
        out.push("  associations: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].associations?.(),\n");
        out.push("  proxy:Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].proxy(),\n");
        out.push("  inheritance: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].inheritance,\n");
        out.push("  stateMachineHash: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].stateMachineHash,\n");
        out.push("  _fireSMEvent: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "']._fireSMEvent,\n");
        out.push("  ...Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].methods,\n");
        out.push("  }\n");
        out.push(");");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.model.new.njs.js.map