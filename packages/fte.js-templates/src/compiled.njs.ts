import type { TemplateBase } from 'fte.js-base'
export default {
  alias: ['compiled.njs'],
  aliases: {
    core: 'MainTemplate.njs',
  },
  script: function (context, _content, partial, slot, options) {
    const coreOptions =
      options && options.sourceMap
        ? {
            sourceMap: true,
            sourceFile: options.sourceFile,
            sourceRoot: options.sourceRoot,
            inline: options.inline,
          }
        : undefined
    const core: any = partial(context, 'core', coreOptions) as any
    const code: any = typeof core === 'string' ? core : core && core.code
    if (typeof code !== 'string') {
      throw new Error('compiled.njs: core template returned invalid result')
    }
    if (typeof core === 'string') {
      return 'module.exports = ' + code + ';'
    } else {
      return {
        code: 'module.exports = ' + code + ';',
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
