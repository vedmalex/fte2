module.exports = {
  alias: ['compilationError.njs'],
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push(
      '\n' +
        '' +
        '\n' +
        '' +
        '\n' +
        '' +
        context.error.message +
        ';\n' +
        '' +
        context.compiledFile +
        ';\n',
    )
    return out.join('\n')
  },
  compile: function () {
    this.alias = ['compilationError.njs']
  },
  dependency: {},
}
