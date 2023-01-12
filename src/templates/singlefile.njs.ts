export default {
  alias: ["singlefile.njs"],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n");
    out.push("\n");
    out.push("const templates = {\n");
    files.forEach((file) => {
      out.push("['" + (file.template.alias || file.name) + "']: " + partial(file.template, "core") + ",\n");
    });
    out.push("\n");
    out.push("}\n");
    out.push("\n");
    out.push("exports.templates = templates\n");
    out.push("const F = new Factory(templates)\n");
    out.push("\n");
    out.push("function run(context, name){\n");
    out.push("  return F.run( context, name )\n");
    out.push("}\n");
    out.push("\n");
    out.push("exports.run = run\n");
    return out.join("");
  },
  compile: function() {
    this.alias = ["singlefile.njs"];
    this.aliases = {};
    this.aliases["core"] = "MainTemplate.njs";
    this.factory.ensure("MainTemplate.njs");
  },
  dependency: {
    "MainTemplate.njs": true,
    "core": true
  }
};
