var Factory = require('../../dist/node').Factory;
var fs = require('fs-extra');
var s;
var raw = new Factory({
  root: 'raw',
  debug: true,
});

s = raw.blocksToFiles({ content: 'TEXT', title: 'Some Title', header: 'this is the header', greetings: 'Santa' }, 'file.njs');
s.forEach(f => {
  fs.writeFileSync(f.file, f.content);
})