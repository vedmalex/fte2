#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const { build } = require('../dist/build')
const { Command } = require('commander')
const program = new Command()

program
  .name('fte.js')
  .description('tempalte generator engine for faster template processing')
  .version(
    JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')))
      .version,
  )

program
  .command('bundle')
  .argument('[tempalates]', 'templates root folder', './templates')
  .argument('[dest]', 'destination path')
  .option('--typescript', 'use typescript', false)
  .option('--single', 'use single file output mode', false)
  .option('--file <filename>', ' single file output mode name', 'index')
  .option('--ext <ext>', ' extension for file', '')
  .option('--standalone', 'use standalone mode', false)
  .option('--minify', 'need to be minified', false)
  .action(function (tempalates, dest, options) {
    if (!dest) {
      dest = tempalates
    }
    build(
      `${path.resolve(process.cwd(), tempalates)}`,
      `${path.resolve(process.cwd(), dest)}`,
      options,
      (err) => {
        if (err) {
          console.log(err)
          process.exit(1)
        } else {
          process.exit(0)
        }
      },
    )
  })

program.parse()
