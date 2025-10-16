// Test the template compilation
const fte = require('./packages/fte.js/dist/index.js').fte;

try {
  const template = `"#{rel.to}
        <#- if(variant!== "*"){ -#>
          #{rel.relName.split('.').join('')}
        <#-}#>"`;

  console.log('Template:');
  console.log(template);
  console.log('\n--- Compiling ---');

  // Compile the template
  const compiled = fte([template]);

  console.log('\n--- Testing with different contexts ---');

  // Test case 1: variant !== "*"
  const result1 = compiled({
    rel: { to: 'User', relName: 'posts.author' },
    variant: 'detail'
  });
  console.log('Test 1 (variant="detail"):', JSON.stringify(result1));

  // Test case 2: variant === "*"
  const result2 = compiled({
    rel: { to: 'User', relName: 'posts.author' },
    variant: '*'
  });
  console.log('Test 2 (variant="*"):', JSON.stringify(result2));

  // Test case 3: Another example
  const result3 = compiled({
    rel: { to: 'Post', relName: 'author.profile' },
    variant: 'list'
  });
  console.log('Test 3 (variant="list"):', JSON.stringify(result3));

} catch (e) {
  console.error('Error:', e.message);
  console.error(e.stack);
}
