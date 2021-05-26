module.exports = {
  alias: ['compilationError.njs'],
  script: function (context, _content, partial, slot) {
    var out = ''
    try {
      var line
      var column
      /*2:1*/
      line = 2
      column = 1
      out += context.error.message
      /*2:25*/
      line = 2
      column = 25
      out += ';\n'
      /*3:1*/
      line = 3
      column = 1
      out += context.compiledFile
      /*3:24*/
      line = 3
      column = 24
      out += ';'
    } catch (e) {
      throw new Error(`
       error at ${line}:${column}
       message: ${e.message}
       stack: ${e.stack}
     `)
    }
    return out
  },
  compile: function () {
    this.alias = ['compilationError.njs']
  },
  dependency: {},
}
