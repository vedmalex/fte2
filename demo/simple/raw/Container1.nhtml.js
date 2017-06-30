module.exports = {
  script: function (obj, _content, partial) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null)
        ctx = obj;
      return _content(blockName, ctx, content, partial)
    }
    var out = '';
    out += content();
    return out
  },
  blocks: {
    'header': function (head, _content, partial) {
      function content(blockName, ctx) {
        if (ctx === undefined || ctx === null)
          ctx = obj;
        return _content(blockName, ctx, content, partial)
      }
      var out = '';
      function applyIndent(_str, _indent) {
        var str = String(_str);
        var indent = '';
        if (typeof _indent == 'number' && _indent > 0) {
          var res = '';
          for (var i = 0; i < _indent; i++) {
            res += ' '
          }
          indent = res
        }
        if (typeof _indent == 'string' && _indent.length > 0) {
          indent = _indent
        }
        if (indent && str) {
          return str.split('\n').map(function (s) {
            return indent + s
          }).join('\n')
        } else {
          return str
        }
      }
      out += '<div>\n';
      out += applyIndent(head.header, '  ');
      out += '\n</div>';
      return out
    }
  },
  compile: function () {
    this.aliases = {};
    this.aliases['head'] = 'Container3.nhtml';
    this.factory.ensure('Container3.nhtml');
    this.parent = 'Container.nhtml';
    this.mergeParent(this.factory.ensure(this.parent))
  },
  dependency: {
    'Container.nhtml': 1,
    'Container3.nhtml': 1
  }
}