module.exports = {

script: function (ctx, _content, partial, slot, options){
    function content(blockName, ctx) {
      if(ctx === undefined || ctx === null) ctx = ctx
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    
    out.push("\"" + (ctx.rel.to) + "\n");
    out.push("        ");
     if(ctx.variant!== "*"){ 
    out.push((ctx.rel.relName.split('.').join('')) + "\n");
    out.push("        ");
    }
    out.push("\"");
    //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9
    
      return out.join('')
  },
  compile: function() {
  },
  dependency: {
  }
};