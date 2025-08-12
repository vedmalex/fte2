<#@ noContent #>
{
  "name": "#{context.name.toLowerCase()}",
  "version": "0.0.1",
  "private": "true",
  "dependencies": {
    "@grainjs/grainjs": "#{global.VERSION}"
  },
  "scripts": {
    "start": "npx grainjs edit",
    "start-mt-3": "npx grainjs editwt 3",
    "restore": "npx grainjs import",
    "debug": "node  --inspect-brk --trace-deprecation --trace-warnings ./node_modules/.bin/grainjs edit"
  }
}
