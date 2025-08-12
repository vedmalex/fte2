<#@ context "entity" -#>
<#@ alias 'forms-grid-view' -#>

import React, { useContext } from "react";
import { UIXContext } from '../contexts';
import { prepareExcludeList } from '../';
// import { useTranslate } from 'react-admin';

const Grid = ({ fields, ...props }) => {
  const uix = useContext(UIXContext);
  const excludedField = prepareExcludeList(fields)
  // const translate = useTranslate();
  return (
  <uix.Datagrid {...props} <#if(!entity.embedded){#>rowClick="edit"<#}#> >
   <# 
      const list = !(entity.embedded || entity.abstract) ? 'list': 'all';
      const ctx={
        entity: {
          ...entity,
          props: entity.lists[list],
          sectionLabel: false,
          grid: true,
        }, source:'',
        customizable: true,
       };
      #>

      #{partial(ctx, 'display-show-entity')}

<# entity.actions.forEach(action=>{ #>
    <uix.#{entity.name}.#{action.fullName} />
<#})#>

<# if(!(entity.embedded || entity.abstract)){#>
    <uix.ShowButton label="" />
    <uix.CloneButton label="" />
<#}#>
  </uix.Datagrid>
);}

export default Grid;