module.exports = {
  alias: ['es6module.njs'],
  script: function (context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    out.push('export default' + ' ' + partial(context, 'core') + ';\n')
    return out.join('\n')
  },
  compile: function () {
    this.alias = ['es6module.njs']
    this.aliases = {}
    this.aliases['core'] = 'MainTemplate.njs'
    this.factory.ensure('MainTemplate.njs')
  },
  dependency: {
    'MainTemplate.njs': 1,
  },
}
