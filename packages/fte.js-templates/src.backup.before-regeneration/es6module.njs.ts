import type { TemplateBase } from 'fte.js-base'
export default {
  alias: ['es6module.njs'],
  aliases: {
    core: 'MainTemplate.njs',
  },
  script: function (context, _content, partial, slot, options) {
    const core: any = partial(context, 'core') as any
    if (typeof core === 'string') {
      return 'export default ' + core + ';'
    } else {
      return {
        code: 'export default ' + core.code + ';',
        map: core.map,
      }
    }
  },
  compile: function (this: TemplateBase) {
    this.factory.ensure('MainTemplate.njs')
  },
  dependency: {
    'MainTemplate.njs': true,
    core: true,
  },
}
