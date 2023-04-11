module.exports = {
  alias: ["panel"],
  script: function(panel, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === void 0 || ctx === null)
        ctx = panel;
      return _content(blockName, ctx, content, partial, slot);
    }
    var out = [];
    out.push('<div class="panel panel-default">\n');
    out.push(options.applyIndent(content("title", panel.title), "  ") + "\n");
    out.push(options.applyIndent(content("body", panel.body), "  ") + "\n");
    out.push(options.applyIndent(content(), "  ") + "\n");
    out.push("</div>");
    return out.join("");
  },
  blocks: {
    "title": function(title, _content, partial, slot, options) {
      var out = [];
      out.push('<div class="panel-heading">\n');
      out.push("  <p> text </p>\n");
      out.push('  <h3 class="panel-title">' + title + "</h3>\n");
      out.push("</div>");
      return out.join("");
    },
    "body": function(body, _content, partial, slot, options) {
      var out = [];
      out.push('<div class="panel-body">\n');
      out.push(options.applyIndent(body, "  ") + "\n");
      out.push("</div>");
      return out.join("");
    }
  },
  compile: function() {
    this.alias = ["panel"];
  },
  dependency: {}
};
