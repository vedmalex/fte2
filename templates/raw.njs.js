module.exports = {
  alias: ['raw.njs'],
  script: function (context, _content, partial, slot) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = ''
    try {
      var line
      var column
      function applyIndent(_str, _indent) {
        var str = String(_str)
        var indent = ''
        if (typeof _indent == 'number' && _indent > 0) {
          var res = ''
          for (var i = 0; i < _indent; i++) {
            res += ' '
          }
          indent = res
        }
        if (typeof _indent == 'string' && _indent.length > 0) {
          indent = _indent
        }
        if (indent && str) {
          return str
            .split('\n')
            .map((s) => indent + s)
            .join('\n')
        } else {
          return str
        }
      }
      /*3:1*/
      line = 3
      column = 1
      out += '(function(){\n  return'
      /*4:9*/
      line = 4
      column = 9
      out += applyIndent(partial(context, 'core'), ' ')
      /*4:37*/
      line = 4
      column = 37
      out += ';\n})();'
    } catch (e) {
      throw new Error(`
       error at ${line}:${column}
       message: ${e.message}
       stack: ${e.stack}
     `)
    }
    return out
  },
  compile: function () {
    this.alias = ['raw.njs']
    this.aliases = {}
    this.aliases['core'] = 'MainTemplate.njs'
    this.factory.ensure('MainTemplate.njs')
  },
  dependency: {
    'MainTemplate.njs': 1,
  },
}
