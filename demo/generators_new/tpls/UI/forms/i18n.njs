<#@ context "entity" -#>
<#@ alias 'forms-i18n' -#>
<# 
const rels = entity.props.filter(f=>f.ref).filter(r=>!r.single && !r.ref.embedded);
 #>

export default {
  resources: {
    #{entity.name}: {
      summary: '#{entity.UI.generalTab ||'Общая информация'}',
      name: '#{entity.title} |||| #{ entity.titlePlural || entity.plural }',
      fields: {

<#entity.props.forEach(f=>{
  if(!f.ref && !f.inheritedFrom){
-#>
        #{f.name}: '#{f.label}',
<#} else if(f.ref && !f.inheritedFrom) {-#>
        #{f.name}: '#{f.label}',
<#}
})-#>
      },
<# const hintList = entity.props.filter(f=>f.hint)
if(hintList.length > 0){
-#>
      helpers:{
<#entity.props.filter(f=>f.hint).forEach(f=>{
  if(!f.ref && !f.inheritedFrom){
-#>
        #{f.name}: '#{f.hint}',
<#} else if(f.ref && !f.inheritedFrom) {-#>
        #{f.name}: '#{f.hint}',
<#}
})-#>
      },
<#}-#>
<# if(entity.actions.length > 0 || rels.length > 0){-#>
      actions:{
<# entity.actions.forEach(action=>{#>
        #{action.name}: '#{action.title}',
<#-})#>
<# rels.forEach(rel=>{#>
  #{rel.name}: '#{ rel?.metadata?.UI?.actions?.add || rel.label}',
<#-})#>
      },
<#}-#>
    }
  },
}