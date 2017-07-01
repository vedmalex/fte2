(function(){
  return {  script: function (context, _content, partial){
     function content(blockName, ctx) {
       if(ctx === undefined || ctx === null) ctx = context;
       return _content(blockName, ctx, content, partial);
     }
     
     let current = '--main--';
     let outStack = [current];
     let result;
 
     function chunkEnsure(name) {
       if (!result) {
         result = {};
       }
       if (!result.hasOwnProperty(name)) {
         result[name] = '';
       }
     }
 
     function chunkStart(name) {
       chunkEnd();
       chunkEnsure(current);
       result[current] += out;
       chunkEnsure(name);
       result[name] = out = '';
       outStack.push(name);
       current = name;
     }
 
     function chunkEnd() {
       chunkEnsure(current);
       result[current] += out;
       if (outStack.length > 1) {
         current = outStack.pop();
       } else {
         current = outStack[0];
       }
       out = ''
     }
 
     
     var out = '';    
     /*2:1*/
      out +="\n";
     /*3:1*/
       chunkStart("filename1.txt") 
     /*3:34*/
      out +="\nfile1\n\n";
     /*6:1*/
       chunkStart("filename2.txt")
     /*6:33*/
      out +="\nfile2\n\n";
     /*9:1*/
       chunkStart("filename3.txt") 
     /*9:34*/
      out +="\nfile3\n\n";
     /*12:1*/
       chunkStart("filename4.txt") 
     /*12:34*/
      out +="\nfile4\n\n";
     /*15:1*/
       chunkStart("filename5.txt") 
     /*15:34*/
      out +="\nfile5\n\n";
     /*18:1*/
       chunkStart("filename6.txt") 
     /*18:34*/
      out +="\nfile6\n";
     
       chunkEnd();
       out = result;
       out = Object.keys(result).filter(i => i !== '--main--').map(curr => ({ name: curr, content: result[curr] }))
     
       return out;
   },
   compile: function() {  },
   dependency: {
     }
 }
 ;
})();