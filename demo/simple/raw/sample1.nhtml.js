module.exports = {
  script: function (context, _content, partial) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial)
    }
    var out = ''
    if (!some) {
      out += 'else '
    }
    out += "if(filters.hasOwnProperty('"
    out += allNonEmbedded[i].to
    out += "')){\n        filter = filters['"
    out += allNonEmbedded[i].to
    out += "'];\n"
    return out
  },
  compile: function () {},
  dependency: {},
}
