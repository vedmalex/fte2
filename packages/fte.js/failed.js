module.exports = {

script: function (d, _content, partial, slot, options){
    function content(blockName, ctx) {
      if(ctx === undefined || ctx === null) ctx = d
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    
    out.push((d.value));
    //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9
    
      return out.join('')
  },
  compile: function() {
  },
  dependency: {
  }
};