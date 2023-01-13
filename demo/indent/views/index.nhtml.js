module.exports = {
  alias: ["index"],
  script: function(context, _content, partial, slot, options) {
    var out = [];
    out.push("<section>\n");
    out.push("  " + partial(context, "panel") + "\n");
    out.push("</section>\n");
    out.push("<section>\n");
    var extra = { title: "Another panel", body: "extra!!! content" };
    out.push("\n");
    out.push("  " + partial(extra, "panel") + "\n");
    out.push("</section>");
    return out.join("");
  },
  compile: function() {
    this.alias = ["index"];
    this.parent = "template.nhtml";
    this.mergeParent(this.factory.ensure(this.parent));
  },
  dependency: {
    "template.nhtml": true
  }
};
