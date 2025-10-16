const { Parser } = require('./packages/fte.js-parser/dist/index.js');
const fs = require('fs');

try {
  const template = fs.readFileSync('debug_template.njs', 'utf8');
  console.log('Template:');
  console.log(JSON.stringify(template));
  console.log('\n--- Parsed result ---');

  const result = Parser.parse(template);
  console.log('Main content:');
  result.main.forEach((item, i) => {
    console.log(`${i}: ${item.type} - start:'${item.start}' end:'${item.end}' content:'${item.content.replace(/\n/g, '\\n').replace(/\s+/g, ' ')}'`);
  });

} catch (e) {
  console.error('Error:', e.message);
  console.error(e.stack);
}
