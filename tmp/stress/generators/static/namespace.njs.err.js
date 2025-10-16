module.exports = {

script: function (context, _content, partial, slot, options){
    function content(blockName, ctx) {
      if(ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    
    out.push("// model\n");
    out.push("// " + (context.name));
     context.metaview.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    }) context.metamodel.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    }) context.model.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    })
    out.push("// stores");
     context.store.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    })
    out.push("\n");
     context.metagridcombo.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    }) context.renderstore.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    })
    out.push("\n");
    out.push("//metadata");
     context.metafieldsets.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    }) context.metaclientmethods.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    }) context.metagridfields.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    }) context.metaviewfields.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    }) context.metaeditfields.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    }) context.metasearchfields.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    })
    out.push("\n");
    out.push("//extjs\n");
     context.view.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    }) context.domain.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    }) context.controller.forEach((file)=>{
    out.push("\n");
    out.push((file) + "\n");
    })if(context.reqThings.length > 0){
    out.push("\n");
    out.push("Ext.require(" + (JSON.stringify(context.reqThings)) + ",\n");
    out.push("    function(){\n");
    out.push("        Ext.define('namespace." + (context.name) + "',{});\n");
    out.push("    }\n");
    out.push(")\n");
    } else {
    out.push("\n");
    out.push("Ext.define('namespace." + (context.name) + "',{});\n");
    }
    
    //# sourceMappingURL=generators/static/namespace.njs.js.map
    
      return out.join('')
  },
  compile: function() {
  },
  dependency: {
  }
};