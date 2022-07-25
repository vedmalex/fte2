<#@ alias 'MainTemplate.njs' #>
<#@ requireAs ('codeblock.njs','codeblock') #>
<#-
  function processRequire(directive){
    return {name:directive.name, alias:directive.params[0]}
  }

  var reqList = []
  var contextName = 'context'
  var noIndent = false
  var alias = ''
  var useChunks = ''
  var inludeMainchunkInOutput = false
  var useHash = false
  var item, directives = context.directives, extend = ''
  let { noContent } = context
  for (var i = 0, len = directives.length; i < len; i++) {
    item = directives[i]
    if(item.name === 'extend'){
      extend = item.name.trim()
    }
    if(item.name === 'requireAs'){
      reqList.push(processRequire(item))
    }
    if(item.name === 'context'){
      contextName = item.params[0]
    }
    if(item.name ==='noIndent'){
      noIndent = true
    }
    if(item.name ==='alias'){
      alias = item.params[0]
    }
    if(item.name ==='chunks'){
      useChunks = item.params[0]
    }
    if(item.name ==='includeMainChunk'){
      inludeMainchunkInOutput = true
    }
    if(item.name ==='useHash'){
      useHash = !!item
    }
  }
-#>
{
<#- if(alias){
#> alias: #{JSON.stringify(alias)},
<#- }-#>
  script: function (#{contextName}, _content, partial, slot, options){
    var {applyIndent, escapeIt} = options
    <#if(noContent){#>
    function content(blockName, ctx) {
      if(ctx === undefined || ctx === null) ctx = #{contextName}
      return _content(blockName, ctx, content, partial, slot)
    }
    <#}#>
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
<#for(var cbn in cb){ -#>
<#- var blockConetxtName = contextName
    var bdirvs = cb[cbn].directives
    var item = bdirvs[i]
    var blkNoIndent = false
    for(var i = 0, len = bdirvs.length; i < len; i++){
      item = bdirvs[i]
      if(item.name === 'context'){
        blockConetxtName = item.params[0]
      }
      if(item.name === 'noIndent'){
        blkNoIndent = true
      }
    }
-#>
    "#{cbn}": function(#{blockConetxtName},  _content, partial, slot, options){
      <#if(noContent){#>
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = #{contextName}
        return _content(blockName, ctx, content, partial, slot)
      }
      <#}#>
      var {applyIndent, escapeIt} = options
      var out = []
      <#- var blocks = {blocks :cb[cbn].main, noIndent:blkNoIndent} -#>
      #{partial(blocks, 'codeblock')}
      return out.join('\n')
    },
<#}-#>
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
    for(var i = 0, len = bdirvs.length; i < len; i++){
      item = bdirvs[i]
      if(item.name === 'context'){
        blockConetxtName = item.params[0]
      }
      if(item.name === 'noIndent'){
        blkNoIndent = true
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
