module.exports = {
  alias: ['raw.njs'],
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push('(function(){\n')
    out.push('  return ' + partial(context, 'core') + ';\n')
    out.push('})();')
    return out.join('')
  },
  compile: function () {
    this.alias = ['raw.njs']
    this.aliases = {}
    this.aliases['core'] = 'MainTemplate.njs'
    this.factory.ensure('MainTemplate.njs')
  },
  dependency: {
    'MainTemplate.njs': true,
    core: true,
  },
}
