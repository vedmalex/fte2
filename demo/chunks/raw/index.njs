<#@ chunks 'index.txt' #>
<#@ noEscape #>
<#@ includeMainChunk #>

<# chunkStart("dir.txt") #>
#{partial(null,'file.njs')}