(function(){
  return {  script: function (context, _content, partial){
     function content(blockName, ctx) {
       if(ctx === undefined || ctx === null) ctx = context;
       return _content(blockName, ctx, content, partial);
     }
     var out = '';    
     /*1:1*/
      if(!some){
     /*1:15*/
      out +="else ";
     /*1:20*/
      }
     /*1:25*/
      out +="if(filters.hasOwnProperty('";
     /*1:52*/
      out +=allNonEmbedded[i].to;
     
     /*1:75*/
      out +="')){\n        filter = filters['";
     /*2:27*/
      out +=allNonEmbedded[i].to;
     
     /*2:50*/
      out +="'];\n";
     return out;
   },
   compile: function() {  },
   dependency: {
     }
 }
 ;
})();