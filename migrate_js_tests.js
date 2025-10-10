const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Get all JavaScript test files
const files = execSync('find packages -name "*.test.js" -o -name "*.spec.js"', {
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .filter((f) => f && fs.existsSync(f))

console.log(`Found ${files.length} JavaScript test files`)

let processed = 0
files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8')
  let modified = false

  // Add bun:test import if not exists
  if (
    !content.includes('import { test, expect, describe } from "vitest"') &&
    (content.includes('describe(') ||
      content.includes('test(') ||
      content.includes('it(') ||
      content.includes('expect('))
  ) {
    // Find the right place to insert import
    const lines = content.split('\n')
    let insertIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line && !line.startsWith('//') && !line.startsWith('/*')) {
        if (
          line.startsWith('import ') ||
          line.startsWith('const ') ||
          line.startsWith('require(')
        ) {
          insertIndex = i
          break
        } else if (insertIndex === 0) {
          insertIndex = i
          break
        }
      }
    }

    lines.splice(
      insertIndex,
      0,
      'import { test, expect, describe } from "vitest";',
    )
    content = lines.join('\n')
    modified = true
  }

  // Replace 'it(' with 'test(' if exists (but not inside strings)
  if (content.includes('  it(')) {
    content = content.replace(/(\s+)it\(/g, '$1test(')
    modified = true
  }

  if (modified) {
    fs.writeFileSync(file, content)
    processed++
    console.log(`Modified: ${file}`)
  }
})

console.log(`Processed ${processed} JavaScript test files`)
