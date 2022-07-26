module.exports = {
  alias: ['raw.njs'],
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push('(function(){')
    out.push('  return ' + partial(context, 'core') + ';')
    out.push('})();')
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
    core: 1,
  },
}
