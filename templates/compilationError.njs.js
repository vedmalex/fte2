module.exports = {
  alias: ['compilationError.njs'],
  script: function (context, _content, partial, slot) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    out.push(context.error.message)
    out.push('\n')
    out.push(context.compiledFile)
    out.push(';')
    return out.join('\n')
  },
  compile: function () {
    this.alias = ['compilationError.njs']
  },
  dependency: {},
}
