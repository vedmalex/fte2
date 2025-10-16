module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("Ext.define('Modeleditor.controller.Profile', {\n");
        out.push("    extend: 'Ext.app.Controller',\n");
        out.push("    views: [");
        if (!context.noHealthCheck) {
            out.push("//'Admin.SpeedTestToolbar',");
        }
        out.push("\n");
        out.push("      '" + (context.name) + (context.currentProfile.name) + ".Viewport',\n");
        out.push("      '" + (context.name) + (context.currentProfile.name) + ".Navigation',\n");
        out.push("      '" + (context.name) + (context.currentProfile.name) + ".ToolBar',\n");
        out.push("      '" + (context.name) + (context.currentProfile.name) + ".ScreenContainer'\n");
        out.push("    ],\n");
        out.push("    models: [ ],\n");
        out.push("    stores: [ ],\n");
        out.push("\n");
        out.push("    /*SCREEN CONFIG*/\n");
        out.push("    screens:" + (context.renderedScreens) + ",\n");
        out.push("\n");
        out.push("    /*SCREEN CONTAINER DISPLAY CONFIG FOR: TABPANEL, PORTALPANEL, SINGLEPANEL*/\n");
        out.push("    SCREENCONFIG:{\n");
        out.push("      tabpanel:{\n");
        out.push("        plain: true,\n");
        out.push("        margin: \"2 0 0 0\"\n");
        out.push("      },\n");
        out.push("      singlepanel:{\n");
        out.push("        plain: false,\n");
        out.push("        margin: \"0\"\n");
        out.push("      }\n");
        out.push("    },\n");
        out.push("\n");
        out.push("    compareIndex: function(a,b) {\n");
        out.push("      if (a.index < b.index)\n");
        out.push("      return 1;\n");
        out.push("      if (a.index > b.index)\n");
        out.push("      return -1;\n");
        out.push("      return 0;\n");
        out.push("    },\n");
        out.push("\n");
        out.push("    compareOrder: function(a,b) {\n");
        out.push("      if (a.order < b.order)\n");
        out.push("      return 1;\n");
        out.push("      if (a.order > b.order)\n");
        out.push("      return -1;\n");
        out.push("      return 0;\n");
        out.push("    },\n");
        out.push("\n");
        out.push("    actionLoad: function(v, max) {\n");
        out.push("      return function() {\n");
        out.push("        if (v == 0) {\n");
        out.push("          Ext.MessageBox.hide();\n");
        out.push("        } else {\n");
        out.push("        let i = (max - v + 1) / max;\n");
        out.push("        Ext.MessageBox.updateProgress(i, Math.round(100 * i) + '% completed');\n");
        out.push("      }\n");
        out.push("    };\n");
        out.push("  },\n");
        out.push("\n");
        out.push("  init: function() {\n");
        out.push("    let me = this;\n");
        out.push("    me.mainController = me.application.getController(\"Modeleditor.controller.Modeleditor\");\n");
        out.push((partial(context, 'requireThings')) + "\n");
        out.push((partial(context, 'control')) + "\n");
        out.push("  },\n");
        out.push("\n");
        out.push("  loadProfile: function() {\n");
        out.push("    let self = this;\n");
        out.push("\n");
        out.push("    /*LOAD VIEWPORT*/\n");
        out.push("    this.mainController.getMainViewport().add(Ext.widget('" + (context.name.toLowerCase() + context.currentProfile.name.toLowerCase()) + "viewport'));\n");
        out.push("    /*LOAD SCREENS*/");
        if (context.SCREENS > 2) {
            out.push("\n");
            out.push("    Ext.MessageBox.show({\n");
            out.push("        title: _t('Please wait', 'SYSTEM', 'titles'),\n");
            out.push("        msg: _t('Loading views...', 'SYSTEM','messages'),\n");
            out.push("        progressText: _t('Initializing...', 'SYSTEM', 'messages'),\n");
            out.push("        width: 300,\n");
            out.push("        progress: true,\n");
            out.push("        closable: false\n");
            out.push("      });\n");
            out.push("      self.SCREEN_LENGTH = self.screens?.length ?? 0;");
        }
        out.push("\n");
        out.push("      if (self.screens) {\n");
        out.push("        self.initScreen(self.screens, self);\n");
        out.push("      }\n");
        out.push((partial(context, 'modules')) + "\n");
        out.push("    },\n");
        out.push("\n");
        out.push("    " + (partial(context, 'toolbarFuncs')) + "\n");
        out.push("\n");
        out.push("    initScreen: function(screenItem, scope, callback) {\n");
        out.push("      let self = scope;\n");
        out.push("      if (screenItem) {\n");
        out.push("        if (screenItem.defaultViews?.length > 0) {\n");
        out.push("          screenItem.defaultViews.sort(self.compareOrder);\n");
        out.push("          screenItem.defaultViews.sort(self.compareIndex);\n");
        out.push("        }\n");
        out.push("        let key = screenItem.type.split(\".\").pop().toLowerCase();\n");
        out.push("        self.addScreenContainer(screenItem, key, self, function(el) {\n");
        out.push("            let item;\n");
        out.push("            let cnt = screenItem.defaultViews.length;\n");
        out.push("            length = 0;\n");
        out.push("\n");
        out.push("            function done(err) {\n");
        out.push("              if (err || ++length > cnt)\n");
        out.push("              if (callback) callback();\n");
        out.push("            }\n");
        out.push("            for (let i = 0; i < cnt; i++) {\n");
        out.push("              item = screenItem.defaultViews[i];\n");
        out.push("              item.parentEl = el;\n");
        out.push("              self.addContent(item, self, done);\n");
        out.push("            }\n");
        out.push("          });\n");
        out.push("        } else {\n");
        out.push("        if (callback) callback();\n");
        out.push("      }\n");
        out.push("    },\n");
        out.push("\n");
        out.push("    addScreenContainer: function(screenItem, key, scope, callback) {\n");
        out.push("      let self = scope;\n");
        out.push("      let itemData = {\n");
        out.push("        element: Ext.create(screenItem.type, {\n");
        out.push("            plain: self.SCREENCONFIG[key].plain,\n");
        out.push("            margin: self.SCREENCONFIG[key].margin,\n");
        out.push("            title: _t(screenItem.title,'" + (context.name) + (context.currentProfile.name) + "', 'titles')\n");
        out.push("          }),\n");
        out.push("          index: screenItem.index,\n");
        out.push("          contentPanel: self.mainController.getMainContainer(),\n");
        out.push("          closable: screenItem.closable\n");
        out.push("        };\n");
        out.push("\n");
        out.push("        self.mainController.preLoadItem(itemData, function() {\n");
        out.push("            if (callback) callback(itemData.element);\n");
        out.push("          });\n");
        out.push("        },\n");
        out.push("\n");
        out.push("        addContent: function(screenItem, scope, callback) {\n");
        out.push("          let me = this;\n");
        out.push("          let reference = screenItem.reference;\n");
        out.push("          let title = screenItem.title;\n");
        out.push("          let type = screenItem.type;\n");
        out.push("          let suffix = \"\";\n");
        out.push("          switch (type) {\n");
        out.push("          case 'list':\n");
        out.push("          suffix = \"list\";\n");
        out.push("          break;\n");
        out.push("        case 'calendar':\n");
        out.push("        suffix = \"calendar\";\n");
        out.push("        break;\n");
        out.push("      }\n");
        out.push("      let widgetName = screenItem.widgetName;\n");
        out.push("      let loadWidget = widgetName + suffix;\n");
        out.push("      if (widgetName) {\n");
        out.push("        let itemData = {\n");
        out.push("          type: type,\n");
        out.push("          element: null,\n");
        out.push("          contentPanel: me.mainController.getMainContainer(),\n");
        out.push("          require: screenItem.require,\n");
        out.push("          reference: screenItem.reference,\n");
        out.push("          widget: widgetName,\n");
        out.push("          widgetName: loadWidget,\n");
        out.push("          thingId: null,\n");
        out.push("          queryResult: null,\n");
        out.push("          title: _t(title,'" + (context.name) + (context.currentProfile.name) + "','titles'),\n");
        out.push("          closable: screenItem.closable\n");
        out.push("        };\n");
        out.push("        me.mainController.preLoadItem(itemData, function() {\n");
        out.push("            if (callback) callback();\n");
        out.push("          });\n");
        out.push("        }\n");
        out.push("      },\n");
        out.push("\n");
        out.push("      loadModule: function(moduleName) {\n");
        out.push("        let self = this;\n");
        out.push("        Ext.require([\n");
        out.push("            moduleName\n");
        out.push("          ], function() {\n");
        out.push("          self.application.getController(moduleName);\n");
        out.push("        });\n");
        out.push("      }\n");
        out.push("    });");
        return out.join('');
    },
    compile: function() {
        this.aliases = {};
        this.aliases["requireThings"] = "server/Application.Config/requireThings.njs";
        this.factory.ensure("server/Application.Config/requireThings.njs");
        this.aliases["control"] = "server/Application.Config/profileControl.njs";
        this.factory.ensure("server/Application.Config/profileControl.njs");
        this.aliases["modules"] = "server/Application.Config/registerModules.njs";
        this.factory.ensure("server/Application.Config/registerModules.njs");
        this.aliases["toolbarFuncs"] = "server/Application.Config/toolbarFuncs.njs";
        this.factory.ensure("server/Application.Config/toolbarFuncs.njs");
    },
    dependency: {
        "server/Application.Config/requireThings.njs": true,
        "requireThings": true,
        "server/Application.Config/profileControl.njs": true,
        "control": true,
        "server/Application.Config/registerModules.njs": true,
        "modules": true,
        "server/Application.Config/toolbarFuncs.njs": true,
        "toolbarFuncs": true
    }
};

//# sourceMappingURL=generators/server/Application.Config/application.profiler.njs.js.map