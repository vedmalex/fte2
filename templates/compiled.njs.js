module.exports = {
  alias: ['compiled.njs'],
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push('module.exports = ' + partial(context, 'core') + ';')
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
    core: 1,
  },
}
