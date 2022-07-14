module.exports = {
  alias: ['compilationError.njs'],
  script: function (context, _content, partial, slot, options) {
    var { applyIndent, escapeIt } = options
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    const { SourceNode } = require('source-map-generator')
    var out = []
    out.push(`
     ${context.error.message};
     ${context.compiledFile};`)
    return out.join('\n')
  },
  compile: function () {
    this.alias = ['compilationError.njs']
  },
  dependency: {},
}
