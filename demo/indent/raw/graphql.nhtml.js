module.exports = {
  script: function (context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === void 0 || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    out.push('  resolver: {')
    console.log('hellop')
    out.push('\n')
    out.push('    id: root => root._id,')
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}
