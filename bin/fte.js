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
  .argument('[dest]', 'destination file', './templates.js')
  .option('-t, --ts', 'use typescript', false)
  .option('-o, --single', 'use single file output mode', false)
  .option('-f, --file', ' single file output mode name', 'index')
  .option('-e, --ext', ' extension for file', '')
  .option('-s, --sa', 'use standalone mode', false)
  .option('-m, --minify', 'need to be minified', true)
  .option('-p, --pretty', 'need to be prettied', true)
  .action(function (tempalates, dest, options) {
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
