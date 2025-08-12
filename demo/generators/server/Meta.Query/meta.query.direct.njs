<#@ noContent #>
<# const [namespace, name] = context.name.split('.');#>
Ext.directFn({
  namespace: '#{namespace}',
  name: '#{name}',
  locationType:"#{context.locationType}",
  body: function(para) {
    let context = this;
    let prm = para.data.shift();
    prm.context = context;
    <#-
      const hasCondition = context.queryRunCondition !== 'true'
        && context.queryRunCondition != true
        && context.queryRunCondition != ''
        && context.queryRunCondition !== null
        && context.queryRunCondition !== undefined #>
    <#- if(hasCondition ){ #>
    if(#{context.queryRunCondition}){
    <#-}#>
    CustomQuery['#{name}'].call(this, this.db, prm, function(err, data) {
      if (!err) context.success(data);
      else context.failure(err);
    })
    <#- if(hasCondition){ #>
    } else {
      context.success(#{context.queryEmptyResult ? context.queryEmptyResult : context.queryIsListResult ? [] : 'null'})
    }
    <#-}#>
  }
});