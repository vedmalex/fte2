module.exports = {
  alias: ['compiled.njs'],
  script: function (context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    const { SourceNode } = require('source-map-generator')
    var out = []
    out.push('module.exports =' + ' ' + partial(context, 'core') + ';\n' + '\n')
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
