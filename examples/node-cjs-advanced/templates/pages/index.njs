<#@ context 'context' #>
<#@ requireAs('partials/header.njs','header') #>
<#@ requireAs('partials/footer.njs','footer') #>
<#@ chunks 'index.html' #>
<#@ alias 'index.njs' #>

<# block 'head': #>
  <title>Hello !{context.name}</title>
<# end #>

<# block 'body': #>
  <h1>Hello !{context.name}</h1>
  #{partial(context, 'header')}
  <div>
    <# for (let i = 0; i < 3; i++) { #>
    <p>Row #{i}</p>
    <# } #>
  </div>
  #{partial(context, 'footer')}
<# end #>
