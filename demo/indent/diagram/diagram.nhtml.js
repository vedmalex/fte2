module.exports = {
  chunks: "$$$main$$$",
  alias: ["model-root"],
  script: function(diagram, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === void 0 || ctx === null)
        ctx = diagram;
      return _content(blockName, ctx, content, partial, slot);
    }
    var out = [];
    const _partial = partial;
    partial = function(obj, template) {
      const result2 = _partial(obj, template);
      if (Array.isArray(result2)) {
        result2.forEach((r) => {
          chunkEnsure(r.name, r.content);
        });
        return "";
      } else {
        return result2;
      }
    };
    const main = "$$$main$$$";
    var current = main;
    let outStack = [current];
    let result;
    function chunkEnsure(name, content2) {
      if (!result) {
        result = {};
      }
      if (!result.hasOwnProperty(name)) {
        result[name] = content2 ? content2 : [];
      }
    }
    function chunkStart(name) {
      chunkEnsure(name);
      chunkEnd();
      current = name;
      out = [];
    }
    function chunkEnd() {
      result[current].push(...out);
      out = [];
      current = outStack.pop() || main;
    }
    chunkStart(main);
    chunkStart(`root.plantuml`);
    const association = {
      "inheritance": ["<|", "|>"],
      "composition": "*",
      "aggregation": "o",
      "navigable": ["<", ">"]
    };
    const dependency = {
      "implement": ["<|", "|>"],
      "depends": ["<", ">"]
    };
    out.push("\n");
    out.push("@startuml diagram\n");
    out.push("!theme sketchy-outline");
    diagram.namespaces.forEach((namespace) => {
      out.push("\n");
      out.push("package " + namespace.name + " {}");
    });
    diagram.things.forEach((thing) => {
      out.push("\n");
      out.push("class " + thing.thingType + " {\n");
      out.push("\n");
      out.push("}");
    });
    out.push("\n");
    out.push("\n");
    out.push("@enduml");
    chunkEnd();
    out = Object.keys(result).filter((i) => i !== "$$$main$$$").map((curr) => ({ name: curr, content: result[curr] }));
    if (out.some((t) => typeof t == "object")) {
      return out.map((chunk) => ({ ...chunk, content: Array.isArray(chunk.content) ? chunk.content.join("") : chunk.content }));
    } else {
      return out.join("");
    }
  },
  compile: function() {
    this.alias = ["model-root"];
  },
  dependency: {}
};
