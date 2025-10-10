import type { TemplateBase } from 'fte.js-base'
export default {
  alias: ['singlefile.ts.njs'],
  aliases: {
    core: 'MainTemplate.ts.njs',
  },
  script: function (files, _content, partial, slot, options) {
    var out: Array<string> = []
    out.push('\n')
    out.push('\n')
    out.push('\n')
    out.push('\n')
    out.push('\n')
    out.push("import { TemplateBase } from 'fte.js-base'\n")
    out.push(
      'import { TemplateFactoryStandalone as Factory } from "fte.js-standalone";\n',
    )
    out.push('\n')
    out.push('export const templates = {\n')
    files.forEach((file) => {
      out.push('\n')
      out.push(
        "  ['" +
          (file.template.alias || file.name) +
          "']: " +
          partial(file.template, 'core') +
          ',\n',
      )
    })
    out.push('\n')
    out.push('}\n')
    out.push('\n')
    out.push('const F = new Factory(templates)\n')
    out.push('\n')
    out.push('export function run(context, name) {\n')
    out.push('  return F.run(context, name)\n')
    out.push('}\n')
    out.push('')
    return out.join('')
  },
  compile: function (this: TemplateBase) {
    this.factory.ensure('MainTemplate.ts.njs')
  },
  dependency: {
    'MainTemplate.ts.njs': true,
    core: true,
  },
}
