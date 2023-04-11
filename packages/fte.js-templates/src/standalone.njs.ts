export default {
  alias: ['standalone.njs'],
  script: function (files, _content, partial, slot, options) {
    var out: Array<string> = []
    out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n")
    out.push('\n')
    out.push('const templates = {')
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push("  '" + files[i].name + "': require('" + files[i].path + "'),")
    }
    out.push('\n')
    out.push('}\n')
    out.push('\n')
    out.push('const F = new Factory(templates)\n')
    out.push('\n')
    out.push('module.exports = (context, name) => {\n')
    out.push('  return F.run( context, name )\n')
    out.push('}')
    return out.join('')
  },
  compile: function (this: {
    factory: {
      ensure: (template: string) => any
    }
    parent: string
    mergeParent: (template: any) => void
  }) {},
  dependency: {},
}