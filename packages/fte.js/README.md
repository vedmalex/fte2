# fte.js - fast template engine that is reborn
[ɛftiː ʤeɪ-ɛs]
!!! Why only generate Web-pages??? [re-]Generate the code!!!

## write [code] -> [build your] template -> [then code]generate

## Features

  - template inheritance
  - codeblocks with parameters and directives
  - partials (works with templates that haven't use chunks)
  - partial with aliases
  - directives
  - progressive template caching
  - smart block indentation
  - multiple root folders
  - pure javascript code
  - smart templates
  - nice code generation for templates
  - posible to load js function as tempaltes.
  - template caching by default
  - one of the fastest tempalte code geneation
  - simple code generation for template engine - it is genereate itself using fTE.js
  - syntax highlight for sublime-text
  - factory-level aliases global aliases

  - configurable escaped blocks

## Furure

 - browser support
 - template packaging using webpack/gulp ... whatever

## Syntax

- `<#` - open code block

- `#>` - close code block

- `<#-` - remove all spaces to left including the one `\n`

- `-#>` - remove all spaces to right including the one `\n`

- `#{} or {{}}`  - expression block that returns string

- `!{} or {{& }}` - html(!!!) escaped expression block: replaces & < > " => `&amp;` `&lt;` `&gt;` `&quote;`

- `<#@ #>` directive block, by default it ommits all spaces and new lines, as if it is never exists.

- Template block

```
<# block 'name': #>
<# end #>

```

To render block
`#{content('codeblock')}}`
`#{content('codeblock', context)}}`

- partial
  #{partial(blocks,'codeblock')}}

## Directives

Syntax

`<#@ directiveName ("params", "params", "params") #>`

`<#@ directiveName "params" #>`

`<#@ directiveName  #>`

! In directives syntax you can use both single quote and double quote.

- `noIndent` -- not use indentaion functinality speedup a little bit

- `requireAs ('templateName', 'alias')` -- require template with alias name. to use with `#{partial(context,'name')}`.

- `context 'name` | `context('name')` -- set up default context name for generated code.

- `alias 'name` | `alias('name')` -- setup global alias name from

- `extend 'alias|templatePath'` - inherite from specified template

## Samples

For more copmplex example see `sample/complexSample` folder in project root

Escapes output from `template-benchamrk`

```html
<#@ context 'data' #>
<html>
  <head>
    <title>!{data.title}</title>
  </head>
  <body>
    <p>!{data.text}</p>
    <#- if (data.projects.length) { -#>
      <#- for (var i = 0; i < data.projects.length; i++) { -#>
        <a href="!{data.projects[i].url}">!{data.projects[i].name}</a>
        <p>!{data.projects[i].description}</p>
      <#- } -#>
    <#- } else { -#>
      No projects
    <#- } -#>
  </body>
</html>
```

Unespaced output from `tempalte-benchamrk`

```html
<#@ context 'data' #>
<html>
  <head>
    <title>#{data.title}</title>
  </head>
  <body>
    <p>#{data.text}</p>
    <# if (data.projects.length) { #>
      <# for (var i = 0; i < data.projects.length; i++) { #>
        <a href="#{data.projects[i].url}">#{data.projects[i].name}</a>
        <p>#{data.projects[i].description}</p>
      <# } #>
    <# } else { #>
      No projects
    <# } #>
  </body>
</html>
```

## Usage on node.js

### install

`npm install fte.js --save`

### use

```javascript

var fte = require('fte.js').Factory;
var tempaltes = new fte({
  root:['tempaltes','other templates'],
  watch: false // progressive template caching disabled;
});

var result = tempaltes.run({hello:'World'}, 'tempalteName');

```

### API

`Factory` - template Factory iteself

`compileLight` - generate template as closure function.

`compileFull` - generate template as module.

method signature `(content:string[, optimize:bool])`

it accept tempalte code and return function code to be used within `fte.js` Factory.

`optimize`-option will run esmangle over the code with thwo options:
'remove-empty-statement' and 'remove-unreachable-branch'.
You alwais can build yout own compiler, just see the source.

### expression blocks

Both of them is used only to displaying the data.
so didn't use them to prepare complex values

```javascript
#{ partial({some:another},'partial')} // this will drive to error;
```

instad of it

```javascript
<# var extra = {some:another} #>
#{ partial(extra,'partial')} // this will not drive to error;
```

### factory level aliases

Factory must be configured to scan over all files to load all templates and extract all aliases

```javascript
var fte = require('fte.js').Factory;
var tempaltes = new fte({
  root:['tempaltes','other templates'],
  watch: false, // progressive template caching disabled;
  preload: true, // be default it aliases available only after manual loading.
  ext: ['.nhtml', 'njs'], // lis of extentions that is available for file search.
});
```

### codeblocks

The codeblock is a part of the tempalte that you want to reuse multiple times, with different context. It is just like a partials, but with different behaviours.

Block can be overriden during inheritance,

directives in next blocks: `context` and `noIndent`.

### inheritance

to inherite from other template please ensure that it has a content-call `#{content()}`
during inheritance you can override and reuse in resulting tempalte all the things:

- reuse required templates with its aliase
- override partials that ws required with parent templates
- reuse defined block
- override template blocks

base.html

```html
<div class="panel-heading">
  <h3 class="panel-title">#{context.title}</h3>
  #{content()}
</div>

```

container.html

```html
<#@ extend 'base.html' #>
<div>
  #{content('header', context.head)}
</div>
<div>
  #{content()}
</div>
```

## Progresinve template caching

by setup `watch:true` in configuration of fte factory, you can achieve progressive tamplate caching. Factory will watch for changing files and it any changes appering in the already loaded files it will reset cache options for it. So in the next time, when changed template will be used it will load new version of template and recomplile it. The main feature is that if the template has any dependency then if one of its dependency is changed this template will also removed from cache.

## Speed Test

I've posted result here.
the only difference in speed is the escape function.
[template-benchamrk](https://github.com/vedmalex/template-benchmark)

64-bit Ubuntu 16.04 LTS
Intel core i7-3632QM CPU @ 2.20GHz x 8, SSD 250G
Nodejs v6.21

> Rendering 100000 templates:

```
Gaikan
  Escaped   : 1651ms
  Unescaped : 52ms
  Total     : 1703ms

ECT
  Escaped   : 1473ms
  Unescaped : 100ms
  Total     : 1573ms

fTE.js
  Escaped   : 1451ms
  Unescaped : 80ms
  Total     : 1531ms

doT
  Escaped   : 2078ms
  Unescaped : 49ms
  Total     : 2127ms

Dust
  Escaped   : 1950ms
  Unescaped : 416ms
  Total     : 2366ms

Hogan.js
  Escaped   : 1918ms
  Unescaped : 324ms
  Total     : 2242ms

Fest
  Escaped   : 1825ms
  Unescaped : 235ms
  Total     : 2060ms

EJS
  Escaped   : 6623ms
  Unescaped : 2289ms
  Total     : 8912ms

Eco
  Escaped   : 4313ms
  Unescaped : 764ms
  Total     : 5077ms

Handlebars.js
  Escaped   : 5187ms
  Unescaped : 2530ms
  Total     : 7717ms

Jade without `with`
  Escaped   : 6087ms
  Unescaped : 1826ms
  Total     : 7913ms

CoffeeKup
  Escaped   : 2555ms
  Unescaped : 6623ms
  Total     : 9178ms

Jade
  Escaped   : 14454ms
  Unescaped : 9594ms
  Total     : 24048ms
```

## Inspiration

It inspired by [nJSt](https://github.com/unclechu/node-njst) and [ect](https://github.com/baryshev/ect)
it is build using [pegjs](https://github.com/pegjs/pegjs)
