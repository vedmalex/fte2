module.exports = {
  alias: ['compilationError.njs'],
  script: function (context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    out.push(context.error.message + ';\n' + '' + context.compiledFile + ';\n')
    return out.join('\n')
  },
  compile: function () {
    this.alias = ['compilationError.njs']
  },
  dependency: {},
}
