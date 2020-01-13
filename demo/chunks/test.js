var Factory = require('../../dist/node').Factory;
var fs = require('fs-extra');
var s;
var raw = new Factory({
  root: 'raw',
  debug: true,
});

debugger;
s = raw.run({}, 'index.njs');
s.forEach(f => {
  debugger;
  fs.writeFileSync(f.name, f.content);
});
