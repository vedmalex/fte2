module.exports = {
  script: function (context, _content, partial) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null)
        ctx = context;
      return _content(blockName, ctx, content, partial)
    }
    let current = '--main--';
    let outStack = [current];
    let result;
    function chunkEnsure(name) {
      if (!result) {
        result = {}
      }
      if (!result.hasOwnProperty(name)) {
        result[name] = ''
      }
    }
    function chunkStart(name) {
      chunkEnd();
      chunkEnsure(current);
      result[current] += out;
      chunkEnsure(name);
      result[name] = out = '';
      outStack.push(name);
      current = name
    }
    function chunkEnd() {
      chunkEnsure(current);
      result[current] += out;
      if (outStack.length > 1) {
        current = outStack.pop()
      } else {
        current = outStack[0]
      }
      out = ''
    }
    var out = '';
    out += '\n';
    chunkStart('filename1.txt');
    out += '\nfile1\n\n';
    chunkStart('filename2.txt');
    out += '\nfile2\n\n';
    chunkStart('filename3.txt');
    out += '\nfile3\n\n';
    chunkStart('filename4.txt');
    out += '\nfile4\n\n';
    chunkStart('filename5.txt');
    out += '\nfile5\n\n';
    chunkStart('filename6.txt');
    out += '\nfile6\n';
    chunkEnd();
    out = result;
    out = Object.keys(result).filter(i => i !== '--main--').map(curr => ({
      name: curr,
      content: result[curr]
    }));
    return out
  },
  compile: function () {
  },
  dependency: {}
}