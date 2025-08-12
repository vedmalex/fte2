<#@ noContent #>
<#
  const getRS = context.getRS
  const makeRelVariants = context.makeRelVariants
  const iterateGroups = context.iterateRelGroups
  const localStateMachine = context.stateMachine;
#>

Ext.define('Modeleditor.view.#{context.$namespace}.FormNavigationToolbar.#{context.$name}',{
  serverModel: '#{context.$normalizedName}',
  // requires: [#{context.requires}],
  extend: "Ext.toolbar.Toolbar",
  alias: "widget.#{context.$widgetName}formnavigationtoolbar",
  dock: 'left',
  overflowY: 'auto',
  initComponent: function(){

    const items = [
        {
          _order:-1000,
          xtype:'button',
          itemId: 'General',
          text: _t('General', 'SYSTEM', 'titles'),
          relGroup: _t('General', 'SYSTEM', 'titles'),
          iconCls: _r('General','', 'SYSTEM','titles', 'iconCls') || _r('iconCls','', '#{context.$namespace}.#{context.$name}'),
          enableToggle: true,
          pressed: true,
          textAlign: 'left',
          minWidth: 160,
          toggleGroup: '#{context.$widgetName}FormNavigation',
          widgetName: "#{context.$widgetName}edit",
          listeners: {
            toggle: function(btn, pressed) {
              if (pressed) {
                DirectCacheLogger.userStories('Form Navigation General Tab', { serverModel: '#{context.$namespace}.#{context.$name}', buttonId: btn.itemId, widgetName: btn.widgetName });
              }
            }
          }
        },
        {
          _order: -999,
          xtype:'tbseparator'
        },
        <#

        if(context.navigationRels) {
            iterateGroups(makeRelVariants(context.navigationRels), (variant, rel, relIndex, variantIndex)=>{
              let rs = getRS(rel);
              let group = rel._toGroup;
              if (!group) {#>
        {
          _order: #{rs.toOrder},
          xtype:"button",
          itemId: "#{rel.to}<#if(variant!== '*'){#>#{rel.relName.split('.').join('')}<#}#>",
          widgetname: "#{([rel.refNorm.namespace, rel.refNorm.name].join("")).toLowerCase()}",
          propname: "#{rel.to}<#if(variant!== '*'){#>#{rel.relName.split('.').join('')}<#}#>",
          text: _t("#{rs.toDisplay}",'#{context.$namespace}.#{context.$name}' ,'toDisplay', '#{rel.to}')<#if(rel.toRequired){#> + " *"<#}#>,
          iconCls: _r("#{rs.toDisplay}",'','#{context.$namespace}.#{context.$name}' ,'toDisplay', '#{rel.to}', 'iconCls') || _r("iconCls",'', '#{rel.ref.thingType}')<#if(rel.ref.iconCls){#> || "#{rel.ref.iconCls}"<#}#>,
          enableToggle: true,
          textAlign: 'left',
          minWidth: 160,
          toggleGroup: '#{context.$widgetName}FormNavigation',
          listeners: {
            toggle: function(btn, pressed) {
              if (pressed) {
                DirectCacheLogger.userStories('Form Navigation Tab', { serverModel: '#{context.$namespace}.#{context.$name}', buttonId: btn.itemId, propname: btn.propname, widgetName: btn.widgetname, relationName: '#{rel.to}' });
              }
            }
          }
        },
        <#     } else {#>
        {
          _order: #{rs.toOrder},
          xtype:'button',
          itemId: "#{rel.to}<#if(variant!== '*'){#>#{rel.relName.split('.').join('')}<#}#>",
          widgetname: "#{([rel.refNorm.namespace, rel.refNorm.name].join("")).toLowerCase()}",
          text: _t(#{JSON.stringify(group)},'#{context.$namespace}.#{context.$name}', 'buttons'),
          iconCls: _r(#{JSON.stringify(group)},'', '#{context.$namespace}.#{context.$name}','iconCls'),
          relGroup: _t('#{group}','#{context.$namespace}.#{context.$name}', 'toGroup'),
          textAlign: 'left',
          minWidth: 160,
          toggleGroup: '#{context.$widgetName}FormNavigation',
          listeners: {
            toggle: function(btn, pressed) {
              if (pressed) {
                DirectCacheLogger.userStories('Form Navigation Group Tab', { serverModel: '#{context.$namespace}.#{context.$name}', buttonId: btn.itemId, relGroup: btn.relGroup, widgetName: btn.widgetname, relationName: '#{rel.to}' });
              }
            }
          }
        },
        <#-       }
            })
        }
          if (context.clientMethods) {
            let clMeth = context.clientMethods.filter(
              m=>(m.type == 'button' || m.type == 'toggle') &&
                !m.disable &&
                !m.currentSettings?.hidden &&
                !m.currentSettings?.showInsideForm
              );

            let separatorExist = false
            for (let i=0; i<clMeth.length; i++){#>
        Grainjs.metadata['metaclientmethods.#{context.$namespace}.#{context.$name}'].buttons['#{clMeth[i].name}'](),
        <#
            }
          }
        #>
      <#if (localStateMachine && context.debugSM) { #>
        <# for (let i = localStateMachine.event.length - 1; i >= 0; i--) {
            let ev = localStateMachine.event[i]
        #>
        Grainjs.metadata["metaclientmethods.#{context.$namespace}.#{context.$name}"].buttons["btn_#{ev.eventName}"](),
        <#}#>
      <#}#>
      ];

    Ext.apply( this, {
      type: "formNavigation",
      items: items.sort((a,b)=> a._order - b._order)
    });
    this.callParent(arguments);
  }
});