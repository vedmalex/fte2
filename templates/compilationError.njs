<#@ alias 'compilationError.njs' #>
<#@ noEscape #>
<#@ noContent #>
#{context.error.message};
#{context.compiledFile};