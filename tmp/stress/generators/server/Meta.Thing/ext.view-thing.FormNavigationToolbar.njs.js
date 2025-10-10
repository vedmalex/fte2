module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        const getRS = context.getRS;
        const makeRelVariants = context.makeRelVariants;
        const iterateGroups = context.iterateRelGroups;
        const localStateMachine = context.stateMachine;
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".FormNavigationToolbar." + (context.$name) + "',{\n");
        out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
        out.push("  // requires: [" + (context.requires) + "],\n");
        out.push("  extend: \"Ext.toolbar.Toolbar\",\n");
        out.push("  alias: \"widget." + (context.$widgetName) + "formnavigationtoolbar\",\n");
        out.push("  dock: 'left',\n");
        out.push("  overflowY: 'auto',\n");
        out.push("  initComponent: function(){\n");
        out.push("\n");
        out.push("    const items = [\n");
        out.push("        {\n");
        out.push("          _order:-1000,\n");
        out.push("          xtype:'button',\n");
        out.push("          itemId: 'General',\n");
        out.push("          text: _t('General', 'SYSTEM', 'titles'),\n");
        out.push("          relGroup: _t('General', 'SYSTEM', 'titles'),\n");
        out.push("          iconCls: _r('General','', 'SYSTEM','titles', 'iconCls') || _r('iconCls','', '" + (context.$namespace) + "." + (context.$name) + "'),\n");
        out.push("          enableToggle: true,\n");
        out.push("          pressed: true,\n");
        out.push("          textAlign: 'left',\n");
        out.push("          minWidth: 160,\n");
        out.push("          toggleGroup: '" + (context.$widgetName) + "FormNavigation',\n");
        out.push("          widgetName: \"" + (context.$widgetName) + "edit\",\n");
        out.push("          listeners: {\n");
        out.push("            toggle: function(btn, pressed) {\n");
        out.push("              if (pressed) {\n");
        out.push("                DirectCacheLogger.userStories('Form Navigation General Tab', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', buttonId: btn.itemId, widgetName: btn.widgetName });\n");
        out.push("              }\n");
        out.push("            }\n");
        out.push("          }\n");
        out.push("        },\n");
        out.push("        {\n");
        out.push("          _order: -999,\n");
        out.push("          xtype:'tbseparator'\n");
        out.push("        },\n");
        out.push("        ");
        if (context.navigationRels) {
            iterateGroups(makeRelVariants(context.navigationRels), (variant, rel, relIndex, variantIndex)=>{
                let rs = getRS(rel);
                let group = rel._toGroup;
                if (!group) {
                    out.push("\n");
                    out.push("        {\n");
                    out.push("          _order: " + (rs.toOrder) + ",\n");
                    out.push("          xtype:\"button\",\n");
                    out.push("          itemId: \"" + (rel.to));
                    if (variant !== '*') {
                        out.push((rel.relName.split('.').join('')));
                    }
                    out.push("\",\n");
                    out.push("          widgetname: \"" + (([
                        rel.refNorm.namespace,
                        rel.refNorm.name
                    ].join("")).toLowerCase()) + "\",\n");
                    out.push("          propname: \"" + (rel.to));
                    if (variant !== '*') {
                        out.push((rel.relName.split('.').join('')));
                    }
                    out.push("\",\n");
                    out.push("          text: _t(\"" + (rs.toDisplay) + "\",'" + (context.$namespace) + "." + (context.$name) + "' ,'toDisplay', '" + (rel.to) + "')");
                    if (rel.toRequired) {
                        out.push(" + \" *\"");
                    }
                    out.push(",\n");
                    out.push("          iconCls: _r(\"" + (rs.toDisplay) + "\",'','" + (context.$namespace) + "." + (context.$name) + "' ,'toDisplay', '" + (rel.to) + "', 'iconCls') || _r(\"iconCls\",'', '" + (rel.ref.thingType) + "')");
                    if (rel.ref.iconCls) {
                        out.push(" || \"" + (rel.ref.iconCls) + "\"");
                    }
                    out.push(",\n");
                    out.push("          enableToggle: true,\n");
                    out.push("          textAlign: 'left',\n");
                    out.push("          minWidth: 160,\n");
                    out.push("          toggleGroup: '" + (context.$widgetName) + "FormNavigation',\n");
                    out.push("          listeners: {\n");
                    out.push("            toggle: function(btn, pressed) {\n");
                    out.push("              if (pressed) {\n");
                    out.push("                DirectCacheLogger.userStories('Form Navigation Tab', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', buttonId: btn.itemId, propname: btn.propname, widgetName: btn.widgetname, relationName: '" + (rel.to) + "' });\n");
                    out.push("              }\n");
                    out.push("            }\n");
                    out.push("          }\n");
                    out.push("        },\n");
                    out.push("        ");
                } else {
                    out.push("\n");
                    out.push("        {\n");
                    out.push("          _order: " + (rs.toOrder) + ",\n");
                    out.push("          xtype:'button',\n");
                    out.push("          itemId: \"" + (rel.to));
                    if (variant !== '*') {
                        out.push((rel.relName.split('.').join('')));
                    }
                    out.push("\",\n");
                    out.push("          widgetname: \"" + (([
                        rel.refNorm.namespace,
                        rel.refNorm.name
                    ].join("")).toLowerCase()) + "\",\n");
                    out.push("          text: _t(" + (JSON.stringify(group)) + ",'" + (context.$namespace) + "." + (context.$name) + "', 'buttons'),\n");
                    out.push("          iconCls: _r(" + (JSON.stringify(group)) + ",'', '" + (context.$namespace) + "." + (context.$name) + "','iconCls'),\n");
                    out.push("          relGroup: _t('" + (group) + "','" + (context.$namespace) + "." + (context.$name) + "', 'toGroup'),\n");
                    out.push("          textAlign: 'left',\n");
                    out.push("          minWidth: 160,\n");
                    out.push("          toggleGroup: '" + (context.$widgetName) + "FormNavigation',\n");
                    out.push("          listeners: {\n");
                    out.push("            toggle: function(btn, pressed) {\n");
                    out.push("              if (pressed) {\n");
                    out.push("                DirectCacheLogger.userStories('Form Navigation Group Tab', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', buttonId: btn.itemId, relGroup: btn.relGroup, widgetName: btn.widgetname, relationName: '" + (rel.to) + "' });\n");
                    out.push("              }\n");
                    out.push("            }\n");
                    out.push("          }\n");
                    out.push("        },\n");
                    out.push("        ");
                }
            });
        }
        if (context.clientMethods) {
            let clMeth = context.clientMethods.filter((m)=>(m.type == 'button' || m.type == 'toggle') && !m.disable && !m.currentSettings?.hidden && !m.currentSettings?.showInsideForm);
            let separatorExist = false;
            for(let i = 0; i < clMeth.length; i++){
                out.push("\n");
                out.push("        Grainjs.metadata['metaclientmethods." + (context.$namespace) + "." + (context.$name) + "'].buttons['" + (clMeth[i].name) + "'](),\n");
                out.push("        ");
            }
        }
        out.push("\n");
        out.push("      ");
        if (localStateMachine && context.debugSM) {
            out.push("\n");
            out.push("        ");
            for(let i = localStateMachine.event.length - 1; i >= 0; i--){
                let ev = localStateMachine.event[i];
                out.push("\n");
                out.push("        Grainjs.metadata[\"metaclientmethods." + (context.$namespace) + "." + (context.$name) + "\"].buttons[\"btn_" + (ev.eventName) + "\"](),\n");
                out.push("        ");
            }
            out.push("\n");
            out.push("      ");
        }
        out.push("\n");
        out.push("      ];\n");
        out.push("\n");
        out.push("    Ext.apply( this, {\n");
        out.push("      type: \"formNavigation\",\n");
        out.push("      items: items.sort((a,b)=> a._order - b._order)\n");
        out.push("    });\n");
        out.push("    this.callParent(arguments);\n");
        out.push("  }\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.view-thing.FormNavigationToolbar.njs.js.map