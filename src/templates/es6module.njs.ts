export default {
  alias: ["es6module.njs"],
  script: function(context, _content, partial, slot, options) {
    var out = [];
    out.push(
      "export default " + partial(context, "core") + ";\n"
    );
    return out.join("");
  },
  compile: function() {
    this.alias = ["es6module.njs"];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    "core": true
  }
};
