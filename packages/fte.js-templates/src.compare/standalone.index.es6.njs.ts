import type { TemplateBase } from 'fte.js-base'
export default {
  alias: ['standalone.index.es6.njs'],
  script: function (files, _content, partial, slot, options) {
    var out: Array<string> = []
    out.push('\n')
    out.push('\n')
    out.push('\n')
    out.push('\n')
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push(
        '  import ' +
          files[i].name.replaceAll(/[\s.]/g, '_') +
          " from '" +
          files[i].path +
          "'\n",
      )
    }
    out.push('\n')
    out.push('\n')
    out.push('const templates = {\n')
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push(
        "  '" +
          files[i].name +
          "': " +
          files[i].name.replaceAll(/[\s.]/g, '_') +
          ',\n',
      )
    }
    out.push('\n')
    out.push('}\n')
    out.push('export default templates')
    return out.join('')
  },
  compile: function (this: TemplateBase) {},
  dependency: {},
}
