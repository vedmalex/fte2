module.exports = {
alias: ["show-rel-single-embed"],

script: function (ctx, _content, partial, slot, options){
    function content(blockName, ctx) {
      if(ctx === undefined || ctx === null) ctx = ctx
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    
    
      const {entity, f, current} = ctx;
    
    
    //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
    
      return out.join('')
  },
  blocks : {
    "import-from-ra-ui-components-show','EmbeddedField": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "import-from-react-admin-show','ShowButton": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "import-from-react-admin-show','EditButton": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "import-from-react-admin-show','DeleteButton": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "<EmbeddedField": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "addLabel={false}": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "#{f.field}Value": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    ">": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "<#": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "let embededEntity = entity.UI.embedded.items[current].entity;": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "let reUI = entity.UI.embedded.items[current].UI;": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "entity.UI.embedded.items[current].fields": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    ".filter(f=>": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "id": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "(reUI.edit[f.name] ||": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "reUI.list[f.name] ||": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "reUI.show[f.name]) &&": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "reUI.show[f.name] !== false)": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    ".forEach(f=>{-#>": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "Number" ? "Text": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "resources.#{embededEntity}.fields.#{f.name}": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "#{f.name}": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "/>": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "});": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "-#>": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "/#{entity.role}/#{f.ref.entity}": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
    "</EmbeddedField>": function(context,  _content, partial, slot, options) {
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      
      //# sourceMappingURL=slots/show-rel-single-embed.njs.js.map
        return out.join('')
    },
  },
  compile: function() {
    this.alias = ["show-rel-single-embed"]
  },
  dependency: {
  }
};