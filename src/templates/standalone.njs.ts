export default {
  alias: ["standalone.njs"],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n");
    out.push("\n");
    out.push("const templates = {\n");
    for (let i = 0; i < files.length; i += 1) {
      out.push("'" + files[i].name + "': require('" + files[i].path + "'),\n");
    }
    out.push("\n");
    out.push("}\n");
    out.push("\n");
    out.push("const F = new Factory(templates)\n");
    out.push("\n");
    out.push("module.exports = (context, name) => {\n");
    out.push("  return F.run( context, name )\n");
    out.push("}\n");
    return out.join("");
  },
  compile: function() {
    this.alias = ["standalone.njs"];
  },
  dependency: {}
};
