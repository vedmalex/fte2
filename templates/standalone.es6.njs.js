module.exports = {
  alias: ["standalone.es6.njs"],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'");
    for (let i = 0; i < files.length; i += 1) {
      out.push("\n");
      out.push("  import " + files[i].name.replaceAll(/[\s\.]/g, "_") + " from '" + files[i].path + "'");
    }
    out.push("\n");
    out.push("\n");
    out.push("const templates = {");
    for (let i = 0; i < files.length; i += 1) {
      out.push("\n");
      out.push("  '" + files[i].name + "': " + files[i].name.replaceAll(/[\s\.]/g, "_") + ",");
    }
    out.push("\n");
    out.push("}\n");
    out.push("\n");
    out.push("const F = new Factory(templates)\n");
    out.push("\n");
    out.push("module.exports = (context, name) => {\n");
    out.push("  return F.run( context, name )\n");
    out.push("}");
    return out.join("");
  },
  compile: function() {
    this.alias = ["standalone.es6.njs"];
  },
  dependency: {}
};
