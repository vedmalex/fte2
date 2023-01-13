module.exports = {
  alias: ["panel_e"],
  script: function(panel, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === void 0 || ctx === null)
        ctx = panel;
      return _content(blockName, ctx, content, partial, slot);
    }
    var out = [];
    out.push("<div>\n");
    out.push("  <p>\n");
    out.push("    extended panel\n");
    out.push("  </p>\n");
    out.push("</div>\n");
    return out.join("");
  },
  compile: function() {
    this.alias = ["panel_e"];
    this.parent = "panel.nhtml";
    this.mergeParent(this.factory.ensure(this.parent));
  },
  dependency: {
    "panel.nhtml": true
  }
};
