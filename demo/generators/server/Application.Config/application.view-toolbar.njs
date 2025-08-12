<#@ noContent #>
<#-
  context.currentProfile.toolBarItem.sort(function(a, b){
    if(a !== undefined && b !== undefined)
      return a.itemIndex - b.itemIndex;
    return 0;
  });
#>

Ext.define('Modeleditor.view.#{context.name}#{context.currentProfile.name}.ToolBar', {
  extend: 'Ext.toolbar.Toolbar',
  alias: 'widget.#{context.name.toLowerCase()}#{context.currentProfile.name.toLowerCase()}toolbar',
  dock: "top",

  initComponent: function() {
    const currentLocale = globalThis.CURRENT_LOCALE || globalThis.AVAILABLE_LANGUAGES[0]
    DirectCacheLogger.userStories('Toolbar Init Component', { applicationName: '#{context.name}', profileName: '#{context.currentProfile.name}' });

    Ext.apply(this, {
      items:[
    <#- for(let i=0; i<context.currentProfile?.toolBarItem?.length ?? -1; i++){
      let settings = JSON.parse(context.currentProfile.toolBarItem[i].settings);
      settings.itemId = context.currentProfile.toolBarItem[i].itemId #>
      #{JSON.stringify(settings)},
    <#- }#>

      /* DEFAULT ITEMS */
      "->",
      <#- if(!context.noTranslationTools) {-#>
      {
        xtype: 'button',
        iconCls: `gi-lang_${currentLocale.code}`,
        menu: {
          items: globalThis.AVAILABLE_LANGUAGES.filter(
            l => l.code != globalThis.CURRENT_LOCALE.code,
          ).map(l => ({
            iconCls: `gi-lang_${l.code}`,
            text: `${l.nativeName} (${l.code})`,
            data: l,
          })),
          listeners: {
            click(menu, item, e, eOpts) {
              DirectCacheLogger.userStories('Language Change', { applicationName: '#{context.name}', profileName: '#{context.currentProfile.name}', newLanguage: item.data.code });
              const button = this.up('button')
              button.setText(item.text)
              button.setIconCls(item.iconCls)
              globalThis._tChangeLang(item.data)
              menu.removeAll()
              globalThis.AVAILABLE_LANGUAGES.filter(
                l => l.code != globalThis.CURRENT_LOCALE.code,
              )
                .map(
                  l =>
                    new Ext.createWidget('menuitem', {
                      iconCls: `gi-lang_${l.code}`,
                      text: `${l.nativeName} (${l.code})`,
                      data: l,
                    }),
                )
                .forEach(item => menu.items.add(item))
            },
          },
        },
      },
      <#}#>
      {
        xtype: 'button',
        text: _t('Logout', 'SYSTEM', 'buttons'),
        itemId: 'logout',
        scale: 'medium',
        href: '/logout',
        hrefTarget: '_self',
        iconCls: _r(
          'Logout',
          'icon-signout medium-icon',
          'SYSTEM',
          'iconCls',
        ),
        listeners: {
          click: function() {
            DirectCacheLogger.userStories('Logout Button Click', { applicationName: '#{context.name}', profileName: '#{context.currentProfile.name}' });
          }
        }
      },
        {
          xtype: 'button',
          text: _t('current session info?', 'SYSTEM', 'toolbars'),
          iconCls: _r('current session info?', '', 'SYSTEM', 'iconCls'),
          menu: [
            {
              xtype: 'button',
              text: _t('current session info?', 'SYSTEM', 'toolbars'),
              itemId: 'showUserInfo',
              iconCls: _r('current session info?', '', 'SYSTEM', 'iconCls'),
              scale: 'medium',
              listeners: {
                click: function() {
                  DirectCacheLogger.userStories('Show User Info Button Click', { applicationName: '#{context.name}', profileName: '#{context.currentProfile.name}' });
                }
              }
            },
            {
              xtype: 'button',
              text: _t('Impersonate User', 'SYSTEM', 'toolbars'),
              itemId: 'impersonateUser',
              iconCls: _r(
                'Impersonate User',
                'gi-fa_solid_user-secret',
                'SYSTEM',
                'iconCls',
              ),
              scale: 'medium',
              hidden: !Ext.util.Cookies.get('isAdmin'),
              handler: function () {
                DirectCacheLogger.userStories('Impersonate User Button Click', { applicationName: '#{context.name}', profileName: '#{context.currentProfile.name}' });
                Ext.create('Modeleditor.view.Admin.ImpersonateForm').show()
              },
            },
            {
              xtype: 'button',
              text: _t('Return to Original User', 'SYSTEM', 'toolbars'),
              itemId: 'revertImpersonate',
              iconCls: _r(
                'Return to Original User',
                'gi-fa_solid_user',
                'SYSTEM',
                'iconCls',
              ),
              scale: 'medium',
              hidden: !Ext.util.Cookies.get('isImpersonating'),
              handler: function () {
                DirectCacheLogger.userStories('Revert Impersonate Button Click', { applicationName: '#{context.name}', profileName: '#{context.currentProfile.name}' });
                Ext.Ajax.request({
                  url: '/impersonate/revert',
                  method: 'POST',
                  success: function () {
                    window.location.reload()
                  },
                  failure: function (response) {
                    Ext.Msg.alert(
                      _t('Error', 'SYSTEM', 'messages'),
                      Ext.decode(response.responseText).error,
                    )
                  },
                })
              },
            },
            {
              xtype: 'button',
              text: _t('Clear Cache', 'SYSTEM', 'toolbars'),
              itemId: 'clearCache',
              iconCls: _r('Clear Cache', '', 'SYSTEM', 'iconCls'),
              scale: 'medium',
              listeners: {
                click: () => {
                  DirectCacheLogger.userStories('Clear Cache Button Click', { applicationName: '#{context.name}', profileName: '#{context.currentProfile.name}' });
                  Workspace.DirectCatcher.clear()
                },
              },
            },
            {
              xtype: 'button',
              text: _t('Capture Start', 'SYSTEM', 'toolbars'),
              itemId: 'captureStart',
              iconCls: _r('Capture Start', '', 'SYSTEM', 'iconCls'),
              scale: 'medium',
              listeners: {
                click: () => {
                  DirectCacheLogger.userStories('Capture Start Button Click', { applicationName: '#{context.name}', profileName: '#{context.currentProfile.name}' });
                  Workspace.DirectCatcher.startCapture()
                },
              },
            },
            {
              xtype: 'button',
              text: _t('Capture Stop', 'SYSTEM', 'toolbars'),
              itemId: 'captureStop',
              iconCls: _r('Capture Stop', '', 'SYSTEM', 'iconCls'),
              scale: 'medium',
              listeners: {
                click: () => {
                  DirectCacheLogger.userStories('Capture Stop Button Click', { applicationName: '#{context.name}', profileName: '#{context.currentProfile.name}' });
                  Workspace.DirectCatcher.stopCapture()
                },
              },
            },
          ],
        },
      ]
    });

    this.callParent(arguments);
  }
});