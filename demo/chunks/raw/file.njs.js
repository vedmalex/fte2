module.exports = {
  chunks: "main.file.txt",
  script: function(context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === void 0 || ctx === null)
        ctx = context;
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
    const main = "main.file.txt";
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
    chunkStart("filename1.txt");
    out.push("\n");
    out.push("file1\n");
    out.push("\n");
    chunkStart("filename2.txt");
    out.push("\n");
    out.push("file2\n");
    out.push("\n");
    chunkStart("filename3.txt");
    out.push("\n");
    out.push("file3\n");
    out.push("\n");
    chunkEnd();
    out.push("\n");
    out.push("!!!\n");
    chunkStart("filename4.txt");
    out.push("\n");
    out.push("file4\n");
    out.push("\n");
    chunkStart("filename5.txt");
    out.push("\n");
    out.push("file5\n");
    out.push("\n");
    chunkStart("filename6.txt");
    out.push("\n");
    out.push("file6\n");
    chunkEnd();
    out = Object.keys(result).map((curr) => ({ name: curr, content: result[curr] }));
    if (out.some((t) => typeof t == "object")) {
      return out.map((chunk) => ({ ...chunk, content: Array.isArray(chunk.content) ? chunk.content.join("") : chunk.content }));
    } else {
      return out.join("");
    }
  },
  compile: function() {
  },
  dependency: {}
};
