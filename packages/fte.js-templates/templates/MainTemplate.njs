<*
  основной шаблон для кодогенерации
  создает структуру кода, для последующей интеграции в другие модули
*>
<#@ alias 'MainTemplate.njs' #>
<#@ requireAs ('codeblock.njs','codeblock') #>

<#-
const { directives } = context
-#>
{
<#- if(directives.chunks){#>
chunks: #{JSON.stringify(directives.chunks)},
<#-}#>
<#- if(directives.alias){#>
alias: #{JSON.stringify(directives.alias)},
<#-}#>

<# block 'maincontent' : #>
<#@ context 'directives'#>
<#@ noContent #>
<#- if(directives?.content){ -#>
function content(blockName, ctx) {
  if(ctx === undefined || ctx === null) ctx = #{directives.context}
  return _content(blockName, ctx, content, partial, slot)
}
<#-}#>
<# end #>
<# block 'chunks-start' : #>
  <#@ context 'directives'#>
  <#@ noContent #>
  <#- if(directives.chunks){#>
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
const main = '#{directives.chunks}'
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
  result[current].push(...out)
  out = []
  current = outStack.pop() || main
}
chunkStart(main)
<#-}#>
<# end #>
<# block 'chunks-finish' : #>
  <#@ context 'directives'#>
  <#@ noContent #>
  <#- if(directives.chunks){#>
    chunkEnd()
    <#- if(!directives.useHash){#>
    out = Object.keys(result)
      <#- if(!directives.includeMainChunk){#>
      .filter(i => i !== '#{directives.chunks}')
      <#-}#>
      .map(curr => ({ name: curr, content: result[curr] }))
      <#-} else {#>
    out = result
      <#-if(!directives.includeMainChunk){#>
    delete out['#{directives.chunks}']
      <#-}#>
    <#-}#>
  <#-}#>
<# end #>
  script: function (#{directives.context}, _content, partial, slot, options){
    #{content('maincontent', directives)}
    var out = []

    const partialOptions = {
      ...options,
      sourceMap: options.sourceMap,
      sourceFile: options.sourceFile,
      sourceRoot: options.sourceRoot,
      inline: options.inline,
    }

    #{content('chunks-start', directives)}
    <# const __main = partial(context.main,'codeblock', partialOptions) #>
    #{ typeof __main === 'string' ? __main : __main.code }
    #{content('chunks-finish', directives)}
    <#-if(directives.chunks){#>
    if(out.some(t=>typeof t == 'object')){
      return out.map(chunk=>
          ({...chunk,
            content:
            <#- if( directives.deindent ){#> options.applyDeindent(<#}#>
            Array.isArray(chunk.content)
              ? chunk.content.join('')
              : chunk.content
            <#-if( directives.deindent ){#>)<#}#>
          })
      )
    }
    <#-}#>

    const __mainMap = typeof __main === 'string' ? undefined : __main.map
    const __result = out.join('')
    if (__mainMap) {
      return { code: __result, map: __mainMap }
    }
    return { code: __result }
  },
<#-
const blockNames = Object.keys(context.blocks)
if(blockNames.length > 0) {#>
  blocks : {
<#-
  for(let i = 0; i < blockNames.length; i+=1) {
    const block = context.blocks[blockNames[i]]
#>
    "#{blockNames[i]}": function(#{block.directives.context},  _content, partial, slot, options) {
      #{content('maincontent', block.directives)}
      var out = []
      <# const __block = partial(block.main, 'codeblock', partialOptions) #>
      #{ typeof __block === 'string' ? __block : __block.code }
      <#-if(directives.chunks){#>
      if(out.some(t=>typeof t == 'object')){
        return out.map(chunk=>
            ({...chunk,
              content:
              <#- if( directives.deindent ){#> options.applyDeindent(<#}#>
              Array.isArray(chunk.content)
                ? chunk.content.join('')
                : chunk.content
              <#-if( directives.deindent ){#>)<#}#>
            })
        )
      } else {
        return <# if( directives.deindent ){#> options.applyDeindent(<#}#>out<#-if( directives.deindent ){#>)<#}#>.join('')
      }
      <#-} else {#>
        return <# if( directives.deindent ){#> options.applyDeindent(<#}#>out<#-if( directives.deindent ){#>)<#}#>.join('')
      <#- }#>
    },
<#- }#>
  },
<#-}#>
<#-
const slotNames = Object.keys(context.slots)
if(slotNames.length > 0) {#>
  slots : {
<#-
  for(let i = 0; i < slotNames.length; i+=1){
    const slot = context.slots[slotNames[i]]
#>
    "#{slotNames[i]}": function(#{slot.directives.context},  _content, partial, slot, options){
      #{content('maincontent', slot.directives)}
      var out = []
      <# const __slot = partial(slot.main, 'codeblock', partialOptions) #>
      #{ typeof __slot === 'string' ? __slot : __slot.code }
      <#- if(directives.chunks){#>
      if(out.some(t=>typeof t == 'object')){
        return out.map(chunk=>
            ({...chunk,
              content:
              <#- if( directives.deindent ){#> options.applyDeindent(<#}#>
              Array.isArray(chunk.content)
                ? chunk.content.join('')
                : chunk.content
              <#-if( directives.deindent ){#>)<#}#>
            })
        )
      } else {
        return <# if( directives.deindent ){#> options.applyDeindent(<#}#>out<#-if( directives.deindent ){#>)<#}#>.join('')
      }
      <#- } else {#>
        return <# if( directives.deindent ){#> options.applyDeindent(<#}#>out<#-if( directives.deindent ){#>)<#}#>.join('')
      <#- }#>
    },
<#-}#>
  },
<#- } #>
  compile: function() {
<#- if(directives.alias){#>
    this.alias = #{JSON.stringify(directives.alias)}
<#- }#>
<#-  if(directives.requireAs.length > 0) { #>
    this.aliases={}
<#- var rq
  for (var i = 0, len = directives.requireAs.length; i < len; i++) {
    rq = directives.requireAs[i]
#>
    this.aliases["#{rq.alias}"] = "#{rq.name}"
    this.factory.ensure("#{rq.name}")
<#-
  }
}#>

<#- if(directives.extend) {#>
    this.parent = #{JSON.stringify(directives.extend)}
    this.mergeParent(this.factory.ensure(this.parent))
<#- }#>
  },
  dependency: {
  <#- if(directives.extend) {#>
    #{JSON.stringify(directives.extend)}: true,
  <#- }#>
<#- if(directives.requireAs.length > 0) {
  for (var i = 0, len = directives.requireAs.length; i < len; i++) {
    rq = directives.requireAs[i]
#>
    "#{rq.name}": true,
    "#{rq.alias}": true,
<#-
  }
}#>
  }
}
