<#@ noContent #>
<#@ requireAs('server/Application.Config/requireThings.njs','requireThings') #>
<#@ requireAs('server/Application.Config/profileControl.njs','control') #>
<#@ requireAs('server/Application.Config/registerModules.njs','modules') #>
<#@ requireAs('server/Application.Config/toolbarFuncs.njs','toolbarFuncs') #>

Ext.define('Modeleditor.controller.Profile', {
    extend: 'Ext.app.Controller',
    views: [
<#- if(!context.noHealthCheck) {-#>
      //'Admin.SpeedTestToolbar',
<#-}#>
      '#{context.name}#{context.currentProfile.name}.Viewport',
      '#{context.name}#{context.currentProfile.name}.Navigation',
      '#{context.name}#{context.currentProfile.name}.ToolBar',
      '#{context.name}#{context.currentProfile.name}.ScreenContainer'
    ],
    models: [ ],
    stores: [ ],

    /*SCREEN CONFIG*/
    screens:#{context.renderedScreens},

    /*SCREEN CONTAINER DISPLAY CONFIG FOR: TABPANEL, PORTALPANEL, SINGLEPANEL*/
    SCREENCONFIG:{
      tabpanel:{
        plain: true,
        margin: "2 0 0 0"
      },
      singlepanel:{
        plain: false,
        margin: "0"
      }
    },

    compareIndex: function(a,b) {
      if (a.index < b.index)
      return 1;
      if (a.index > b.index)
      return -1;
      return 0;
    },

    compareOrder: function(a,b) {
      if (a.order < b.order)
      return 1;
      if (a.order > b.order)
      return -1;
      return 0;
    },

    actionLoad: function(v, max) {
      return function() {
        if (v == 0) {
          Ext.MessageBox.hide();
        } else {
        let i = (max - v + 1) / max;
        Ext.MessageBox.updateProgress(i, Math.round(100 * i) + '% completed');
      }
    };
  },

  init: function() {
    let me = this;
    me.mainController = me.application.getController("Modeleditor.controller.Modeleditor");
#{partial(context, 'requireThings')}
#{partial(context, 'control')}
  },

  loadProfile: function() {
    let self = this;

    /*LOAD VIEWPORT*/
    this.mainController.getMainViewport().add(Ext.widget('#{context.name.toLowerCase() + context.currentProfile.name.toLowerCase()}viewport'));
    /*LOAD SCREENS*/
<#- if (context.SCREENS > 2) {#>
    Ext.MessageBox.show({
        title: _t('Please wait', 'SYSTEM', 'titles'),
        msg: _t('Loading views...', 'SYSTEM','messages'),
        progressText: _t('Initializing...', 'SYSTEM', 'messages'),
        width: 300,
        progress: true,
        closable: false
      });
      self.SCREEN_LENGTH = self.screens?.length ?? 0;
<#- }#>
      if (self.screens) {
        self.initScreen(self.screens, self);
      }
#{partial(context,'modules')}
    },

#{partial(context,'toolbarFuncs')}

    initScreen: function(screenItem, scope, callback) {
      let self = scope;
      if (screenItem) {
        if (screenItem.defaultViews?.length > 0) {
          screenItem.defaultViews.sort(self.compareOrder);
          screenItem.defaultViews.sort(self.compareIndex);
        }
        let key = screenItem.type.split(".").pop().toLowerCase();
        self.addScreenContainer(screenItem, key, self, function(el) {
            let item;
            let cnt = screenItem.defaultViews.length;
            length = 0;

            function done(err) {
              if (err || ++length > cnt)
              if (callback) callback();
            }
            for (let i = 0; i < cnt; i++) {
              item = screenItem.defaultViews[i];
              item.parentEl = el;
              self.addContent(item, self, done);
            }
          });
        } else {
        if (callback) callback();
      }
    },

    addScreenContainer: function(screenItem, key, scope, callback) {
      let self = scope;
      let itemData = {
        element: Ext.create(screenItem.type, {
            plain: self.SCREENCONFIG[key].plain,
            margin: self.SCREENCONFIG[key].margin,
            title: _t(screenItem.title,'#{context.name}#{context.currentProfile.name}', 'titles')
          }),
          index: screenItem.index,
          contentPanel: self.mainController.getMainContainer(),
          closable: screenItem.closable
        };

        self.mainController.preLoadItem(itemData, function() {
            if (callback) callback(itemData.element);
          });
        },

        addContent: function(screenItem, scope, callback) {
          let me = this;
          let reference = screenItem.reference;
          let title = screenItem.title;
          let type = screenItem.type;
          let suffix = "";
          switch (type) {
          case 'list':
          suffix = "list";
          break;
        case 'calendar':
        suffix = "calendar";
        break;
      }
      let widgetName = screenItem.widgetName;
      let loadWidget = widgetName + suffix;
      if (widgetName) {
        let itemData = {
          type: type,
          element: null,
          contentPanel: me.mainController.getMainContainer(),
          require: screenItem.require,
          reference: screenItem.reference,
          widget: widgetName,
          widgetName: loadWidget,
          thingId: null,
          queryResult: null,
          title: _t(title,'#{context.name}#{context.currentProfile.name}','titles'),
          closable: screenItem.closable
        };
        me.mainController.preLoadItem(itemData, function() {
            if (callback) callback();
          });
        }
      },

      loadModule: function(moduleName) {
        let self = this;
        Ext.require([
            moduleName
          ], function() {
          self.application.getController(moduleName);
        });
      }
    });

