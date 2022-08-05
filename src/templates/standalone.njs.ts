export default {
  alias: ["standalone.njs"],
  script: function(files, _content, partial, slot, options) {
    var out = [];
    out.push(
      "const { Factory } = require('fte.js/lib/standalone.fte.js')\n\nconst templates = {\n"
    );
    for (let i = 0; i < files.length; i += 1) {
      out.push(
        "'" + files[i].name + "': require('" + files[i].path + "'),\n"
      );
    }
    out.push(
      "\n}\n\nconst F = new Factory(templates)\n\nmodule.exports = (context, name) => {\n  return F.run( context, name )\n}\n"
    );
    return out.join("");
  },
  compile: function() {
    this.alias = ["standalone.njs"];
  },
  dependency: {}
};
