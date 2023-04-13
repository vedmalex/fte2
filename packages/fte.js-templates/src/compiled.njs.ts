import { TemplateBase } from 'fte.js-base'

export default {
  alias: ['compiled.njs'],
  aliases: {
    core: 'MainTemplate.njs',
  },
  script: function (context, _content, partial, slot, options) {
    var out: Array<string> = []
    out.push('module.exports = ' + partial(context, 'core') + ';')
    return out.join('')
  },
  compile: function (this: TemplateBase) {
    this.factory.ensure('MainTemplate.njs')
  },
  dependency: {
    'MainTemplate.njs': true,
    core: true,
  },
}
