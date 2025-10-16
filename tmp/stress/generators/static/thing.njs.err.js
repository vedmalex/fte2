module.exports = {
chunks: "$$$main$$$",

script: function (context, _content, partial, slot, options){
    function content(blockName, ctx) {
      if(ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    
    const _partial = partial
    partial = function(obj, template) {
      const result = _partial(obj, template)
      if(Array.isArray(result)){
        result.forEach(r => {
          chunkEnsure(r.name, r.content)
        })
        return ''
      } else {
        return result
      }
    }
    const main = '$$$main$$$'
    var current = main
    let outStack = [current]
    let result
    
    function chunkEnsure(name, content) {
      if (!result) {
        result = {}
      }
      if (!result.hasOwnProperty(name)) {
        result[name] = content ? content : []
      }
    }
    function chunkStart(name) {
      chunkEnsure(name)
      chunkEnd()
      current = name
      out = []
    }
    function chunkEnd() {
      result[current].push(...out)
      out = []
      current = outStack.pop() || main
    }
    chunkStart(main)
     const [ns, thingType] = context.thingType.split('.') 
     chunkStart(`./${thingType}.js`);  const chunks = ['model','store','metadata','app'] 
    out.push("\n");
    out.push("Ext.require(" + (JSON.stringify(chunks.map(chunk=> `things.${ns}.${chunk}.${thingType}`))) + ",\n");
    out.push("    function(){\n");
    out.push("        Ext.define('things." + (context.thingType) + "',{});\n");
    out.push("    }\n");
    out.push(")");
     chunkStart(`./model/${thingType}.js`); 
    out.push("// model");
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
    out.push("Ext.define('things." + (ns) + ".model." + (thingType) + "',{});");
     chunkStart(`./store/${thingType}.js`); 
    out.push("Ext.require('things." + (ns) + ".model." + (thingType) + "', function() {\n");
    out.push("// stores\n");
    out.push("    ");
     context.store.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    })
    out.push("\n");
    out.push("    ");
     context.metagridcombo.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    }) context.renderstore.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    })
    out.push("\n");
    out.push("\n");
    out.push("    Ext.define('things." + (ns) + ".store." + (thingType) + "',{});\n");
    out.push("})");
     chunkStart(`./metadata/${thingType}.js`); 
    out.push("Ext.require(['things." + (ns) + ".model." + (thingType) + "','things." + (ns) + ".store." + (thingType) + "'], function() {\n");
    out.push("    //metadata");
     context.metafieldsets.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    }) context.metaclientmethods.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    }) context.metagridfields.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    }) context.metaviewfields.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    }) context.metaeditfields.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    }) context.metasearchfields.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    })
    out.push("\n");
    out.push("    Ext.define('things." + (ns) + ".metadata." + (thingType) + "',{});\n");
    out.push("})");
     chunkStart(`./app/${thingType}.js`); 
    out.push("Ext.require(['things." + (ns) + ".model." + (thingType) + "','things." + (ns) + ".store." + (thingType) + "','things." + (ns) + ".metadata." + (thingType) + "'], function(){\n");
    out.push("    //extjs\n");
    out.push("    ");
     context.view.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    }) context.domain.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    }) context.controller.forEach((file)=>{
    out.push("\n");
    out.push("    " + (file) + "\n");
    out.push("    ");
    })
    out.push("Ext.define('things." + (ns) + ".app." + (thingType) + "',{});\n");
    out.push("})\n");
     chunkEnd(); 
    
    //# sourceMappingURL=generators/static/thing.njs.js.map
    
        chunkEnd()
        out = Object.keys(result)
          .filter(i => i !== '$$$main$$$')
          .map(curr => ({ name: curr, content: result[curr] }))
    if(out.some(t=>typeof t == 'object')){
      return out.map(chunk=(
          {...chunk,
            content:
            Array.isArray(chunk.content)
              ? chunk.content.join('')
              : chunk.content
          }
        )
      )
    } else {
      return out.join('')
    }
  },
  compile: function() {
    this.chunks = "$$$main$$$"
  },
  dependency: {
  }
};