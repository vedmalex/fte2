Line 20: Unexpected token ILLEGAL;
     module.exports =  {    script: function ( context , _content, partial){
          function content(blockName, ctx) {
            if(ctx === undefined || ctx === null) ctx =  context ;
            return _content(blockName, ctx, content, partial);
          }
          var out = '';      function applyIndent(_str, _indent) {
            var str = String(_str);
            var indent = '';
            if (typeof _indent == 'number' && _indent > 0) {
              var res = '';
              for (var i = 0; i < _indent; i++) {
                res += ' ';
              }
              indent = res;
            }
            if (typeof _indent == 'string' && _indent.length > 0) {
              indent = _indent;
            }
            if (indent && str) {
              return str.split('
     ').map(function (s) {
                  return indent + s;
              }).join('
     ');
            } else {
              return str;
            }
          }
            
          /* 2 : 1 */
             out += `module.exports =` ;  
          /* 2 : 17 */
             out +=  applyIndent( partial(context, 'core') ,  " " );  
          /* 2 : 45 */
             out += `;
     ` ;  
          return out;
        },
          compile: function() {      this.aliases={};
            this.aliases[" core "] = " MainTemplate.njs ";
          this.factory.ensure(" MainTemplate.njs ");
          },
        dependency: {
              " MainTemplate.njs ": 1,
          }
      }
       ;
;