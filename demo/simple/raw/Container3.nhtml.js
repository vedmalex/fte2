module.exports = {
  script: function (context, _content, partial) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null)
        ctx = context;
      return _content(blockName, ctx, content, partial)
    }
    var out = '';
    out += '<div>\n  <p>\n  ';
    if (context == 'Santa') {
      out += '    Hello Dear';
      out += ' ' + context;
      out += '!'
    } else {
      out += '    Hello';
      out += ' ' + context;
      out += '!'
    }
    out += '\n  </p>\n</div>\n';
    return out
  },
  compile: function () {
  },
  dependency: {}
}