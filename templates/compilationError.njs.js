module.exports = {
  script: function (context, _content, partial, slot) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null)
        ctx = context;
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = '';
    out += context.error.message;
    out += ';\n';
    out += context.compiledFile;
    out += ';';
    return out
  },
  compile: function () {
  },
  dependency: {}
}