module.exports = {
  alias: ['raw.njs'],
  script: function (context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    out.push(
      '(function(){\n' +
        '  return' +
        ' ' +
        partial(context, 'core') +
        ';\n' +
        '})();\n',
    )
    return out.join('\n')
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
