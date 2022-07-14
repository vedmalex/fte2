module.exports = {
  alias: ['raw.njs'],
  script: function (context, _content, partial, slot) {
    var out = []
    out.push(`
(function(){
  return ${partial(context, 'core')}
})()
`)
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
