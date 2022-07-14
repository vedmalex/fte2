module.exports = {
  alias: ['compiled.njs'],
  script: function (context, _content, partial, slot) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
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
    out.push('module.exports =')
    out.push(applyIndent(partial(context, 'core'), ' '))
    out.push('\n')
    return out.join('\n')
  },
  compile: function () {
    this.alias = ['compiled.njs']
    this.aliases = {}
    this.aliases['core'] = 'MainTemplate.njs'
    this.factory.ensure('MainTemplate.njs')
  },
  dependency: {
    'MainTemplate.njs': 1,
  },
}
