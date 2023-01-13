module.exports = {
  alias: ["template"],
  script: function(context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === void 0 || ctx === null)
        ctx = context;
      return _content(blockName, ctx, content, partial, slot);
    }
    var out = [];
    out.push("<!DOCTYPE html>\n");
    out.push('<html lang="en">\n');
    out.push("\n");
    out.push("  <head>\n");
    out.push("    <title>Starter plate</title>\n");
    out.push("  </head>\n");
    out.push("\n");
    out.push("  <body>\n");
    out.push(options.applyIndent(content("nav"), "    ") + "\n");
    out.push(options.applyIndent(content(), "    ") + "\n");
    out.push("  </body>\n");
    out.push("\n");
    out.push("</html>\n");
    return out.join("");
  },
  blocks: {
    "nav": function(context, _content, partial, slot, options) {
      var out = [];
      out.push('<nav class="navbar navbar-inverse navbar-fixed-top">\n');
      out.push('  <div class="container">\n');
      out.push('    <div class="navbar-header">\n');
      out.push('      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"\n');
      out.push('        aria-expanded="false" aria-controls="navbar">\n');
      out.push('        <span class="sr-only">Toggle navigation</span>\n');
      out.push('        <span class="icon-bar"></span>\n');
      out.push('        <span class="icon-bar"></span>\n');
      out.push('        <span class="icon-bar"></span>\n');
      out.push("      </button>\n");
      out.push('      <a class="navbar-brand" href="#">Project name</a>\n');
      out.push("    </div>\n");
      out.push('    <div id="navbar" class="collapse navbar-collapse">\n');
      out.push('      <ul class="nav navbar-nav">\n');
      out.push('        <li class="active"><a href="#">Home</a></li>\n');
      out.push('        <li><a href="#about">About</a></li>\n');
      out.push('        <li><a href="#contact">Contact</a></li>\n');
      out.push("      </ul>\n");
      out.push("    </div>\n");
      out.push("    <!--/.nav-collapse -->\n");
      out.push("  </div>\n");
      out.push("</nav>");
      return out.join("");
    }
  },
  compile: function() {
    this.alias = ["template"];
  },
  dependency: {}
};
