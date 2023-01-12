module.exports = {
  alias: ["compilationError.njs"],
  script: function(context, _content, partial, slot, options) {
    var out = [];
    out.push(context.error.message + ";\n");
    out.push(context.compiledFile + ";");
    return out.join("");
  },
  compile: function() {
    this.alias = ["compilationError.njs"];
  },
  dependency: {}
};
