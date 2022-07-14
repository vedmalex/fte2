<#@ alias 'MainTemplate.njs' #>
<#@ requireAs ('codeblock.njs','codeblock') #>
<#-
  function processRequire(item){
    var requires = item.name.split(',').map(function(i){return i.trim()})
    return {name:requires[0], alias:requires[1]}
  }

  function processContextName(item){
    return item.name.split(',')[0].trim()
  }

  function processAsync(item){
    return item.name.split(',')[0].trim()
  }

  function processAlias(item){
    return item.name.split(',').map(a => a.trim())
  }

  function processnoIndent(item){
    return !!item
  }

  var templateAlias = ''
  var reqList = []
  var contextName = 'context'
  var noIndent = false
  var alias = ''
  var useChunks = ''
  var inludeMainchunkInOutput = false
  var useHash = ''
  var item, directives = context.directives, extend = ''
  for (var i = 0, len = directives.length; i < len; i++) {
    item = directives[i]
    if(item.content.indexOf('extend') > -1){
      extend = item.name.trim()
    }
    if(item.content.indexOf('requireAs') > -1){
      reqList.push(processRequire(item))
    }
    if(item.content.indexOf('context') > -1){
      contextName = processContextName(item)
    }
    if(item.content.indexOf('noIndent') > -1){
      noIndent = processnoIndent(item)
    }
    if(item.content.indexOf('alias') > -1){
      alias = processAlias(item)
    }
    if(item.content.indexOf('chunks') > -1){
      useChunks = processAsync(item)
    }
    if(item.content.indexOf('includeMainChunk') > -1){
      inludeMainchunkInOutput = processnoIndent(item)
    }
    if(item.content.indexOf('useHash') > -1){
      useHash = !!item
    }
  }
-#>
{
<#- if(alias){
#> alias: #{JSON.stringify(alias)},
<#- }-#>
<# const useDirectContent = context.blocks || context.slots; #>
  script: function (#{contextName}, _content, partial, slot, options){
    function content(blockName, ctx) {
      if(ctx === undefined || ctx === null) ctx = #{contextName}
      return _content(blockName, ctx, content, partial, slot)
    }
    <#if(useChunks){#>
    const _partial = partial
    partial = function(obj, template) {
      const result = _partial(obj, template)
      if(Array.isArray(result)){
        result.forEach(r => {
          chunkEnsure(r.name, r.content)
        })
        return ''
      } else {
        return result
      }
    }
    const main = '#{useChunks}'
    var current = main
    let outStack = [current]
    let result

    function chunkEnsure(name, content) {
      if (!result) {
        result = {}
      }
      if (!result.hasOwnProperty(name)) {
        result[name] = content ? content : []
      }
    }
    function chunkStart(name) {
      chunkEnsure(name)
      chunkEnd()
      current = name
      out = []
    }
    function chunkEnd() {
      result[current].push(out)
      out = []
      current = outStack.pop() || main
    }

    <#}#>
    const { SourceNode } = require("source-map-generator")

    var out = []
    <#if(useChunks){#>
      chunkStart(main)
    <#}#>
    <#- var blocks = {blocks:context.main, noIndent:noIndent} -#>
    #{partial(blocks,'codeblock')}
    <#if(useChunks){#>
      chunkEnd()
      <#if(!useHash){#>
        out = Object.keys(result)
        <#if(!inludeMainchunkInOutput){#>
        .filter(i => i !== '#{useChunks}')
        <#}#>
        .map(curr => ({ name: curr, content: result[curr] }))
      <#} else {#>
        out = result
        <#if(!inludeMainchunkInOutput){#>
        delete out['#{useChunks}']
        <#}#>
      <#}#>
    <#}#>
     return out.join('\n')
  },
<#
  var cb = context.blocks
    if(cb) {-#>
  blocks : {
<#    for(var cbn in cb){ -#>
<#- var blockConetxtName = contextName
    var bdirvs = cb[cbn].directives
    var item = bdirvs[i]
    var blkNoIndent = false
    var blAsyncType = ''
    for(var i = 0, len = bdirvs.length; i < len; i++){
      item = bdirvs[i]
      if(item.content.indexOf('context') > -1){
        blockConetxtName = processContextName(item)
      }
      if(item.content.indexOf('noIndent') > -1){
        blkNoIndent = processnoIndent(item)
      }
      if(item.content.indexOf('async') > -1){
        blAsyncType = processAsync(item)
      }
    }
-#>
    "#{cbn}": function(#{blockConetxtName},  _content, partial, slot){
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = #{contextName}
        return _content(blockName, ctx, content, partial, slot)
      }
      var {applyIndent, escapeIt} = options
      var out = []
      <#- var blocks = {blocks :cb[cbn].main, noIndent:blkNoIndent} -#>
      #{partial(blocks, 'codeblock')}
      return out.join('\n')
    },
<#      }-#>
  },
<#-  } -#>
<#
    var cb = context.slots
if(cb) {-#>
  slots : {
<#    for(var cbn in cb){ -#>
<#- var blockConetxtName = contextName
    var bdirvs = cb[cbn].directives
    var item = bdirvs[i]
    var blkNoIndent = false
    var blAsyncType = ''
    for(var i = 0, len = bdirvs.length; i < len; i++){
      item = bdirvs[i]
      if(item.content.indexOf('context') > -1){
        blockConetxtName = processContextName(item)
      }
      if(item.content.indexOf('noIndent') > -1){
        blkNoIndent = processnoIndent(item)
      }
      if(item.content.indexOf('async') > -1){
        blAsyncType = processAsync(item)
      }
    }
-#>
    "#{cbn}": function(#{blockConetxtName},  _content, partial, slot){
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = #{contextName}
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      <#- var blocks = {blocks :cb[cbn].main, noIndent:blkNoIndent} -#>
      #{partial(blocks, 'codeblock')}
      return out.join('\n')
    },
<#      }-#>
  },
<#-  } -#>
  compile: function() {
<#- if(alias){#>
    this.alias = #{JSON.stringify(alias)}
<#- }-#>
<#-  if(reqList.length > 0) { -#>
    this.aliases={}
<# var rq
  for (var i = 0, len = reqList.length; i < len; i++) {
    rq = reqList[i]
-#>
    this.aliases["#{rq.alias}"] = "#{rq.name}"
    this.factory.ensure("#{rq.name}")
<#
  }
}-#>

<#-if(extend) {#>
    this.parent = #{JSON.stringify(extend)}
    this.mergeParent(this.factory.ensure(this.parent))
<#}-#>
  },
  dependency: {
  <# if(extend) {-#>
    #{JSON.stringify(extend)}: 1,
  <# }-#>
<#- if(reqList.length > 0) {
  for (var i = 0, len = reqList.length; i < len; i++) {
    rq = reqList[i]
-#>
    "#{rq.name}": 1,
<#
  }
}-#>
  }
}
